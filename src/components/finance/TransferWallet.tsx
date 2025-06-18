import { AlertTriangle, Wallet, ArrowRightLeft } from 'lucide-react'
import React, { useState } from 'react'

const TransferWallet = ({
  selectedWallet,
  setIsModalOpen,
  systemWallets,
  formatCurrency
}) => {
  const [amount, setAmount] = useState('')
  const [receiverWalletId, setReceiverWalletId] = useState('')
  const [transferReason, setTransferReason] = useState('settlement')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!receiverWalletId) {
      setError('Please select a destination wallet')
      return
    }

    if (parseFloat(amount) > selectedWallet.balance) {
      setError('Transfer amount exceeds available balance')
      return
    }

    setIsSubmitting(true)
    setError('')

    // Prepare payload based on requirements
    const payload = {
      senderWalletId: selectedWallet.id,
      receiverWalletId: receiverWalletId,
      amount: parseFloat(amount)
    }

    try {
      // Mock API call - replace with your actual API
      console.log('Submitting transfer request:', payload)
      // await api.transferBetweenWallets(payload)

      // Simulate success
      setTimeout(() => {
        setIsSubmitting(false)
        setIsModalOpen(false)
        // You'd typically refresh wallet data or show a success notification here
      }, 1500)
    } catch (err) {
      setError('Failed to process transfer request')
      setIsSubmitting(false)
    }
  }

  // Get destination wallet name for display
  const getDestinationWalletName = (id) => {
    const wallet = systemWallets.find(w => w.id === id)
    return wallet ? wallet.name : 'Selected Wallet'
  }

  return (
    <div className="space-y-5 p-1">
      {/* Balance Card with Glassmorphism */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/20 backdrop-blur-sm p-5 border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-primary-400/10 backdrop-blur-[2px]"></div>
        <div className="absolute -top-24 -right-24 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl"></div>

        <div className="relative flex justify-between items-center">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Available Balance</h3>
          <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance tracking-tight">
            {formatCurrency(selectedWallet.balance)}
          </span>
        </div>

        <div className="relative mt-4 flex items-center space-x-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
            <Wallet size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Source Wallet</span>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {selectedWallet.name}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <div className="group">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Transfer Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="text-neutral-500 dark:text-neutral-400 sm:text-sm">KES</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pl-12 pr-3 py-3 w-full bg-white/10 dark:bg-dark-input/40 backdrop-blur-md border border-neutral-200/70 dark:border-neutral-700/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 focus:border-primary-500/50 dark:focus:border-primary-500/50 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-200"
            />
            {amount && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-primary-600 dark:text-primary-400">
                {parseFloat(amount) > 0 && `${Math.round((parseFloat(amount) / selectedWallet.balance) * 100)}% of balance`}
              </div>
            )}
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Destination Wallet
          </label>
          <select
            value={receiverWalletId}
            onChange={(e) => setReceiverWalletId(e.target.value)}
            className="w-full pl-3.5 pr-10 py-3 bg-white/10 dark:bg-dark-input/40 backdrop-blur-md border border-neutral-200/70 dark:border-neutral-700/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 focus:border-primary-500/50 dark:focus:border-primary-500/50 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-200"
          >
            <option value="">Select destination wallet</option>
            {systemWallets.filter(w => w.id !== selectedWallet.id).map(wallet => (
              <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
            ))}
            <option value="main">Main Operating Account</option>
          </select>
        </div>

        {receiverWalletId && (
          <div className="relative overflow-hidden rounded-lg bg-primary-50/50 dark:bg-primary-900/20 p-3 border border-primary-100/70 dark:border-primary-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 dark:bg-dark-elevated/30 backdrop-blur-sm rounded-lg flex-shrink-0 border border-white/10">
                <ArrowRightLeft size={16} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <span className="text-xs text-primary-600/70 dark:text-primary-400/70">Transfer Summary</span>
                <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {selectedWallet.name} → {getDestinationWalletName(receiverWalletId)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="group">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Transfer Reason
          </label>
          <select
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            className="w-full pl-3.5 pr-10 py-3 mb-3 bg-white/10 dark:bg-dark-input/40 backdrop-blur-md border border-neutral-200/70 dark:border-neutral-700/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 focus:border-primary-500/50 dark:focus:border-primary-500/50 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-200"
          >
            <option value="settlement">Settlement</option>
            <option value="rebalancing">Wallet Rebalancing</option>
            <option value="correction">Error Correction</option>
            <option value="other">Other (Specify)</option>
          </select>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes"
            className="pl-3.5 pr-3 py-3 w-full bg-white/10 dark:bg-dark-input/40 backdrop-blur-md border border-neutral-200/70 dark:border-neutral-700/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 focus:border-primary-500/50 dark:focus:border-primary-500/50 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Warning Message */}
      <div className="relative overflow-hidden bg-warning-50/70 dark:bg-warning-900/20 border-l-4 border-warning-400 dark:border-warning-600 p-4 rounded-xl mt-5">
        <div className="absolute inset-0 bg-warning-500/5 backdrop-blur-[1px]"></div>
        <div className="relative flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning-500 dark:text-warning-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-warning-700 dark:text-warning-300">
              Transfers between system wallets are recorded in the audit log and may require approval based on the amount.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50/70 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200/70 dark:border-neutral-700/30">
        <button
          onClick={() => setIsModalOpen(false)}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white/50 dark:bg-dark-active/50 backdrop-blur-sm border border-neutral-200/70 dark:border-neutral-700/30 rounded-xl hover:bg-white/70 dark:hover:bg-dark-hover/70 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="relative px-5 py-2.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 border border-primary-500/70 dark:border-primary-600/70 rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 shadow-lg shadow-primary-600/20 dark:shadow-primary-700/30 transition-all duration-200 disabled:opacity-70 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 via-primary-400/30 to-primary-400/0 group-hover:via-primary-400/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out"></div>
          <div className="relative flex items-center justify-center">
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Initiate Transfer"
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

export default TransferWallet
