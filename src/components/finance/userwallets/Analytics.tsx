import { Activity, ArrowDownRight, ArrowUpRight, Download, PieChart, Send, Wallet } from 'lucide-react'
import React from 'react'

const Analytics = ({
  wallet,
  transactions,
  stats,
  analyticsData,
  walletBalance,
  walletCredit,
  walletDebit,
  currencySymbol = 'ksh',
  formatCurrency,
  timeAgo,
  setTabIndex
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
              <Wallet size={20} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Total Balance</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {formatCurrency(walletBalance)}
          </div>
          <div className="text-xs text-gray-500">
            Updated {timeAgo(wallet.updatedAt)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
              <ArrowUpRight size={20} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Income</h3>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {formatCurrency(walletCredit)}
          </div>
          <div className="text-xs text-gray-500">
            From {transactions.filter(tx => tx.type === 'incoming').length} incoming transactions
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mr-3">
              <ArrowDownRight size={20} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Expenses</h3>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {formatCurrency(walletDebit)}
          </div>
          <div className="text-xs text-gray-500">
            From {transactions.filter(tx => tx.type === 'outgoing').length} outgoing transactions
          </div>
        </div>
      </div>

      {stats && (
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Current Month Volume</p>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {formatCurrency(stats.currentMonth.volume)}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <ArrowUpRight size={14} className="mr-1 text-emerald-500" />
                <span className="text-emerald-600 font-medium">{stats.volumeChangePercent}%</span> from last month
              </div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Previous Month Volume</p>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {formatCurrency(stats.previousMonth.volume)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction Distribution</h3>
          {analyticsData ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <span className="text-sm font-medium">{analyticsData.incoming.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
                <span className="text-sm font-medium">{analyticsData.outgoing.toFixed(2)}</span>
              </div>

              <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${(analyticsData.incoming / (analyticsData.incoming + analyticsData.outgoing || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <PieChart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Not enough transaction data</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Spending by Category</h3>
          {analyticsData && analyticsData.categories ? (
            <div className="space-y-4">
              {analyticsData.categories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color}`}
                      style={{
                        width: `${(category.amount / (analyticsData.outgoing || 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <PieChart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Not enough transaction data</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-300 flex items-center"
            onClick={() => setTabIndex(1)}
          >
            View All
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.slice(0, 4).map((transaction, index) => (
              <div
                key={transaction.id}
                className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-colors duration-300"
              >
                <div className="flex items-start">
                  <div className={`h-10 w-10 rounded-xl ${transaction.type === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-3`}>
                    {transaction.type === 'incoming' ? <Download size={18} /> : <Send size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">
                        {transaction.description}
                      </p>
                      <p className={`font-medium ${transaction.type === 'incoming' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.type === 'incoming' ? '+' : '-'} {currencySymbol} {transaction.amount}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                      </p>
                      <p className="text-xs text-gray-500">{timeAgo(transaction.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No transaction history yet</p>
            <p className="text-sm text-gray-500">Analytics will be available once you have transactions</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics
