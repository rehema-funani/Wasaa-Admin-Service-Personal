// src/app/error/unauthorized-page.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ShieldOff,
    Home,
    ArrowLeft,
    Mail,
    Lock,
    Shield,
    AlertTriangle,
    User,
    X,
    ChevronRight
} from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from || '/';
    const [mounted, setMounted] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Refs for parallax effect
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Mock user data
    const userData = {
        name: "Alex Morgan",
        email: "alex.morgan@company.com",
        role: "Marketing Specialist",
        avatar: null,
    };

    useEffect(() => {
        setMounted(true);

        // Handle parallax effect on mouse move
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !cardRef.current) return;

            const { clientX, clientY } = e;
            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate mouse position relative to container center
            const centerX = containerRect.left + containerRect.width / 2;
            const centerY = containerRect.top + containerRect.height / 2;

            // Calculate offsets
            const offsetX = (clientX - centerX) / 30;
            const offsetY = (clientY - centerY) / 30;

            // Apply subtle parallax effect to card
            cardRef.current.style.transform = `
        translate3d(${offsetX}px, ${offsetY}px, 0)
        rotateX(${-offsetY * 0.2}deg)
        rotateY(${offsetX * 0.2}deg)
      `;
        };

        // Add event listener
        window.addEventListener('mousemove', handleMouseMove);

        // Animate in button elements with delay
        const buttons = document.querySelectorAll('.action-button');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                (button as HTMLElement).style.opacity = '1';
                (button as HTMLElement).style.transform = 'translateY(0)';
            }, 800 + (index * 150));
        });

        return () => {
            setMounted(false);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const toggleSection = (section: string) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full flex items-center justify-center perspective-1000 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50 p-4 overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/30 to-blue-300/20 blur-3xl animate-float-slow" />
                <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-200/20 to-violet-200/20 blur-3xl animate-float-slower" />
                <div className="absolute -bottom-40 right-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-100/20 to-indigo-200/30 blur-3xl animate-float" />

                {/* Geometric shapes */}
                <div className="absolute top-20 right-20 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400/10 to-indigo-400/10 backdrop-blur-md rotate-12 animate-spin-very-slow border border-white/20" />
                <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-300/10 to-violet-400/10 backdrop-blur-md animate-float-slow border border-white/20" />
                <div className="absolute top-1/3 right-1/3 w-10 h-10 rounded-md bg-gradient-to-br from-cyan-300/10 to-blue-400/10 backdrop-blur-md -rotate-12 animate-float border border-white/20" />
            </div>

            {/* Glowing dots */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400/70 blur-sm animate-pulse" />
            <div className="absolute top-3/4 left-2/3 w-2 h-2 rounded-full bg-indigo-400/70 blur-sm animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-violet-400/70 blur-sm animate-pulse-slow" />

            {/* Light beam effect */}
            <div className="absolute top-0 left-1/2 w-1/3 h-screen bg-gradient-to-b from-blue-400/5 via-indigo-400/5 to-transparent transform -translate-x-1/2 rotate-15 blur-3xl" />

            {/* Main content container with 3D effect */}
            <div
                ref={cardRef}
                className={`relative max-w-lg w-full transition-all duration-1000 ease-out transform style-preserve-3d ${mounted ? 'translate-y-0 opacity-100 rotate-z-0' : 'translate-y-8 opacity-0 rotate-z-2'
                    }`}
            >
                <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/40 overflow-hidden transition-all duration-300 hover:shadow-indigo-200/20">
                    <div className="relative h-48 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-violet-600/95 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
                            <div className="absolute bottom-0 left-10 w-20 h-20 rounded-full bg-white/10" />
                            <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-white/10" />

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-32 h-32 rounded-full border border-white/20 animate-pulse-ring" />
                                <div className="absolute top-0 left-0 w-48 h-48 rounded-full border border-white/10 animate-pulse-ring-slow" />
                                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white/5 animate-pulse-ring-slower" />
                            </div>

                            <div className="absolute top-0 left-1/2 w-40 h-full bg-gradient-to-b from-white/20 to-transparent transform -translate-x-1/2 rotate-15 blur-lg" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/30 shadow-lg animate-float-subtle">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-white/5 opacity-80 filter blur-md" />
                                <Shield size={44} className="text-white relative z-10" strokeWidth={1.5} />
                                <div className="absolute inset-0 rounded-3xl bg-blue-400/30 filter blur-xl opacity-70 animate-pulse-slow" />
                            </div>

                            <div className="mt-4 px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                <h2 className="text-white font-medium text-lg tracking-wider">ACCESS RESTRICTED</h2>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">Permission Denied</h1>
                        <p className="text-gray-600 text-center text-[13px] mb-8 max-w-md mx-auto">
                            You don't have the necessary permissions to access this area. Please request access from your system administrator.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md">
                                <button
                                    onClick={() => toggleSection('access')}
                                    className="w-full bg-white p-4 flex items-center justify-between text-left hover:bg-blue-50/50 transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <Lock size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Restricted Area</h3>
                                            <p className="text-xs text-gray-500">Access details</p>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={18}
                                        className={`text-blue-400 transition-transform duration-300 ${expandedSection === 'access' ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                <div
                                    className={`bg-blue-50/70 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'access' ? 'max-h-40 p-4' : 'max-h-0'
                                        }`}
                                >
                                    <p className="text-sm text-blue-700">
                                        The page <span className="font-medium">{from}</span> requires additional permissions that are not currently assigned to your role.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm transition-all duration-300 hover:shadow-md">
                                <button
                                    onClick={() => toggleSection('permissions')}
                                    className="w-full bg-white p-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                            <ShieldOff size={18} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Missing Permissions</h3>
                                            <p className="text-xs text-gray-500">Request access</p>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={18}
                                        className={`text-amber-400 transition-transform duration-300 ${expandedSection === 'permissions' ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                <div
                                    className={`bg-amber-50/70 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'permissions' ? 'max-h-40 p-4' : 'max-h-0'
                                        }`}
                                >
                                    <p className="text-sm text-amber-700">
                                        Contact your system administrator to request the necessary permissions for your role.
                                    </p>
                                    <div className="mt-3 px-3 py-2 rounded-xl bg-white border border-amber-100 text-xs text-amber-800">
                                        <span className="font-medium">Administrator:</span> admin@wasaachat.com
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md">
                                <button
                                    onClick={() => toggleSection('system')}
                                    className="w-full bg-white p-4 flex items-center justify-between text-left hover:bg-indigo-50/50 transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <AlertTriangle size={18} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">System Notice</h3>
                                            <p className="text-xs text-gray-500">Access attempt logged</p>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={18}
                                        className={`text-indigo-400 transition-transform duration-300 ${expandedSection === 'system' ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                <div
                                    className={`bg-indigo-50/70 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'system' ? 'max-h-40 p-4' : 'max-h-0'
                                        }`}
                                >
                                    <p className="text-sm text-indigo-700">
                                        This access attempt has been logged in the system. Repeated unauthorized access attempts may trigger account review.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-x-3 flex">
                            <button
                                onClick={() => navigate('/')}
                                className="action-button w-full py-2 text-[13px] px-4 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center opacity-0 transform translate-y-4"
                            >
                                <Home size={18} className="mr-2 h-4 w-4" />
                                <span>Return to Dashboard</span>
                                <div className="absolute inset-0 rounded-2xl bg-blue-400/20 filter blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button
                                onClick={() => window.location.href = 'mailto:admin@wasaachat.com?subject=Permission%20Request&body=I%20need%20access%20to%20' + encodeURIComponent(from)}
                                className="action-button w-full py-2 text-[13px] px-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-medium hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-indigo-100/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center opacity-0 transform translate-y-4"
                            >
                                <Mail size={18} className="mr-2 h-4 w-4" />
                                <span>Request Access</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100 px-8 py-4 text-center">
                        <p className="text-sm text-gray-500 flex items-center justify-center">
                            <User size={14} className="mr-1" />
                            <span>Need help? Contact the </span>
                            <a href="#" className="inline-flex items-center ml-1 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                IT team <ChevronRight size={14} className="ml-0.5" />
                            </a>
                        </p>
                    </div>
                </div>

                <div className="absolute top-24 -left-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-xl opacity-50 animate-pulse-slow" />
                <div className="absolute -bottom-4 right-10 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 blur-xl opacity-40 animate-float-slow" />
                <div className="absolute -bottom-2 left-20 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 blur-xl opacity-30 animate-float" />
            </div>

            <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { opacity: 0.2; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes pulse-ring-slow {
          0% { transform: scale(0.85); opacity: 0.2; }
          50% { opacity: 0.1; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        
        @keyframes pulse-ring-slower {
          0% { transform: scale(0.9); opacity: 0.1; }
          50% { opacity: 0.05; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        
        .animate-float-subtle {
          animation: float-subtle 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-out infinite;
        }
        
        .animate-pulse-ring-slow {
          animation: pulse-ring-slow 4s ease-out infinite;
        }
        
        .animate-pulse-ring-slower {
          animation: pulse-ring-slower 5s ease-out infinite;
        }
        
        .animate-spin-very-slow {
          animation: spin-very-slow 12s linear infinite;
        }
        
        .rotate-15 {
          transform: rotate(15deg);
        }
        
        .rotate-z-0 {
          transform: rotateZ(0deg);
        }
        
        .rotate-z-2 {
          transform: rotateZ(2deg);
        }
      `}</style>
        </div>
    );
};

export default UnauthorizedPage;