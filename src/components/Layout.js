import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css'; // We'll create this CSS file next

const Layout = () => {
    return (
        <div className="relative">
            <div className="blob-container"></div>
            <header className="p-4 md:p-6 flex justify-between items-center shadow-sm bg-white z-10">
                <div className="flex items-center space-x-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Vignan_logo.png/1200px-Vignan_logo.png" width="49" height="49" alt="Vignan Logo" />
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>VIGNAN Library System</h1>
                </div>
                <nav>
                    {/* Link component from React Router is used for SPA navigation */}
                    <Link to="/home" className="btn-professional">Home</Link>
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8 z-10">
                {/* The Outlet component renders the current page based on the URL */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;