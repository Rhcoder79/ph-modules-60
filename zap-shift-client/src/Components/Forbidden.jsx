import React from 'react';
import { Link } from 'react-router';
import { FaShieldAlt } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-6 rounded-full">
                        <FaShieldAlt className="text-red-500 text-7xl animate-pulse" />
                    </div>
                </div>
                <h1 className="text-9xl font-black text-gray-200">403</h1>
                <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
                    Access Forbidden!
                </p>
                <p className="mt-4 text-gray-500">
                    Sorry, you don't have permission to access this page. 
                    This area is restricted to **Administrators** only.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn btn-primary"
                    >
                        Go Back Home
                    </Link>
                    <Link
                        to="/dashboard"
                        className="btn btn-outline"
                    >
                        My Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;