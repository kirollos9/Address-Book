import React, { useState } from "react";
import styles from "./RegisterPage.module.css"; // Importing the CSS module
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  // State for form fields
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    gender: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    const requestData = {
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
    };

    try {
      const response = await fetch("https://localhost:5001/Auth/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
     
        navigate('/Login');

     
      } else {
        const data = await response.json();
        setError( "Registration failed.");
      }
    } catch (error) {
      setError("Registration failed.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.registerBtn}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
