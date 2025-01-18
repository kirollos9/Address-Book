import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import * as XLSX from "xlsx";
import AddAddressBookEntryPage from "./AddAdressBookEntry";

const AddressBookPage = () => {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [editEntryTitle, setEditEntryTitle] = useState("");
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const response = await fetch("https://localhost:5001/AddressBookEntry/MyEntries", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }

      const data = await response.json();
      setEntries(data);
      setFilteredEntries(data); // Initialize filteredEntries with all entries
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchJobsAndDepartments = async () => {
    try {
      const jobResponse = await fetch("https://localhost:5001/Jobs/MyJobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const departmentResponse = await fetch(
        "https://localhost:5001/Departments/MyDepartments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (jobResponse.ok) setJobs(await jobResponse.json());
      if (departmentResponse.ok) setDepartments(await departmentResponse.json());
    } catch (error) {
      console.error("Error fetching jobs or departments:", error);
    }
  };

  const deleteEntry = async () => {
    try {
      const response = await fetch(`https://localhost:5001/AddressBookEntry/Entry/${selectedEntryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      //setEntries(entries.filter((entry) => entry.id !== selectedEntryId));
      fetchEntries();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const editEntry = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("https://localhost:5001/AddressBook/UpsertEntry", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editEntryTitle, entryId: selectedEntryId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update entry");
      }
      fetchEntries();
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const exportToExcel = () => {
    const table = document.querySelector(".table");
    const headers = [];
    table.querySelectorAll("thead th").forEach((th, index) => {
      if (index < table.querySelectorAll("thead th").length - 1) {
        headers.push(th.innerText.trim());
      }
    });

    const rows = [];
    table.querySelectorAll("tbody tr").forEach((tr) => {
      const row = {};
      tr.querySelectorAll("td").forEach((td, index) => {
        if (index < tr.querySelectorAll("td").length - 1) {
          row[headers[index]] = td.innerText.trim();
        }
      });
      rows.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Address Book");
    XLSX.writeFile(workbook, "addressBookEntries.xlsx");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = entries.filter((entry) => {
      const fullName = entry.fullName.toLowerCase();
      const job = entry.job.toLowerCase();
      const department = entry.department.toLowerCase();
      const mobileNumber = entry.mobileNumber.toLowerCase();
      const age = new Date().getFullYear() - new Date(entry.dateOfBirth).getFullYear();
      const address = entry.address.toLowerCase();
      const email = entry.email.toLowerCase();

      const query = e.target.value.toLowerCase();
      return (
        fullName.includes(query) ||
        job.includes(query) ||
        department.includes(query) ||
        mobileNumber.includes(query) ||
        age.toString().includes(query) ||
        address.includes(query) ||
        email.includes(query)
      );
    });
    setFilteredEntries(filtered);
  };

  useEffect(() => {
    fetchEntries();
    fetchJobsAndDepartments();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <div className="row">
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Address Book</h3>
      </div>

      <div className="row">
        <div className="col-xl-9 col-12">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by any field..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="col-xl-3 col-12">
          <button
            className="btn btn-primary mb-3"
            style={{ float: "right" }}
            onClick={() => navigate("/add-AddressBookEntry")}
          >
            Add Entry
          </button>
          <button
            className="btn btn-success mb-3"
            style={{ float: "right", marginRight: "10px" }}
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive row mt-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Job</th>
                <th>Department</th>
                <th>Mobile Number</th>
                <th>Age</th>
                <th>Address</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.fullName}</td>
                  <td>{entry.job}</td>
                  <td>{entry.department}</td>
                  <td>{entry.mobileNumber}</td>
                  <td>{new Date().getFullYear() - new Date(entry.dateOfBirth).getFullYear()}</td>
                  <td>{entry.address}</td>
                  <td>{entry.email}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setSelectedEntryId(entry.id);
                        setEditEntryTitle(entry.title);
                        setShowEditDialog(true);
                        setSelectedEntry(entry);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedEntryId(entry.id);
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
        </div>
      </div>

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
                <p>Are you sure you want to delete this entry?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={deleteEntry}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Dialog */}
      {showEditDialog && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Entry</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditDialog(false)}></button>
              </div>
              <div className="modal-body">
                <AddAddressBookEntryPage probs={selectedEntry} onClose={() => { setShowEditDialog(false); fetchEntries(); }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBookPage;
