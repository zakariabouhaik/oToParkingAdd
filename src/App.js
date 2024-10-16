import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Agent from "./scenes/team/Agent";
import Gardien from "./scenes/team/Gardien";
import Parking from "./scenes/team/Parking";
import Logincho from "./Login/Logincho";
import ProtectedRoute from "./ProtectedRoute";
import Parkingo from "./scenes/team/Parking copy";
import Parkings from "./scenes/team/Parking copy 2";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const AuthenticatedLayout = ({ children }) => (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: '#1F2A40',
      }}>
        <Sidebar isSidebar={isSidebar} />
      </div>
      <main style={{
        flexGrow: 1,
        marginLeft: '250px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}>
          <Topbar setIsSidebar={setIsSidebar} />
        </div>
        <div style={{
          flexGrow: 1,
          padding: '20px',
          overflowY: 'auto',
        }}>
          {children}
        </div>
      </main>
    </div>
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Logincho />} />
          <Route path="/login" element={<Logincho />} />
          <Route path="/Gardien" element={
            <ProtectedRoute requiredRoles={['AGENT']}>
              <AuthenticatedLayout>
                <Gardien />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/agent" element={
            <ProtectedRoute requiredRoles={['SUPERVISEUR']}>
              <AuthenticatedLayout>
                <Agent />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/parkings" element={
            <ProtectedRoute requiredRoles={['AGENT']}>
              <AuthenticatedLayout>
                <Parkings />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/Parkingo" element={
            <ProtectedRoute requiredRoles={['AGENT']}>
              <AuthenticatedLayout>
                <Parkingo />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/Parking" element={
            <ProtectedRoute requiredRoles={['SUPERVISEUR']}>
              <AuthenticatedLayout>
                <Parking />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/form/:userId" element={
            <ProtectedRoute requiredRoles={['AUDITE']}>
              <AuthenticatedLayout>
                <Form />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
