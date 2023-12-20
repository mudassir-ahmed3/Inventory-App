import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './Context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>

    <GoogleOAuthProvider clientId='828007683862-a7ls6o20c11cqctb6rh55q1veuqtc0pe.apps.googleusercontent.com'>
      <AuthContextProvider>
        <AppRoutes />
      </AuthContextProvider>
    </GoogleOAuthProvider>

  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();