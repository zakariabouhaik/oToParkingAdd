import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Agent from "./scenes/team/Agent";
import Gardien from "./scenes/team/Gardien";
import FAQ from "./scenes/faq";
import Parking from "./scenes/team/Parking";
import Logincho from "./Login/Logincho";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Parkingo from "./scenes/team/Parking copy";
import Geography from "./scenes/geography";
import Parkings from "./scenes/team/Parking copy 2";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoginPage ? (
          <Logincho />
        ) : (
          <div style={{
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
          }}>
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
                <Routes>
              
                    <Route path="/parkings" element={<ProtectedRoute requiredRoles={['AGENT']}><Parkings /></ProtectedRoute>} />
                  <Route path="/Parkingo" element={<ProtectedRoute requiredRoles={['AGENT']}><Parkingo /></ProtectedRoute>} />
                  <Route path="/Agent" element={<ProtectedRoute requiredRoles={['SUPERVISEUR']}><Agent /></ProtectedRoute>} />
                  <Route path="/Gardien" element={<ProtectedRoute requiredRoles={['AGENT']}><Gardien /></ProtectedRoute>} />
                  <Route path="/Parking" element={<ProtectedRoute requiredRoles={['SUPERVISEUR']}><Parking /></ProtectedRoute>} />      
               
                </Routes>
              </div>
            </main>
          </div>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
