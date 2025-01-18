import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import * as XLSX from "xlsx";
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [editJobTitle, setEditJobTitle] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await fetch("https://localhost:5001/Jobs/MyJobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const deleteJob = async () => {
    try {
      const response = await fetch(`https://localhost:5001/Jobs/Job/${selectedJobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs(jobs.filter((job) => job.jobId !== selectedJobId));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const editJob = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("https://localhost:5001/Jobs/UpsertJob", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editJobTitle,jobId: selectedJobId}),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }
      fetchJobs();
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };


  
  const exportToExcel = () => {
    
    const filteredJobs = jobs.map((job) => ({
      jobId: job.jobId,
      title: job.title,
    }));
    
    
    const worksheet = XLSX.utils.json_to_sheet(filteredJobs, {
      header: ["jobId", "title"], 
    });
    
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
    
  
    XLSX.writeFile(workbook, "jobs.xlsx");
  };
  
  
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Jobs</h1>
      <button
        className="btn btn-primary mb-3"
        style={{ float: "right" }}
        onClick={() => navigate("/add-job")} // Navigate to Add Job Page
      >
        Add Job
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
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job.jobId}>
              <td>{job.jobId}</td>
              <td>{job.title}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setSelectedJobId(job.jobId);
                    setEditJobTitle(job.title);
                    setShowEditDialog(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setSelectedJobId(job.jobId);
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
                <p>Are you sure you want to delete this job?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={deleteJob}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Dialog */}
      {showEditDialog && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <form onSubmit={editJob}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Job</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label>Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editJobTitle}
                  onChange={(e) => setEditJobTitle(e.target.value)}
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

export default JobsPage;
