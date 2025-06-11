import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <Router>
        <AppRouter />
      </Router>
    </NotificationProvider>
  );
};

export default App;
