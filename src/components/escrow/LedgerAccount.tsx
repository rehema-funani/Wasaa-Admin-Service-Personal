import { Activity, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react'

const LedgerAccount = ({
    escrow,
    formatCurrency,
    formatDate,

}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {escrow.ledgerAccounts && escrow.ledgerAccounts.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Database className="w-5 h-5 mr-2 text-primary-500" />
              Ledger Accounts ({escrow.ledgerAccounts.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {escrow.ledgerAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-800 dark:text-gray-100">
                    Account #{index + 1}
                  </h5>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      account.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {account.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Account ID
                      </label>
                      <p className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-gray-600 mt-1">
                        {account.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Owner Type
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        {account.ownerType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Owner ID
                      </label>
                      <p className="font-mono text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {account.ownerId?.slice(0, 8)}...
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Account Kind
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        {account.kind || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Currency
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        {account.currency || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Current Balance
                      </label>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
                        {formatCurrency(
                          account.balance || 0,
                          account.currency || "KES"
                        )}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Total Debit
                        </label>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                          {formatCurrency(
                            account.debit || 0,
                            account.currency || "KES"
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Total Credit
                        </label>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                          {formatCurrency(
                            account.credit || 0,
                            account.currency || "KES"
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Created
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        {formatDate(account.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Escrow Agreement
                      </label>
                      <p className="font-mono text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {account.escrowAgreementId?.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Summary */}
                <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-800/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Net Position:
                    </span>
                    <span
                      className={`font-medium ${
                        (account.credit || 0) - (account.debit || 0) >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(
                        (account.credit || 0) - (account.debit || 0),
                        account.currency || "KES"
                      )}
                    </span>
                  </div>
                </div>

                {/* Entries & Transactions Section */}
                {account.entries && account.entries.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h6 className="font-medium text-gray-800 dark:text-gray-100 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-primary-500" />
                        Transaction History ({account.entries.length})
                      </h6>
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-4">
                      {account.entries.map((entry, entryIndex) => (
                        <motion.div
                          key={entry.id}
                          className="bg-white/70 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: entryIndex * 0.05,
                          }}
                        >
                          {/* Entry Header */}
                          <div
                            className={`p-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 ${
                              entry.direction === "DEBIT"
                                ? "bg-red-50/70 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800/30"
                                : "bg-green-50/70 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  entry.direction === "DEBIT"
                                    ? "bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400"
                                    : "bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400"
                                }`}
                              >
                                {entry.direction === "DEBIT" ? "-" : "+"}
                              </div>
                              <div>
                                <h6 className="font-medium text-gray-800 dark:text-gray-100">
                                  {entry.transaction?.txnType ||
                                    entry.direction}{" "}
                                  Transaction
                                </h6>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(entry.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-lg font-bold ${
                                  entry.direction === "DEBIT"
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {entry.direction === "DEBIT" ? "-" : "+"}
                                {formatCurrency(
                                  entry.amountMinor || 0,
                                  account.currency || "KES"
                                )}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Balance:{" "}
                                {formatCurrency(
                                  entry.balance || 0,
                                  account.currency || "KES"
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Entry Details */}
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">
                                  Entry ID
                                </label>
                                <p className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-700 p-1.5 rounded border border-gray-200 dark:border-gray-600 mt-1">
                                  {entry.id}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">
                                  Transaction ID
                                </label>
                                <p className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-700 p-1.5 rounded border border-gray-200 dark:border-gray-600 mt-1">
                                  {entry.txnId}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">
                                  Direction
                                </label>
                                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      entry.direction === "DEBIT"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    }`}
                                  >
                                    {entry.direction}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Transaction Details */}
                            {entry.transaction && (
                              <div className="space-y-3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-3 md:pt-0 md:pl-4">
                                <div>
                                  <label className="text-xs text-gray-500 dark:text-gray-400">
                                    Transaction Type
                                  </label>
                                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                    {entry.transaction.txnType}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 dark:text-gray-400">
                                    Reference
                                  </label>
                                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                    {entry.transaction.reference || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 dark:text-gray-400">
                                    Memo
                                  </label>
                                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                    {entry.transaction.memo || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 dark:text-gray-400">
                                    Transaction Date
                                  </label>
                                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                    {formatDate(entry.transaction.createdAt)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Transaction Amount Summary */}
                          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                Account:
                              </span>{" "}
                              <span className="font-mono text-gray-700 dark:text-gray-300">
                                {entry.accountId.slice(0, 8)}...
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  Debit:
                                </span>{" "}
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                  {formatCurrency(
                                    entry.debit || 0,
                                    account.currency || "KES"
                                  )}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  Credit:
                                </span>{" "}
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {formatCurrency(
                                    entry.credit || 0,
                                    account.currency || "KES"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
            <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-4">
              Accounts Summary
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {escrow.ledgerAccounts.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Accounts
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    escrow.ledgerAccounts.filter(
                      (acc) => acc.status === "ACTIVE"
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Accounts
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {formatCurrency(
                    escrow.ledgerAccounts.reduce(
                      (sum, acc) => sum + (acc.balance || 0),
                      0
                    ),
                    escrow.currency || "KES"
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Balance
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30">
            <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-500" />
              Transaction Summary
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800/30">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(
                    escrow.ledgerAccounts.reduce(
                      (sum, acc) => sum + (acc.credit || 0),
                      0
                    ),
                    escrow.currency || "KES"
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Credits
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-800/30">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(
                    escrow.ledgerAccounts.reduce(
                      (sum, acc) => sum + (acc.debit || 0),
                      0
                    ),
                    escrow.currency || "KES"
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Debits
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {escrow.ledgerAccounts.reduce(
                    (sum, acc) => sum + (acc.entries?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Ledger Accounts
          </h5>
          <p className="text-gray-500 dark:text-gray-400">
            No ledger account information available for this escrow
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default LedgerAccount
