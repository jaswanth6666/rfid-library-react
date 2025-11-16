import React from 'react';
// Step 1: Import the new image from your assets folder
import homeImage from '../assets/library-home.jpg';

const HomePage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-vignan-maroon mb-2">Welcome to the Admin Dashboard</h1>
            <p className="text-muted-text mb-8">Manage and monitor all library activities in real-time.</p>
            
            <div className="grid md:grid-cols-5 gap-8 items-center">
                {/* Left Column for Text Content (No changes here) */}
                <div className="md:col-span-3">
                    <div className="card-vignan h-full">
                        <h2 className="text-2xl font-semibold mb-4 text-dark-text">System Overview</h2>
                        <p className="text-gray-700 leading-relaxed">
                            This portal is the central hub for the Vignan RFID Library Management System. 
                            It provides administrators with powerful tools to monitor attendance, track book circulation,
                            and analyze library usage patterns instantly. All data is synchronized in real-time
                            from the RFID hardware via a cloud database.
                        </p>
                        <h3 className="text-xl font-semibold mt-6 mb-3 text-dark-text">Key Features:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>
                                <b>Live Attendance Dashboard:</b> View a live counter of students currently inside the library and see a list of who they are.
                            </li>
                            <li>
                                <b>Comprehensive Student Records:</b> Search for any student to view their complete book borrowing history, check due dates, and manage fines.
                            </li>
                            <li>
                                <b>Detailed Event Logs:</b> Access a searchable and filterable log of every login and logout event, perfect for record-keeping and analysis.
                            </li>
                            <li>
                                <b>Usage Analytics:</b> Gain insights into which books are most popular and track overall library traffic over time.
                            </li>
                        </ul>
                         <p className="mt-6 text-sm text-muted-text">
                            Please use the sidebar navigation on the left to access each module.
                        </p>
                    </div>
                </div>

                {/* Right Column for Image */}
                <div className="md:col-span-2">
                    {/* Step 2: Use the imported image in the src attribute */}
                    <img 
                        src={homeImage}
                        alt="Vignan Library Reading Area"
                        className="rounded-lg shadow-xl w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;