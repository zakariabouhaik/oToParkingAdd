import React, { useState } from "react";
import { 
  Button, CssBaseline, TextField, Box, Grid, 
  Typography, createTheme, ThemeProvider, Alert, Snackbar 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const defaultTheme = createTheme();

const axiosInstance = axios.create();

// Disable SSL certificate verification (only for development!)
axiosInstance.defaults.httpsAgent = {
  rejectUnauthorized: false
};

export default function Logincho() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("username");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleUsernameSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(`https://16.171.20.170:8085/User/hasPassword?username=${username}`);
      
      const result = response.data;
      console.log('Response:', result);
      
      switch(result.trim()) {
        case "walo":
          showSnackbar("Compte non existant", "error");
          break;
        case "3ndo":
          setStep("password");
          break;
        case "ma3ndoch":
          setStep("otp");
          break;
        default:
          showSnackbar("Une erreur s'est produite", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar("Erreur lors de la vérification du nom d'utilisateur", "error");
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        `https://16.171.20.170:8085/User/verifyGardienCode?username=${encodeURIComponent(username)}&gardienCode=${encodeURIComponent(otp)}`
      );
      
      if (response.data === true) {
        setStep("newPassword");
      } else {
        showSnackbar("Code OTP invalide", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar("Erreur lors de la vérification du code OTP", "error");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("https://16.171.20.170:8085/User/login", {
        username,
        password
      });

      const data = response.data;
      
      if (!data.accessToken) {
        throw new Error("Connexion réussie mais le jeton d'accès est manquant");
      }

      const tokenParts = data.accessToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Format de jeton invalide");
      }
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.sub;

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("id", userId);

      const userResponse = await axiosInstance.get(`https://16.171.20.170:8085/User/getUserRole/${userId}`, {
        headers: { "Authorization": `Bearer ${data.accessToken}` }
      });

      const role = userResponse.data.trim();

      switch (role) {
        case 'AGENT':
          navigate("/Gardien");
          break;
        case 'SUPERVISEUR':
          navigate(`/agent`);
          break;
        case 'AUDITE':
          navigate(`/form/${userId}`);
          break;
        default:
          console.warn("Rôle d'utilisateur inconnu:", role);
          navigate("/");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      showSnackbar("Mot de passe incorrect", "error");
    }
  };

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      showSnackbar("Les mots de passe ne correspondent pas", "error");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `https://16.171.20.170:8085/User/createPassword?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      );
      if (response.status === 200) {
        showSnackbar("Mot de passe défini avec succès", "success");
        setTimeout(() => setStep("password"), 2000);
      } else {
        showSnackbar("Erreur lors de la définition du mot de passe", "error");
      }
    } catch (error) {
      console.error('Erreur lors de la définition du mot de passe:', error);
      if (error.response) {
        showSnackbar(`Erreur ${error.response.status}: ${error.response.data}`, "error");
      } else if (error.request) {
        showSnackbar("Pas de réponse du serveur", "error");
      } else {
        showSnackbar("Erreur lors de la configuration de la requête", "error");
      }
    }
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden',
        display: 'flex'
      }}>
        <CssBaseline />
        <Grid container sx={{ height: '100%', width: '100%' }}>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url('/assets/parking.jpg')",
              backgroundRepeat: "no-repeat",
              backgroundColor: t =>
                t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid item xs={12} sm={8} md={5} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '400px',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/assets/logo.png"
                alt="logo"
                style={{ width: '30%', marginBottom: "30px" }}
              />
              <Typography sx={{ marginBottom: "30px" }} component="h1" variant="h6">
                Bienvenue à Votre Application
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={
                  step === "username" ? handleUsernameSubmit :
                  step === "otp" ? handleOtpSubmit :
                  step === "password" ? handlePasswordSubmit :
                  handleNewPasswordSubmit
                }
                sx={{ mt: 1, width: '100%' }}
              >
                {step === "username" && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Entrez votre nom d'utilisateur"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                )}
                {step === "otp" && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="Entrez le code OTP"
                    name="otp"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                )}
                {step === "password" && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                {step === "newPassword" && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="Nouveau mot de passe"
                      type="password"
                      id="newPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirmez le mot de passe"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#374869',
                    '&:hover': { backgroundColor: '#374869' },
                    '&:disabled': { backgroundColor: '#374869' }
                  }}
                >
                  {step === "username" ? "Suivant" :
                   step === "otp" ? "Vérifier OTP" :
                   step === "password" ? "Se Connecter" :
                   "Définir le mot de passe"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width:'100%'}}>
          <Typography>{snackbarMessage}</Typography>
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
