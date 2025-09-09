import React from 'react'

const PaymentMethodPerformance = ({
    paymentMethodStats,
    formatCurrency,
    formatNumber,
}) => {
  return (
    <div className="space-y-4">
      {paymentMethodStats.map((method: any) => {
        return (
          <div
            key={method.paymentMethod}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                <span className="w-5 h-5 text-gray-600 dark:text-gray-300">
                  💳
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {method.paymentMethod}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatNumber(method.count)} transactions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(Number(method.volume))}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Volume
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    method.successRate > 97
                      ? "text-green-600 dark:text-green-400"
                      : method.successRate > 95
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {method.successRate}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Success
                </p>
              </div>
              <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    method.successRate > 97
                      ? "bg-green-500"
                      : method.successRate > 95
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${method.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PaymentMethodPerformance
