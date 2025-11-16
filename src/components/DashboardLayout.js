import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo'; // Import the AnimatedLogo component

// Simple SVG icons for the sidebar
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97m5.176 5.97h-3.236a1 1 0 01-1-1v-4a1 1 0 011-1h2.236a1 1 0 011 1v4a1 1 0 01-1 1z" /></svg>;
const RecordsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const LogsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

const navLinks = [
    { name: 'Home', path: '/home', icon: <HomeIcon /> },
    { name: 'Attendance', path: '/attendance', icon: <AttendanceIcon /> },
    { name: 'Student Records', path: '/student-records', icon: <RecordsIcon /> },
    { name: 'Login/Logout Logs', path: '/logs', icon: <LogsIcon /> },
    { name: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
];

const DashboardLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/login');

    return (
        <div className="min-h-screen flex flex-col bg-light-bg">
            <header className="p-4 flex justify-between items-center shadow-md bg-white z-20 shrink-0">
                <div className="flex items-center space-x-4">
                    {/* UPDATED: Replaced static image with the AnimatedLogo component */}
                    <AnimatedLogo size={200} />
                    <div>
                        <h1 className="text-xl font-bold text-vignan-maroon">Library Admin Portal</h1>
                        <p className="text-sm text-muted-text">Vignan Institute of Information Technology</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn-vignan">Logout</button>
            </header>
            <div className="flex flex-grow">
                <aside className="w-64 bg-white shadow-lg p-4 z-10 flex-shrink-0">
                    <nav className="flex flex-col space-y-2 mt-4">
                        {navLinks.map(link => (
                            <NavLink key={link.name} to={link.path} className="flex items-center px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="flex-grow p-6 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;