import { AlertTriangle } from 'lucide-react'

const WalletSettings = ({
  selectedWallet,
  setIsModalOpen
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Wallet Name</label>
          <input
            type="text"
            defaultValue={selectedWallet.name}
            className="px-2.5 py-2 w-full bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs text-neutral-700 dark:text-neutral-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Wallet Status</label>
          <select
            className="w-full px-2.5 py-2 bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs text-neutral-700 dark:text-neutral-200"
            defaultValue={selectedWallet.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
          <textarea
            defaultValue={selectedWallet.description}
            rows={2}
            className="px-2.5 py-2 w-full bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs text-neutral-700 dark:text-neutral-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Low Balance Alert</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">KES</span>
              </div>
              <input
                type="number"
                defaultValue={100000}
                className="pl-10 pr-2.5 py-2 w-full bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs text-neutral-700 dark:text-neutral-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">High Balance Alert</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">KES</span>
              </div>
              <input
                type="number"
                defaultValue={10000000}
                className="pl-10 pr-2.5 py-2 w-full bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs text-neutral-700 dark:text-neutral-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-dark-active p-3 rounded-md border border-neutral-200 dark:border-dark-border">
        <h3 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-2.5">Notification Settings</h3>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-neutral-700 dark:text-neutral-300">Daily Balance Report</label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle-daily" defaultChecked className="sr-only toggle-checkbox" />
              <label htmlFor="toggle-daily" className="block h-4 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-neutral-700 dark:text-neutral-300">Large Transaction Alerts</label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle-large" defaultChecked className="sr-only toggle-checkbox" />
              <label htmlFor="toggle-large" className="block h-4 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-neutral-700 dark:text-neutral-300">Weekly Summary</label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle-weekly" className="sr-only toggle-checkbox" />
              <label htmlFor="toggle-weekly" className="block h-4 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs text-neutral-700 dark:text-neutral-300">Error Notifications</label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input type="checkbox" name="toggle" id="toggle-error" defaultChecked className="sr-only toggle-checkbox" />
              <label htmlFor="toggle-error" className="block h-4 rounded-full bg-neutral-300 dark:bg-dark-border cursor-pointer toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-danger-50 dark:bg-danger-900/20 border-l-2 border-danger-500 dark:border-danger-700 p-2.5 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-danger-400 dark:text-danger-500" />
          </div>
          <div className="ml-2.5">
            <h3 className="text-xs font-medium text-danger-800 dark:text-danger-400">Danger Zone</h3>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-[10px] text-danger-700 dark:text-danger-400">
                System wallets can be deactivated but not deleted.
              </p>
              <button className="px-2 py-1 text-[10px] font-medium text-white bg-danger-600 dark:bg-danger-700 rounded-md hover:bg-danger-700 dark:hover:bg-danger-600">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 mt-2 border-t border-neutral-200 dark:border-dark-border">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-dark-active border border-neutral-200 dark:border-dark-border rounded-md hover:bg-neutral-50 dark:hover:bg-dark-hover"
        >
          Cancel
        </button>
        <button
          className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 dark:bg-primary-700 border border-transparent rounded-md hover:bg-primary-700 dark:hover:bg-primary-600"
        >
          Save
        </button>
      </div>

      <style>{`
            .toggle-checkbox:checked + .toggle-label {
              background-color: #4f46e5;
            }
            .toggle-checkbox:checked + .toggle-label:before {
              transform: translateX(100%);
            }
            .toggle-label {
              transition: background-color 0.2s ease;
              position: relative;
            }
            .toggle-label:before {
              position: absolute;
              content: "";
              height: 1rem;
              width: 1rem;
              left: 0.125rem;
              bottom: 0.125rem;
              top: 0.125rem;
              background-color: white;
              border-radius: 9999px;
              transition: transform 0.2s ease;
            }
          `}</style>
    </div>
  )
}

export default WalletSettings
