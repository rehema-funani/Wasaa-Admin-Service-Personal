import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    showItemsPerPage?: boolean;
    itemsPerPageOptions?: number[];
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    showSummary?: boolean;
    className?: string;
    maxPagesToShow?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    showItemsPerPage = false,
    itemsPerPageOptions = [10, 25, 50, 100],
    onItemsPerPageChange,
    showSummary = true,
    className = '',
    maxPagesToShow = 5
}) => {
    const [inputPage, setInputPage] = useState<string>(currentPage.toString());
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value);
    };

    const handlePageInputBlur = () => {
        const page = parseInt(inputPage);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            onPageChange(page);
        } else {
            setInputPage(currentPage.toString());
        }
    };

    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handlePageInputBlur();
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onItemsPerPageChange) {
            onItemsPerPageChange(parseInt(e.target.value));
        }
    };

    const startItem = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1);
    const endItem = Math.min(totalItems, currentPage * itemsPerPage);

    const getPageNumbers = () => {
        const pageNumbers: number[] = [];

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        }

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
                {showItemsPerPage && onItemsPerPageChange && (
                    <div className="flex items-center">
                        <span>Rows per page:</span>
                        <motion.select
                            className="ml-2 bg-white border border-gray-200 rounded-lg text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            whileHover={{ borderColor: '#6366f1' }}
                        >
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </motion.select>
                    </div>
                )}

                {showSummary && (
                    <div className="text-gray-500">
                        {totalItems === 0 ? (
                            <span>No items</span>
                        ) : (
                            <span>
                                Showing <span className="font-medium text-gray-700">{startItem}</span> to{' '}
                                <span className="font-medium text-gray-700">{endItem}</span> of{' '}
                                <span className="font-medium text-gray-700">{totalItems}</span> items
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center">
                {/* First page button */}
                <motion.button
                    className="p-1.5 rounded-lg text-gray-600 disabled:text-gray-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(238, 242, 255, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                    aria-label="First page"
                >
                    <ChevronsLeft size={18} strokeWidth={1.8} />
                </motion.button>

                {/* Previous page button */}
                <motion.button
                    className="p-1.5 rounded-lg text-gray-600 disabled:text-gray-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(238, 242, 255, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} strokeWidth={1.8} />
                </motion.button>

                {/* Page number buttons */}
                <div className="flex items-center px-1 space-x-1">
                    {pageNumbers.map(pageNum => (
                        <motion.button
                            key={pageNum}
                            className={`
                w-8 h-8 rounded-lg text-sm flex items-center justify-center
                ${currentPage === pageNum
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-indigo-50/70'}
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPageChange(pageNum)}
                        >
                            {pageNum}
                        </motion.button>
                    ))}
                </div>

                {/* Next page button */}
                <motion.button
                    className="p-1.5 rounded-lg text-gray-600 disabled:text-gray-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(238, 242, 255, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                >
                    <ChevronRight size={18} strokeWidth={1.8} />
                </motion.button>

                <motion.button
                    className="p-1.5 rounded-lg text-gray-600 disabled:text-gray-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(238, 242, 255, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(totalPages)}
                    aria-label="Last page"
                >
                    <ChevronsRight size={18} strokeWidth={1.8} />
                </motion.button>

                <div className="ml-2 flex items-center">
                    <span className="text-xs text-gray-500 mr-1 hidden sm:inline">Go to:</span>
                    <motion.input
                        type="text"
                        value={inputPage}
                        onChange={handlePageInput}
                        onBlur={handlePageInputBlur}
                        onKeyDown={handlePageInputKeyDown}
                        className="w-12 text-center py-1 px-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        whileHover={{ borderColor: '#6366f1' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pagination;