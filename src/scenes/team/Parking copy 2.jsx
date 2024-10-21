import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { useNavigate ,useParams} from 'react-router-dom';
import axios from 'axios';
 import { DirectionsCar,LocalShipping,DirectionsBike,LocalParking } from '@mui/icons-material';
 import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
 import { ThreeDot } from 'react-loading-indicators';

const Parkings = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   
  const navigate = useNavigate();


  useEffect(() => {

    const userId = localStorage.getItem('id')
    const fetchParkings = async () => {
      try {
        const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getParkingforAgent/${userId}`);
      
        setParkings(response.data.parkings);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch parking data');
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'voiture': return <DirectionsCar />;
      case 'moto': return <TwoWheelerIcon />;
      case 'camion': return <LocalShipping />;
      case 'bicyclette': return <DirectionsBike />;
      default: return null;
    }
  };

  
  const handleRowClick = (Id_Parking) => {
    navigate('/parkingo', { state: { Id_Parking } });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDot variant="bounce" color="#317bcc" size="large" text="" textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#1976d2', display: 'flex', alignItems: 'center' }}>
        <LocalParking sx={{ mr: 1 }} /> Parkings Available
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="parkings table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Parking Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">ID</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Vehicle Types</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Total Slots</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parkings.map((parking) => (
              <TableRow 
                key={parking.Id_Parking} 
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => handleRowClick(parking.Id_Parking)}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1">{parking.name}</Typography>
                </TableCell>
                <TableCell><Typography variant="body2" color="textSecondary">{parking.Id_Parking}</Typography></TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {parking.vehicle_types2.map((type) => (
                      <Chip
                        key={type}
                        icon={getVehicleIcon(type)}
                        label={type}
                        size="small"
                        sx={{ 
                          backgroundColor: type === 'voiture' ? '#e3f2fd' :
                                           type === 'moto' ? '#fff3e0' :
                                           type === 'camion' ? '#e8f5e9' :
                                           '#f3e5f5',
                          color: type === 'voiture' ? '#1565c0' :
                                 type === 'moto' ? '#f57c00' :
                                 type === 'camion' ? '#2e7d32' :
                                 '#7b1fa2'
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{parking.slots.length}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Parkings;
