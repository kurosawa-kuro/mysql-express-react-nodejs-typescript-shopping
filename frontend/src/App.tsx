// App.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Header />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
};

export default App;
