import React, { createContext } from "react";

const driverCoords = {
  fromCoords: {
    lat: null,
    lng: null
  },
  toCoords: {
    lat: null,
    lng: null
  }
};

const DriverContext = createContext();

function driverReducer(state, action) {
  switch (action.type) {
    case "UPDATE_TO":
      return Object.assign({}, state, {
        toCoords: action.payload
      });
    case "UPDATE_FROM":
      return Object.assign({}, state, {
        fromCoords: action.payload
      });
    default: {
      return state;
    }
  }
}

function DriverProvider({ children }) {
  const [state, dispatch] = React.useReducer(driverReducer, driverCoords);

  const value = { driverCoords: state, driverDipatcher: dispatch };
  return (
    <DriverContext.Provider value={value}>{children}</DriverContext.Provider>
  );
}

export { DriverProvider, DriverContext };
