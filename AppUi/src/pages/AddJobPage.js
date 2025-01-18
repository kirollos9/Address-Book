import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const AddJobPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const addJob = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:5001/Jobs/UpsertJob", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: jobTitle,jobId:0 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add job");
      }

      navigate("/jobs"); // Redirect back to Jobs page after adding
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Add Job</h1>
      <form onSubmit={addJob}>
        <div className="mb-3">
          <label htmlFor="jobTitle" className="form-label">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            className="form-control"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
