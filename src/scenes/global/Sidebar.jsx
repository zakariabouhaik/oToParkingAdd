import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import useUserDetails from '../../hook/useUserDetails';

import { tokens } from "../../theme";

const darkColors = tokens("dark");

const Item = ({ title, to, icon, selected, setSelected, setIsCollapsed, isMobile }) => {
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: darkColors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        if (isMobile) setIsCollapsed(true); // Ferme le sidebar après un clic seulement sur mobile
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ setSidebarWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [selected, setSelected] = useState("Dashboard");
  const { userDetails, loading, error } = useUserDetails();

  useEffect(() => {
    setSidebarWidth(isCollapsed ? 80 : 250);
  }, [isCollapsed, setSidebarWidth]);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  const isSupervisor = userDetails?.role === 'SUPERVISEUR';
  const isAGENT = userDetails?.role === 'AGENT';

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${darkColors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-sidebar": {
          width: isCollapsed ? '80px !important' : '250px !important',
          minWidth: isCollapsed ? '80px !important' : '250px !important',
        },
        "& .pro-sidebar-content": {
          transition: 'width 0.3s ease-in-out',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: darkColors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton sx={{color:'white'}} onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/logo.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={darkColors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  oToParking
                </Typography>
              </Box>
            </Box>
          )}

          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography marginTop={1} variant="h5" color='white'>
                  {userDetails ? (
                    <>
                      {userDetails.role}<br /><br />
                      {userDetails.nom} {userDetails.prenom}
                    </>
                  ) : "Loading..."}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={darkColors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Gestion
            </Typography>
            {isSupervisor && (
              <Item
                title="Ajouter Agent"
                to="/Agent"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
              />
            )}
            {isAGENT && (
              <Item
                title="Ajouter Gardien"
                to="/Gardien"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
              />
            )}
            {isSupervisor && (
              <Item
                title="Ajouter Parking"
                to="/Parking"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
              />
            )}
            {isAGENT && (
              <Item
                title="Parking List"
                to="/Parkings"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
              />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;