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
    <div className="space-y-4">
      {/* Balance Card */}
      <div className="rounded-md bg-gradient-to-br from-primary-500/10 to-primary-600/20 p-4 border border-white/20">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 uppercase tracking-wider">Available Balance</span>
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 font-finance tracking-tight">
            {formatCurrency(selectedWallet.balance)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/10 rounded-md border border-white/10">
            <Wallet size={14} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Source Wallet</span>
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
              {selectedWallet.name}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Transfer Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-500 dark:text-neutral-400 text-xs">KES</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pl-10 pr-3 py-2.5 w-full bg-white/10 dark:bg-dark-input/40 border border-neutral-200/70 dark:border-neutral-700/30 rounded-md focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 text-sm text-neutral-700 dark:text-neutral-200 transition-all"
            />
            {amount && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] font-medium text-primary-600 dark:text-primary-400">
                {parseFloat(amount) > 0 && `${Math.round((parseFloat(amount) / selectedWallet.balance) * 100)}% of balance`}
              </div>
            )}
          </div>
        </div>

        {/* Destination Wallet */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Destination Wallet
          </label>
          <select
            value={receiverWalletId}
            onChange={(e) => setReceiverWalletId(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/10 dark:bg-dark-input/40 border border-neutral-200/70 dark:border-neutral-700/30 rounded-md focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 text-sm text-neutral-700 dark:text-neutral-200 transition-all"
          >
            <option value="">Select destination wallet</option>
            {systemWallets.filter(w => w.id !== selectedWallet.id).map(wallet => (
              <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
            ))}
            <option value="main">Main Operating Account</option>
          </select>
        </div>

        {/* Transfer Summary */}
        {receiverWalletId && (
          <div className="rounded-md bg-primary-50/50 dark:bg-primary-900/20 p-2.5 border border-primary-100/70 dark:border-primary-800/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 dark:bg-dark-elevated/30 rounded-md flex-shrink-0 border border-white/10">
                <ArrowRightLeft size={12} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <span className="text-[10px] text-primary-600/70 dark:text-primary-400/70 block">Transfer Summary</span>
                <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                  {selectedWallet.name} → {getDestinationWalletName(receiverWalletId)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Reason */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Transfer Reason
          </label>
          <select
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            className="w-full px-3 py-2.5 mb-2 bg-white/10 dark:bg-dark-input/40 border border-neutral-200/70 dark:border-neutral-700/30 rounded-md focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 text-sm text-neutral-700 dark:text-neutral-200 transition-all"
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
            className="px-3 py-2.5 w-full bg-white/10 dark:bg-dark-input/40 border border-neutral-200/70 dark:border-neutral-700/30 rounded-md focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 text-sm text-neutral-700 dark:text-neutral-200 transition-all"
          />
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-warning-50/70 dark:bg-warning-900/20 border-l-2 border-warning-400 dark:border-warning-600 p-2.5 rounded-md">
        <div className="flex items-start">
          <AlertTriangle className="h-3.5 w-3.5 text-warning-500 dark:text-warning-400 mt-0.5 flex-shrink-0" />
          <p className="ml-2 text-[10px] leading-tight text-warning-700 dark:text-warning-300">
            Transfers between system wallets are recorded in the audit log and may require approval based on the amount.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50/70 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-2 rounded-md text-xs">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-3 mt-2 border-t border-neutral-200/70 dark:border-neutral-700/30">
        <button
          onClick={() => setIsModalOpen(false)}
          disabled={isSubmitting}
          className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white/50 dark:bg-dark-active/50 border border-neutral-200/70 dark:border-neutral-700/30 rounded-md hover:bg-white/70 dark:hover:bg-dark-hover/70 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-primary-600 dark:bg-primary-700 border border-primary-500/70 dark:border-primary-600/70 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Transfer"
          )}
        </button>
      </div>
    </div>
  )
}

export default TransferWallet
