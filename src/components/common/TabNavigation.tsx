import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TabNavigation = ({
    tabs,
    activeTab,
    onTabChange,
    variant = 'default',
    className = '',
    scrollable = true
}) => {
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const tabsContainerRef = useRef(null);

    useEffect(() => {
        const checkScroll = () => {
            if (tabsContainerRef.current) {
                const { scrollWidth, clientWidth } = tabsContainerRef.current;
                setShowScrollButtons(scrollWidth > clientWidth && scrollable);
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);

        return () => {
            window.removeEventListener('resize', checkScroll);
        };
    }, [tabs, scrollable]);

    const scrollTabs = (direction: any) => {
        if (tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            const scrollAmount = container.clientWidth / 2;

            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const getContainerClasses = () => {
        switch (variant) {
            case 'pills':
                return 'bg-gray-100 p-1.5 rounded-lg';
            case 'underline':
                return 'border-b border-gray-200';
            case 'minimal':
                return 'pb-2';
            default: // 'default'
                return 'bg-white rounded-lg shadow-sm p-1 border border-gray-200';
        }
    };

    const getTabClasses = (isActive: any) => {
        const baseClasses = 'relative flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 mx-1';

        switch (variant) {
            case 'pills':
                return `${baseClasses} rounded-md ${isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`;
            case 'underline':
                return `${baseClasses} ${isActive
                    ? 'text-primary-600 border-b-2 border-primary-500 -mb-px'
                    : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'
                    }`;
            case 'minimal':
                return `${baseClasses} ${isActive
                    ? 'text-primary-600 font-medium'
                    : 'text-gray-500 hover:text-gray-800'
                    }`;
            default:
                return `${baseClasses} rounded-md ${isActive
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`;
        }
    };

    const showIndicator = variant !== 'pills' && variant !== 'underline';

    return (
        <div className={`relative ${getContainerClasses()} ${className}`}>
            {showScrollButtons && (
                <motion.button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1"
                    onClick={() => scrollTabs('left')}
                    aria-label="Scroll tabs left"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronLeft size={18} />
                </motion.button>
            )}

            <div
                ref={tabsContainerRef}
                className={`flex items-center ${scrollable ? 'overflow-x-auto hide-scrollbar' : 'flex-wrap'} ${showScrollButtons ? 'px-8' : ''}`}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <motion.button
                            key={tab.id}
                            className={getTabClasses(isActive)}
                            onClick={() => onTabChange(tab.id)}
                            whileHover={{ scale: isActive ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`${tab.id}-panel`}
                        >
                            {tab.icon && (
                                <span className={`mr-2 ${isActive ? 'text-primary-500' : 'text-gray-400'}`}>
                                    {tab.icon}
                                </span>
                            )}
                            <span>{tab.label}</span>

                            {isActive && showIndicator && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full mx-2"
                                    layoutId="activeTabIndicator"
                                    initial={false}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {showScrollButtons && (
                <motion.button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1"
                    onClick={() => scrollTabs('right')}
                    aria-label="Scroll tabs right"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronRight size={18} />
                </motion.button>
            )}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default TabNavigation;