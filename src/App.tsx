import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/globals.css';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h2>
        <div className="p-3 mb-4 overflow-auto text-sm bg-gray-100 rounded">
          <pre>{error.message}</pre>
        </div>
        <p className="mb-4 text-gray-600">
          The application encountered an unexpected error. You can try to:
        </p>
        <div className="flex space-x-2">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go to home page
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-md px-8 py-10 mx-4 bg-white rounded-xl shadow-2xl transform transition-all">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-20 animate-ping"></div>
              <div className="relative w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Connection Lost</h2>

          <div className="w-16 h-1 mx-auto my-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>

          <p className="text-center text-gray-600 mb-6">
            We can't reach our servers at the moment. Please check your internet connection.
          </p>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Check Wi-Fi or cellular data</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Airplane mode may be active</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full mt-8 px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform transition-all hover:scale-105"
          >
            Try Again
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Your changes will be saved locally until connection is restored
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <AppRouter />
            </Suspense>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
