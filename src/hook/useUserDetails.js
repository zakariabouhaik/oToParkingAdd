import { useState, useEffect } from 'react';
import useCurrentUserId from './useCurrentUserId';
import axios from 'axios';

const axiosInstance = axios.create();

// Disable SSL certificate verification (only for development!)
axiosInstance.defaults.httpsAgent = {
  rejectUnauthorized: false
};

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
                    const roleResponse = await axiosInstance.get(`https://fgefweff.online:8085/User/getUserRole/${userId}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    
                    const fullNameResponse = await axiosInstance.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getfulnameAgent/${userId}`);
                    
                    console.log('Raw role response:', roleResponse.data);
                    console.log('Raw full name response:', fullNameResponse.data);
                    
                    const role = typeof roleResponse.data === 'object' ? roleResponse.data.role : roleResponse.data.trim();
                    const { nom, prenom } = fullNameResponse.data;
                    
                    setUserDetails({ role, nom, prenom });
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
