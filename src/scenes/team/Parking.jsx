import React, { useState,useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Fade,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  AccountCircle,
  LocalPhone,
  ConfirmationNumber,
  LocationCity,
  DirectionsCar,
  LocalShipping,
  DirectionsBike,
} from '@mui/icons-material';
import axios from 'axios';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import { ThreeDot } from 'react-loading-indicators';
import { setLocale } from 'yup';

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

const SelectField = ({ label, options, value, onChange, ...props }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      value={value}
      onChange={onChange}
      {...props}
    >
      <MenuItem value=""><em>None</em></MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
      {value && !options.find(option => option.value === value) && (
        <MenuItem value={value}>
          {value}
        </MenuItem>
      )}
    </Select>
  </FormControl>
);

const VehicleCountField = ({ label, icon, onChange, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    <Typography sx={{ width: 100 }}>{label}:</Typography>
    <TextField
      placeholder={`Nombre de ${label.toLowerCase()}s`}
      size="small"
      sx={{ width: 150 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="number"
    />
  </Box>
);

const TarifSection = ({ title, onChange, tarif, heureDebut, heureFin }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f5f5f5' }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#374869' }}>{title}</Typography>
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <TextField 
        label="Tarif" 
        size="small" 
        sx={{ width: 120 }} 
        value={tarif}
        onChange={(e) => onChange('tarif', e.target.value)}
        type="number"
      />
    </Box>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <CustomTimeInputField 
        label="Temps de début" 
        value={heureDebut}
        onChange={(value) => onChange('heure_debut', value)}
      />
      <CustomTimeInputField 
        label="Temps de fin" 
        value={heureFin}
        onChange={(value) => onChange('heure_fin', value)}
      />
    </Box>
  </Box>
);

 

const Parking = () => {

  
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState('');
  const [Loading,setIsLoading]= useState(false);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [pachaliks, setPachaliks] = useState([]);
  const [selectedPachalik, setSelectedPachalik] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');  
  const [agent, setAgent] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');  
  const [parkingname,setParkingName]=useState('');
  const [vehicleCounts, setVehicleCounts] =useState({
    voiture:0,
    moto:0,
    camion:0,
    bicyclette:0
  });
  const [jourTarif, setJourTarif] = useState({ tarif: '', heure_debut: '', heure_fin: '' });
  const [nuitTarif, setNuitTarif] = useState({ tarif: '', heure_debut: '', heure_fin: '' });
  const [tarif24h, setTarif24h] = useState({ tarif: '', heure_debut: '', heure_fin: '' });
  const [success, setSuccess] = useState(false);
  const [showTarif24h, setShowTarif24h] = useState(false);
  const [errors, setErrors] = useState({
    region: '',
    province: '',
    pachalik: '',
    agent: '',
    vehicleCounts: '',
    jourTarif: '',
    nuitTarif: '',
    tarif24h: '',
  });


  

  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...errors };

    if (!selectedRegion) {
      newErrors.region = 'Veuillez sélectionner une région';
      isValid = false;
    } else {
      newErrors.region = '';
    }

    if (!selectedProvince) {
      newErrors.province = 'Veuillez sélectionner une province';
      isValid = false;
    } else {
      newErrors.province = '';
    }

    if (!selectedPachalik) {
      newErrors.pachalik = 'Veuillez sélectionner un pachalik';
      isValid = false;
    } else {
      newErrors.pachalik = '';
    }

    if (!selectedAgent) {
      newErrors.agent = 'Veuillez sélectionner un agent';
      isValid = false;
    } else {
      newErrors.agent = '';
    }

    if (Object.values(vehicleCounts).every(count => count === 0)) {
      newErrors.vehicleCounts = 'Veuillez spécifier au moins un type de véhicule';
      isValid = false;
    } else {
      newErrors.vehicleCounts = '';
    }

    if (!jourTarif.tarif || !jourTarif.heure_debut || !jourTarif.heure_fin) {
      newErrors.jourTarif = 'Veuillez remplir tous les champs du tarif du jour';
      isValid = false;
    } else {
      newErrors.jourTarif = '';
    }

    if (!nuitTarif.tarif || !nuitTarif.heure_debut || !nuitTarif.heure_fin) {
      newErrors.nuitTarif = 'Veuillez remplir tous les champs du tarif de nuit';
      isValid = false;
    } else {
      newErrors.nuitTarif = '';
    }

    if (showTarif24h && (!tarif24h.tarif || !tarif24h.heure_debut || !tarif24h.heure_fin)) {
      newErrors.tarif24h = 'Veuillez remplir tous les champs du tarif 24h';
      isValid = false;
    } else {
      newErrors.tarif24h = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => { 
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getallregion');
      if (response.data && response.data.allregion) {
        setRegions(response.data.allregion);
        setIsLoading(false)
      } else {
        console.error('Structure de réponse inattendue pour les régions:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
    }
  };

  const fetchProvinces = async (regionId) => {
    setIsLoading(true)
    if (!regionId) return;
    try {
      const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getprovinceofregion/${regionId}`);
      if (response.data && response.data.ourprovinces) {
        
        setProvinces(response.data.ourprovinces);
        setIsLoading(false)
      } else {
        console.error('Structure de réponse inattendue pour les provinces:', response.data);
        setProvinces([]);
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des provinces:', error);
      setProvinces([]);
    }
  };

  const fetchPachaliks = async (provinceId) => {
    if (!provinceId) return;
    setIsLoading(true)
    try {
      const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getPachalikOfProvince/${provinceId}`);
 
        setPachaliks(response.data.pachaliks)
        setIsLoading(false)
        
    } catch (error) {
      console.error('Erreur lors de la récupération des pachaliks:', error);
      setPachaliks([]);
    }
  };
 

  const fetchAgentsforpchalik = async (pachalikId) => {
    if (!pachalikId) return;
    setIsLoading(true);
    setSelectedAgent(''); // Reset selected agent when changing Pachalik
    try {
      const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getAgentbypachalik/${pachalikId}`);
      if (response.data && Array.isArray(response.data.ourUser)) {
        setAgent(response.data.ourUser);
        console.log('Fetched agents:', response.data.ourUser);
      } else {
        console.error('Unexpected response structure for agents:', response.data);
        setAgent([]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setAgent([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentChange = (event) => {
    const newValue = event.target.value;
    setSelectedAgent(newValue);
    console.log('Selected agent:', newValue);
  };
  
  const handlePachalikChange = (event) => {
    const pachalikId = event.target.value;
    setSelectedPachalik(pachalikId);
    setSelectedAgent(''); // Reset to empty string
    fetchAgentsforpchalik(pachalikId);
  };

  const handleRegionChange = (event) => {
    const regionId = event.target.value;
    setSelectedRegion(regionId);
    setSelectedProvince('');
    setSelectedPachalik('');
    fetchProvinces(regionId);
  };

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    setSelectedPachalik('');
    fetchPachaliks(provinceId);
  };

  const resetForm = () => {
    setRegion('');
    setSelectedRegion('');
    setSelectedAgent('');
    setAgent('');
    setProvinces([])
    setSelectedProvince('')
    setPachaliks([]);
    setSelectedPachalik('');
    setVehicleCounts('')
    setTarif24h({tarif: '', heure_debut: '', heure_fin: ''});
    setNuitTarif({tarif: '', heure_debut: '', heure_fin: ''});
    setJourTarif({tarif: '', heure_debut: '', heure_fin: ''});
    setShowTarif24h(false);
    setErrors({});
  };





 const handleVehicleCountChange = (type,value)=>{
  setVehicleCounts(prev =>({...prev,[type]:value}))
 }


 const handleTarifChange = (section, field, value) => {
  const setTarifFunction = section === 'jour' ? setJourTarif : section === 'nuit' ? setNuitTarif : setTarif24h;
  setTarifFunction(prev => ({ ...prev, [field]: value }));
};


const handleSubmit = async () => {
  

 
  if (validateForm()) {
    setIsLoading(true)
  const vehicleTypes = Object.entries(vehicleCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, number]) => ({ type, number: parseInt(number) }));

  const payload = {
    name: 'fff',
    vehicle_types: vehicleTypes,
    jour: jourTarif,
    nuit: nuitTarif,
    tarif24h : tarif24h,
    Id_Agent:selectedAgent
  };

 
 
  try {
    const response = await fetch('https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/createslotParkingtarif', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Parking created successfully');
      setSuccess(true);
      
      // Set a timer to reset the form and hide the success message after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        resetForm()
      }, 800);
      
      setIsLoading(false)
      
    } else {
      console.error('Failed to create parking');
      // Handle error (e.g., show error message)
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle network errors
  }
} else {
  console.log('Form validation failed');
}
};


if (success) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)' // semi-transparent white background
      }}
    >
      <Alert 
        severity="success"
        sx={{
          width: '50%', // You can adjust this value
          padding: '2rem',
          '& .MuiAlert-icon': {
            fontSize: '2rem'
          },
          '& .MuiAlert-message': {
            fontSize: '1.2rem'
          }
        }}
      >
        <AlertTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Succès</AlertTitle>
        L'ajout de Parking a bien été effectué.
      </Alert>
    </Box>
  );
}

if (Loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ThreeDot variant="bounce" color="#317bcc" size="large" text="" textColor="" />
    </div>
  );
}
return (
  <Paper elevation={3} sx={{ maxWidth: 1000, margin: 'auto', p: 5, backgroundColor: '#f9f9f9' }}>
    <Typography variant="h4" sx={{ mb: 4, color: '#374869', textAlign: 'center', fontWeight: 'bold' }}>
      Enregistrement de Parking
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={4} sm={4}>
        <SelectField
          label="Région"
          value={selectedRegion}
          onChange={handleRegionChange}
          options={regions.map(region => ({
            value: region.id,
            label: region.nom
          }))}
        />
        {errors.region && <Typography color="error">{errors.region}</Typography>}
      </Grid>

      <Grid item xs={4} sm={4}>
        <SelectField
          label="Province"
          value={selectedProvince}
          onChange={handleProvinceChange}
          options={provinces.map(province => ({
            value: province.id,
            label: province.nom
          }))}
        />
        {errors.province && <Typography color="error">{errors.province}</Typography>}
      </Grid>

      <Grid item xs={4} sm={4}>
        <SelectField
          label="Pachalik"
          value={selectedPachalik}
          onChange={handlePachalikChange}
          options={pachaliks.map(pachalik => ({
            value: pachalik.id,
            label: pachalik.nom
          }))}
        />
        {errors.pachalik && <Typography color="error">{errors.pachalik}</Typography>}
      </Grid>

      <Grid item xs={12} sm={16}>
        <SelectField
          label="Agent"
          value={selectedAgent}
          onChange={handleAgentChange}
          options={Array.isArray(agent) ? agent.map(agento => ({
            value: agento.Id_Agent,
            label: `${agento.nom} ${agento.prenom}`
          })) : []}
        />
        {errors.agent && <Typography color="error">{errors.agent}</Typography>}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#374869' }}>Nombre de véhicules :</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'space-between' }}>
          <VehicleCountField label="Voiture" icon={<DirectionsCar />} value={vehicleCounts.voiture} onChange={(value) => handleVehicleCountChange('voiture', value)} />
          <VehicleCountField label="Camion" icon={<LocalShipping />} value={vehicleCounts.camion} onChange={(value) => handleVehicleCountChange('camion', value)} />
          <VehicleCountField label="Moto" icon={<TwoWheelerIcon />} value={vehicleCounts.moto} onChange={(value) => handleVehicleCountChange('moto', value)} />
          <VehicleCountField label="Bicyclette" icon={<DirectionsBike />} value={vehicleCounts.bicyclette} onChange={(value) => handleVehicleCountChange('bicyclette', value)} />
        </Box>
        {errors.vehicleCounts && <Typography color="error">{errors.vehicleCounts}</Typography>}
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
          <TarifSection
            title="Tarif du Jour"
            onChange={(field, value) => handleTarifChange('jour', field, value)}
            tarif={jourTarif.tarif}
            heureDebut={jourTarif.heure_debut}
            heureFin={jourTarif.heure_fin}
          />
          {errors.jourTarif && <Typography color="error">{errors.jourTarif}</Typography>}
          <TarifSection
            title="Tarif de Nuit"
            onChange={(field, value) => handleTarifChange('nuit', field, value)}
            tarif={nuitTarif.tarif}
            heureDebut={nuitTarif.heure_debut}
            heureFin={nuitTarif.heure_fin}
          />
          {errors.nuitTarif && <Typography color="error">{errors.nuitTarif}</Typography>}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="outlined"
          onClick={() => setShowTarif24h(!showTarif24h)}
          sx={{
            mt: 2,
            mb: 2,
            color: '#374869',
            borderColor: '#374869',
            '&:hover': {
              backgroundColor: '#e8eaf6',
            },
          }}
        >
          {showTarif24h ? 'Masquer Tarif 24h' : 'Afficher Tarif 24h'}
        </Button>

        <Fade in={showTarif24h}>
          <Box>
            {showTarif24h && (
              <>
                <TarifSection
                  title="Tarif de 24h"
                  onChange={(field, value) => handleTarifChange('tarif24', field, value)}
                  tarif={tarif24h.tarif}
                  heureDebut={tarif24h.heure_debut}
                  heureFin={tarif24h.heure_fin}
                />
                {errors.tarif24h && <Typography color="error">{errors.tarif24h}</Typography>}
              </>
            )}
          </Box>
        </Fade>
      </Grid>
    </Grid>

    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          backgroundColor: '#374869',
          '&:hover': {
            backgroundColor: '#2c3a54',
          },
          padding: '10px 30px',
          fontSize: '1.1rem',
        }}
      >
        Enregistrer
      </Button>
    </Box>
  </Paper>
);
};

export default Parking;