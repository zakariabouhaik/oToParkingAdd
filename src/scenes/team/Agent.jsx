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
  Container,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  AccountCircle,
  AlternateEmail,
  ConfirmationNumber,
  Apartment,
  LocalPhone,
  Public,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';


const StyledBox = styled(Box)(({ theme }) => ({
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1, 4),
}));


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
      <MenuItem value=""><em>Aucun</em></MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {error && <Typography color="error" variant="caption">{error}</Typography>}
  </FormControl>
);

const axiosInstance = axios.create({
  httpsAgent: { rejectUnauthorized: false } // À utiliser uniquement en développement !
});

const Agent = () => {
 
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cin: '',
    region: '',
    province: '',
    pachalik: '',
  });
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [pachaliks, setPachaliks] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { 
    fetchRegions();
  }, []);

  const handleInputChange = (e, clearError = false) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (clearError) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'region') {
      fetchProvinces(value);
    } else if (name === 'province') {
      fetchPachaliks(value);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      cin: '',
      region: '',
      province: '',
      pachalik: '',
    });
    setErrors({});
  };

  const fetchRegions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getallregion');
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
      const response = await axiosInstance.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getprovinceofregion/${regionId}`);
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
      const response = await axiosInstance.get(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/getPachalikOfProvince/${provinceId}`);
      setPachaliks(response.data.pachaliks);
    } catch (error) {
      console.error('Erreur lors de la récupération des pachaliks:', error);
      setPachaliks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = `Le champ ${key} est requis`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response1 = await axiosInstance.post(`https://fgefweff.online:8085/User/createAgent?username=${formData.telephone}`);

      if (!response1.data || !response1.data.id) {
        throw new Error('Invalid response from first API');
      }

      const keycloakId = response1.data.id;

      const response2 = await fetch(`https://er8wa98ace.execute-api.us-east-1.amazonaws.com/dev/createAgent`, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          keycloakId: keycloakId
        })
      });

      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }

      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error creating agent:', error);
      // Optionally set an error state here to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
    <StyledBox sx={{ mt: 4, mb: 4 }}>
      <StyledTypography variant="h4">
        Enregistrement d'agent
      </StyledTypography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputField
            icon={<AccountCircle />}
            label="Nom"
            name="nom"
            value={formData.nom}
            onInputChange={handleInputChange}
            error={errors.nom}
          />
        </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              icon={<AccountCircle />}
              label="Prénom"
              name="prenom"
              value={formData.prenom}
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
              value={formData.email}
              onInputChange={handleInputChange}
              error={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              icon={<LocalPhone />}
              label="Numéro de téléphone"
              name="telephone"
              value={formData.telephone}
              onInputChange={handleInputChange}
              error={errors.telephone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              icon={<ConfirmationNumber />}
              label="CIN"
              name="cin"
              value={formData.cin}
              onInputChange={handleInputChange}
              error={errors.cin}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectField
              label="Région"
              name="region"
              value={formData.region}
              onSelectChange={handleInputChange}
              options={regions.map(region => ({
                value: region.id,
                label: region.nom
              }))}
              startAdornment={
                <InputAdornment position="start">
                  <Public />
                </InputAdornment>
              }
              error={errors.region}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectField
              label="Province"
              name="province"
              value={formData.province}
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
              value={formData.pachalik}
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
        <StyledButton 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
        </StyledButton>
      </StyledBox>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <MuiAlert elevation={6} variant="filled" severity="success">
          L'ajout de l'Agent a bien été effectué.
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Agent;