import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserDetails from "../src/hook/useUserDetails";
import { ThreeDot } from 'react-loading-indicators';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { userDetails, loading } = useUserDetails();
    const location = useLocation();

    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        // User is not authenticated, redirect to login page immediately
        return <Navigate to="/" state={{ from: location }} replace />;
    }

  if (loading) {
 return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDot variant="bounce" color="#317bcc" size="large" text="" textColor="" />
      </div>
    );
}
  
    if (!userDetails) {
        // User details couldn't be fetched, redirect to login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!requiredRoles.includes(userDetails.role)) {
        // User doesn't have the required role, redirect to appropriate page based on their role
        switch (userDetails.role) {
            case 'AGENT':
                return <Navigate to="/Gardien" replace />;
            case 'SUPERVISEUR':
                return <Navigate to="/agent" replace />;
            case 'AUDITE':
                return <Navigate to={`/form/${userDetails.id}`} replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    // User is authenticated and has the required role, render the protected content
    return children;
};

export default ProtectedRoute;
