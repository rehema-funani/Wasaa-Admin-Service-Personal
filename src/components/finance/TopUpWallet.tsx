import { AlertTriangle, Smartphone, CreditCard, Wallet } from 'lucide-react'
import React, { useState } from 'react'

const TopUpWallet = ({
  selectedWallet,
  setIsModalOpen,
  formatCurrency
}) => {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('MOBILE')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (paymentMethod === 'MOBILE' && !phone) {
      setError('Please enter a phone number')
      return
    }

    setIsSubmitting(true)
    setError('')

    const payload = {
      userWalletId: selectedWallet.id,
      amount: parseFloat(amount),
      paymentMethodUuid: paymentMethod === 'MOBILE' ? '2' : '1',
      transferType: paymentMethod,
      phone: phone.startsWith('254') ? phone : `254${phone.replace(/^0+/, '')}`
    }

    try {
      console.log('Submitting top-up request:', payload)
      // await api.topUpWallet(payload)

      setTimeout(() => {
        setIsSubmitting(false)
        setIsModalOpen(false)
      }, 1500)
    } catch (err) {
      setError('Failed to process top-up request')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <div className="rounded-lg bg-gradient-to-br from-primary-500/10 to-primary-600/20 p-4 border border-white/20">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 uppercase tracking-wider">Current Balance</span>
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 font-finance tracking-tight">
            {formatCurrency(selectedWallet.balance)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/10 rounded-md border border-white/10">
            <Wallet size={14} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Wallet ID</span>
            <p className="text-xs font-mono text-neutral-700 dark:text-neutral-200">
              {selectedWallet.id.substring(0, 12)}...
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Amount to Top Up
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
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('MOBILE')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-xs transition-all ${paymentMethod === 'MOBILE'
                  ? 'bg-primary-50/80 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800/40 text-primary-700 dark:text-primary-300'
                  : 'bg-white/20 dark:bg-dark-input/20 border-neutral-200/70 dark:border-neutral-700/30 text-neutral-600 dark:text-neutral-400 hover:bg-white/30 dark:hover:bg-dark-input/30'
                }`}
            >
              <Smartphone size={14} />
              <span>Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('CARD')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-xs transition-all ${paymentMethod === 'CARD'
                  ? 'bg-primary-50/80 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800/40 text-primary-700 dark:text-primary-300'
                  : 'bg-white/20 dark:bg-dark-input/20 border-neutral-200/70 dark:border-neutral-700/30 text-neutral-600 dark:text-neutral-400 hover:bg-white/30 dark:hover:bg-dark-input/30'
                }`}
            >
              <CreditCard size={14} />
              <span>Card</span>
            </button>
          </div>
        </div>

        {/* Phone Number */}
        {paymentMethod === 'MOBILE' && (
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="254XXXXXXXXX"
              className="px-3 py-2.5 w-full bg-white/10 dark:bg-dark-input/40 border border-neutral-200/70 dark:border-neutral-700/30 rounded-md focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 text-sm text-neutral-700 dark:text-neutral-200 transition-all"
            />
            <p className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
              Enter your phone number in international format (254...)
            </p>
          </div>
        )}
      </div>

      {/* Warning Box */}
      <div className="bg-warning-50/70 dark:bg-warning-900/20 border-l-2 border-warning-400 dark:border-warning-600 p-2.5 rounded-md">
        <div className="flex items-start">
          <AlertTriangle className="h-3.5 w-3.5 text-warning-500 dark:text-warning-400 mt-0.5 flex-shrink-0" />
          <p className="ml-2 text-[10px] leading-tight text-warning-700 dark:text-warning-300">
            Top-ups to system wallets require approval from a financial administrator and are subject to audit.
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
            "Submit Request"
          )}
        </button>
      </div>
    </div>
  )
}

export default TopUpWallet
