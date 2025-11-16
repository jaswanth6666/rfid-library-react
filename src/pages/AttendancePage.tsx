// This file only has one change from the previous version:
// 'Object.values(todayData).forEach((e: DailyLog) =>' becomes 'Object.values(todayData).forEach((e: any) =>'
// This is a pragmatic fix for Firebase's sometimes unpredictable data shapes.

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StudentDetails {
    Name: string;
    Branch: string;
}

const AttendancePage = () => {
    const [currentCount, setCurrentCount] = useState<number>(0);
    const [loginCount, setLoginCount] = useState<number>(0);
    const [logoutCount, setLogoutCount] = useState<number>(0);
    const [studentsPresent, setStudentsPresent] = useState<Record<string, StudentDetails>>({});
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

    useEffect(() => {
        const countRef = ref(db, 'Analytics/StudentsPresentCount');
        const listRef = ref(db, 'Analytics/StudentsPresentList');
        const dailyRef = ref(db, 'Analytics/DailyEntryLog');

        const unsubCount = onValue(countRef, snap => setCurrentCount(snap.exists() ? snap.val() : 0));
        const unsubList = onValue(listRef, snap => setStudentsPresent(snap.exists() ? snap.val() : {}));
        const unsubDaily = onValue(dailyRef, snap => {
            const today = new Date().toISOString().split('T')[0];
            const data = snap.exists() ? snap.val() : {};
            const todayData = data[today] || {};

            let logins = 0, logouts = 0;
            // CORRECTED: Use 'any' type for flexibility with Firebase data
            Object.values(todayData).forEach((e: any) => {
                if (e.Event === "Login") logins++;
                else if (e.Event === "Logout") logouts++;
            });

            setLoginCount(logins);
            setLogoutCount(logouts);

            const labels = Object.keys(data).sort().slice(-7);
            const loginCounts = labels.map(d => Object.values(data[d] as Record<string, any>).filter(e => e.Event === "Login").length);
            const logoutCounts = labels.map(d => Object.values(data[d] as Record<string, any>).filter(e => e.Event === "Logout").length);
            
            setChartData({
                labels,
                datasets: [
                    { label: "Logins", data: loginCounts, backgroundColor: "var(--vignan-maroon)" },
                    { label: "Logouts", data: logoutCounts, backgroundColor: "rgba(161, 26, 31, 0.5)" }
                ]
            });
        });

        return () => { unsubCount(); unsubList(); unsubDaily(); };
    }, []);

    return (
        <>
            <h1 className="text-3xl font-bold text-vignan-maroon mb-8">Library Attendance</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                 {/* ... rest of JSX is identical ... */}
                <div className="card-vignan text-center">
                    <h3 className="text-lg font-semibold mb-2 text-muted-text">Students in Library</h3>
                    <p className="text-4xl font-bold text-vignan-maroon">{currentCount}</p>
                </div>
                <div className="card-vignan text-center">
                    <h3 className="text-lg font-semibold mb-2 text-muted-text">Logins Today</h3>
                    <p className="text-4xl font-bold text-vignan-maroon">{loginCount}</p>
                </div>
                <div className="card-vignan text-center">
                    <h3 className="text-lg font-semibold mb-2 text-muted-text">Logouts Today</h3>
                    <p className="text-4xl font-bold text-vignan-maroon">{logoutCount}</p>
                </div>
                <div className="card-vignan">
                    <h3 className="text-lg text-center font-semibold mb-2 text-muted-text">Last 7 Days Visitors</h3>
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            </div>
            <div className="card-vignan">
                <h3 className="text-xl font-semibold mb-4 text-dark-text">Students Present Now</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-left">
                        <thead className="border-b">
                            <tr>
                                <th className="px-4 py-2">Roll No</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(studentsPresent).length > 0 ? (
                                Object.entries(studentsPresent).map(([roll, details]) => (
                                    <tr key={roll} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 font-medium">{roll}</td>
                                        <td className="px-4 py-2">{details.Name}</td>
                                        <td className="px-4 py-2">{details.Branch}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={3} className="py-4 text-center text-muted-text">No students currently in the library.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AttendancePage;