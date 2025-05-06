import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
}) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const springTransition = {
        type: "spring",
        damping: 30,
        stiffness: 400,
        mass: 0.8
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        className="absolute inset-0 backdrop-blur-[6px] bg-black/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    <motion.div
                        className={`
              relative w-full ${sizeClasses[size]} mx-auto  max-h-[96vh] overflow-y-auto
              rounded-3xl overflow-hidden 
              bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl
              border border-white/20
              shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)]
            `}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 10 }}
                        transition={springTransition}
                    >
                        <div className="absolute inset-[1px] rounded-[23px] pointer-events-none bg-gradient-to-b from-white/30 to-white/5 overflow-hidden">
                            <div className="absolute -inset-x-20 -top-40 h-80 w-[200%] bg-gradient-to-b from-white/50 to-transparent opacity-60 transform rotate-12"></div>
                            <div className="absolute -inset-x-20 bottom-0 h-40 w-[200%] bg-gradient-to-t from-white/10 to-transparent opacity-60"></div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-br pointer-events-none"></div>

                        {title && (
                            <div className="relative px-6 py-4 border-b border-white/20 bg-white/15 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <motion.h3
                                        className="text-lg font-medium text-gray-800"
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {title}
                                    </motion.h3>
                                    {showCloseButton && (
                                        <motion.button
                                            type="button"
                                            onClick={onClose}
                                            className="relative text-gray-600 hover:text-gray-800 rounded-full p-2 bg-white/20 hover:bg-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X size={18} />
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="relative p-6 bg-white/5 backdrop-blur-xl">
                            <motion.div
                                className="text-gray-800"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                            >
                                {children}
                            </motion.div>
                        </div>

                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full"></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};