/* global google */
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  FormControl,
  Input,
  ListItemText,
  List,
  Drawer
} from "@mui/material";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { MapDirectionsRenderer } from "./fragments/direction-renderer";

const API_KEY = "AIzaSyDciBUuGsYD6gmUrEkV-24bhXvzAXiZz0g";

const MainScreen = () => {
  const drawerWidth = "20%";

  const [from, setFrom] = useState("");
  const [fromCoords, setFromCoords] = useState({
    lat: null,
    lng: null
  });
  const [filteredRides, setFilteredRides] = useState([]);
  const [to, setTo] = useState("");
  const [toCoords, setToCoords] = useState({
    lat: null,
    lng: null
  });

  // TODO: To be fetched real time from AWS
  const riders = [
    { lat: 34.0257449, lng: -118.2832194 },
    { lat: 34.0259722, lng: -118.2841969 }
  ];

  // To filtered the rides which in the range of 5 kms of the driver
  useEffect(() => {
    if (
      fromCoords.lat != null &&
      fromCoords.lng != null &&
      toCoords.lat != null &&
      toCoords.lng != null
    ) {
      const l1 = new google.maps.LatLng(fromCoords.lat, fromCoords.lng);
      const l2 = new google.maps.LatLng(toCoords.lat, toCoords.lng);
      const d = (
        google.maps.geometry.spherical.computeDistanceBetween(l1, l2) / 1000
      ).toFixed(2);

      const validRides = riders.map(ride => {
        const d1 = (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(ride.lat, ride.lng),
            new google.maps.LatLng(fromCoords.lat, fromCoords.lng)
          ) / 1000
        ).toFixed(2);

        const d2 = (
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(ride.lat, ride.lng),
            new google.maps.LatLng(toCoords.lat, toCoords.lng)
          ) / 1000
        ).toFixed(2);
        if (d1 + d2 <= d + 3.1) return ride;
      });
      setFilteredRides(validRides);
    }
  }, [fromCoords, toCoords]);

  const handleSelectTo = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setTo(value);
    setToCoords(latLng);
  };

  const handleSelectFrom = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setFrom(value);
    setFromCoords(latLng);
  };

  const Map = withScriptjs(
    withGoogleMap(props => (
      <GoogleMap
        defaultCenter={props.defaultCenter}
        defaultZoom={props.defaultZoom}
      >
        {/* Code to show makers for the rides which are in the 5km range */}
        {filteredRides.map((marker, index) => {
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
      <AppBar
        position="fixed"
        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            RideShare
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        <Toolbar />
        <Box sx={{ m: 2 }}>
          <Box sx={{ m: 2 }}>
            <FormControl fullWidth>
              <PlacesAutocomplete
                value={from}
                onChange={setFrom}
                onSelect={handleSelectFrom}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading
                }) => (
                  <Box>
                    <Input
                      autoFocus={true}
                      sx={{ width: "100%" }}
                      {...getInputProps({ placeholder: "From" })}
                    />
                    <List dense={true}>
                      {loading ? <Box>...loading</Box> : null}
                      {suggestions.map(suggestion => {
                        return (
                          <ListItemText
                            {...getSuggestionItemProps(suggestion)}
                            sx={{ cursor: "pointer" }}
                          >
                            {suggestion.description}
                          </ListItemText>
                        );
                      })}
                    </List>
                  </Box>
                )}
              </PlacesAutocomplete>
            </FormControl>
          </Box>
          <Box sx={{ m: 2 }}>
            <FormControl fullWidth>
              <PlacesAutocomplete
                value={to}
                onChange={setTo}
                onSelect={handleSelectTo}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading
                }) => (
                  <Box>
                    <Input
                      sx={{ width: "100%" }}
                      {...getInputProps({ placeholder: "To" })}
                    />
                    <List dense={true}>
                      {loading ? <Box>...loading</Box> : null}
                      {suggestions.map(suggestion => {
                        return (
                          <ListItemText
                            {...getSuggestionItemProps(suggestion)}
                            sx={{
                              cursor: "pointer"
                            }}
                          >
                            {suggestion.description}
                          </ListItemText>
                        );
                      })}
                    </List>
                  </Box>
                )}
              </PlacesAutocomplete>
            </FormControl>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Map
          googleMapURL={
            "https://maps.googleapis.com/maps/api/js?key=" +
            API_KEY +
            "&v=3.exp&libraries=geometry,drawing,places&sensor=true"
          }
          places={[fromCoords, toCoords]}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: "80vh" }} />}
          mapElement={<div style={{ height: "100vh" }} />}
          defaultCenter={{ lat: 27.71415, lng: -82.3583 }}
          defaultZoom={12}
        />
      </Box>
    </Box>
  );
};

export default MainScreen;
