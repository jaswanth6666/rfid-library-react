
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// CLEAN IMPORTS - No file extensions needed!
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AttendancePage from './pages/AttendancePage';
import LogDataPage from './pages/LogDataPage';
import StudentRecordsPage from './pages/StudentRecordsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/logs" element={<LogDataPage />} />
          <Route path="/student-records" element={<StudentRecordsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;