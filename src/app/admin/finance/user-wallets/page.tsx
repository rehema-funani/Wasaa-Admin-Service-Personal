import { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Eye,
  Clock,
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [wallets, setWallets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWallets = async () => {
    setIsLoading(true);

    try {
      const response = await financeService.getAllWallets();
      const formattedWallets = response.data.map((wallet: any) => ({
        id: wallet.id || '',
        user: {
          id: wallet.user_uuid || '',
          name: wallet.user?.username || 'Unknown User',
          phone: wallet.user?.phone_number || 'N/A',
        },
        balance: wallet.balance ?? 0,
        pendingBalance: wallet.pending_balance ?? 0,
        currency: wallet.Currency?.symbol || '',
        status: wallet.status || 'active',
        type: wallet.type || 'personal',
        lastTransaction: wallet.last_transaction || 'N/A',
        created: wallet.created_at
          ? new Date(wallet.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          : 'Unknown',
        transactionCount: wallet.transaction_count ?? 0,
        securityLevel: wallet.security_level || 'medium',
      }));

      setWallets(formattedWallets);
    } catch (err) {
      toast.error('Failed to load wallets');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchWallets();
  }, []);

  const columns = [
    {
      id: 'user',
      header: 'Owner',
      accessor: (row: any) => row.user.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.user.email}</p>
          </div>
        </div>
      )
    },
    {
      id: 'balance',
      header: 'Balance',
      accessor: (row: any) => row.balance,
      sortable: true,
      width: '150px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-800">
            {value}
            <span className="text-xs text-gray-500 ml-1">{row.currency}</span>
          </div>
          {row.pendingBalance > 0 && (
            <div className="text-xs text-gray-500 mt-0.5">
              Pending: {row.pendingBalance}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        const statusMap: Record<string, any> = {
          'active': { color: 'green', icon: true },
          'inactive': { color: 'gray', icon: false },
          'pending': { color: 'yellow', icon: true },
          'frozen': { color: 'primary', icon: true },
          'processing': { color: 'purple', icon: true }
        };
        return (
          <StatusBadge
            status={value as any}
            size="sm"
            withIcon
            withDot={value === 'active'}
            className={`text-${statusMap[value]?.color}-500`}
          />
        );
      }
    },
    {
      id: 'lastTransaction',
      header: 'Last Transaction',
      accessor: (row: any) => row.lastTransaction,
      sortable: true,
      cell: (value: string) => (
        <div className="flex items-center">
          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'transactionCount',
      header: 'Transactions',
      accessor: (row: any) => row.transactionCount,
      sortable: true,
      width: '120px',
      cell: (value: number) => (
        <span className={`
        px-2 py-1 rounded-md text-xs font-medium
        ${value === 0
            ? 'bg-gray-100 text-gray-500'
            : value > 100
              ? 'bg-green-100 text-green-700'
              : 'bg-primary-50 text-primary-700'}
      `}>
          {value}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '140px',
      cell: (value: string) => (
        <div className="flex items-center space-x-1">
          <button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            onClick={() => navigate(`/admin/finance/user-wallets/${value}`)}
          >
            <Eye size={16} strokeWidth={1.8} />
          </button>
        </div>
      )
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert('Export functionality would go here');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">User Wallets</h1>
          <p className="text-gray-500 mt-1">Manage balances and wallet security settings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
          >
            <Upload size={16} className="mr-2" strokeWidth={1.8} />
            Import
          </button>
          <button
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm shadow-sm"
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </button>
        </div>
      </div>

      <div
        className="mb-6"
      >
        <DataTable
          columns={columns}
          data={wallets}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No wallets found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </div>

      <div
      >
        <Pagination
          totalItems={wallets.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          showSummary={true}
        />
      </div>
    </div>
  );
};

export default page;