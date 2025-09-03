import React, { useState, useEffect } from "react";
import { ChevronRight, CheckCircle, RefreshCw } from "lucide-react";

const NavigationTour = ({ onClose, debugMode: initialDebugMode = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [tourTarget, setTourTarget] = useState(null);
  const [debugMode, setDebugMode] = useState(initialDebugMode);
  const [debugInfo, setDebugInfo] = useState({});

  // Define tour steps
  const tourSteps = [
    {
      target: "nav-logo",
      title: "Welcome to the Dashboard",
      content:
        "This is your administrative interface. Let's take a quick tour to explore its key features and help you navigate more efficiently.",
      position: "bottom",
    },
    {
      target: "nav-sections",
      title: "Navigation Sections",
      content:
        "These categories organize your dashboard features. You have Finance, Clients, Customization, Support, Administration, and Fundraising sections.",
      position: "bottom",
    },
    {
      target: "finance-section",
      title: "Finance Management",
      content:
        "Manage transactions, wallets, payments, and financial reports. Monitor compliance and handle risk management for financial operations.",
      position: "right",
    },
    {
      target: "clients-section",
      title: "Client Management",
      content:
        "View and manage individual and group accounts, analyze geographic distribution, and handle client risk management including KYC and AML procedures.",
      position: "right",
    },
    {
      target: "support-section",
      title: "Support Tools",
      content:
        "Handle customer support tickets, manage SLAs, and access support reports and analytics to ensure timely resolution of customer issues.",
      position: "right",
    },
    {
      target: "nav-search",
      title: "Quick Search",
      content:
        "Find anything instantly with our powerful search. Quickly locate transactions, clients, support tickets, campaigns, and system settings.",
      position: "bottom",
    },
    {
      target: "nav-user",
      title: "Your Account",
      content:
        "Access your profile settings, manage your preferences, and logout from this menu.",
      position: "left",
    },
    {
      target: "nav-notifications",
      title: "Notifications Center",
      content:
        "Stay updated with system alerts, important updates, and relevant notifications about platform activity.",
      position: "left",
    },
  ];

  // Add debugging logs
  useEffect(() => {
    console.log("NavigationTour is being rendered");
    const hasSeenTour = localStorage.getItem("navTourCompleted");
    console.log("hasSeenTour value:", hasSeenTour);

    // In debug mode, always show tour regardless of localStorage
    if (debugMode) {
      setIsVisible(true);
      // Add overlay to body
      document.body.classList.add("tour-active");
      // Set initial target
      setTargetElement(tourSteps[currentStep].target);
      return () => {
        document.body.classList.remove("tour-active");
      };
    } else {
      // Normal flow checking localStorage
      if (hasSeenTour === "true") {
        setIsVisible(false);
        if (onClose) onClose();
        return;
      }

      // Set initial target
      setTargetElement(tourSteps[currentStep].target);

      // Add overlay to body
      document.body.classList.add("tour-active");

      return () => {
        document.body.classList.remove("tour-active");
      };
    }
  }, [debugMode]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < tourSteps.length && isVisible) {
      setTargetElement(tourSteps[currentStep].target);
    }
  }, [currentStep, isVisible]);

  const setTargetElement = (targetId) => {
    const element =
      document.getElementById(targetId) ||
      document.querySelector(`.${targetId}`) ||
      document.querySelector(`[data-tour="${targetId}"]`);

    setDebugInfo((prev) => ({
      ...prev,
      [targetId]: {
        found: !!element,
        selector: `[data-tour="${targetId}"]`,
        boundingRect: element ? element.getBoundingClientRect() : null,
      },
    }));

    if (element) {
      setTourTarget(element);
      scrollToElement(element);
    } else {
      console.warn(`Target element not found: ${targetId}`);

      setTourTarget(null);

      if (debugMode) {
        console.log(
          "Available data-tour elements:",
          Array.from(document.querySelectorAll("[data-tour]")).map((el) => ({
            "data-tour": el.getAttribute("data-tour"),
            element: el,
          }))
        );
      }
    }
  };

  const scrollToElement = (element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;

    if (!isInViewport) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    if (!debugMode) {
      localStorage.setItem("navTourCompleted", "true");
    }
    setIsVisible(false);
    document.body.classList.remove("tour-active");
    if (onClose) onClose();
  };

  const resetTour = () => {
    localStorage.removeItem("navTourCompleted");
    setCurrentStep(0);
    setIsVisible(true);
    document.body.classList.add("tour-active");
    setTargetElement(tourSteps[0].target);
  };

  const toggleDebugMode = () => {
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode);
    if (newDebugMode) {
      // Force tour to show in debug mode
      localStorage.removeItem("navTourCompleted");
      setIsVisible(true);
    }
  };

  const getTooltipPosition = () => {
    if (!tourTarget) {
      // Fallback position in center of screen if no target
      return {
        top: `${window.innerHeight / 2 - 110}px`,
        left: `${window.innerWidth / 2 - 150}px`,
      };
    }

    const rect = tourTarget.getBoundingClientRect();
    const position = tourSteps[currentStep].position;
    const tooltipWidth = 300;
    const tooltipHeight = 220; // Approximate height of tooltip
    const margin = 16; // Space between target and tooltip

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Initial position calculation
    let top, left;

    switch (position) {
      case "top":
        top = rect.top - margin - tooltipHeight;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - margin - tooltipWidth;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + margin;
        break;
      default:
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }

    // Adjust if the tooltip would go outside viewport
    // Ensure the tooltip stays within horizontal bounds
    if (left < margin) {
      left = margin; // Keep margin from left edge
    } else if (left + tooltipWidth > viewportWidth - margin) {
      left = viewportWidth - tooltipWidth - margin;
    }

    // Ensure the tooltip stays within vertical bounds
    if (top < margin) {
      top = margin; // Keep margin from top edge
    } else if (top + tooltipHeight > viewportHeight - margin) {
      top = viewportHeight - tooltipHeight - margin;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  const getArrowPosition = () => {
    const position = tourSteps[currentStep].position;

    switch (position) {
      case "top":
        return "bottom-0 left-1/2 transform translate(-50%, 100%) rotate(180deg)";
      case "bottom":
        return "top-0 left-1/2 transform translate(-50%, -100%)";
      case "left":
        return "top-1/2 right-0 transform translate(100%, -50%) rotate(90deg)";
      case "right":
        return "top-1/2 left-0 transform translate(-100%, -50%) rotate(-90deg)";
      default:
        return "top-0 left-1/2 transform translate(-50%, -100%)";
    }
  };

  if (!isVisible) return null;

  const tooltipStyle = getTooltipPosition();
  const arrowPosition = getArrowPosition();
  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] pointer-events-none"></div>
      {tourTarget ? (
        <>
          <div
            className="absolute z-[65] pointer-events-none"
            style={{
              top: `${tourTarget.getBoundingClientRect().top - 8}px`,
              left: `${tourTarget.getBoundingClientRect().left - 8}px`,
              width: `${tourTarget.getBoundingClientRect().width + 16}px`,
              height: `${tourTarget.getBoundingClientRect().height + 16}px`,
              backgroundColor: "transparent",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
              borderRadius: "16px",
            }}
          >
            {/* Highlight border */}
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-500 animate-pulse"></div>
            <div className="absolute inset-0 rounded-xl border border-white/30 dark:border-gray-700/30"></div>
          </div>
        </>
      ) : (
        // Fallback for when target isn't found
        <div className="fixed inset-0 z-[65] pointer-events-none">
          {debugMode && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-lg text-sm">
              Target element not found: {tourSteps[currentStep].target}
            </div>
          )}
        </div>
      )}
      {/* Tooltip */}
      <div
        className="fixed w-[300px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-900/20 dark:shadow-black/30 z-[70] border border-white/70 dark:border-gray-700/70 overflow-hidden transition-all duration-300 animate-fadeIn"
        style={tooltipStyle}
      >
        {/* Arrow */}
        <div className={`absolute w-4 h-4 ${arrowPosition}`}>
          <div className="w-4 h-4 rotate-45 transform bg-indigo-500"></div>
        </div>

        {/* Tooltip content */}
        <div className="relative">
          {/* Debug mode indicator */}
          {debugMode && (
            <div className="absolute top-3 left-3 bg-red-100/80 dark:bg-red-900/80 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full px-2 py-0.5">
              Debug Mode
            </div>
          )}

          {/* Step indicator */}
          <div className="absolute top-3 right-3 bg-indigo-100/80 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full px-2 py-0.5">
            {currentStep + 1} / {tourSteps.length}
          </div>

          {/* Header */}
          <div className="p-4 border-b border-indigo-100 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/80 dark:from-indigo-900/80 to-violet-50/80 dark:to-violet-900/80">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
              {currentTourStep.title}
            </h3>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {currentTourStep.content}
            </p>

            {/* Debug information */}
            {debugMode && (
              <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                  Target: {currentTourStep.target}
                  <br />
                  Found:{" "}
                  {debugInfo[currentTourStep.target]?.found ? "Yes" : "No"}
                  <br />
                  Selector: {debugInfo[currentTourStep.target]?.selector}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-3 border-t border-indigo-100 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/60 dark:from-indigo-900/60 to-violet-50/60 dark:to-violet-900/60">
            <div className="flex space-x-2">
              <button
                onClick={handleSkip}
                className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Skip tour
              </button>

              {/* Debug toggle button */}
              <button
                onClick={toggleDebugMode}
                className={`p-1.5 rounded-full transition-colors ${
                  debugMode
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
                title={debugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>

              {/* Reset tour button */}
              <button
                onClick={resetTour}
                className="p-1.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400 transition-colors"
                title="Reset Tour"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-md shadow-indigo-600/20 flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95"
            >
              {isLastStep ? (
                <>
                  <CheckCircle size={16} className="mr-1" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Add required CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default NavigationTour;
