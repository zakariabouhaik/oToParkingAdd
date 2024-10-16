import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserDetails from "../src/hook/useUserDetails";

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { userDetails, loading } = useUserDetails();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userDetails) {
        // User is not authenticated, redirect to login page
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!requiredRoles.includes(userDetails.role)) {
        // User doesn't have the required role, redirect to login page
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // User is authenticated and has the required role, render the protected content
    return children;
};

export default ProtectedRoute;
