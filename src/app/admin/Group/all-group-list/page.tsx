import React, { useEffect, useState } from 'react';
import { Calendar, Eye, X, SortAsc, SortDesc, Check } from 'lucide-react';
import groupService from '../../../../api/services/groups';
import { useNavigate } from 'react-router-dom';

type Group = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  type: string;
  status: string;
  created_by: string | null;
  last_message: string | null;
  last_message_sender: string | null;
  last_message_time: string | null;
  last_message_type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ApiResponse = {
  groups: Group[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

const generateGroupColor = (title: string) => {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-yellow-100 text-yellow-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
  ];

  const sum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

const getInitials = (title: string) => {
  return title
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (error) {
    return dateString;
  }
};

const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [metadata, setMetadata] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sorting states
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Selection states
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [isAllSelected, setIsAllSelected] = useState(false);

  const fetchGroups = async (page = 1) => {
    try {
      setLoading(true);
      // Assuming groupService.getGroups accepts pagination params
      const response: ApiResponse = await groupService.getGroups({ page });
      setGroups(response.groups);
      setMetadata(response.meta);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = React.useMemo(() => {
    if (!sortedColumn) return filteredGroups;

    return [...filteredGroups].sort((a, b) => {
      let valueA, valueB;

      switch (sortedColumn) {
        case 'title':
          valueA = a.title;
          valueB = b.title;
          break;
        case 'type':
          valueA = a.type;
          valueB = b.type;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'created':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (valueA === valueB) return 0;

      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  }, [filteredGroups, sortedColumn, sortDirection]);

  const changePage = (page: number) => {
    if (page < 1 || page > metadata.totalPages) return;
    fetchGroups(page);
  };

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
    sortedData.forEach(row => {
      newSelectedRows[row.id] = newSelectAllState;
    });
    setSelectedRows(newSelectedRows);
  };

  const updateAllSelectedState = (isSelected: boolean) => {
    const allSelected = sortedData.every(row => selectedRows[row.id] || (row.id === isSelected));
    setIsAllSelected(allSelected);
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/admin/Group/all-group-list/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Table */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Using the DataTable style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70">
                    <th className="w-10 px-4 py-4">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-4 py-4 text-left" style={{ width: '40%' }}>
                      <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-4 py-4 text-left" style={{ width: '15%' }}>
                      <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-4 py-4 text-left" style={{ width: '15%' }}>
                      <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-4 py-4 text-left" style={{ width: '15%' }}>
                      <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-4 py-4 text-left" style={{ width: '15%' }}>
                      <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-4">
                        <div className="w-5 h-5 bg-gray-100 rounded animate-pulse"></div>
                      </td>
                      {Array.from({ length: 5 }).map((_, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`} className="px-4 py-4">
                          <div className="h-5 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : sortedData.length === 0 ? (
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <X size={24} className="text-gray-400" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500">No groups found matching your search.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 backdrop-blur-sm">
                    <th className="w-10 px-4 py-3">
                      <div
                        className="w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-600"
                        onClick={handleSelectAll}
                      >
                        {isAllSelected && (
                          <Check size={14} className="text-indigo-600" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Group</span>
                        <div className="ml-1 opacity-30">
                          {sortedColumn === 'title' ? (
                            sortDirection === 'asc' ? (
                              <SortAsc size={14} className="text-indigo-600" />
                            ) : (
                              <SortDesc size={14} className="text-indigo-600" />
                            )
                          ) : (
                            <SortAsc size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Type</span>
                        <div className="ml-1 opacity-30">
                          {sortedColumn === 'type' ? (
                            sortDirection === 'asc' ? (
                              <SortAsc size={14} className="text-indigo-600" />
                            ) : (
                              <SortDesc size={14} className="text-indigo-600" />
                            )
                          ) : (
                            <SortAsc size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <div className="ml-1 opacity-30">
                          {sortedColumn === 'status' ? (
                            sortDirection === 'asc' ? (
                              <SortAsc size={14} className="text-indigo-600" />
                            ) : (
                              <SortDesc size={14} className="text-indigo-600" />
                            )
                          ) : (
                            <SortAsc size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider cursor-pointer"
                      onClick={() => handleSort('created')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created</span>
                        <div className="ml-1 opacity-30">
                          {sortedColumn === 'created' ? (
                            sortDirection === 'asc' ? (
                              <SortAsc size={14} className="text-indigo-600" />
                            ) : (
                              <SortDesc size={14} className="text-indigo-600" />
                            )
                          ) : (
                            <SortAsc size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((group, index) => (
                    <tr
                      key={group.id}
                      className={`
                        border-b border-gray-50 last:border-0 
                        hover:bg-gray-50/50 cursor-pointer
                        ${selectedRows[group.id] ? 'bg-indigo-50/50' : ''}
                      `}
                    >
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(group.id);
                        }}
                      >
                        <div
                          className={`
                            w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer hover:border-indigo-600
                            ${selectedRows[group.id] ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}
                          `}
                        >
                          {selectedRows[group.id] && (
                            <Check size={14} className="text-indigo-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${generateGroupColor(group.title)}`}>
                            {getInitials(group.title)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{group.title}</h3>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{group.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${group.type === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {group.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${group.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {group.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(group.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-1 rounded-md hover:bg-indigo-50 text-indigo-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewGroup(group.id);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        {metadata.totalPages > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-500">
              Showing {sortedData.length} of {metadata.totalItems} groups
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-1 rounded-lg bg-gray-100 text-gray-600 ${metadata.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={metadata.currentPage === 1}
                onClick={() => changePage(metadata.currentPage - 1)}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, metadata.totalPages) }).map((_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (metadata.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (metadata.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (metadata.currentPage >= metadata.totalPages - 2) {
                  pageNum = metadata.totalPages - 4 + i;
                } else {
                  pageNum = metadata.currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-lg ${pageNum === metadata.currentPage ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => changePage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className={`px-3 py-1 rounded-lg bg-gray-100 text-gray-600 ${metadata.currentPage === metadata.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={metadata.currentPage === metadata.totalPages}
                onClick={() => changePage(metadata.currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;