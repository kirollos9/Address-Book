import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import { useAuth } from '../components/AuthContext';

export default function RootLayout() {
  const token  = localStorage.getItem('authToken'); 
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const publicPaths = ['/login', '/register']; 
    const isPublicPath = publicPaths.includes(location.pathname);

    if (!token && !isPublicPath) {
 
      navigate('/login'); 
    }
  }, [token, location.pathname, navigate]);

  return (
    <>
      {token &&<MainNavigation />}
      <main>
        <Outlet />
      </main>
    </>
  );
}
