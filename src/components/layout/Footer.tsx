import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface FooterProps {
  sidebarCollapsed: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="py-1 px-4 sm:px-6 border-t border-gray-100 bg-white/80 backdrop-blur-xl
                 transition-all text-xs sm:text-sm"
      initial={false}
      animate={{
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <motion.div
          className="flex items-center text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>© {currentYear} wasaa chat. All rights reserved.</span>
        </motion.div>
        <motion.div
          className="mt-3 flex justify-center sm:justify-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.div
            className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50/70 px-3.5 py-1.5 rounded-full text-xs text-green-700 border border-green-100/70 shadow-sm"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              y: -1
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-2 h-2 bg-green-500 rounded-full mr-2.5"
            />
            <motion.span
              className="flex items-center"
              whileHover={{ x: 1 }}
            >
              <CheckCircle size={14} className="text-green-600 mr-1.5" strokeWidth={1.8} />
              All systems operational
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center bg-gray-50/80 px-3.5 py-1.5 rounded-full text-xs text-gray-600 sm:ml-4 sm:mr-0 border border-gray-100/50 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{
            backgroundColor: 'rgba(238, 242, 255, 0.8)',
            borderColor: 'rgba(224, 231, 255, 0.6)',
            y: -1,
            transition: { duration: 0.2 }
          }}
        >
          <motion.span
            className="font-medium mr-1.5 text-indigo-600"
            whileHover={{ scale: 1.05 }}
          >
            v2.5.0
          </motion.span>
          <span className="hidden sm:inline text-gray-500">• Last updated: Apr 25, 2025</span>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;