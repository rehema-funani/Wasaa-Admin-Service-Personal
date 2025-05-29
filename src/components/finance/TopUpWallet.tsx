import { AlertTriangle } from 'lucide-react'
import React from 'react'

const TopUpWallet = ({
    selectedWallet,
    setIsModalOpen,
    formatCurrency
}) => {
  return (
      <div className="space-y-4 p-1">
          <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-lg mb-4 border border-primary-100 dark:border-primary-800/30">
              <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Current Balance</h3>
                  <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 font-finance">{formatCurrency(selectedWallet.balance)}</span>
              </div>
          </div>

          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Amount to Top Up</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-neutral-500 dark:text-neutral-400 sm:text-sm">KES</span>
                      </div>
                      <input
                          type="number"
                          placeholder="0.00"
                          className="pl-12 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Source Account</label>
                  <select className="w-full pl-3 pr-10 py-2 bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200">
                      <option value="main">Main Operating Account</option>
                      <option value="reserve">Reserve Account</option>
                      <option value="capital">Capital Account</option>
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reference Note</label>
                  <input
                      type="text"
                      placeholder="E.g., Monthly top-up"
                      className="pl-3 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                  />
              </div>
          </div>

          <div className="bg-warning-50 dark:bg-warning-900/20 border-l-4 border-warning-400 dark:border-warning-600 p-3 rounded-md mt-4">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-warning-400 dark:text-warning-500" />
                  </div>
                  <div className="ml-3">
                      <p className="text-sm text-warning-700 dark:text-warning-400">
                          Top-ups to system wallets require approval from a financial administrator and are subject to audit.
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200 dark:border-dark-border">
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-dark-active border border-neutral-300 dark:border-dark-border rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-hover"
              >
                  Cancel
              </button>
              <button
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 border border-transparent rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 shadow-button dark:shadow-dark-glow"
              >
                  Submit Top-up Request
              </button>
          </div>
      </div>
  )
}

export default TopUpWallet
