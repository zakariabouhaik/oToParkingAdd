import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Collapse, 
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Checkbox,  
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import { useParams,useLocation  } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ThreeDot } from 'react-loading-indicators';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function createData(id, slot, number, shadow, electricity, type_vehicule, disponib) {
  return {
    id,
    slot,
    number,
    shadow,
    electricity,
    type_vehicule,
    disponib,
    details: {
      PointA: '000000',
      PointB: '000000',
      PointC: '000000',
      PointD: '000000',
    },
  };
}




function EditableCell({ value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(editedValue);
  };

  const handleChange = (event) => {
    setEditedValue(event.target.value);
  };

  if (isEditing) {
    return (
      <TextField
        value={editedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        size="small"
      />
    );
  }

  return (
    <span onDoubleClick={handleDoubleClick}>
      {value}
    </span>
  );
}

function EditableTitle({ value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(editedValue);
  };

  const handleChange = (event) => {
    setEditedValue(event.target.value);
  };

  if (isEditing) {
    return (
      <TextField
        value={editedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        variant="standard"
        sx={{ fontSize: 'h4.fontSize', fontWeight: 'bold' }}
      />
    );
  }

  return (
    <Typography variant="h4" component="div" onDoubleClick={handleDoubleClick} sx={{ cursor: 'pointer' }}>
      {value}
    </Typography>
  );
}

const CustomTimeInputField = ({ label, onChange, value }) => {
  const [hour, setHour] = useState(value ? value.split(':')[0] : '');
  const [minute, setMinute] = useState(value ? value.split(':')[1] : '');

  const handleHourChange = (event) => {
    setHour(event.target.value);
    onChange(`${event.target.value}:${minute}`);
  };

  const handleMinuteChange = (event) => {
    setMinute(event.target.value);
    onChange(`${hour}:${event.target.value}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 200 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small">
          <InputLabel>Heure</InputLabel>
          <Select
            value={hour}
            label="Heure"
            onChange={handleHourChange}
            sx={{ width: 80 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 150,
                },
              },
            }}
          >
            {[...Array(24)].map((_, index) => (
              <MenuItem key={index} value={index.toString().padStart(2, '0')}>
                {index.toString().padStart(2, '0')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Minute</InputLabel>
          <Select
            value={minute}
            label="Minute"
            onChange={handleMinuteChange}
            sx={{ width: 80 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 150,
                },
              },
            }}
          >
            {[...Array(12)].map((_, index) => (
              <MenuItem key={index} value={(index * 5).toString().padStart(2, '0')}>
                {(index * 5).toString().padStart(2, '0')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

const TarifSection = ({ title, onChange, tarif, heureDebut, heureFin }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,  marginBottom:5   }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#374869' }}>{title}</Typography>
    <Box sx={{ display: 'flex',  alignItems: 'flex-start'}}>
      <TextField 
        label="Tarif" 
        size="small" 
        sx={{ width: 120 }} 
        value={tarif}
        onChange={(e) => onChange('rate', e.target.value)}
        type="number"
      />
    </Box>
    <Box sx={{ display: 'flex',gap:1  }}>
      <CustomTimeInputField 
        label="Temps de début" 
        value={heureDebut}
        onChange={(value) => onChange('startTime', value)}
      />
      <CustomTimeInputField 
        label="Temps de fin" 
        value={heureFin}
        onChange={(value) => onChange('endTime', value)}
      />
    </Box>
  </Box>
);


const ParkingInfo = ({ id, title, icon, startTime, endTime, rate, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title,
    startTime,
    endTime,
    rate
  });

  const isTarif24hEmpty = !rate && !startTime && !endTime;

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleSave = () => {
    onUpdate(id, editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({ title, startTime, endTime, rate });
    setIsEditing(false);
  };

  const handleAddTarif24h = () => {
    setEditedData({
      title: "24 Hours Parking",
      startTime: "",
      endTime: "",
      rate: ""
    });
    setIsEditing(true);
  };

  if (isTarif24hEmpty && !isEditing) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <IconButton onClick={handleAddTarif24h} size="large">
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
        <Typography variant="body1">Ajouter tarif 24h</Typography>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <TarifSection
            title={editedData.title}
            onChange={handleChange}
            tarif={editedData.rate}
            heureDebut={editedData.startTime}
            heureFin={editedData.endTime}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSave} sx={{ mr: 1 }} variant="contained" color="primary">
              Enregistrer
            </Button>
            <Button onClick={handleCancel} variant="contained" color="secondary">
              Annuler
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="div" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography color="text.secondary">Start: {startTime}</Typography>
        <Typography color="text.secondary">End: {endTime}</Typography>
        <Typography variant="body1" mt={1}>
          Rate: {rate} MAD/h
        </Typography>
      </CardContent>
      <Button onClick={() => setIsEditing(true)}>Modifier</Button>
    </Card>
  );
};






function Row({ row: initialRow, onUpdateRow }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rowData, setRowData] = useState(initialRow);
  const [tempRowData, setTempRowData] = useState(initialRow);

  const handleEdit = () => {
    setTempRowData(rowData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setRowData(tempRowData);
    onUpdateRow(tempRowData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempRowData(rowData);
  };

  const handleChange = (field, value) => {
    setTempRowData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleCoordinateChange = (index, field, value) => {
    const newCoordinates = [...tempRowData.coordinates];
    newCoordinates[index] = { ...newCoordinates[index], [field]: value };
    setTempRowData(prevData => ({ ...prevData, coordinates: newCoordinates }));
  };

  const renderEditableCell = (field, value, type = 'text') => {
    switch (type) {
      case 'checkbox':
        return (
          <Checkbox
            checked={isEditing ? tempRowData[field] : value}
            onChange={(e) => handleChange(field, e.target.checked)}
            disabled={!isEditing}
          />
        );
      case 'select':
        return (
          <Select
            value={isEditing ? tempRowData[field] : value}
            onChange={(e) => handleChange(field, e.target.value)}
            size="small"
            disabled={!isEditing}
          >
            <MenuItem value="voiture">Voiture</MenuItem>
            <MenuItem value="moto">Moto</MenuItem>
            <MenuItem value="camion">Camion</MenuItem>
            <MenuItem value="bicyclette">Bicyclette</MenuItem>
          </Select>
        );
      case 'availability':
        return (
          <Select
            value={isEditing ? tempRowData[field] : value}
            onChange={(e) => handleChange(field, e.target.value)}
            size="small"
            disabled={!isEditing}
          >
            <MenuItem value="CREATED">Created</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="NOT_AVAILABLE">Not Available</MenuItem>
            <MenuItem value="RETIRER">Retirer</MenuItem>
          </Select>
        );
      default:
        return isEditing ? (
          <TextField
            value={tempRowData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            size="small"
          />
        ) : (
          value
        );
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {renderEditableCell('name', rowData.name)}
        </TableCell>
        <TableCell align="right">
          {renderEditableCell('number', rowData.number, 'number')}
        </TableCell>
        <TableCell align="right">
          {renderEditableCell('shadow', rowData.shadow, 'checkbox')}
        </TableCell>
        <TableCell align="right">
          {renderEditableCell('electricity', rowData.electricity, 'checkbox')}
        </TableCell>
        <TableCell align="right">
          {renderEditableCell('type_vehicule', rowData.type_vehicule, 'select')}
        </TableCell>
        <TableCell align="right">
          {renderEditableCell('disponib', rowData.disponib, 'availability')}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <>
              <IconButton onClick={handleSave}>
                <CheckCircleIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Coordonnées
              </Typography>
              <Table size="small" aria-label="coordinates">
                <TableHead>
                  <TableRow>
                    <TableCell>Point</TableCell>
                    <TableCell>Longitude</TableCell>
                    <TableCell>Latitude</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowData.coordinates.map((coord, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {['A', 'B', 'C', 'D'][index]}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            value={tempRowData.coordinates[index].longitude}
                            onChange={(e) => handleCoordinateChange(index, 'longitude', e.target.value)}
                            size="small"
                          />
                        ) : coord.longitude}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            value={tempRowData.coordinates[index].latitude}
                            onChange={(e) => handleCoordinateChange(index, 'latitude', e.target.value)}
                            size="small"
                          />
                        ) : coord.latitude}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

 


Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    slot: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    shadow: PropTypes.bool.isRequired,
    electricity: PropTypes.bool.isRequired,
    type_vehicule: PropTypes.string.isRequired,
    disponib: PropTypes.string.isRequired,
    details: PropTypes.shape({
      PointA: PropTypes.string.isRequired,
      PointB: PropTypes.string.isRequired,
      PointC: PropTypes.string.isRequired,
      PointD: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onUpdateRow: PropTypes.func.isRequired,
};

const Parkingo = () => {

  const location = useLocation();
  const [parkingData, setParkingData] = useState(null);
   const [Loading,setIsLoading]= useState(false);

  const [parkingInfos, setParkingInfos] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const { Id_Parking } = location.state || {};

  useEffect(() => {
    setIsLoading(true);
    const fetchParkingData = async () => {
      try {
        const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getParkinginfo/${Id_Parking}`);
        setParkingData(response.data);
        setTitle(response.data.parking.name);
        
        // Initialiser parkingInfos
        setParkingInfos([
          { id: 1, title: "Day Parking", icon: <WbSunnyIcon />, startTime: response.data.tarifs[0].jour.heure_debut, endTime: response.data.tarifs[0].jour.heure_fin, rate: response.data.tarifs[0].jour.tarif },
          { id: 2, title: "Night Parking", icon: <NightsStayIcon />, startTime: response.data.tarifs[0].nuit.heure_debut, endTime: response.data.tarifs[0].nuit.heure_fin, rate: response.data.tarifs[0].nuit.tarif },
          { id: 3, title: "24 Hours Parking", icon: <AccessTimeIcon />,  startTime: response.data.tarifs[0].tarif24h.heure_debut, endTime: response.data.tarifs[0].tarif24h.heure_fin, rate: response.data.tarifs[0].tarif24h.tarif },
        ]);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch parking data');
        setIsLoading(false);
      }
    };
  
    fetchParkingData();
  }, []);


  const updateParkingData = async (updateData) => {
    try {
      const response = await fetch(
        `https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/Parkingupdateinfo/${Id_Parking}`,
        {
          method: 'PUT',
           
          body: JSON.stringify(updateData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Update successful:', data);
      // Optionally, update your local state here
    } catch (err) {
      console.error('Error updating parking data:', err);
      setError('Failed to update parking data');
    }
  }
  
  const handleTitleUpdate = async (newTitle) => {
    setTitle(newTitle);
    await updateParkingData({ parking: { name: newTitle } });
  };

  
  if (Loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDot variant="bounce" color="#317bcc" size="large" text="" textColor="" />
      </div>
    );
  }
  
  
  if (error) return <Typography color="error">{error}</Typography>;
  if (!parkingData) return null;

 
  const { parking, tarifs, slots } = parkingData;

 

  const handleUpdateParkingInfo = async (id, updatedInfo) => {
    console.log('Updating parking info:', id, updatedInfo);
  
    // Mise à jour immédiate de l'état local
    setParkingInfos(prevInfos => prevInfos.map(info => 
      info.id === id ? { ...info, ...updatedInfo } : info
    ));
  
    let updateData = {};
    if (id === 1) {
      updateData = {
        tarifs: [{
          jour: {
            tarif: parseFloat(updatedInfo.rate),
            heure_debut: updatedInfo.startTime,
            heure_fin: updatedInfo.endTime
          }
        }]
      };
    } else if (id === 2) {
      updateData = {
        tarifs: [{
          nuit: {
            tarif: parseFloat(updatedInfo.rate),
            heure_debut: updatedInfo.startTime,
            heure_fin: updatedInfo.endTime
          }
        }]
      };
    } else if (id === 3) {
      updateData = {
        tarifs: [{
          tarif24h: {
            tarif: parseFloat(updatedInfo.rate),
            heure_debut: updatedInfo.startTime,
            heure_fin: updatedInfo.endTime
          }
        }]
      };
    }
  
    try {
      await updateParkingData(updateData);
      // La mise à jour de l'interface a déjà été faite, donc pas besoin de le refaire ici
    } catch (error) {
      console.error('Failed to update tarif:', error);
      setError('Failed to update tarif');
      // Optionnellement, vous pouvez revenir à l'état précédent en cas d'erreur
      // setParkingInfos(prevInfos => /* logique pour revenir à l'état précédent */);
    }
  };

  const handleUpdateRow = async (updatedRow) => {
    console.log('Updating row:', updatedRow);
    await updateParkingData({ 
      slots: [{
        Id_Slot: updatedRow.Id_Slot,
        name: updatedRow.name,
        number: updatedRow.number,
        shadow: updatedRow.shadow,
        electricity: updatedRow.electricity,
        type_vehicule: updatedRow.type_vehicule,
        disponib: updatedRow.disponib,
        coordinates: updatedRow.coordinates
      }]
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocalParkingIcon sx={{ fontSize: 40, marginRight: 1 }} />
        <EditableTitle value={title} onSave={handleTitleUpdate} />
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
  {parkingInfos.map((info) => (
    <Grid item xs={12} md={4} key={info.id}>
      <ParkingInfo 
        {...info}
        onUpdate={handleUpdateParkingInfo}
      />
    </Grid>
  ))}
</Grid>

      <Divider sx={{ my: 4 }} />
 
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell />
              <TableCell sx={{ color: 'white' }}>Slot</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Number</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Shadow</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Electricity</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Vehicle Type</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Availability</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Modifier</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.map((slot) => (
              <Row
               key={slot.Id_Slot} 
               row={slot} 
               onUpdateRow={handleUpdateRow} 
                
               />
             
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Parkingo;