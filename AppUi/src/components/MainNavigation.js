import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './MainNvigation.module.css';
import { useAuth } from '../components/AuthContext';

export default function MainNavigation() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    
    // Update the context (clear token)
    setToken(null);
    
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? classes.active : undefined)}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobs"
              className={({ isActive }) => (isActive ? classes.active : undefined)}
            >
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Departments"
              className={({ isActive }) => (isActive ? classes.active : undefined)}
            >
              Departments
            </NavLink>
          </li>
          <li>
           
            <NavLink 
              onClick={handleLogout} 
              className={classes.logoutButton}
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
