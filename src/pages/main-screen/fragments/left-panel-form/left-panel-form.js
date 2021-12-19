import React, { useState, useContext } from "react";
import {
  Box,
  FormControl,
  ListItemText,
  List,
  Toolbar,
  Divider,
  TextField
} from "@mui/material";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { DriverContext } from "../../../../main-screen.provider";

const LeftPanelForm = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const driverContext = useContext(DriverContext);

  const handleFromSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setFrom(value);
    driverContext.driverDipatcher({ type: "UPDATE_FROM", payload: latLng });
  };

  const handleSelectTo = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setTo(value);
    driverContext.driverDipatcher({ type: "UPDATE_TO", payload: latLng });
  };

  return (
    <Box>
      <Toolbar />
      <Divider />
      <Box sx={{ m: 2 }}>
        <FormControl fullWidth>
          <PlacesAutocomplete
            value={from}
            onChange={setFrom}
            onSelect={handleFromSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <Box>
                <TextField
                  label="From"
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
                <TextField
                  label="To"
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
  );
};

export default LeftPanelForm;
