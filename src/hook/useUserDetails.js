import { useState, useEffect } from 'react';
import useCurrentUserId from './useCurrentUserId';

const useUserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useCurrentUserId();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userId) {
                try {
                    setLoading(true);
                    console.log('Fetching user details for ID:', userId);
                    const response = await fetch(`http://localhost:8085/User/getUserRole/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (response.ok) {
                        const text = await response.text();
                        console.log('Raw response:', text);
                        try {
                            const userData = JSON.parse(text);
                            console.log('Parsed user data:', userData);
                            setUserDetails(userData);
                        } catch (parseError) {
                            console.log('Response is not JSON, treating as plain text');
                            setUserDetails({ role: text.trim() });
                        }
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [userId]);

    console.log('Current user details:', userDetails);
    return { userDetails, loading, error };
};

export default useUserDetails;