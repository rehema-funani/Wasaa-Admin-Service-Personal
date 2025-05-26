// src/components/common/Pagination.tsx

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (perPage: number) => void;
    showItemsPerPage?: boolean;
    itemsPerPageOptions?: number[];
    showSummary?: boolean;
    totalPages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange,
    showItemsPerPage = false,
    itemsPerPageOptions = [10, 25, 50, 100],
    showSummary = true,
    totalPages: providedTotalPages
}) => {
    // Calculate the total number of pages
    const totalPages = providedTotalPages || Math.ceil(totalItems / itemsPerPage);

    // Calculate the range of displayed items
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Show max 5 page numbers at once

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is less than or equal to maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            let startPage;
            let endPage;

            if (currentPage <= 3) {
                // If near the beginning, show first few pages
                startPage = 2;
                endPage = 4;
                pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
                pageNumbers.push('ellipsis');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // If near the end, show last few pages
                pageNumbers.push('ellipsis');
                startPage = totalPages - 3;
                endPage = totalPages - 1;
                pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
                pageNumbers.push(totalPages);
            } else {
                // If in the middle, show current page and pages around it
                pageNumbers.push('ellipsis');
                startPage = currentPage - 1;
                endPage = currentPage + 1;
                pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
                pageNumbers.push('ellipsis');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
            {/* Summary */}
            {showSummary && totalItems > 0 && (
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-700">{startItem}</span> to{' '}
                    <span className="font-medium text-gray-700">{endItem}</span> of{' '}
                    <span className="font-medium text-gray-700">{totalItems}</span> entries
                </div>
            )}

            {/* Items per page selector */}
            {showItemsPerPage && onItemsPerPageChange && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-500">per page</span>
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center">
                <motion.button
                    className={`p-1 rounded-lg mr-1 ${currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-primary-600'
                        }`}
                    onClick={() => currentPage > 1 && onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                    <ChevronsLeft size={18} />
                </motion.button>

                <motion.button
                    className={`p-1 rounded-lg mr-2 ${currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-primary-600'
                        }`}
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                    <ChevronLeft size={18} />
                </motion.button>

                <div className="flex items-center space-x-1">
                    {pageNumbers.map((page, index) => {
                        if (page === 'ellipsis') {
                            return (
                                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <motion.button
                                key={`page-${page}`}
                                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm ${currentPage === page
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                onClick={() => page !== currentPage && onPageChange(page as number)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                            >
                                {page}
                            </motion.button>
                        );
                    })}
                </div>

                <motion.button
                    className={`p-1 rounded-lg ml-2 ${currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-primary-600'
                        }`}
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                    <ChevronRight size={18} />
                </motion.button>

                <motion.button
                    className={`p-1 rounded-lg ml-1 ${currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-primary-600'
                        }`}
                    onClick={() => currentPage < totalPages && onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                    <ChevronsRight size={18} />
                </motion.button>
            </div>
        </div>
    );
};

export default Pagination;