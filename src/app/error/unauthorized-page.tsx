import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldOff,
  Home,
  Mail,
  Lock,
  Shield,
  AlertTriangle,
  User,
  ChevronRight,
  HelpCircle,
  Clock,
  CalendarClock,
  FileText,
  ExternalLink,
  BarChart4,
  Info
} from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [errorRef] = useState(`ERR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-primary-50 p-4">
      {/* Simple background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary-200/20 to-primary-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary-200/20 to-violet-200/10 rounded-full blur-3xl" />

      <div className="max-w-lg w-full">
        {/* Session info bar */}
        <div className="mb-3 px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <User size={14} className="mr-1.5 text-primary-500" />
            <span>john.doe@example.com</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5 text-primary-500" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="relative h-40 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-10 w-16 h-16 rounded-full bg-white/10" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg animate-pulse">
                <Shield size={40} className="text-white" strokeWidth={1.5} />
              </div>

              <div className="mt-3 px-5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                <h2 className="text-white font-medium text-sm tracking-wider">ACCESS RESTRICTED</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">Permission Denied</h1>
            <p className="text-gray-600 text-center text-sm mb-6 max-w-md mx-auto">
              You don't have the necessary permissions to access this area. Please request access from your system administrator.
            </p>

            <div className="space-y-3 mb-6">
              {/* Access section */}
              <div className="rounded-xl overflow-hidden border border-primary-100 shadow-sm">
                <button
                  onClick={() => toggleSection('access')}
                  className="w-full bg-white p-3.5 flex items-center justify-between text-left hover:bg-primary-50/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <Lock size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Restricted Area</h3>
                      <p className="text-xs text-gray-500">Access details</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-primary-400 transition-transform duration-200 ${expandedSection === 'access' ? 'rotate-90' : ''}`}
                  />
                </button>

                <div
                  className={`bg-primary-50/70 overflow-hidden transition-all duration-200 ${expandedSection === 'access' ? 'max-h-60 p-4' : 'max-h-0'}`}
                >
                  <p className="text-sm text-primary-700 mb-2">
                    The page <span className="font-medium">{from}</span> requires additional permissions that are not currently assigned to your role.
                  </p>
                  <div className="mt-2 flex items-center justify-between p-2 bg-white/80 rounded-lg border border-primary-100 text-xs">
                    <div className="flex items-center text-primary-800">
                      <Info size={14} className="mr-1.5" />
                      <span>Error Reference: <span className="font-mono font-medium">{errorRef}</span></span>
                    </div>
                    <button className="text-primary-600 hover:text-primary-800 flex items-center">
                      <span className="mr-1">Details</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions section */}
              <div className="rounded-xl overflow-hidden border border-amber-100 shadow-sm">
                <button
                  onClick={() => toggleSection('permissions')}
                  className="w-full bg-white p-3.5 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <ShieldOff size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Missing Permissions</h3>
                      <p className="text-xs text-gray-500">Request access</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-amber-400 transition-transform duration-200 ${expandedSection === 'permissions' ? 'rotate-90' : ''}`}
                  />
                </button>

                <div
                  className={`bg-amber-50/70 overflow-hidden transition-all duration-200 ${expandedSection === 'permissions' ? 'max-h-96 p-4' : 'max-h-0'}`}
                >
                  <p className="text-sm text-amber-700 mb-3">
                    Contact your system administrator to request the necessary permissions for your role.
                  </p>

                  <div className="mb-3 px-3 py-2 rounded-lg bg-white border border-amber-100 text-xs text-amber-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium">Administrator:</span>
                      <a href="mailto:admin@wasaachat.com" className="text-primary-600 hover:underline flex items-center">
                        admin@wasaachat.com
                        <Mail size={12} className="ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">IT Support:</span>
                      <a href="tel:+123456789" className="text-primary-600 hover:underline flex items-center">
                        (123) 456-789
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-amber-800 mb-1.5">Required Permissions:</h4>
                    <ul className="text-xs text-amber-700 bg-white rounded-lg border border-amber-100 overflow-hidden">
                      <li className="px-3 py-1.5 border-b border-amber-50 flex items-center">
                        <Shield size={12} className="mr-1.5 text-amber-500" />
                        User Management - View
                      </li>
                      <li className="px-3 py-1.5 border-b border-amber-50 flex items-center">
                        <Shield size={12} className="mr-1.5 text-amber-500" />
                        Finance Module - Admin
                      </li>
                      <li className="px-3 py-1.5 flex items-center">
                        <Shield size={12} className="mr-1.5 text-amber-500" />
                        Reports - Generate
                      </li>
                    </ul>
                  </div>

                  <div className="text-xs text-amber-700 bg-white/70 rounded-lg border border-amber-100 p-2 flex items-center">
                    <HelpCircle size={14} className="mr-1.5 text-amber-500 flex-shrink-0" />
                    <span>Typical approval time is 1-2 business days.</span>
                  </div>
                </div>
              </div>

              {/* System notice section */}
              <div className="rounded-xl overflow-hidden border border-primary-100 shadow-sm">
                <button
                  onClick={() => toggleSection('system')}
                  className="w-full bg-white p-3.5 flex items-center justify-between text-left hover:bg-primary-50/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <AlertTriangle size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">System Notice</h3>
                      <p className="text-xs text-gray-500">Access attempt logged</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-primary-400 transition-transform duration-200 ${expandedSection === 'system' ? 'rotate-90' : ''}`}
                  />
                </button>

                <div
                  className={`bg-primary-50/70 overflow-hidden transition-all duration-200 ${expandedSection === 'system' ? 'max-h-64 p-4' : 'max-h-0'}`}
                >
                  <p className="text-sm text-primary-700 mb-3">
                    This access attempt has been logged in the system. Repeated unauthorized access attempts may trigger account review.
                  </p>

                  <div className="mb-3 flex items-center justify-between text-xs text-primary-700 bg-white/80 rounded-lg border border-primary-100 p-2.5">
                    <div className="flex items-center">
                      <CalendarClock size={14} className="mr-1.5 text-primary-500" />
                      <span>Attempt logged at: {currentTime.toLocaleString()}</span>
                    </div>
                    <a href="#" className="text-primary-600 hover:underline flex items-center">
                      View Log
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>

                  <div className="mb-3 text-xs">
                    <div className="flex items-center text-primary-700 mb-1.5">
                      <BarChart4 size={14} className="mr-1.5 text-primary-500" />
                      <span className="font-medium">System Status:</span>
                    </div>
                    <div className="bg-white/80 rounded-lg border border-primary-100 overflow-hidden">
                      <div className="px-3 py-1.5 border-b border-primary-50 flex items-center justify-between">
                        <span className="text-gray-700">Authentication Service</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Operational</span>
                      </div>
                      <div className="px-3 py-1.5 border-b border-primary-50 flex items-center justify-between">
                        <span className="text-gray-700">Permission Service</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium">Degraded</span>
                      </div>
                      <div className="px-3 py-1.5 flex items-center justify-between">
                        <span className="text-gray-700">User Management</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Operational</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help & resources section */}
              <div className="rounded-xl overflow-hidden border border-primary-100 shadow-sm">
                <button
                  onClick={() => toggleSection('help')}
                  className="w-full bg-white p-3.5 flex items-center justify-between text-left hover:bg-primary-50/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <HelpCircle size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Help & Resources</h3>
                      <p className="text-xs text-gray-500">Access assistance</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-primary-400 transition-transform duration-200 ${expandedSection === 'help' ? 'rotate-90' : ''}`}
                  />
                </button>

                <div
                  className={`bg-primary-50/70 overflow-hidden transition-all duration-200 ${expandedSection === 'help' ? 'max-h-64 p-4' : 'max-h-0'}`}
                >
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <a href="#" className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-primary-100 text-primary-700 hover:bg-primary-50 transition-colors">
                      <FileText size={20} className="mb-1 text-primary-500" />
                      <span className="text-xs font-medium">Documentation</span>
                    </a>
                    <a href="#" className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-primary-100 text-primary-700 hover:bg-primary-50 transition-colors">
                      <HelpCircle size={20} className="mb-1 text-primary-500" />
                      <span className="text-xs font-medium">FAQ</span>
                    </a>
                  </div>

                  <button className="w-full p-2.5 bg-white rounded-lg border border-primary-100 text-primary-700 text-xs font-medium hover:bg-primary-50 transition-colors flex items-center justify-center">
                    <span>Create Support Ticket</span>
                    <ExternalLink size={12} className="ml-1.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-x-3 flex mb-4">
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
              >
                <Home size={16} className="mr-2" />
                <span>Return to Dashboard</span>
              </button>

              <button
                onClick={() => window.location.href = 'mailto:admin@wasaachat.com?subject=Permission%20Request&body=I%20need%20access%20to%20' + encodeURIComponent(from)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-primary-100 text-primary-700 text-sm font-medium hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center"
              >
                <Mail size={16} className="mr-2" />
                <span>Request Access</span>
              </button>
            </div>

            {/* Alternative options */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center">
                <Info size={12} className="mr-1.5" />
                Alternative options available:
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                  Switch Account
                </button>
                <button className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                  Request Temp Access
                </button>
                <button className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-xs text-gray-500">
                <User size={14} className="mr-1" />
                <span>Need help? Contact the </span>
                <a href="#" className="inline-flex items-center ml-1 text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  IT team <ChevronRight size={14} className="ml-0.5" />
                </a>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <span className="mr-2">v3.5.2</span>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <FileText size={14} />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center">
                <span>Session ID: {errorRef.substring(4, 12)}</span>
              </div>
              <div className="flex items-center">
                <span>Last login: Today at 9:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
