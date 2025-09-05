import { motion } from "framer-motion";
import {
  BarChart2,
  PieChart,
  LineChart,
  Loader,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Medal,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";

const AnalyticsSection = ({
  performanceMetrics,
  donationAnalytics,
  campaignAnalytics,
  analyticsLoading,
}) => {
  const navigate = useNavigate();

  const formattedDailyStats = campaignAnalytics?.dailyStats
    ? campaignAnalytics.dailyStats.map((day) => ({
        date: day.date,
        donorsCount: day.donorsCount || 0,
        donationsAmount:
          typeof day.donationsAmount === "number" ? day.donationsAmount : 0,
      }))
    : [];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          Analytics Dashboard
        </h2>
        <div className="flex space-x-2">
          <select className="text-sm border border-slate-200 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300">
            <option value="week">This Week</option>
            <option value="month" selected>
              This Month
            </option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            className="text-sm px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center hover:bg-primary-100"
            onClick={() => navigate("/admin/fundraising/analytics")}
          >
            <Activity size={14} className="mr-1" />
            Full Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Overview Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-slate-100 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="border-b border-slate-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
                <BarChart2 size={18} className="mr-2 text-blue-500" />
                System Performance
              </h3>
              {performanceMetrics?.systemHealth?.uptime && (
                <span className="px-2.5 py-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                  Uptime: {performanceMetrics.systemHealth.uptime}
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size={24} className="text-primary-500 animate-spin" />
              </div>
            ) : performanceMetrics ? (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1 flex items-center">
                      <Users size={12} className="mr-1" />
                      Active Users
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {performanceMetrics.platformMetrics
                          ?.monthlyActiveUsers || 0}
                      </p>
                      <div className="text-emerald-500 dark:text-emerald-400 text-xs flex items-center">
                        <ArrowUp size={12} className="mr-0.5" /> 12%
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Active Campaigns
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {performanceMetrics.platformMetrics?.activeCampaigns ||
                          0}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-gray-400">
                        of{" "}
                        {performanceMetrics.platformMetrics?.totalCampaigns ||
                          0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1 flex items-center">
                      <DollarSign size={12} className="mr-1" />
                      Revenue
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {typeof performanceMetrics.financialMetrics
                          ?.totalRevenue === "number"
                          ? `Kes ${Math.round(
                              performanceMetrics.financialMetrics.totalRevenue /
                                1000
                            )}K`
                          : "N/A"}
                      </p>
                      <div className="text-emerald-500 dark:text-emerald-400 text-xs flex items-center">
                        <ArrowUp size={12} className="mr-0.5" /> 8%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="h-64">
                    {performanceMetrics?.systemHealth ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Response Time",
                              value:
                                performanceMetrics.systemHealth?.responseTime ||
                                0,
                              fill: "#8884d8",
                            },
                            {
                              name: "Error Rate",
                              value:
                                parseFloat(
                                  performanceMetrics.systemHealth?.errorRate ||
                                    0
                                ) * 100,
                              fill: "#ff8042",
                            },
                            {
                              name: "Throughput",
                              value:
                                (performanceMetrics.systemHealth?.throughput ||
                                  0) / 10,
                              fill: "#82ca9d",
                            },
                          ]}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip
                            formatter={(value, name) => {
                              if (name === "Response Time")
                                return [`${value} ms`, name];
                              if (name === "Error Rate")
                                return [
                                  `${(Number(value) / 100).toFixed(2)}%`,
                                  name,
                                ];
                              if (name === "Throughput")
                                return [
                                  `${Math.round(Number(value) * 10)}/min`,
                                  name,
                                ];
                              return [value, name];
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 dark:text-gray-400">
                        No system health data available
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-4 h-64 flex items-center justify-center text-slate-500 dark:text-gray-400">
                No performance data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Campaign Insights Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-slate-100 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="border-b border-slate-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
                <PieChart size={18} className="mr-2 text-purple-500" />
                Campaign Insights
              </h3>
              <span className="px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                {campaignAnalytics?.period?.toUpperCase() || "MONTH"}
              </span>
            </div>
          </div>

          <div className="p-4">
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size={24} className="text-primary-500 animate-spin" />
              </div>
            ) : campaignAnalytics ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1 flex items-center">
                      <DollarSign size={12} className="mr-1" />
                      Total Donations
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Kes {Math.round(campaignAnalytics.totalDonations / 1000)}K
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1 flex items-center">
                      <Users size={12} className="mr-1" />
                      Total Donors
                    </div>
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {campaignAnalytics.donationsCount.toLocaleString()}
                      </p>
                      {campaignAnalytics.recentTrend.direction !== "stable" && (
                        <span
                          className={`ml-2 text-xs px-1.5 py-0.5 rounded-full flex items-center ${
                            campaignAnalytics.recentTrend.direction === "up"
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {campaignAnalytics.recentTrend.direction === "up" ? (
                            <ArrowUp size={10} className="mr-0.5" />
                          ) : (
                            <ArrowDown size={10} className="mr-0.5" />
                          )}
                          {campaignAnalytics.recentTrend.percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-800 dark:text-white mb-3">
                    Daily Donor Trends
                  </p>
                  <div className="h-64">
                    {formattedDailyStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={formattedDailyStats}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorDonors"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8884d8"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8884d8"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 10 }}
                            domain={[0, "dataMax + 1"]}
                          />
                          <Tooltip
                            formatter={(value) => [`${value} donors`, "Donors"]}
                            labelFormatter={(label) => {
                              const date = new Date(label);
                              return format(date, "MMM d, yyyy");
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="donorsCount"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorDonors)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 dark:text-gray-400">
                        No daily data available
                      </div>
                    )}
                  </div>
                </div>

                {campaignAnalytics.topDonors &&
                  campaignAnalytics.topDonors.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          Top Donors
                        </p>
                        <span className="text-xs text-primary-600 dark:text-primary-400 cursor-pointer">
                          View All
                        </span>
                      </div>

                      <div className="space-y-2">
                        {campaignAnalytics.topDonors.map((donor, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  index === 0
                                    ? "bg-yellow-100 text-yellow-600"
                                    : index === 1
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-amber-100 text-amber-600"
                                }`}
                              >
                                <Medal size={14} />
                              </div>
                              <span className="text-sm font-medium text-slate-800 dark:text-white">
                                {donor.anonymous
                                  ? "Anonymous Donor"
                                  : donor.userId}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              Kes {donor.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center p-4 h-64 flex items-center justify-center text-slate-500 dark:text-gray-400">
                No campaign analytics available
              </div>
            )}
          </div>
        </motion.div>

        {/* Donation Trends Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-slate-100 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="border-b border-slate-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
                <LineChart size={18} className="mr-2 text-green-500" />
                Donation Trends
              </h3>
              {donationAnalytics?.growthRate !== undefined && (
                <span
                  className={`px-2.5 py-1 text-xs rounded-full flex items-center ${
                    donationAnalytics.growthRate > 0
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  {donationAnalytics.growthRate > 0 ? (
                    <ArrowUp size={10} className="mr-1" />
                  ) : (
                    <ArrowDown size={10} className="mr-1" />
                  )}
                  {Math.abs(donationAnalytics.growthRate)}% Growth
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size={24} className="text-primary-500 animate-spin" />
              </div>
            ) : donationAnalytics ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                      Total Donations
                    </span>
                    <span className="text-xl font-semibold text-slate-900 dark:text-white">
                      {donationAnalytics.totalDonations?.toLocaleString() || 0}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                      Across all campaigns
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                      Peak Donation Day
                    </span>
                    <span className="text-xl font-semibold text-slate-900 dark:text-white">
                      {donationAnalytics.peakDonationDay || "N/A"}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                      Highest activity
                    </span>
                  </div>
                </div>

                <div className="h-64 flex items-center justify-center">
                  {/* Placeholder for donation trends chart - would implement with real data */}
                  <div className="text-center text-slate-500 dark:text-gray-400">
                    <TrendingUp
                      size={48}
                      className="mx-auto mb-2 text-green-500 opacity-50"
                    />
                    <p>Detailed donation trends visualization</p>
                    <p className="text-xs mt-1">Additional data required</p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm hover:bg-green-100 transition-colors"
                    onClick={() =>
                      navigate("/admin/fundraising/analytics/donations")
                    }
                  >
                    View Detailed Donation Analysis
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-4 h-64 flex items-center justify-center text-slate-500 dark:text-gray-400">
                No donation analytics available
              </div>
            )}
          </div>
        </motion.div>

        {/* Conversion Metrics Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-slate-100 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="border-b border-slate-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
                <Activity size={18} className="mr-2 text-indigo-500" />
                Conversion Metrics
              </h3>
              <span className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                Month to Date
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    Avg. Donation
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                    +5.3%
                  </span>
                </div>
                <p className="text-xl font-semibold text-slate-900 dark:text-white">
                  Kes{" "}
                  {campaignAnalytics?.averageDonation
                    ? Math.round(
                        Number(campaignAnalytics.averageDonation)
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                    Target: 85%
                  </span>
                </div>
                <p className="text-xl font-semibold text-slate-900 dark:text-white">
                  {campaignAnalytics?.completionPercentage !== null
                    ? `${campaignAnalytics?.completionPercentage}%`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600 dark:text-gray-400">
                    Visitor to Donor
                  </span>
                  <span className="text-xs font-medium text-slate-800 dark:text-white">
                    12%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: "12%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600 dark:text-gray-400">
                    Donor Retention
                  </span>
                  <span className="text-xs font-medium text-slate-800 dark:text-white">
                    48%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: "48%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600 dark:text-gray-400">
                    Campaign Success
                  </span>
                  <span className="text-xs font-medium text-slate-800 dark:text-white">
                    76%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: "76%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
                onClick={() =>
                  navigate("/admin/fundraising/analytics/performance")
                }
              >
                View Detailed Metrics
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
