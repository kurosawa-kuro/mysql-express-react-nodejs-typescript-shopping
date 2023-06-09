// frontend\src\App.js

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { useAuthStore } from './state/store'; // Import Zustand store

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { logout } = useAuthStore(); // Use the logout function from Zustand store

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        logout();
      }
    }
  }, [logout]);

  return (
    <>
      <ToastContainer />
      <Header />
      <main className='py-8 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
