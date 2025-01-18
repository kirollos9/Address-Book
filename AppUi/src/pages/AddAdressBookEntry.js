import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const AddAddressBookEntryPage = ({ probs, onClose }) => {
  const [fullName, setFullName] = useState(probs?.fullName || "");
  const [jobId, setJobId] = useState(probs?.jobId || "");
  const [departmentId, setDepartmentId] = useState(probs?.departmentId || "");
  const [mobileNumber, setMobileNumber] = useState(probs?.mobileNumber || "");
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState(
    probs?.dateOfBirth ? probs.dateOfBirth.split("T")[0] : ""
  );
  const [address, setAddress] = useState(probs?.address || "");
  const [email, setEmail] = useState(probs?.email || "");
  const [password, setPassword] = useState(probs?.password || "");
  const [photo, setPhoto] = useState(probs?.photo || null);
  const [photoPreview, setPhotoPreview] = useState(
    probs?.photoStr ? `data:image/png;base64,${probs.photoStr}` : ""
  );
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [id, setId] = useState(probs?.id || 0);
  const { token } = useAuth();
  const navigate = useNavigate();

  const validateMobileNumber = (number) => {
    const regex = /^01[0125][0-9]{8}$/; // Egyptian mobile number pattern
    return regex.test(number);
  };

  useEffect(() => {
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

    fetchJobsAndDepartments();
  }, [token]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result); // Set preview for photo
      };
      reader.readAsDataURL(file); // Convert photo to base64
    } else {
      setPhotoPreview(null);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const addAddressBookEntry = async (e) => {
    e.preventDefault();

    if (!validateMobileNumber(mobileNumber)) {
      setIsMobileNumberValid(false);
      return;
    }

    // Convert the photo to base64 (byte array representation)
    let photoBase64 = null;
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        photoBase64 = reader.result.split(",")[1]; // Remove data URL prefix (base64 part)
        const requestBody = {
          id,
          fullName,
          jobId,
          departmentId,
          mobileNumber,
          dateOfBirth,
          address,
          email,
          password,
          photoStr: photoBase64,
        };

        try {
          const response = await fetch(
            "https://localhost:5001/AddressBookEntry/UpsertEntry",
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to add address book entry");
          }
          if (onClose) {
            onClose(); // Call the onClose handler passed from the parent
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Error adding address book entry:", error);
        }
      };
      reader.readAsDataURL(photo); // Convert file to base64 string
    } else if (photoPreview) {
      // If the user hasn't uploaded a new photo but there's already a preview
      const requestBody = {
        id,
        fullName,
        jobId,
        departmentId,
        mobileNumber,
        dateOfBirth,
        address,
        email,
        password,
        photoStr: photoPreview.split(",")[1], // Send the current base64 string
      };

      try {
        const response = await fetch(
          "https://localhost:5001/AddressBookEntry/UpsertEntry",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add address book entry");
        }
        if (onClose) {
          onClose(); // Call the onClose handler passed from the parent
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error adding address book entry:", error);
      }
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Add Address Book Entry
      </h1>
      <form onSubmit={addAddressBookEntry}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="jobId" className="form-label">
              Job
            </label>
            <select
              id="jobId"
              className="form-select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              required
            >
              <option value="">Select a Job</option>
              {jobs.map((job) => (
                <option key={job.jobId} value={job.jobId}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="departmentId" className="form-label">
              Department
            </label>
            <select
              id="departmentId"
              className="form-select"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select a Department</option>
              {departments.map((department) => (
                <option
                  key={department.departmentId}
                  value={department.departmentId}
                >
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              className={`form-control ${
                !isMobileNumberValid ? "is-invalid" : ""
              }`}
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setIsMobileNumberValid(validateMobileNumber(e.target.value));
              }}
              required
            />
            {!isMobileNumberValid && (
              <div className="invalid-feedback">
                Please enter a valid Egyptian mobile number.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-control"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Edit Mode Photo Handling */}
        <div className="mb-3">
          {photoPreview ? (
            <div>
              <img
                src={photoPreview}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
              <div>
                <button type="button" onClick={clearPhoto} className="btn btn-danger">
                  Clear Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="form-control mt-2"
                />
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="form-control"
              />
            </div>
          )}
        </div>

        <div className="mb-3 text-center">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressBookEntryPage;
