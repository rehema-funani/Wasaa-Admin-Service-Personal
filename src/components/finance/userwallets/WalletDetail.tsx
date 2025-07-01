import { Activity, ArrowDownRight, ArrowUpRight, Calendar, CheckCircle, ChevronRight, Clock, Copy, CreditCard, DollarSign, Download, Eye, EyeOff, RefreshCw, Send, Shield, User, Users } from 'lucide-react'

const WalletDetail = ({
  wallet,
  walletBalance,
  walletCredit,
  walletDebit,
  transactions,
  currencySymbol = 'KES',
  hideBalance,
  setHideBalance,
  isRefreshing,
  handleRefreshWallet,
  setTabIndex,
  timeAgo,
  formatDate,
  formatCurrency,
  copyToClipboard
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
      <div className="md:col-span-2">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg shadow-indigo-500/20 p-8 mb-8 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full -z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-full -z-0"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float -z-0"></div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-lg font-semibold text-indigo-100">Wallet Balance</h2>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300 text-white"
            >
              {hideBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col mb-8">
              <p className="text-sm text-indigo-200 mb-2">Available Balance</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {hideBalance
                  ? '••••••••'
                  : formatCurrency(walletBalance)}
              </h1>
              <div className="mt-3 flex items-center">
                <span className="text-xs text-indigo-200 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  Updated {timeAgo(wallet.updatedAt)}
                </span>
                <button
                  className={`ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors duration-300 text-white ${isRefreshing ? 'animate-spin' : ''}`}
                  onClick={handleRefreshWallet}
                  disabled={isRefreshing}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-indigo-200 mb-1">Total Credit</p>
                <p className="text-xl font-bold text-white">
                  {hideBalance
                    ? '••••••••'
                    : formatCurrency(walletCredit)}
                </p>
                <div className="flex items-center mt-2 text-xs text-indigo-200">
                  <ArrowUpRight size={14} className="mr-1" />
                  Money In
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-indigo-200 mb-1">Total Debit</p>
                <p className="text-xl font-bold text-white">
                  {hideBalance
                    ? '••••••••'
                    : formatCurrency(walletDebit)}
                </p>
                <div className="flex items-center mt-2 text-xs text-indigo-200">
                  <ArrowDownRight size={14} className="mr-1" />
                  Money Out
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              onClick={() => setTabIndex(1)}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center p-4 border border-gray-100 rounded-xl hover:border-indigo-100 transition-colors duration-300 hover:bg-indigo-50/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`h-10 w-10 rounded-full ${transaction.type === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-4`}>
                    {transaction.type === 'incoming' ? <Download size={18} /> : <Send size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'incoming' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {transaction.type === 'incoming' ? '+' : '-'} {currencySymbol} {transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
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
              <p className="text-sm text-gray-500">Transactions will appear here once you start using your wallet</p>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-1">
        {/* Wallet Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Wallet Information</h2>
          <div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="text-indigo-500 mr-3">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wallet ID</p>
                  <p className="text-base font-medium text-gray-800 truncate max-w-[180px]">{wallet.id.substring(0, 12)}...</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(wallet.id)}
                className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="text-indigo-500 mr-3">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="text-base font-medium text-gray-800">KES (ksh)</p>
              </div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="text-indigo-500 mr-3">
                {wallet.type === 'user' ? <User size={18} /> : wallet.type === 'group' ? <Users size={18} /> : <Shield size={18} />}
              </div>
              <div>
                <p className="text-sm text-gray-500">Wallet Type</p>
                <p className="text-base font-medium text-gray-800 capitalize">{wallet.type} Wallet</p>
              </div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="text-indigo-500 mr-3">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${wallet.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {wallet.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>}
                    {wallet.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-100">
              <div className="text-indigo-500 mr-3">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p className="text-base font-medium text-gray-800">{formatDate(wallet.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center py-3">
              <div className="text-indigo-500 mr-3">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-medium text-gray-800">{timeAgo(wallet.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">{wallet.type === 'user' ? 'User Information' : wallet.type === 'group' ? 'Group Information' : 'System Information'}</h2>

          {wallet.type === 'user' ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 mr-4">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">User</p>
                  <p className="text-sm text-gray-500">ID: {wallet.user_uuid.substring(0, 8)}...</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">User ID</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-medium text-gray-600 truncate max-w-[200px]">{wallet.user_uuid}</p>
                  <button
                    onClick={() => copyToClipboard(wallet.user_uuid)}
                    className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-500 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : wallet.type === 'group' ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Group</p>
                  <p className="text-sm text-gray-500">ID: {wallet.group_uuid.substring(0, 8)}...</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Group ID</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-medium text-gray-600 truncate max-w-[200px]">{wallet.group_uuid}</p>
                  <button
                    onClick={() => copyToClipboard(wallet.group_uuid)}
                    className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-500 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 mr-4">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">System Wallet</p>
                  <p className="text-sm text-gray-500">
                    {wallet.systemWalletType || 'General System Wallet'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">System Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium capitalize">{wallet.systemWalletType || 'General'}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Security Level</p>
                    <p className="font-medium">High</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletDetail

