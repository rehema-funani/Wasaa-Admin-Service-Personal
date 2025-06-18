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

    // Prepare payload based on requirements
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

      // Simulate success
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
    <div className="space-y-5 p-1">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/20 backdrop-blur-sm p-5 border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-primary-400/10 backdrop-blur-[2px]"></div>
        <div className="absolute -top-24 -right-24 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl"></div>

        <div className="relative flex justify-between items-center">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Current Balance</h3>
          <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance tracking-tight">
            {formatCurrency(selectedWallet.balance)}
          </span>
        </div>

        <div className="relative mt-4 flex items-center space-x-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
            <Wallet size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Wallet ID</span>
            <p className="text-sm font-mono text-neutral-700 dark:text-neutral-200">
              {selectedWallet.id.substring(0, 12)}...
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <div className="group">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Amount to Top Up
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
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('MOBILE')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${paymentMethod === 'MOBILE'
                  ? 'bg-primary-50/80 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800/40 text-primary-700 dark:text-primary-300 shadow-md'
                  : 'bg-white/20 dark:bg-dark-input/20 border-neutral-200/70 dark:border-neutral-700/30 text-neutral-600 dark:text-neutral-400 hover:bg-white/30 dark:hover:bg-dark-input/30'
                }`}
            >
              <Smartphone size={18} />
              <span>Mobile Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('CARD')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${paymentMethod === 'CARD'
                  ? 'bg-primary-50/80 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800/40 text-primary-700 dark:text-primary-300 shadow-md'
                  : 'bg-white/20 dark:bg-dark-input/20 border-neutral-200/70 dark:border-neutral-700/30 text-neutral-600 dark:text-neutral-400 hover:bg-white/30 dark:hover:bg-dark-input/30'
                }`}
            >
              <CreditCard size={18} />
              <span>Card</span>
            </button>
          </div>
        </div>

        {paymentMethod === 'MOBILE' && (
          <div className="group">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="254XXXXXXXXX"
              className="pl-3.5 pr-3 py-3 w-full bg-white/10 dark:bg-dark-input/40 backdrop-blur-md border border-neutral-200/70 dark:border-neutral-700/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 focus:border-primary-500/50 dark:focus:border-primary-500/50 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-200"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Enter your phone number in international format (254...)
            </p>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden bg-warning-50/70 dark:bg-warning-900/20 border-l-4 border-warning-400 dark:border-warning-600 p-4 rounded-xl mt-5">
        <div className="absolute inset-0 bg-warning-500/5 backdrop-blur-[1px]"></div>
        <div className="relative flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning-500 dark:text-warning-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-warning-700 dark:text-warning-300">
              Top-ups to system wallets require approval from a financial administrator and are subject to audit.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/70 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

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
              "Submit Top-up Request"
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

export default TopUpWallet
