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
      <div className="p-1">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                  <div className="p-2 bg-neutral-100 dark:bg-dark-active rounded-lg mr-3">
                      {getWalletIcon(selectedWallet.type)}
                  </div>
                  <div>
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{selectedWallet.name}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 font-mono">{selectedWallet.accountNumber}</p>
                  </div>
              </div>

              <div className="flex items-center gap-2">
                  <select className="text-xs bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg py-1.5 px-3 text-neutral-700 dark:text-neutral-300">
                      <option value="all">All Transactions</option>
                      <option value="credit">Credits Only</option>
                      <option value="debit">Debits Only</option>
                  </select>
                  <button className="p-1.5 bg-neutral-100 dark:bg-dark-active rounded-lg hover:bg-neutral-200 dark:hover:bg-dark-hover transition-colors text-neutral-600 dark:text-neutral-400">
                      <Download size={16} />
                  </button>
              </div>
          </div>

          <div className="overflow-x-auto max-h-96 border border-neutral-200 dark:border-dark-border rounded-lg">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border">
                  <thead className="bg-neutral-50 dark:bg-dark-active">
                      <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Transaction</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Reference</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Amount</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-elevated divide-y divide-neutral-200 dark:divide-dark-border">
                      {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10">
                              <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-neutral-100 dark:bg-dark-active flex items-center justify-center mr-3">
                                          {getTransactionIcon(transaction.type)}
                                      </div>
                                      <div>
                                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                                              {transaction.type === 'credit' ? 'Received' : 'Sent'}
                                          </div>
                                          <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 line-clamp-1" title={transaction.description}>
                                              {transaction.description}
                                          </div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-neutral-900 dark:text-neutral-300 font-mono">{transaction.reference}</div>
                                  <div className="text-xs text-neutral-500 dark:text-neutral-500">{transaction.relatedEntity}</div>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                  <div className={`text-sm font-medium ${transaction.type === 'credit'
                                      ? 'text-success-600 dark:text-success-400'
                                      : 'text-primary-600 dark:text-primary-400'
                                      }`}>
                                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                  </div>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-500">
                                  {formatDate(transaction.timestamp)}
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                      <Eye size={16} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {transactions.length === 0 && (
              <div className="text-center py-12 bg-neutral-50 dark:bg-dark-active rounded-lg border border-neutral-200 dark:border-dark-border">
                  <Clock size={36} className="mx-auto text-neutral-400 dark:text-neutral-500 mb-3" />
                  <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-1">No transactions found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">This wallet has no transaction history yet.</p>
              </div>
          )}

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200 dark:border-dark-border">
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-dark-active border border-neutral-300 dark:border-dark-border rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-hover"
              >
                  Close
              </button>
              <button
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 border border-transparent rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 shadow-button dark:shadow-dark-glow"
              >
                  Export to CSV
              </button>
          </div>
      </div>
  )
}

export default WalletHistory
