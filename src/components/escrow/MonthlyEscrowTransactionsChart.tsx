import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyEscrowTransactionsChart = ({
    escrowData,
    formatNumber
}) => {
  const mappedData = escrowData.map((item) => ({
    name: item.monthName,
    pendingFunding: Number(item.statuses.PENDING_FUNDING),
    funded: Number(item.statuses.FUNDED),
    partiallyReleased: Number(item.statuses.PARTIALLY_RELEASED),
    released: Number(item.statuses.RELEASED),
    disputed: Number(item.statuses.DISPUTED),
    cancelled: Number(item.statuses.CANCELLED),
  }));


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={mappedData}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => formatNumber(value)}
          labelFormatter={(label) => `Period: ${label}`}
        />
        <Legend />

        <Bar dataKey="pendingFunding" fill="#facc15" radius={[4, 4, 0, 0]} />
        <Bar dataKey="funded" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="partiallyReleased" fill="#a855f7" radius={[4, 4, 0, 0]} />
        <Bar dataKey="released" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="disputed" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cancelled" fill="#6b7280" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyEscrowTransactionsChart
