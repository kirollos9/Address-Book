import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './components/AuthContext';
import JobsPage from './pages/JobsPage';

import AddJobPage from './pages/AddJobPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AddDepartmentPage from './pages/AddDepartmentPage';
import AddAddressBookEntryPage from './pages/AddAdressBookEntry';
import AddressBookPage from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <AddressBookPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '/jobs', element: <JobsPage /> },
      {path: "/add-job", element: <AddJobPage />}
      ,{ path: '/Departments', element: <DepartmentsPage /> },
      {path: "/add-department", element: <AddDepartmentPage />},
      {path: "/add-AddressBookEntry", element: <AddAddressBookEntryPage />}

    ],
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
