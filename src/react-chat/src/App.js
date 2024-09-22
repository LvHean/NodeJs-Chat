import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./lib/PrivateRoutes";
import PublicRoutes from "./lib/PublicRoutes";
import Alert from "./components/Alert/Alert";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Chat from "./components/Chat/Chat";

import './App.css';

function App() {
  const [errorMessage, updateErrorMessage] = useState(null);
    return (
      <div className="container d-flex align-items-center flex-column">
        <Alert
            errorMessage={errorMessage}
            hideError={updateErrorMessage}
          />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route index path="/" element={<Login showError={updateErrorMessage} />} />
              <Route index path="/login" element={<Login showError={updateErrorMessage} />} />
              <Route path="/register" element={<Register showError={updateErrorMessage} />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/home" element={<Home showError={updateErrorMessage} />} />
              <Route path="/chat" element={<Chat showError={updateErrorMessage} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
}

export default App;
