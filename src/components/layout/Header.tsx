import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  CreditCard,
  UserCog,
  X,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react';
import logo from '../../assets/images/logo-wasaa.png';
import Cookies from 'js-cookie';

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  showSearchOnMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showSearchOnMobile = false
}) => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const user = Cookies.get('userData') ? JSON.parse(Cookies.get('userData') as string) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchFocus = () => {
    setSearchOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userData');
    navigate('/auth/login');
    window.location.reload();
  };

  const notifications = [
    {
      id: 1,
      title: 'New transaction received',
      description: 'You received $250.00 from Jane Smith',
      time: '10 minutes ago',
      read: false,
      type: 'transaction'
    },
    {
      id: 2,
      title: 'Stream went live',
      description: 'Tech Talk with John Doe is now live',
      time: '1 hour ago',
      read: false,
      type: 'stream'
    },
    {
      id: 3,
      title: 'New withdrawal request',
      description: 'User #1234 requested $500.00 withdrawal',
      time: '2 hours ago',
      read: false,
      type: 'withdrawal'
    },
    {
      id: 4,
      title: 'System update completed',
      description: 'The system has been updated to version 2.5.0',
      time: '1 day ago',
      read: true,
      type: 'system'
    }
  ];

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return (
          <div
            className="p-1.5 rounded-full bg-green-50 border border-green-100"
          >
            <CreditCard size={16} className="text-green-500" />
          </div>
        );
      case 'stream':
        return (
          <div
            className="p-1.5 rounded-full bg-blue-50 border border-blue-100"
          >
            <Bell size={16} className="text-blue-500" />
          </div>
        );
      case 'withdrawal':
        return (
          <div
            className="p-1.5 rounded-full bg-amber-50 border border-amber-100"
          >
            <Clock size={16} className="text-amber-500" />
          </div>
        );
      case 'system':
        return (
          <div
            className="p-1.5 rounded-full bg-gray-50 border border-gray-100"
          >
            <AlertCircle size={16} className="text-gray-500" />
          </div>
        );
      default:
        return (
          <div
            className="p-1.5 rounded-full bg-indigo-50 border border-indigo-100"
          >
            <Bell size={16} className="text-indigo-500" />
          </div>
        );
    }
  };

  return (
    <header
      className="h-[60px] bg-white/80 backdrop-blur-xl border-b border-gray-50  
      flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 transition-all"
    >
      <div className="flex items-center">
        <NavLink to="/" className="flex md:hidden items-center">
          <div className="relative transition-all duration-200 group">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto rounded-xl transition-all duration-200 group-hover:opacity-90"
            />
            <div
              className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-blue-200/20 to-indigo-200/10 blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        </NavLink>
      </div>

      <div className={`relative flex-1 max-w-md mx-4 ${showSearchOnMobile ? 'block' : 'hidden md:block'}`}>
        <div
          className="flex items-center bg-gray-50/80 rounded-xl border border-gray-100 overflow-hidden"
        >
          <span
            className="mx-3 text-gray-400"
          >
            <Search size={18} strokeWidth={1.8} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="flex-1 py-2.5 bg-transparent outline-none border-gray-100 text-sm text-gray-700 rounded-r-xl"
            onFocus={handleSearchFocus}
            onBlur={() => setTimeout(() => setSearchOpen(false), 100)}
          />
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mr-3 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                <X size={16} strokeWidth={1.8} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="relative" ref={notificationsRef}>
          <button
            className={`
              p-2 rounded-xl relative transition-all
              ${notificationsOpen
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-indigo-500'}
            `}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            onMouseEnter={() => setHoveredButton('notifications')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Bell size={20} strokeWidth={1.8} />
            <AnimatePresence>
              {unreadNotifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1.5 right-1.5 flex items-center justify-center"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full block"></span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 py-2 z-30 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`
                            px-4 py-3 hover:bg-indigo-50/50 cursor-pointer relative
                            ${!notification.read ? 'bg-indigo-50/30' : ''}
                          `}
                        >
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-3">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="px-4 py-10 text-center text-gray-500 text-sm flex flex-col items-center justify-center"
                    >
                      <Bell size={24} className="text-gray-300 mb-2" strokeWidth={1.5} />
                      No notifications
                    </div>
                  )}
                </div>

                <div
                  className="px-4 py-2 border-t border-gray-100"
                >
                  <button
                    className="w-full text-xs text-center text-indigo-600 hover:text-indigo-700 font-medium py-1"
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          className="p-2 rounded-xl text-gray-400 hover:text-indigo-500 hover:bg-gray-50/80 transition-all hidden sm:block"
          onMouseEnter={() => setHoveredButton('settings')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Settings size={18} strokeWidth={1.8} />
        </button>

        <div className="relative ml-2" ref={userMenuRef}>
          <button
            className={`
              flex items-center space-x-2 py-1.5 px-1.5 sm:px-2.5 rounded-xl transition-all
              ${userMenuOpen ? 'bg-indigo-50/80' : 'hover:bg-gray-50/80'}
            `}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div
              className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white"
            >
              <User size={16} strokeWidth={1.8} />
            </div>
            <span
              className="hidden sm:block font-medium text-sm text-gray-700"
            >
              Admin
            </span>
            <div
              className="hidden sm:block text-gray-400"
            >
              <ChevronDown size={16} strokeWidth={1.8} />
            </div>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 py-2 z-30 overflow-hidden"
              >
                <div
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <div
                  className="px-1 py-1"
                >
                  <button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center"
                  >
                    <User size={16} className="mr-3 text-gray-500" strokeWidth={1.8} />
                    <span>Profile</span>
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center"
                  >
                    <UserCog size={16} className="mr-3 text-gray-500" strokeWidth={1.8} />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div
                  className="border-t border-gray-100 mt-1 px-1 py-1"
                >
                  <button
                    onClick={() => handleLogout()}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 text-sm flex items-center text-red-600"
                  >
                    <LogOut size={16} className="mr-3" strokeWidth={1.8} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 768px) {
          .ml-2 {
            margin-left: 0.25rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;