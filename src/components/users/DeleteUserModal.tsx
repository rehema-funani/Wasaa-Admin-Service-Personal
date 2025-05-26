import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, User } from 'lucide-react';
import ModalBackdrop from './ModalBackdrop';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    role_id: string | null;
    status: string;
    location: string;
    last_login: string | null;
    createdAt: string;
    transactions_count: number;
    phone_number: string | null;
    first_name: string;
    last_name: string;
    lastActive?: string;
}

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: User;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const requiredConfirmation = user.name.split(' ')[0].toLowerCase();

    const handleConfirm = async () => {
        if (confirmText.toLowerCase() !== requiredConfirmation) {
            return;
        }

        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <ModalBackdrop onClick={onClose} isDark={true} />

                    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        >
                            {/* Header with warning icon */}
                            <div className="px-6 pt-6 pb-2 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="mx-auto"
                                >
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 rounded-full bg-red-100 blur-md opacity-70 transform scale-110"></div>
                                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full relative">
                                            <Trash2 className="w-7 h-7 text-red-500" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.h3
                                    className="mb-2 text-xl font-bold text-gray-900"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    Delete User
                                </motion.h3>

                                <motion.div
                                    className="flex items-center justify-center mb-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-2 shadow-sm">
                                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                    <div className="mt-2 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-800 mb-4">
                                        <p className="flex items-start">
                                            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                            <span>
                                                This action <span className="font-bold">cannot be undone</span>. This will permanently delete the user and all associated data.
                                            </span>
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">
                                        To confirm deletion, please type <span className="font-medium text-gray-800">{requiredConfirmation}</span> below:
                                    </p>

                                    <div className="flex items-center mb-4">
                                        <div className="relative w-full">
                                            <input
                                                type="text"
                                                value={confirmText}
                                                onChange={(e) => setConfirmText(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                                placeholder={`Type ${requiredConfirmation} to confirm`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex justify-end gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all duration-200"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    whileHover={confirmText.toLowerCase() === requiredConfirmation ? { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(220, 38, 38, 0.2)" } : {}}
                                    whileTap={confirmText.toLowerCase() === requiredConfirmation ? { scale: 0.98 } : {}}
                                    onClick={handleConfirm}
                                    className={`px-4 py-2.5 text-white rounded-xl shadow-md transition-all duration-200 flex items-center ${confirmText.toLowerCase() === requiredConfirmation
                                        ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    disabled={isDeleting || confirmText.toLowerCase() !== requiredConfirmation}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="mr-2" />
                                            Delete User
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteUserModal;