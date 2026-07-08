import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./styles/base/reset.css";
import "./styles/base/variables.css";
import "./styles/base/themes.css";
import "./styles/base/typography.css";
import "./styles/base/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);