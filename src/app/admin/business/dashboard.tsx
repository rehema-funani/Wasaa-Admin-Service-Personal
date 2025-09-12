import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Filter,
  Calendar,
  BarChart2,
  PieChart,
  TrendingUp,
  MapPin,
  ShoppingBag,
  Users,
  Briefcase,
  AlertTriangle,
  Search,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const BusinessDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [businessData, setBusinessData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [regionData, setRegionData] = useState([]);

  // Dummy data
  const businessGrowthData = [
    { name: "Jan", total: 1240, new: 320, active: 980 },
    { name: "Feb", total: 1410, new: 350, active: 1120 },
    { name: "Mar", total: 1680, new: 420, active: 1340 },
    { name: "Apr", total: 1940, new: 480, active: 1580 },
  ];

  const businessCategoryData = [
    { name: "Retail", value: 35, count: 679 },
    { name: "Food & Beverage", value: 25, count: 485 },
    { name: "Services", value: 20, count: 388 },
    { name: "Health", value: 10, count: 194 },
    { name: "Technology", value: 10, count: 194 },
  ];

  const businessStatusData = [
    { name: "Active", value: 81, count: 1571 },
    { name: "Pending Verification", value: 12, count: 233 },
    { name: "Suspended", value: 5, count: 97 },
    { name: "Incomplete", value: 2, count: 39 },
  ];

  const businessRegionData = [
    { name: "Nairobi", count: 720 },
    { name: "Mombasa", count: 310 },
    { name: "Kisumu", count: 210 },
    { name: "Nakuru", count: 180 },
    { name: "Eldoret", count: 140 },
    { name: "Other", count: 380 },
  ];

  const businessTierData = [
    { name: "SME", count: 1552, value: 80 },
    { name: "Enterprise", count: 194, value: 10 },
    { name: "NGO", count: 194, value: 10 },
  ];

  const recentBusinessData = [
    {
      id: "BUS-001243",
      name: "TechnoHub Solutions",
      category: "Technology",
      tier: "Enterprise",
      status: "Active",
      dateJoined: "2025-04-01",
      region: "Nairobi",
    },
    {
      id: "BUS-001244",
      name: "Fresh Harvest Grocers",
      category: "Retail",
      tier: "SME",
      status: "Active",
      dateJoined: "2025-04-01",
      region: "Mombasa",
    },
    {
      id: "BUS-001245",
      name: "Healing Hands Clinic",
      category: "Health",
      tier: "SME",
      status: "Pending Verification",
      dateJoined: "2025-04-02",
      region: "Kisumu",
    },
    {
      id: "BUS-001246",
      name: "Eco Warriors NGO",
      category: "Environmental",
      tier: "NGO",
      status: "Active",
      dateJoined: "2025-04-02",
      region: "Nairobi",
    },
    {
      id: "BUS-001247",
      name: "Urban Eats Restaurant",
      category: "Food & Beverage",
      tier: "SME",
      status: "Incomplete",
      dateJoined: "2025-04-03",
      region: "Nakuru",
    },
  ];

  const pendingVerificationData = [
    {
      id: "BUS-001245",
      name: "Healing Hands Clinic",
      category: "Health",
      tier: "SME",
      documents: 3,
      dateSubmitted: "2025-04-02",
    },
    {
      id: "BUS-001249",
      name: "SafariTech Solutions",
      category: "Technology",
      tier: "SME",
      documents: 4,
      dateSubmitted: "2025-04-03",
    },
    {
      id: "BUS-001252",
      name: "Artisan Crafts Cooperative",
      category: "Retail",
      tier: "SME",
      documents: 2,
      dateSubmitted: "2025-04-03",
    },
  ];

  const businessKpiData = [
    { metric: "Total Businesses", value: "1,940", change: "+15.5%" },
    { metric: "New This Month", value: "480", change: "+14.3%" },
    { metric: "Average Daily Signups", value: "16", change: "+6.7%" },
    { metric: "Verification Rate", value: "83.2%", change: "+2.1%" },
    { metric: "KYC Completion Rate", value: "91.8%", change: "+3.4%" },
    { metric: "Active Rate", value: "81.4%", change: "-1.2%" },
    { metric: "Churn Rate", value: "4.2%", change: "+0.5%" },
    { metric: "Average Onboarding Time", value: "1.8 days", change: "-0.3 days" },
  ];

  const COLORS = [
    "#6366f1", // Primary blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
  ];

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      setBusinessData(businessGrowthData);
      setCategoryData(businessCategoryData);
      setTrendData(businessStatusData);
      setRegionData(businessRegionData);
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedYear, selectedMonth]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with filters */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Business Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage all businesses on the WasaaChat platform
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 flex items-center shadow-sm">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedPeriod === "weekly"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handlePeriodChange("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedPeriod === "monthly"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handlePeriodChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedPeriod === "quarterly"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handlePeriodChange("quarterly")}
            >
              Quarterly
            </button>
          </div>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Calendar size={16} className="mr-2" strokeWidth={1.8} />
            {selectedPeriod === "monthly" && `April ${selectedYear}`}
            {selectedPeriod === "quarterly" && `Q2 ${selectedYear}`}
            {selectedPeriod === "weekly" && `April Week 4, ${selectedYear}`}
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Filters
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Total Businesses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Businesses</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                1,940
              </h3>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                +15.5% <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900">
              <Briefcase
                size={24}
                className="text-primary-500 dark:text-primary-400"
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>

        {/* Verification Pending */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verification Pending</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                233
              </h3>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">
                +8.3% <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900">
              <Search
                size={24}
                className="text-amber-500 dark:text-amber-400"
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>

        {/* Active Businesses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Businesses</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                1,580
              </h3>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                +17.9% <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900">
              <Users
                size={24}
                className="text-green-500 dark:text-green-400"
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>

        {/* Suspended Accounts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Suspended Accounts</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                97
              </h3>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                +3.2% <span className="text-gray-500 dark:text-gray-400">from last month</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900">
              <AlertTriangle
                size={24}
                className="text-red-500 dark:text-red-400"
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Growth & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Business Growth
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total, new, and active businesses
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 dark:bg-primary-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Total
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Active
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  New
                </span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={businessData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis width={50} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="new" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Category Distribution
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Businesses by industry category
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.count]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Business Status & Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Business Status Overview
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Distribution by account status
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={trendData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {trendData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.count]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Regional Distribution
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Businesses by geographic location
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Businesses & Pending Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recently Joined Businesses
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Last 5 business accounts created
              </p>
            </div>
            <a 
              href="/admin/business/all-businesses"
              className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentBusinessData.map((business, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {business.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {business.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {business.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          business.tier === "Enterprise"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : business.tier === "NGO"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {business.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          business.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : business.status === "Pending Verification"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : business.status === "Suspended"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {business.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(business.dateJoined).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Pending Verification
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Business accounts awaiting KYC verification
              </p>
            </div>
            <a
              href="/admin/business/verification/queue"
              className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingVerificationData.map((business, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {business.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {business.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {business.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          business.tier === "Enterprise"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : business.tier === "NGO"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {business.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {business.documents} files
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(business.dateSubmitted).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Business Tiers & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Business Tier Distribution
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Distribution by business tier
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={businessTierData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {businessTierData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "SME"
                            ? "#6366f1"
                            : entry.name === "Enterprise"
                            ? "#8b5cf6"
                            : "#f59e0b"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.count]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Business KPIs
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Key performance indicators for business accounts
            </p>
          </div>
          <div className="h-72 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businessKpiData.map((kpi, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {kpi.metric}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {kpi.value}
                      </h4>
                      <span 
                        className={`text-sm font-medium ${
                          kpi.change.startsWith("+") && !kpi.change.includes("days")
                            ? "text-green-600 dark:text-green-400"
                            : kpi.change.startsWith("-") && !kpi.change.includes("days")
                            ? "text-red-600 dark:text-red-400"
                            : kpi.change.includes("days") && kpi.change.startsWith("-")
                            ? "text-green-600 dark:text-green-400"
                            : kpi.change.includes("days") && kpi.change.startsWith("+")
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Actions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Common business management tasks
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.a
              href="/admin/business/registration"
              className="flex items-center px-4 py-2 bg-primary-600 text-white dark:bg-primary-700 dark:text-gray-100 rounded-xl text-sm shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600"
              whileHover={{
                y: -2,
                backgroundColor: "#4f46e5",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
              }}
              whileTap={{ y: 0 }}
            >
              <Briefcase size={16} className="mr-2" strokeWidth={1.8} />
              Add Business
            </motion.a>
            <motion.a
              href="/admin/business/verification/queue"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <Search size={16} className="mr-2 text-amber-500" strokeWidth={1.8} />
              Verify Businesses
            </motion.a>
            <motion.a
              href="/admin/business/categories"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <ShoppingBag size={16} className="mr-2 text-primary-500" strokeWidth={1.8} />
              Manage Categories
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessDashboard;