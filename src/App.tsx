import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* <ThemeProvider> */}
        <NotificationProvider>
          <Router>
            <AppRouter />
          </Router>
        </NotificationProvider>
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
};

export default App;
