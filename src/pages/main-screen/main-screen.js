/* global google */
import React, { useContext, useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  Drawer,
  IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { DriverContext } from "../../main-screen.provider";
import { MapDirectionsRenderer, LeftPanelForm } from "./fragments";

const API_KEY = "AIzaSyCFOxZdr5r5zsdVPG7XD2o_CAwwy2DvPqo";

const MainScreen = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const container =
    window !== undefined ? () => window.document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawerWidth = "300px";
  const [filteredRides, setFilteredRides] = useState([]);
  const { driverCoords } = useContext(DriverContext);

  // TODO: To be fetched real time from AWS
  const riders = [
    { lat: 34.0257449, lng: -118.2832194 },
    { lat: 34.0259722, lng: -118.2841969 }
  ];

  // To filtered the rides which are in the range of 5 kms of the driver
  useEffect(() => {
    if (
      driverCoords.fromCoords.lat != null &&
      driverCoords.fromCoords.lng != null &&
      driverCoords.toCoords.lat != null &&
      driverCoords.toCoords.lng != null
    ) {
      const l1 = new google.maps.LatLng(
        driverCoords.fromCoords.lat,
        driverCoords.fromCoords.lng
      );
      const l2 = new google.maps.LatLng(
        driverCoords.toCoords.lat,
        driverCoords.toCoords.lng
      );
      const d = (
        google.maps.geometry.spherical.computeDistanceBetween(l1, l2) / 1000
      ).toFixed(2);

      const validRides = riders.map(ride => {
        const d1 = (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(ride.lat, ride.lng),
            new google.maps.LatLng(
              driverCoords.fromCoords.lat,
              driverCoords.fromCoords.lng
            )
          ) / 1000
        ).toFixed(2);

        const d2 = (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(ride.lat, ride.lng),
            new google.maps.LatLng(
              driverCoords.toCoords.lat,
              driverCoords.toCoords.lng
            )
          ) / 1000
        ).toFixed(2);
        if (d1 + d2 <= d + 3.1) return ride;
      });
      setFilteredRides(validRides);
    }
  }, [driverCoords.fromCoords, driverCoords.toCoords]);

  const Map = withScriptjs(
    withGoogleMap(props => (
      <GoogleMap
        defaultCenter={props.defaultCenter}
        defaultZoom={props.defaultZoom}
      >
        {/* Code to show makers for the rides which are in the 5km range */}
        {filteredRides &&
          filteredRides[0] &&
          filteredRides.map((marker, index) => {
            const position = { lat: marker.lat, lng: marker.lng };
            return <Marker key={index} position={position} />;
          })}
        <MapDirectionsRenderer
          places={props.places}
          rides={props.rides}
          travelMode={window.google.maps.TravelMode.DRIVING}
        />
      </GoogleMap>
    ))
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth})` },
          ml: { sm: `${drawerWidth}` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            RideShare
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          <LeftPanelForm />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
          open
        >
          <LeftPanelForm />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth})` }
        }}
      >
        <Toolbar />
        <Map
          googleMapURL={
            "https://maps.googleapis.com/maps/api/js?key=" +
            API_KEY +
            "&v=3.exp&libraries=geometry,drawing,places&sensor=true"
          }
          places={[driverCoords.fromCoords, driverCoords.toCoords]}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: "80vh" }} />}
          mapElement={<div style={{ height: "86vh" }} />}
          defaultCenter={{ lat: 27.71415, lng: -82.3583 }}
          defaultZoom={12}
        />
      </Box>
    </Box>
  );
};

export default MainScreen;
