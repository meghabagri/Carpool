import React from "react";
import { MainScreen } from "./pages/main-screen";
import { DriverProvider } from "./main-screen.provider";

const App = () => {
  return (
    <div>
      <DriverProvider>
        <MainScreen />
      </DriverProvider>
    </div>
  );
};
export default App;
