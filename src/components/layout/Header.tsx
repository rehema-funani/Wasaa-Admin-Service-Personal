import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Settings,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  CreditCard,
  UserCog,
  Mail,
  X,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside of menus to close them
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

  // Focus search input when opened
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
          <motion.div
            className="p-1.5 rounded-full bg-green-50 border border-green-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <CreditCard size={16} className="text-green-500" />
          </motion.div>
        );
      case 'stream':
        return (
          <motion.div
            className="p-1.5 rounded-full bg-blue-50 border border-blue-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Bell size={16} className="text-blue-500" />
          </motion.div>
        );
      case 'withdrawal':
        return (
          <motion.div
            className="p-1.5 rounded-full bg-amber-50 border border-amber-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Clock size={16} className="text-amber-500" />
          </motion.div>
        );
      case 'system':
        return (
          <motion.div
            className="p-1.5 rounded-full bg-gray-50 border border-gray-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={16} className="text-gray-500" />
          </motion.div>
        );
      default:
        return (
          <motion.div
            className="p-1.5 rounded-full bg-indigo-50 border border-indigo-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Bell size={16} className="text-indigo-500" />
          </motion.div>
        );
    }
  };


  return (
    <motion.header
      className="h-[60px] bg-white/80 backdrop-blur-xl border-b border-gray-50  
      flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 transition-width"
      initial={false}
      animate={sidebarCollapsed ? {
        transition: { type: "spring", stiffness: 300, damping: 30 }
      } : {
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
    >
      <div className="relative flex-1 max-w-md">
        <motion.div
          className="flex items-center bg-gray-50/80 rounded-xl border border-gray-100 overflow-hidden"
          initial={false}
          animate={{
            width: searchOpen ? '100%' : '100%',
            boxShadow: searchOpen ? '0 0 0 2px rgba(99, 102, 241, 0.1)' : 'none'
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="mx-3 text-gray-400"
            animate={{ scale: searchOpen ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search size={18} strokeWidth={1.8} />
          </motion.span>
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
                className="mr-3 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} strokeWidth={1.8} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="relative" ref={notificationsRef}>
          <motion.button
            className={`
              p-2 rounded-xl relative transition-all
              ${notificationsOpen
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-indigo-500'}
            `}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            whileHover={{
              scale: notificationsOpen ? 1 : 1.1,
              backgroundColor: notificationsOpen ? 'rgba(238, 242, 255, 0.8)' : 'rgba(238, 242, 255, 0.8)'
            }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredButton('notifications')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Bell size={20} strokeWidth={1.8} />
            <AnimatePresence>
              {unreadNotifications > 0 && (
                <motion.div
                  className="absolute top-1.5 right-1.5 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full block"></span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 py-2 z-30 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  {unreadNotifications > 0 && (
                    <motion.button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mark all as read
                    </motion.button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          className={`
                            px-4 py-3 hover:bg-indigo-50/50 cursor-pointer relative
                            ${!notification.read ? 'bg-indigo-50/30' : ''}
                          `}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ x: 2 }}
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
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className="px-4 py-10 text-center text-gray-500 text-sm flex flex-col items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Bell size={24} className="text-gray-300 mb-2" strokeWidth={1.5} />
                      No notifications
                    </motion.div>
                  )}
                </div>

                <motion.div
                  className="px-4 py-2 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <motion.button
                    className="w-full text-xs text-center text-indigo-600 hover:text-indigo-700 font-medium py-1"
                    whileHover={{ backgroundColor: 'rgba(238, 242, 255, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View all notifications
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative ml-2" ref={userMenuRef}>
          <motion.button
            className={`
              flex items-center space-x-2 py-1.5 px-1.5 sm:px-2.5 rounded-xl transition-all
              ${userMenuOpen ? 'bg-indigo-50/80' : 'hover:bg-gray-50/80'}
            `}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            whileHover={{
              backgroundColor: userMenuOpen ? 'rgba(238, 242, 255, 0.8)' : 'rgba(238, 242, 255, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200/60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <User size={16} strokeWidth={1.8} />
            </motion.div>
            <motion.span
              className="hidden sm:block font-medium text-sm text-gray-700"
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Admin
            </motion.span>
            <motion.div
              animate={{
                rotate: userMenuOpen ? 180 : 0
              }}
              transition={{ duration: 0.3 }}
              className="hidden sm:block text-gray-400"
            >
              <ChevronDown size={16} strokeWidth={1.8} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 py-2 z-30 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="px-4 py-3 border-b border-gray-100"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-sm text-gray-500">admin@streampay.com</p>
                </motion.div>

                <motion.div
                  className="px-1 py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <motion.button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User size={16} className="mr-3 text-gray-500" strokeWidth={1.8} />
                    <span>Profile</span>
                  </motion.button>
                  <motion.button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                  >
                    <UserCog size={16} className="mr-3 text-gray-500" strokeWidth={1.8} />
                    <span>Account Settings</span>
                  </motion.button>
                  <motion.button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 text-sm flex items-center"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <Mail size={16} className="mr-3 text-gray-500" strokeWidth={1.8} />
                    <span>Messages</span>
                  </motion.button>
                </motion.div>

                <motion.div
                  className="border-t border-gray-100 mt-1 px-1 py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <motion.button
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 text-sm flex items-center text-red-600"
                    whileHover={{ x: 4, backgroundColor: 'rgba(254, 226, 226, 0.7)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={16} className="mr-3" strokeWidth={1.8} />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
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
      `}</style>
    </motion.header>
  );
};

export default Header;