import React from 'react';
import { motion } from 'framer-motion';

interface ModalBackdropProps {
    onClick: () => void;
    isDark?: boolean;
}

const ModalBackdrop: React.FC<ModalBackdropProps> = ({ onClick, isDark = false }) => (
    <motion.div
        className={`fixed inset-0 ${isDark ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm z-40 flex items-center justify-center p-4`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
    />
);

export default ModalBackdrop;