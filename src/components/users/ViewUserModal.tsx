import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Clock,
    CalendarDays,
    Mail,
    Phone,
    MapPin,
    Shield,
    CreditCard,
    UserCheck,
    Activity,
    KeyRound,
    RefreshCw,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import ModalBackdrop from './ModalBackdrop';
import StatusBadge from '../common/StatusBadge';
import userService from '../../api/services/users';

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

interface ViewUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleSendPasswordReset = async () => {
        try {
            setIsSendingReset(true);
            await userService.sendPasswordReset(user.id);
            setResetSent(true);
            toast.success('Password reset email sent successfully');

            setTimeout(() => {
                setResetSent(false);
            }, 10000);
        } catch (error) {
            console.error('Failed to send password reset:', error);
            toast.error('Failed to send password reset email');
        } finally {
            setIsSendingReset(false);
        }
    };

    const InfoCard = ({
        icon,
        label,
        value,
        className = ''
    }: {
        icon: React.ReactNode,
        label: string,
        value: React.ReactNode,
        className?: string
    }) => (
        <div className={`bg-gray-50 p-4 rounded-xl border border-gray-100 ${className}`}>
            <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                {icon}
                <span className="ml-2">{label}</span>
            </h4>
            <div className="text-gray-800 font-medium">{value}</div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <ModalBackdrop onClick={onClose} />

                    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        >
                            <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600 p-6 flex items-end">
                                <motion.button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 focus:outline-none"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={20} className="text-white" />
                                </motion.button>

                                <motion.div
                                    initial={{ scale: 0.8, y: 20, opacity: 0 }}
                                    animate={{ scale: 1, y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="absolute -bottom-10 left-6 w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-white"
                                >
                                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                                </motion.div>
                            </div>

                            <div className="px-6 pt-14 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <motion.h2
                                            className="text-xl font-semibold text-gray-800"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {user.name}
                                        </motion.h2>
                                        <motion.p
                                            className="text-gray-500 flex items-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <Mail size={14} className="mr-2" />
                                            {user.email}
                                        </motion.p>
                                    </div>

                                    {/* Password Reset Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {resetSent ? (
                                            <div className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                                                <CheckCircle size={14} className="mr-1" />
                                                <span>Reset email sent</span>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleSendPasswordReset}
                                                disabled={isSendingReset}
                                                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium 
                                                ${isSendingReset
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                                                    }`}
                                            >
                                                {isSendingReset ? (
                                                    <>
                                                        <RefreshCw size={14} className="mr-2 animate-spin" />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <KeyRound size={14} className="mr-2" />
                                                        <span>Send Password Reset</span>
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-220px)]">
                                <motion.div
                                    className="space-y-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {/* Top row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div variants={itemVariants}>
                                            <InfoCard
                                                icon={<Shield size={14} className="text-primary-500" />}
                                                label="ROLE"
                                                value={user.role || 'No role assigned'}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <InfoCard
                                                icon={<UserCheck size={14} className="text-primary-500" />}
                                                label="STATUS"
                                                value={<StatusBadge status={user.status as any} size="md" withIcon />}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Contact information */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-gray-50 rounded-xl border border-gray-100 p-4"
                                    >
                                        <h3 className="text-sm font-medium text-gray-800 mb-3">Contact Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm">
                                                <Mail size={14} className="text-gray-400 mr-2" />
                                                <span className="text-gray-700">{user.email}</span>
                                            </div>

                                            <div className="flex items-center text-sm">
                                                <Phone size={14} className="text-gray-400 mr-2" />
                                                <span className="text-gray-700">{user.phone_number || 'Not provided'}</span>
                                            </div>

                                            <div className="flex items-center text-sm">
                                                <MapPin size={14} className="text-gray-400 mr-2" />
                                                <span className="text-gray-700">{user.location || 'Not specified'}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Activity stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div variants={itemVariants}>
                                            <InfoCard
                                                icon={<Clock size={14} className="text-primary-500" />}
                                                label="LAST ACTIVE"
                                                value={
                                                    <div className="text-sm flex items-center">
                                                        {user.last_login ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true }) : 'Never'}
                                                    </div>
                                                }
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <InfoCard
                                                icon={<CalendarDays size={14} className="text-primary-500" />}
                                                label="JOINED"
                                                value={
                                                    <div className="text-sm">
                                                        {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}
                                                    </div>
                                                }
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Transactions */}
                                    <motion.div variants={itemVariants}>
                                        <InfoCard
                                            icon={<CreditCard size={14} className="text-primary-500" />}
                                            label="TRANSACTIONS"
                                            value={
                                                <div className="flex items-center">
                                                    <span className="text-lg font-semibold mr-2">{user.transactions_count}</span>
                                                    <div className="h-2.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-500"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(user.transactions_count * 2, 100)}%` }}
                                                            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </motion.div>

                                    {/* Activity timeline */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-gray-50 rounded-xl border border-gray-100 p-4"
                                    >
                                        <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                            <Activity size={14} className="text-primary-500 mr-2" />
                                            Activity Timeline
                                        </h3>
                                        <div className="relative pl-4 border-l border-gray-200 space-y-3">
                                            <div className="relative">
                                                <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                                <p className="text-xs font-medium text-gray-700">Account Created</p>
                                                <p className="text-xs text-gray-500">{user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}</p>
                                            </div>

                                            {user.last_login && (
                                                <div className="relative">
                                                    <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                                    <p className="text-xs font-medium text-gray-700">Last Login</p>
                                                    <p className="text-xs text-gray-500">{format(new Date(user.last_login), 'MMM d, yyyy, h:mm a')}</p>
                                                </div>
                                            )}

                                            {user.transactions_count > 0 && (
                                                <div className="relative">
                                                    <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                    <p className="text-xs font-medium text-gray-700">Transactions</p>
                                                    <p className="text-xs text-gray-500">{user.transactions_count} total transactions</p>
                                                </div>
                                            )}

                                            {resetSent && (
                                                <div className="relative">
                                                    <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                                    <p className="text-xs font-medium text-gray-700">Password Reset Email</p>
                                                    <p className="text-xs text-gray-500">Sent {format(new Date(), 'MMM d, yyyy, h:mm a')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Security section */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-gray-50 rounded-xl border border-gray-100 p-4"
                                    >
                                        <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                            <KeyRound size={14} className="text-primary-500 mr-2" />
                                            Security
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-700">
                                                    <p className="font-medium">Password Reset</p>
                                                    <p className="text-xs text-gray-500">Send a password reset link to user's email</p>
                                                </div>

                                                {resetSent ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle size={12} className="mr-1" /> Sent
                                                    </span>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={handleSendPasswordReset}
                                                        disabled={isSendingReset}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium 
                                                        ${isSendingReset
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                                                            }`}
                                                    >
                                                        {isSendingReset ? "Sending..." : "Send reset"}
                                                    </motion.button>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500 flex items-start pt-2 border-t border-gray-200">
                                                <AlertCircle size={12} className="mr-1 mt-0.5 text-amber-500" />
                                                Reset links expire after 24 hours. User will need to verify their identity.
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all duration-200"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ViewUserModal;