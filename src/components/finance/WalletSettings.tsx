import { AlertTriangle } from 'lucide-react'
import React from 'react'

const WalletSettings = ({
    selectedWallet,
    setIsModalOpen
}) => {
  return (
      <div className="space-y-5 p-1">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Wallet Name</label>
                  <input
                      type="text"
                      defaultValue={selectedWallet.name}
                      className="pl-3 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Wallet Status</label>
                  <select
                      className="w-full pl-3 pr-10 py-2 bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                      defaultValue={selectedWallet.status}
                  >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                  <textarea
                      defaultValue={selectedWallet.description}
                      rows={3}
                      className="pl-3 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Low Balance Alert</label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500 dark:text-neutral-400 sm:text-sm">KES</span>
                          </div>
                          <input
                              type="number"
                              defaultValue={100000}
                              className="pl-12 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">High Balance Alert</label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500 dark:text-neutral-400 sm:text-sm">KES</span>
                          </div>
                          <input
                              type="number"
                              defaultValue={10000000}
                              className="pl-12 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200"
                          />
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-neutral-50 dark:bg-dark-active p-4 rounded-lg border border-neutral-200 dark:border-dark-border">
              <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-3">Notification Settings</h3>

              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                      <label className="text-sm text-neutral-700 dark:text-neutral-300">Daily Balance Report</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle-daily" defaultChecked className="sr-only toggle-checkbox" />
                          <label htmlFor="toggle-daily" className="block h-6 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
                      </div>
                  </div>

                  <div className="flex items-center justify-between">
                      <label className="text-sm text-neutral-700 dark:text-neutral-300">Large Transaction Alerts</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle-large" defaultChecked className="sr-only toggle-checkbox" />
                          <label htmlFor="toggle-large" className="block h-6 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
                      </div>
                  </div>

                  <div className="flex items-center justify-between">
                      <label className="text-sm text-neutral-700 dark:text-neutral-300">Weekly Summary</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle-weekly" className="sr-only toggle-checkbox" />
                          <label htmlFor="toggle-weekly" className="block h-6 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
                      </div>
                  </div>

                  <div className="flex items-center justify-between">
                      <label className="text-sm text-neutral-700 dark:text-neutral-300">Error Notifications</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle-error" defaultChecked className="sr-only toggle-checkbox" />
                          <label htmlFor="toggle-error" className="block h-6 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-danger-50 dark:bg-danger-900/20 border-l-4 border-danger-500 dark:border-danger-700 p-3 rounded-md">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-danger-400 dark:text-danger-500" />
                  </div>
                  <div className="ml-3">
                      <h3 className="text-sm font-medium text-danger-800 dark:text-danger-400">Danger Zone</h3>
                      <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-danger-700 dark:text-danger-400">
                              System wallets can be deactivated but not deleted.
                          </p>
                          <button className="px-3 py-1 text-xs font-medium text-white bg-danger-600 dark:bg-danger-700 rounded-lg hover:bg-danger-700 dark:hover:bg-danger-600">
                              Deactivate
                          </button>
                      </div>
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
                  Save Changes
              </button>
          </div>
      </div>
  )
}

export default WalletSettings
