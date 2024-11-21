import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// eslint-disable-next-line no-unused-vars
import fonts from "./services/fonts.jsx"; 

import "./index.css";

import { AuthContextProvider } from "./context/authContext.jsx";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <HashRouter>

      <AuthContextProvider>
              <App />
      </AuthContextProvider>

      </HashRouter>
  </React.StrictMode>
);

