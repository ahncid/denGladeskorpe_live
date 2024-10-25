import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// eslint-disable-next-line no-unused-vars
import fonts from "./services/fonts.jsx"; 

import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

      <BrowserRouter>
      <AuthContextProvider>
              <App />
      </AuthContextProvider>
      </BrowserRouter>

  </React.StrictMode>
);

