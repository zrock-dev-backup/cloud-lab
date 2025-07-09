import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from "./AuthContext.tsx";
import * as Sentry from "@sentry/react";

const theme = createTheme();

Sentry.init({
    dsn: "https://baa3266c7a3cb98009d79346d84ab455@o4509638673694720.ingest.de.sentry.io/4509638675988560",
    sendDefaultPii: true
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
