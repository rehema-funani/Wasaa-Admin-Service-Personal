import React from 'react';
import { motion } from 'framer-motion';

const errorPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-white">
      <div className="w-full flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-40 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="w-60 h-32 rounded-full bg-gray-50"
                  />
                </div>

                <div className="flex items-center justify-center z-10 relative">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="z-10 text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-400"
                  >
                    4
                  </motion.div>

                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative z-10 mx-1"
                  >
                    <span className="text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">0</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="z-10 text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500"
                  >
                    4
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg font-medium text-gray-800 mt-4"
            >
              Page not found
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-gray-500 mt-2 max-w-sm mx-auto"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
          </div>

          <div className="space-y-3 mb-8">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500 transition-all duration-150"
            >
              Return to dashboard
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-150"
            >
              Go back
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="border-t border-gray-100 pt-6"
          >
            <p className="text-xs font-medium text-gray-500 mb-3">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Dashboard', path: '/' },
                { name: 'Users', path: '/admin/users/user-details' },
                { name: 'Transactions', path: '/admin/finance/transactions' },
                { name: 'Settings', path: '/admin/System-Setting/General-Setting' }
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.path}
                  className="px-3 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 pt-4"
          >
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Need help? <a href="#" className="text-teal-500 hover:text-teal-600">Contact support</a></span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default errorPage;
