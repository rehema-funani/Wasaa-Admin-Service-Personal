import { Activity, CheckCircle, Download, Filter, Plus, RefreshCw, Search, Send, X } from 'lucide-react';
import React from 'react'

const TransactionHistory = ({
  transactions,
  loadingMore,
  handleLoadMoreTransactions,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  dateRange,
  setDateRange,
  currencySymbol = 'ksh',
  formatDate,
  timeAgo,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 animate-fadeIn">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex items-center">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-300 flex items-center">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              onClick={() => setFilterType('all')}
            >
              All Types
            </button>
            <button
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'incoming'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              onClick={() => setFilterType('incoming')}
            >
              <Download size={14} className="inline mr-1" /> Incoming
            </button>
            <button
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'outgoing'
                ? 'bg-red-100 text-red-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              onClick={() => setFilterType('outgoing')}
            >
              <Send size={14} className="inline mr-1" /> Outgoing
            </button>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-600">Transaction</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600">Description</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600">Date</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-600 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-indigo-50/20 transition-colors duration-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-xl ${transaction.type === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-3 shadow-sm`}>
                          {transaction.type === 'incoming' ? <Download size={18} /> : <Send size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                          </p>
                          <p className="text-xs text-gray-500">{transaction.type === 'incoming' ? 'Received' : 'Sent'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-700">{formatDate(transaction.timestamp)}</p>
                        <p className="text-xs text-gray-500">{timeAgo(transaction.timestamp)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${transaction.type === 'incoming' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.type === 'incoming' ? '+' : '-'} {currencySymbol} {transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle size={12} className="mr-1" /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-center">
            <button
              className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors duration-300 flex items-center"
              onClick={handleLoadMoreTransactions}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Load More Transactions
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 animate-fadeIn">
          <Activity size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">No transactions found</p>
          <p className="text-sm text-gray-500 mb-6">No transactions match your current filters</p>
          {(searchTerm || filterType !== 'all' || dateRange !== 'all') && (
            <button
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center mx-auto"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setDateRange('all');
              }}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
