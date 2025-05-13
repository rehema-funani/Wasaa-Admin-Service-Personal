import React, { useEffect, useState } from 'react';
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

    // State to handle animation
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsAnimating(false);
            // Small delay to allow exit animation to complete
            const timer = setTimeout(() => {
                document.body.style.overflow = '';
            }, 200);
            return () => clearTimeout(timer);
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

    if (!isOpen && !isAnimating) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={handleBackdropClick}
        >
            <div
                className="absolute inset-0 backdrop-blur-[6px] bg-black/10 transition-opacity duration-200 ease-in-out"
            />

            <div
                className={`
                relative w-full ${sizeClasses[size]} mx-auto max-h-[96vh] overflow-y-auto
                rounded-3xl overflow-hidden 
                bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl
                border border-white/20
                shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)]
                transition-all duration-200 ease-in-out
                ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
              `}
            >
                <div className="absolute inset-[1px] rounded-[23px] pointer-events-none bg-gradient-to-b from-white/30 to-white/5 overflow-hidden">
                    <div className="absolute -inset-x-20 -top-40 h-80 w-[200%] bg-gradient-to-b from-white/50 to-transparent opacity-60 transform rotate-12"></div>
                    <div className="absolute -inset-x-20 bottom-0 h-40 w-[200%] bg-gradient-to-t from-white/10 to-transparent opacity-60"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br pointer-events-none"></div>

                {title && (
                    <div className="relative px-6 py-4 border-b border-white/20 bg-white/15 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <h3
                                className="text-lg font-medium text-gray-800"
                            >
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="relative text-gray-600 hover:text-gray-800 rounded-full p-2 bg-white/20 hover:bg-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="relative p-6 bg-white/5 backdrop-blur-xl">
                    <div
                        className="text-gray-800"
                    >
                        {children}
                    </div>
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full"></div>
            </div>
        </div>
    );
};