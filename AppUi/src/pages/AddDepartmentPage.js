import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const AddDepartmentPage = () => {
  const [DepartmentTitle, setDepartmentTitle] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const addDepartment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:5001/Departments/UpsertDepartment", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: DepartmentTitle,DepartmentId:0 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Department");
      }

      navigate("/Departments"); // Redirect back to Departments page after adding
    } catch (error) {
      console.error("Error adding Department:", error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Add Department</h1>
      <form onSubmit={addDepartment}>
        <div className="mb-3">
          <label htmlFor="DepartmentTitle" className="form-label">Department Title</label>
          <input
            type="text"
            id="DepartmentTitle"
            className="form-control"
            value={DepartmentTitle}
            onChange={(e) => setDepartmentTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Department</button>
      </form>
    </div>
  );
};

export default AddDepartmentPage;
