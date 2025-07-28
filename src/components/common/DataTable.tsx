import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    SortAsc,
    SortDesc,
    X
} from 'lucide-react';

interface Column {
    id: string;
    header: string;
    accessor: (row: any) => any;
    cell?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    selectable?: boolean;
    onRowClick?: (row: any) => void;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    emptyMessage?: string;
    isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    selectable = false,
    onRowClick,
    defaultRowsPerPage = 10,
    emptyMessage = 'No data available',
    isLoading = false
}) => {
    const [sortedColumn, setSortedColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const sortedData = React.useMemo(() => {
        if (!sortedColumn) return data;

        return [...data].sort((a, b) => {
            const column = columns.find(col => col.id === sortedColumn);
            if (!column) return 0;

            const valueA = column.accessor(a);
            const valueB = column.accessor(b);

            if (valueA === valueB) return 0;

            if (sortDirection === 'asc') {
                return valueA < valueB ? -1 : 1;
            } else {
                return valueA > valueB ? -1 : 1;
            }
        });
    }, [data, sortedColumn, sortDirection, columns]);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    const handleSort = (columnId: string) => {
        if (sortedColumn === columnId) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(columnId);
            setSortDirection('asc');
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        updateAllSelectedState(!selectedRows[id]);
    };

    const handleSelectAll = () => {
        const newSelectAllState = !isAllSelected;
        setIsAllSelected(newSelectAllState);

        const newSelectedRows: Record<string, boolean> = {};
        paginatedData.forEach(row => {
            newSelectedRows[row.id] = newSelectAllState;
        });
        setSelectedRows(newSelectedRows);
    };

    const updateAllSelectedState = (isSelected: boolean) => {
        const allSelected = paginatedData.every(row => selectedRows[row.id] || (row.id === isSelected));
        setIsAllSelected(allSelected);
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/70 dark:bg-gray-700">
                                {selectable && (
                                    <th className="w-10 px-4 py-4">
                                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    </th>
                                )}
                                {columns.map(column => (
                                    <th
                                        key={column.id}
                                        className="px-4 py-4 text-left"
                                        style={{ width: column.width }}
                                    >
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                    {selectable && (
                                        <td className="px-4 py-4">
                                            <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                                        </td>
                                    )}
                                    {columns.map((colIndex) => (
                                        <td key={`${rowIndex}-${colIndex}`} className="px-4 py-4">
                                            <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                        <X size={24} className="text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/80 dark:bg-gray-800 backdrop-blur-sm">
                            {selectable && (
                                <th className="w-10 px-4 py-3">
                                    <motion.div
                                        className="w-5 h-5 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer"
                                        whileHover={{ scale: 1.1, borderColor: '#6366f1' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSelectAll}
                                    >
                                        {isAllSelected && (
                                            <Check size={14} className="text-primary-600" />
                                        )}
                                    </motion.div>
                                </th>
                            )}
                            {columns.map(column => (
                                <th
                                    key={column.id}
                                    className={`px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wider ${column.sortable ? 'cursor-pointer' : ''}`}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.id)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.header}</span>
                                        {column.sortable && (
                                            <motion.div
                                                className="ml-1"
                                                animate={{ opacity: sortedColumn === column.id ? 1 : 0.3 }}
                                            >
                                                {sortedColumn === column.id ? (
                                                    sortDirection === 'asc' ? (
                                                        <SortAsc size={14} className="text-primary-600 dark:text-primary-400" />
                                                    ) : (
                                                        <SortDesc size={14} className="text-primary-600 dark:text-primary-400" />
                                                    )
                                                ) : (
                                                    <SortAsc size={14} className="text-gray-400 dark:text-gray-500" />
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedData.map((row, index) => (
                                <motion.tr
                                    key={row.id || index}
                                    className={`
                    border-b border-gray-50 last:border-0 dark:border-gray-700
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50' : ''}
                    ${selectedRows[row.id] ? 'bg-primary-50/50 dark:bg-primary-50/50' : ''}
                  `}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    whileHover={{ backgroundColor: onRowClick ? 'rgba(238, 242, 255, 0.3)' : undefined }}
                                >
                                    {selectable && (
                                        <td className="px-4 py-3.5" onClick={e => {
                                            e.stopPropagation();
                                            handleSelectRow(row.id);
                                        }}>
                                            <motion.div
                                                className={`
                          w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer
                          ${selectedRows[row.id] ? 'border-primary-600 bg-primary-50 dark:bg-primary-50' : 'border-gray-300 dark:border-gray-600'}
                        `}
                                                whileHover={{ scale: 1.1, borderColor: '#6366f1' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {selectedRows[row.id] && (
                                                    <Check size={14} className="text-primary-600 dark:text-primary-400" />
                                                )}
                                            </motion.div>
                                        </td>
                                    )}
                                    {columns.map(column => (
                                        <td key={column.id} className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                                            {column.cell
                                                ? column.cell(column.accessor(row), row)
                                                : column.accessor(row)}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;