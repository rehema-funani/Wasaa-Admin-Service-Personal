import React, { useEffect, Suspense, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./styles/globals.css";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
          Something went wrong
        </h2>
        <div className="p-3 mb-4 overflow-auto text-sm bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
          <pre className="text-gray-800 dark:text-gray-200">
            {error.message}
          </pre>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The application encountered an unexpected error. You can try to:
        </p>
        <div className="flex space-x-2">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-700 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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

const MobileRestrictionScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-800 p-4">
      <div className="w-full max-w-md px-8 py-10 mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 transform transition-all">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-red-500 dark:bg-red-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Desktop Required
        </h2>

        <div className="w-20 h-1 mx-auto my-4 bg-gradient-to-r from-red-400 to-red-600 dark:from-red-500 dark:to-red-400 rounded-full"></div>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          This admin panel is designed for desktop and tablet devices only.
          Please access it from a larger screen for the best experience.
        </p>

        <div className="space-y-3 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Supported Devices:
          </h3>

          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Desktop & Laptop Computers
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a1 1 0 001-1V5a1 1 0 00-1-1H8a1 1 0 00-1 1v15a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Tablets & iPads
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Mobile Phones (Not Supported)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-500 rounded-lg shadow hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-50 transform transition-all hover:scale-105"
        >
          Refresh Page
        </button>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          If you're on a supported device, try refreshing the page
        </p>
      </div>
    </div>
  );
};

const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      const screenWidth = window.innerWidth;

      const userAgent = navigator.userAgent.toLowerCase();

      const mobileKeywords = [
        "mobile",
        "android",
        "blackberry",
        "iphone",
        "ipod",
        "opera mini",
        "iemobile",
        "wpdesktop",
      ];

      const isMobileUserAgent = mobileKeywords.some((keyword) =>
        userAgent.includes(keyword)
      );

      const isTablet =
        userAgent.includes("ipad") ||
        (userAgent.includes("android") && !userAgent.includes("mobile")) ||
        userAgent.includes("tablet");

      const isSmallScreen = screenWidth < 768;

      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isLikelyMobile = isSmallScreen && hasTouch && isMobileUserAgent;

      const shouldBlock = isLikelyMobile && !isTablet;

      setIsMobile(shouldBlock);
      setIsLoading(false);
    };

    detectDevice();

    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile, isLoading };
};

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isMobile, isLoading } = useDeviceDetection();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isMobile) {
    return <MobileRestrictionScreen />;
  }

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md px-8 py-10 mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500 dark:bg-blue-400 rounded-full opacity-20 animate-ping"></div>
              <div className="relative w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Connection Lost
          </h2>

          <div className="w-16 h-1 mx-auto my-3 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 rounded-full"></div>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            We can't reach our servers at the moment. Please check your internet
            connection.
          </p>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  Check Wi-Fi or cellular data
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  Airplane mode may be active
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full mt-8 px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 transform transition-all hover:scale-105"
          >
            Try Again
          </button>

          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Your changes will be saved locally until connection is restored
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
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
