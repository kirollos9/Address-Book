import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import * as XLSX from "xlsx";
const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [editDepartmentTitle, setEditDepartmentTitle] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const response = await fetch("https://localhost:5001/Departments/MyDepartments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Departments");
      }

      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching Departments:", error);
    }
  };

  const deleteDepartment = async () => {
    try {
      const response = await fetch(`https://localhost:5001/Departments/Department/${selectedDepartmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete Department");
      }

      setDepartments(departments.filter((department) => department.departmentId !== selectedDepartmentId));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting Department:", error);
    }
  };

  const editDepartment = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("https://localhost:5001/Departments/UpsertDepartment", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editDepartmentTitle,departmentId: selectedDepartmentId}),
      });

      if (!response.ok) {
        throw new Error("Failed to update Department");
      }
      fetchDepartments();
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating Department:", error);
    }
  };


  
  const exportToExcel = () => {
    
    const filteredDepartments = departments.map((department) => ({
      DepartmentId: department.departmentId,
      Name: department.name,
    }));
    
    
    const worksheet = XLSX.utils.json_to_sheet(filteredDepartments, {
      header: ["DepartmentId", "Name"], 
    });
    
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "departments");
    
  
    XLSX.writeFile(workbook, "Departments.xlsx");
  };
  
  
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Departments</h1>
      <button
        className="btn btn-primary mb-3"
        style={{ float: "right" }}
        onClick={() => navigate("/add-Department")} // Navigate to Add Department Page
      >
        Add Department
      </button>
      <button
  className="btn btn-success mb-3"
  style={{ float: "right", marginRight: "10px" }}
  onClick={exportToExcel}
>
  Export to Excel
</button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department, index) => (
            <tr key={department.departmentId}>
              <td>{department.departmentId}</td>
              <td>{department.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setSelectedDepartmentId(department.departmentId);
                    setEditDepartmentTitle(department.name);
                    setShowEditDialog(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setSelectedDepartmentId(department.departmentId);
                    setShowDeleteDialog(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this Department?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={deleteDepartment}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Dialog */}
      {showEditDialog && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <form onSubmit={editDepartment}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Department</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label>Department Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editDepartmentTitle}
                  onChange={(e) => setEditDepartmentTitle(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditDialog(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
