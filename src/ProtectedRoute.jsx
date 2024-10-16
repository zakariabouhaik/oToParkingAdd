import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserDetails from "../src/hook/useUserDetails";

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { userDetails, loading } = useUserDetails();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userDetails || !requiredRoles.includes(userDetails.role)) {
   
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
