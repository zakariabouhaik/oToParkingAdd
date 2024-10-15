import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert
} from '@mui/material';
import {
  AccountCircle,
  AlternateEmail,
  ConfirmationNumber,
  LocationCity
} from '@mui/icons-material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import axios from 'axios';
import { ThreeDot } from 'react-loading-indicators';

const InputField = ({ icon, label, name, value, onChange, error, ...props }) => (
  <TextField
    fullWidth
    variant="outlined"
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    error={!!error}
    helperText={error}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          {icon}
        </InputAdornment>
      ),
    }}
    {...props}
  />
);

const SelectField = ({ label, name, value, options, onChange, startAdornment, error, ...props }) => (
  <FormControl fullWidth error={!!error}>
    <InputLabel>{label}</InputLabel>
    <Select 
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
      startAdornment={
        <InputAdornment position="start">
          {startAdornment}
        </InputAdornment>
      }
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

const Gardien = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cin: '',
    caidat: ''
  });
  const [errors, setErrors] = useState({});
  const [caidats, setCaidats] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { 
    fetchCaidats();
  }, []);

  const fetchCaidats = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('id');
    try {
      const response = await axios.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getcaidatforagent/${userId}`);
      if (response.data && response.data.caidats) {
        setCaidats(response.data.caidats);
      } else {
        console.error('Structure de réponse inattendue pour les caidats:', response.data);
        setSnackbar({ open: true, message: 'Erreur lors de la récupération des caidats', severity: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des caidats:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la récupération des caidats', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'Ce champ est requis';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs', severity: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const gardienData = {
        username: formData.telephone,
        cin: formData.cin,
        name: formData.nom,
        lastname: formData.prenom,
        email: formData.email,
        agentId: localStorage.getItem('id'),
        caidat: formData.caidat,
        picture: ''
      };

      const response = await fetch(`http://16.171.20.170:8085/User/createGardien`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gardienData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gardien créé avec succès:', data);
      setSnackbar({ open: true, message: 'Gardien créé avec succès', severity: 'success' });
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        cin: '',
        caidat: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de la création du gardien:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la création du gardien', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDot variant="bounce" color="#317bcc" size="large" text="" textColor="" />
      </div>
    );
  }

  return (
    <Box sx={{ margin: 'auto', padding: 6 }}>
      <Typography variant="h4" sx={{marginBottom:4}}>
        Enregistrement de Gardien
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<AccountCircle />}
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            error={errors.nom}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<AccountCircle />}
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            error={errors.prenom}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            icon={<AlternateEmail />}
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<LocalPhoneIcon />}
            label="Numéro de téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            error={errors.telephone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<ConfirmationNumber />}
            label="CIN"
            name="cin"
            value={formData.cin}
            onChange={handleInputChange}
            error={errors.cin}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectField
            label="Caidat"
            name="caidat"
            value={formData.caidat}
            onChange={handleInputChange}
            options={caidats.map(caidat => ({
              value: caidat.id,
              label: caidat.nom
            }))}
            startAdornment={<LocationCity />}
            error={errors.caidat}
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gardien;