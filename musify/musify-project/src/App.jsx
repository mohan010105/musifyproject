import React from "react";
import { RouterProvider } from "react-router-dom";
import { MyMap } from "./Routes/Map";
import AuthContex from "./Contex/AuthContex";
import { SongProvider } from "./Contex/SongContext";
import { ThemeProvider } from "./Contex/ThemeContext";
import { SubscriptionProvider } from "./Contex/SubscriptionContext";

const App = () => {
  return (
    <AuthContex>
      <ThemeProvider>
        <SubscriptionProvider>
          <SongProvider>
            <RouterProvider router={MyMap} />
          </SongProvider>
        </SubscriptionProvider>
      </ThemeProvider>
    </AuthContex>
  );
};

export default App;
