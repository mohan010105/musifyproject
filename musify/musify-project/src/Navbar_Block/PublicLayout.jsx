import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster/>
      <Navbar/>
      <main className="flex-1">
        <Outlet/>
      </main>
    </div>
  );
};

export default PublicLayout;
