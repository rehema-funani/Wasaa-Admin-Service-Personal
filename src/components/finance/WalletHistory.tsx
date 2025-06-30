import { Clock, Download, Eye } from 'lucide-react'
import React from 'react'

const WalletHistory = ({
  selectedWallet,
  transactions,
  setIsModalOpen,
  formatCurrency,
  getWalletIcon,
  getTransactionIcon,
  getStatusColor,
  formatDate
}) => {
  return (
    <div>
      {/* Wallet Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-neutral-100 dark:bg-dark-active rounded-md mr-2">
            {getWalletIcon(selectedWallet.type, { size: 14, strokeWidth: 1.5 })}
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedWallet.name}</h3>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 font-mono">{selectedWallet.accountNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <select className="text-[10px] bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-md py-1 px-2 text-neutral-700 dark:text-neutral-300">
            <option value="all">All Transactions</option>
            <option value="credit">Credits Only</option>
            <option value="debit">Debits Only</option>
          </select>
          <button className="p-1 bg-neutral-100 dark:bg-dark-active rounded-md hover:bg-neutral-200 dark:hover:bg-dark-hover transition-colors text-neutral-600 dark:text-neutral-400">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border border-neutral-200 dark:border-dark-border rounded-md overflow-hidden">
        <div className="overflow-x-auto max-h-80">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border">
            <thead className="bg-neutral-50 dark:bg-dark-active">
              <tr>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Transaction</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Reference</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Amount</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 text-left text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="px-2 py-2 text-right text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-elevated divide-y divide-neutral-200 dark:divide-dark-border">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-md bg-neutral-100 dark:bg-dark-active flex items-center justify-center mr-2">
                        {getTransactionIcon(transaction.type, { size: 12, strokeWidth: 1.5 })}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                          {transaction.type === 'credit' ? 'Received' : 'Sent'}
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-500 line-clamp-1" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-xs text-neutral-900 dark:text-neutral-300 font-mono">{transaction.reference}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-500">{transaction.relatedEntity}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className={`text-xs font-medium ${transaction.type === 'credit'
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-primary-600 dark:text-primary-400'
                      }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-500">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right text-xs font-medium">
                    <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="text-center py-8 bg-neutral-50 dark:bg-dark-active rounded-md border border-neutral-200 dark:border-dark-border">
          <Clock size={24} className="mx-auto text-neutral-400 dark:text-neutral-500 mb-2" />
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">No transactions found</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs">This wallet has no transaction history yet.</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-neutral-200 dark:border-dark-border">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-dark-active border border-neutral-200 dark:border-dark-border rounded-md hover:bg-neutral-50 dark:hover:bg-dark-hover"
        >
          Close
        </button>
        <button
          className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 dark:bg-primary-700 border border-transparent rounded-md hover:bg-primary-700 dark:hover:bg-primary-600"
        >
          Export
        </button>
      </div>
    </div>
  )
}

export default WalletHistory
