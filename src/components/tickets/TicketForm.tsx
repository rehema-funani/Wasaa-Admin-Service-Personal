import React, { useState, useEffect } from 'react';
import { X, Ticket, AlertCircle, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Ticket as TicketType, TicketFormData } from '../../types/team';

interface TicketFormProps {
    ticket?: TicketType;
    onSubmit: (data: TicketFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({
    ticket,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState<TicketFormData>({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium'
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority
            });
        }
    }, [ticket]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Priority color mapping
    const priorityColors = {
        low: 'bg-gray-100 border-gray-200 text-gray-700',
        medium: 'bg-primary-50 border-primary-200 text-primary-700',
        high: 'bg-orange-50 border-orange-200 text-orange-700',
        critical: 'bg-red-50 border-red-200 text-red-700'
    };

    // Status color mapping
    const statusColors = {
        open: 'bg-gray-100 border-gray-200 text-gray-700',
        'in-progress': 'bg-primary-50 border-primary-200 text-primary-700',
        pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        resolved: 'bg-green-50 border-green-200 text-green-700',
        closed: 'bg-gray-100 border-gray-200 text-gray-700'
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Ticket size={18} />
                    </div>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter ticket title"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none transition-all duration-200"
                    placeholder="Enter ticket description"
                />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div variants={itemVariants}>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Priority
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <AlertCircle size={18} />
                        </div>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${priorityColors[formData.priority as keyof typeof priorityColors]}`}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Clock size={18} />
                        </div>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${statusColors[formData.status as keyof typeof statusColors]}`}
                        >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                variants={itemVariants}
                className="flex justify-end gap-3 pt-5"
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="border-gray-200/80 bg-white/70 backdrop-blur-sm hover:bg-gray-50/90 rounded-xl transition-all duration-200"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="bg-primary-500/90 hover:bg-primary-600/90 text-white rounded-xl shadow-sm shadow-primary-500/20 transition-all duration-200"
                    rightIcon={ticket ? <Check size={16} /> : undefined}
                >
                    {ticket ? 'Update Ticket' : 'Create Ticket'}
                </Button>
            </motion.div>
        </motion.form>
    );
};