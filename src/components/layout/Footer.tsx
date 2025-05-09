import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Footer: React.FC = () => {
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
      <div className="flex justify-between items-center gap-4">
        <motion.div
          className="flex items-center text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>© {currentYear} wasaa chat. All rights reserved.</span>
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