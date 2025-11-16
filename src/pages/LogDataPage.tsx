import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

// --- TYPE DEFINITION ---
interface LogEntry {
    DateTime: string;
    Roll: string;
    Name: string;
    Branch: string;
    Event: 'Login' | 'Logout';
}

const LogDataPage = () => {
    // Define the type for our state arrays
    const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
    const [filterType, setFilterType] = useState<'Login' | 'Logout'>('Login');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const studentsRef = ref(db, 'Students');
        const unsubscribe = onValue(studentsRef, (snapshot) => {
            const logs: LogEntry[] = []; // Use our interface
            const students = snapshot.val();
            if (students) {
                Object.values(students).forEach((student: any) => { // 'any' is okay here
                    if (student.Logs) {
                        Object.values(student.Logs).forEach((log: any) => {
                            logs.push(log);
                        });
                    }
                });
            }
            logs.sort((a, b) => new Date(b.DateTime).getTime() - new Date(a.DateTime).getTime());
            setAllLogs(logs);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let tempLogs = allLogs.filter(log => log.Event === filterType);
        if (filterDate) {
            tempLogs = tempLogs.filter(log => log.DateTime.startsWith(filterDate));
        }
        setFilteredLogs(tempLogs);
    }, [allLogs, filterType, filterDate]);

    return (
        <>
            <h1 className="text-3xl font-bold text-vignan-maroon mb-8">Student Login/Logout Records</h1>
            <div className="flex justify-center items-center mb-6 space-x-4 p-4 card-vignan max-w-xl mx-auto">
                <button onClick={() => setFilterType('Login')} className={`btn-vignan ${filterType === 'Login' ? 'bg-opacity-80' : ''}`}>Login Data</button>
                <button onClick={() => setFilterType('Logout')} className={`btn-vignan ${filterType === 'Logout' ? 'bg-opacity-80' : ''}`}>Logout Data</button>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="card-vignan overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">S.No</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Roll Number</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Branch</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredLogs.length > 0 ? filteredLogs.map((log, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{log.DateTime}</td>
                                <td className="px-6 py-4">{log.Roll}</td>
                                <td className="px-6 py-4">{log.Name}</td>
                                <td className="px-6 py-4">{log.Branch}</td>
                            </tr>
                        )) : <tr><td colSpan={5} className="text-center py-4 text-muted-text">No data found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default LogDataPage;