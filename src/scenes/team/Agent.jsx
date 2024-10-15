import React, { useState, useEffect } from 'react';
import axios from "axios";
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
  Stack,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  AccountCircle,
  AlternateEmail,
  ConfirmationNumber,
  Apartment,
} from '@mui/icons-material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import { ThreeDot } from 'react-loading-indicators';


const InputField = ({ icon, label, error, onInputChange, ...props }) => (
  <TextField
    fullWidth
    variant="outlined"
    label={label}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          {icon}
        </InputAdornment>
      ),
    }}
    error={!!error}
    helperText={error}
    onChange={(e) => {
      onInputChange(e);
      if (error) {
        onInputChange({ target: { name: props.name, value: e.target.value } }, true);
      }
    }}
    {...props}
  />
);

const SelectField = ({ label, options, startAdornment, error, onSelectChange, ...props }) => (
  <FormControl fullWidth error={!!error}>
    <InputLabel>{label}</InputLabel>
    <Select 
      label={label} 
      {...props}
      startAdornment={startAdornment}
      onChange={(e) => {
        onSelectChange(e);
        if (error) {
          onSelectChange({ target: { name: props.name, value: e.target.value } }, true);
        }
      }}
    >
      <MenuItem value=""><em>None</em></MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {error && <Typography color="error" variant="caption">{error}</Typography>}
  </FormControl>
);

const Agent = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [cin, setCin] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [pachaliks, setPachaliks] = useState([]);
  const [selectedPachalik, setSelectedPachalik] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { 
    fetchRegions();
  }, []);

  const handleInputChange = (e, clearError = false) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nom':
        setNom(value);
        break;
      case 'prenom':
        setPrenom(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'telephone':
        setTelephone(value);
        break;
      case 'cin':
        setCin(value);
        break;
      case 'region':
        setSelectedRegion(value);
        fetchProvinces(value);
        break;
      case 'province':
        setSelectedProvince(value);
        fetchPachaliks(value);
        break;
      case 'pachalik':
        setSelectedPachalik(value);
        break;
      default:
        break;
    }

    if (clearError) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setTelephone('');
    setCin('');
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedPachalik('');
    setErrors({});
  };

 

  const fetchRegions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getallregion');
      if (response.data && response.data.allregion) {
        setRegions(response.data.allregion);
      } else {
        console.error('Structure de réponse inattendue pour les régions:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProvinces = async (regionId) => {
    if (!regionId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getprovinceofregion/${regionId}`);
      if (response.data && response.data.ourprovinces) {
        setProvinces(response.data.ourprovinces);
      } else {
        console.error('Structure de réponse inattendue pour les provinces:', response.data);
        setProvinces([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des provinces:', error);
      setProvinces([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPachaliks = async (provinceId) => {
    if (!provinceId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getPachalikOfProvince/${provinceId}`);
      setPachaliks(response.data.pachaliks);
    } catch (error) {
      console.error('Erreur lors de la récupération des pachaliks:', error);
      setPachaliks([]);
    } finally {
      setIsLoading(false);
    }
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

  const validateForm = () => {
    const newErrors = {};
    if (!nom) newErrors.nom = "Le nom est requis";
    if (!prenom) newErrors.prenom = "Le prénom est requis";
    if (!email) newErrors.email = "L'email est requis";
    if (!telephone) newErrors.telephone = "Le numéro de téléphone est requis";
    if (!cin) newErrors.cin = "Le CIN est requis";
    if (!selectedRegion) newErrors.region = "La région est requise";
    if (!selectedProvince) newErrors.province = "La province est requise";
    if (!selectedPachalik) newErrors.pachalik = "Le pachalik est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://16.171.20.170:8085/User/createAgent?username=${telephone}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data1 = await response.json();

      const response2 = await fetch(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/createAgent`, {
        method: 'POST',
       
        body: JSON.stringify({
          nom,
          prenom,
          cin,
          email,   
          region: selectedRegion,
          province: selectedProvince,
          pachalik: selectedPachalik,
          keycloakId: data1.id
        })
      });

      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }

      setSuccess(true);
      
      // Set a timer to reset the form and hide the success message after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 800);

    } catch (error) {
      console.error('Error creating agent:', error);
      // Optionally set an error state here to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDot variant="bounce" color="#317bcc" size="large" text="" textColor="" />
      </div>
    );
  }

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
          L'ajout de l'Agent a bien été effectué.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 'auto', padding: 6 }}>
      <Typography variant="h4" sx={{marginBottom:4}}>
        Enregistrement d'agent
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<AccountCircle />}
            label="Nom"
            name="nom"
            value={nom}
            onInputChange={handleInputChange}
            error={errors.nom}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<AccountCircle />}
            label="Prénom"
            name="prenom"
            value={prenom}
            onInputChange={handleInputChange}
            error={errors.prenom}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            icon={<AlternateEmail />}
            label="Email"
            type="email"
            name="email"
            value={email}
            onInputChange={handleInputChange}
            error={errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<LocalPhoneIcon />}
            label="Numéro de téléphone"
            name="telephone"
            value={telephone}
            onInputChange={handleInputChange}
            error={errors.telephone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<ConfirmationNumber />}
            label="CIN"
            name="cin"
            value={cin}
            onInputChange={handleInputChange}
            error={errors.cin}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField
            label="Région"
            name="region"
            value={selectedRegion}
            onSelectChange={handleInputChange}
            options={regions.map(region => ({
              value: region.id,
              label: region.nom
            }))}
            startAdornment={
              <InputAdornment position="start">
                <SouthAmericaIcon />
              </InputAdornment>
            }
            error={errors.region}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField
            label="Province"
            name="province"
            value={selectedProvince}
            onSelectChange={handleInputChange}
            options={provinces.map(province => ({
              value: province.id,
              label: province.nom
            }))}
            startAdornment={
              <InputAdornment position="start">
                <Apartment />
              </InputAdornment>
            }
            error={errors.province}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField
            label="Pachalik"
            name="pachalik"
            value={selectedPachalik}
            onSelectChange={handleInputChange}
            options={pachaliks.map(pachalik => ({
              value: pachalik.id,
              label: pachalik.nom
            }))}
            startAdornment={
              <InputAdornment position="start">
                <Apartment />
              </InputAdornment>
            }
            error={errors.pachalik}
          />
        </Grid>
      </Grid>
      <Button 
        variant="contained" 
        sx={{marginTop:5, backgroundColor:'#374869'}}
        onClick={handleSubmit}
      >
        Enregistrer
      </Button>
    </Box>
  );
};

export default Agent;