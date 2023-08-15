import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FileContext, FileContextProvider } from "./context/FileContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FileContextProvider>
        <App />
      </FileContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
