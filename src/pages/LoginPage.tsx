import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import libraryImage from '../assets/library-bg.jpg';
import AnimatedLogo from '../components/AnimatedLogo'; // Import the AnimatedLogo component

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (username === 'vignan' && password === 'vignan') {
            navigate('/home');
        } else {
            alert('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Column: Image */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${libraryImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-sm">
                    {/* UPDATED: Replaced static image with the AnimatedLogo component */}
                    <div className="text-left mb-10 ">
                        <div style={{ textAlign: "center" }}>
                            <AnimatedLogo size={400} isShining={true} />
                        </div>
                        <h1 className="text-3xl font-bold text-vignan-maroon mt-4 text-center">   Library Admin Portal</h1>
                        <p className="text-muted-text text-center">Vignan Institute of Information Technology</p>
                    </div>

                    <div className="card-vignan p-8">
                        <h2 className="text-2xl font-semibold mb-6 text-dark-text">Secure Sign In</h2>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter 'vignan'"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vignan-maroon focus:border-vignan-maroon"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="'vignan'"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-vignan-maroon focus:border-vignan-maroon"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-vignan w-full font-bold py-2.5 text-lg"
                            >
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;