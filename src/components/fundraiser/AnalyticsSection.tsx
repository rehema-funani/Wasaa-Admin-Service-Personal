import { motion } from "framer-motion";
import { BarChart2, PieChart, LineChart, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

const AnalyticsSection = ({
  performanceMetrics,
  donationAnalytics,
  campaignAnalytics,
  analyticsLoading,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Performance Metrics Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-medium text-slate-900 dark:text-white">
            Performance Overview
          </h3>
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BarChart2 size={16} />
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex justify-center p-4">
            <Loader size={20} className="text-primary-500 animate-spin" />
          </div>
        ) : performanceMetrics ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                  System Uptime
                </p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  {performanceMetrics.systemHealth?.uptime || "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                  Active Campaigns
                </p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  {performanceMetrics.platformMetrics?.activeCampaigns || 0}
                  <span className="text-xs text-slate-500 dark:text-gray-400 ml-1">
                    /{performanceMetrics.platformMetrics?.totalCampaigns || 0}
                  </span>
                </p>
              </div>
            </div>

            {/* System Health Metrics Chart */}
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                System Performance
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Response",
                        value:
                          performanceMetrics.systemHealth?.responseTime || 0,
                        fill: "#8884d8",
                      },
                      {
                        name: "Error Rate",
                        value:
                          parseFloat(
                            performanceMetrics.systemHealth?.errorRate || 0
                          ) * 100,
                        fill: "#ff8042",
                      },
                      {
                        name: "Throughput",
                        value:
                          (performanceMetrics.systemHealth?.throughput || 0) /
                          10, // Scaled for visualization
                        fill: "#82ca9d",
                      },
                    ]}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Response")
                          return [`${value} ms`, "Response Time"];
                        if (name === "Error Rate")
                          return [`${(Number(value) / 100).toFixed(2)}%`, "Error Rate"];
                        if (name === "Throughput")
                          return [`${Number(value) * 10}/min`, "Throughput"];
                        return [value, name];
                      }}
                    />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Monthly Active Users
                </span>
                <span className="text-md font-medium text-slate-900 dark:text-white">
                  {performanceMetrics.platformMetrics?.monthlyActiveUsers || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Total Revenue
                </span>
                <span className="text-md font-medium text-slate-900 dark:text-white">
                  Kes{" "}
                  {typeof performanceMetrics.financialMetrics?.totalRevenue ===
                  "number"
                    ? performanceMetrics.financialMetrics.totalRevenue.toLocaleString()
                    : "N/A"}
                </span>
              </div>

              {performanceMetrics.financialMetrics?.platformFee !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    Platform Fee
                  </span>
                  <span className="text-md font-medium text-slate-900 dark:text-white">
                    Kes{" "}
                    {typeof performanceMetrics.financialMetrics?.platformFee ===
                    "number"
                      ? performanceMetrics.financialMetrics.platformFee.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              )}

              {performanceMetrics.financialMetrics?.netRevenue !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    Net Revenue
                  </span>
                  <span className="text-md font-medium text-slate-900 dark:text-white">
                    Kes{" "}
                    {typeof performanceMetrics.financialMetrics?.netRevenue ===
                    "number"
                      ? performanceMetrics.financialMetrics.netRevenue.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-4 text-slate-500 dark:text-gray-400">
            No performance data available
          </div>
        )}
      </div>

      {/* Donation Trends Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-medium text-slate-900 dark:text-white">
            Donation Trends
          </h3>
          <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <LineChart size={16} />
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex justify-center p-4">
            <Loader size={20} className="text-primary-500 animate-spin" />
          </div>
        ) : donationAnalytics ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-gray-400">
                Total Donations
              </span>
              <span className="text-md font-medium text-slate-900 dark:text-white">
                {donationAnalytics.totalDonations?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-gray-400">
                Growth Rate
              </span>
              <span
                className={`text-md font-medium ${
                  donationAnalytics.growthRate > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {donationAnalytics.growthRate > 0 ? "+" : ""}
                {donationAnalytics.growthRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-gray-400">
                Peak Day
              </span>
              <span className="text-md font-medium text-slate-900 dark:text-white">
                {donationAnalytics.peakDonationDay}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-slate-500 dark:text-gray-400">
            No donation analytics available
          </div>
        )}

        <button
          className="w-full mt-4 py-2 text-xs text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
          onClick={() => navigate("/admin/fundraising/analytics/donations")}
        >
          View Donation Analytics
        </button>
      </div>

      {/* Campaign Insights Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-medium text-slate-900 dark:text-white">
            Campaign Insights
          </h3>
          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <PieChart size={16} />
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex justify-center p-4">
            <Loader size={20} className="text-primary-500 animate-spin" />
          </div>
        ) : campaignAnalytics ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                  Total Donations
                </p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  Kes {campaignAnalytics.totalDonations.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                  Total Donors
                </p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  {campaignAnalytics.donationsCount.toLocaleString()}
                  {campaignAnalytics.recentTrend.direction !== "stable" && (
                    <span
                      className={`ml-1 text-xs ${
                        campaignAnalytics.recentTrend.direction === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      (
                      {campaignAnalytics.recentTrend.direction === "up"
                        ? "+"
                        : "-"}
                      {campaignAnalytics.recentTrend.percentage}%)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Daily Donations Chart */}
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                Daily Donation Trends
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart
                    data={campaignAnalytics.dailyStats}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value) => [`${value} donors`, "Donors"]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return format(date, "MMM d, yyyy");
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="donorsCount"
                      name="Donors"
                      stroke="#8884d8"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </RechartLineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Average Donation
                </span>
                <span className="text-md font-medium text-slate-900 dark:text-white">
                  {campaignAnalytics.averageDonation
                    ? `Kes ${Number(
                        campaignAnalytics.averageDonation
                      ).toLocaleString()}`
                    : "Not available"}
                </span>
              </div>

              {campaignAnalytics.completionPercentage !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <span className="text-md font-medium text-slate-900 dark:text-white">
                    {campaignAnalytics.completionPercentage}%
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Period
                </span>
                <span className="text-md font-medium text-slate-900 dark:text-white capitalize">
                  {campaignAnalytics.period}
                </span>
              </div>
            </div>

            {/* Top Donors Section */}
            {campaignAnalytics.topDonors &&
              campaignAnalytics.topDonors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                    Top Donors
                  </p>
                  {campaignAnalytics.topDonors.map((donor, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="text-xs text-slate-600 dark:text-gray-400">
                        {donor.anonymous ? "Anonymous Donor" : donor.userId}
                      </span>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">
                        Kes {donor.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </>
        ) : (
          <div className="text-center p-4 text-slate-500 dark:text-gray-400">
            No campaign analytics available
          </div>
        )}

        <button
          className="w-full mt-4 py-2 text-xs text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
          onClick={() => navigate("/admin/fundraising/analytics/campaigns")}
        >
          View Campaign Analytics
        </button>
      </div>
    </motion.div>
  );
};

export default AnalyticsSection;