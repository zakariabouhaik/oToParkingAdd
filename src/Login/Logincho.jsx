import React, { useState } from "react";
import { 
  Button, CssBaseline, TextField, Paper, Box, Grid, 
  Typography, createTheme, ThemeProvider, Alert, Snackbar 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

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
      const response = await fetch(`http://16.171.20.170:8085/User/hasPassword?username=${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.text();
      console.log('Response:', result);
      
      switch(result.trim()) {
        case "walo":
          showSnackbar("Compte non existant", "error");
          break;
        case "3ndo":
          setStep("password");
          break;
        case "ma3ndoch":
          setStep("newPassword");
          break;
        default:
          showSnackbar("Une erreur s'est produite", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar("Erreur lors de la vérification du nom d'utilisateur", "error");
    }
  };


  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://16.171.20.170:8085/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la connexion");
      }
  
      const data = await response.json();
      
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
  
      const userResponse = await fetch(`http://16.171.20.170:8085/User/getUserRole/${userId}`, {
        headers: { "Authorization": `Bearer ${data.accessToken}` }
      });
  
      if (!userResponse.ok) {
        throw new Error(`Échec de la récupération du rôle de l'utilisateur: ${userResponse.status} ${userResponse.statusText}`);
      }
  
      const role = await userResponse.text().then(text => text.trim());
  
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

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://16.171.20.170:8085/User/verifyGardienCode?username=${username}&gardienCode=${otp}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const isOtpValid = await response.json();
      
      if (isOtpValid) {
        setStep("newPassword");
      } else {
        showSnackbar("Code OTP invalide", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar("Erreur lors de la vérification du code OTP", "error");
    }
  };

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      showSnackbar("Les mots de passe ne correspondent pas", "error");
      return;
    }
    try {
      const response = await fetch(`http://16.171.20.170:8085/User/createPassword?username=${username}&password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        showSnackbar("Mot de passe défini avec succès", "success");
        setTimeout(() => setStep("password"), 2000);
      } else {
        showSnackbar("Erreur lors de la définition du mot de passe", "error");
      }
    } catch (error) {
      showSnackbar("Erreur lors de la définition du mot de passe", "error");
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
                    backgroundColor: '#C2002F',
                    '&:hover': { backgroundColor: '#A5002A' },
                    '&:disabled': { backgroundColor: '#FFB3B3' }
                  }}
                >
                  {step === "username" ? "Suivant" :
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