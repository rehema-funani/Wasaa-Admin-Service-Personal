import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Download,
    Share2,
    Globe,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Smartphone,
    Laptop,
    Tablet,
    CreditCard,
    DollarSign,
    MapPin,
    UserCheck,
    BarChart3,
    PieChart,
    LineChart as LineChartIcon,
    Eye,
    Mail,
    MoreHorizontal,
    ChevronRight,

} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RechartsPie,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const CountryDetailPage = () => {
    // Normally we'd get this from route params or props
    const [country, setCountry] = useState({
        id: '9',
        country: 'India',
        region: 'Asia',
        totalUsers: 4521,
        activeUsers: 2987,
        inactiveUsers: 1534,
        growthRate: 21.5,
        averageTransactions: 24.8,
        lastUserJoined: '30 minutes ago',
        status: 'active',
        currency: 'INR',
        timezone: 'UTC+5:30',
        languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'],
        marketPenetration: 0.027,
        userRetentionRate: 78,
        primaryDevices: { mobile: 72, desktop: 18, tablet: 10 },
        avgSessionMinutes: 8.3,
        conversionRate: 3.8,
        revenuePerUser: 17.42,
        topCities: [
            { name: 'Mumbai', users: 842 },
            { name: 'Delhi', users: 761 },
            { name: 'Bangalore', users: 584 },
            { name: 'Hyderabad', users: 426 },
            { name: 'Chennai', users: 321 }
        ],
        userDemographics: {
            ageGroups: [
                { group: '18-24', percentage: 32 },
                { group: '25-34', percentage: 41 },
                { group: '35-44', percentage: 18 },
                { group: '45-54', percentage: 6 },
                { group: '55+', percentage: 3 }
            ],
            gender: { male: 64, female: 35, other: 1 }
        },
        transactionMethods: [
            { name: 'UPI', percentage: 45 },
            { name: 'Credit Card', percentage: 23 },
            { name: 'Debit Card', percentage: 18 },
            { name: 'Net Banking', percentage: 12 },
            { name: 'Wallet', percentage: 2 }
        ]
    });

    const [timeframe, setTimeframe] = useState('month');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Growth and active users data (simulated)
    const [growthData, setGrowthData] = useState<any[]>([]);
    const [activeData, setActiveData] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);

    // Generate mock growth data
    const generateGrowthData = (period: string) => {
        let data = [];
        let points = 0;

        switch (period) {
            case 'week':
                points = 7;
                for (let i = 0; i < points; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (points - i - 1));
                    data.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        users: Math.round(country.totalUsers - (points - i) * (country.totalUsers * 0.01 * Math.random())),
                        active: Math.round(country.activeUsers - (points - i) * (country.activeUsers * 0.01 * Math.random()))
                    });
                }
                break;
            case 'month':
                points = 30;
                for (let i = 0; i < points; i += 3) {
                    const date = new Date();
                    date.setDate(date.getDate() - (points - i - 1));
                    data.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        users: Math.round(country.totalUsers - (points - i) * (country.totalUsers * 0.005 * Math.random())),
                        active: Math.round(country.activeUsers - (points - i) * (country.activeUsers * 0.005 * Math.random()))
                    });
                }
                break;
            case 'year':
                points = 12;
                for (let i = 0; i < points; i++) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (points - i - 1));
                    data.push({
                        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        users: Math.round(country.totalUsers - (points - i) * (country.totalUsers * 0.03 * Math.random())),
                        active: Math.round(country.activeUsers - (points - i) * (country.activeUsers * 0.03 * Math.random()))
                    });
                }
                break;
        }

        return data;
    };

    // Generate daily active user data
    const generateActiveUserData = () => {
        const hours = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
        return hours.map(hour => {
            // Create a pattern with peak at midday
            let percentage;
            if (hour === '12am') percentage = 2;
            else if (hour === '3am') percentage = 1;
            else if (hour === '6am') percentage = 5;
            else if (hour === '9am') percentage = 13;
            else if (hour === '12pm') percentage = 26;
            else if (hour === '3pm') percentage = 24;
            else if (hour === '6pm') percentage = 19;
            else percentage = 10;

            return {
                hour,
                active: Math.round((percentage / 100) * country.activeUsers),
                percentage
            };
        });
    };

    // Generate mock user list
    const generateUsersList = () => {
        const users = [];
        const names = [
            'Aarav Patel', 'Diya Sharma', 'Arjun Singh', 'Ananya Verma',
            'Vihaan Reddy', 'Anika Joshi', 'Advait Kumar', 'Ishaan Mehta',
            'Saanvi Gupta', 'Ayaan Khan', 'Ira Malhotra', 'Reyansh Tiwari',
            'Myra Agarwal', 'Dhruv Nair', 'Avni Bose', 'Kabir Choudhury'
        ];

        for (let i = 0; i < 16; i++) {
            users.push({
                id: `user_${i + 1}`,
                name: names[i],
                email: names[i].toLowerCase().replace(' ', '.') + '@example.com',
                joinDate: `${Math.floor(Math.random() * 12) + 1} ${Math.random() > 0.5 ? 'months' : 'weeks'} ago`,
                lastActive: `${Math.floor(Math.random() * 24) + 1} ${Math.random() > 0.7 ? 'days' : Math.random() > 0.5 ? 'hours' : 'minutes'} ago`,
                transactions: Math.floor(Math.random() * 50) + 1,
                spent: Math.floor(Math.random() * 2000) + 100,
                status: Math.random() > 0.7 ? 'inactive' : 'active',
                device: Math.random() > 0.7 ? 'desktop' : Math.random() > 0.5 ? 'mobile' : 'tablet',
                city: country.topCities[Math.floor(Math.random() * country.topCities.length)].name
            });
        }

        return users;
    };

    useEffect(() => {
        setIsLoading(true);

        setTimeout(() => {
            setGrowthData(generateGrowthData(timeframe));
            setActiveData(generateActiveUserData());
            setUsersList(generateUsersList());
            setIsLoading(false);
        }, 1000);
    }, [timeframe]);

    const handleTimeframeChange = (period: string) => {
        setTimeframe(period);
    };

    const userColumns = [
        {
            id: 'name',
            header: 'User',
            accessor: (row: any) => row.name,
            sortable: true,
            cell: (value: string, row: any) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                        {value.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{value}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'city',
            header: 'City',
            accessor: (row: any) => row.city,
            sortable: true,
            width: '120px'
        },
        {
            id: 'transactions',
            header: 'Txns',
            accessor: (row: any) => row.transactions,
            sortable: true,
            width: '80px',
            cell: (value: number) => (
                <span className="font-medium text-gray-700">
                    {value}
                </span>
            )
        },
        {
            id: 'spent',
            header: 'Spent',
            accessor: (row: any) => row.spent,
            sortable: true,
            width: '100px',
            cell: (value: number) => (
                <span className="font-medium text-gray-700">
                    ₹{value.toLocaleString()}
                </span>
            )
        },
        {
            id: 'device',
            header: 'Device',
            accessor: (row: any) => row.device,
            sortable: true,
            width: '100px',
            cell: (value: string) => {
                let icon;
                let color;

                if (value === 'mobile') {
                    icon = <Smartphone size={14} className="mr-1.5" strokeWidth={1.8} />;
                    color = 'text-primary-600';
                } else if (value === 'desktop') {
                    icon = <Laptop size={14} className="mr-1.5" strokeWidth={1.8} />;
                    color = 'text-primary-600';
                } else {
                    icon = <Tablet size={14} className="mr-1.5" strokeWidth={1.8} />;
                    color = 'text-purple-600';
                }

                return (
                    <div className={`flex items-center ${color}`}>
                        {icon}
                        <span className="capitalize">{value}</span>
                    </div>
                );
            }
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (row: any) => row.status,
            sortable: true,
            width: '100px',
            cell: (value: string) => (
                <StatusBadge status={value as any} size="sm" withIcon withDot={value === 'active'} />
            )
        },
        {
            id: 'lastActive',
            header: 'Last Seen',
            accessor: (row: any) => row.lastActive,
            sortable: true,
            width: '120px',
            cell: (value: string) => (
                <div className="flex items-center text-gray-600">
                    <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            id: 'actions',
            header: '',
            accessor: (row: any) => row.id,
            sortable: false,
            width: '60px',
            cell: () => (
                <div className="flex items-center">
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View user details"
                    >
                        <Eye size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="More options"
                    >
                        <MoreHorizontal size={16} strokeWidth={1.8} />
                    </motion.button>
                </div>
            )
        }
    ];

    const filterOptions = [
        {
            id: 'status',
            label: 'Status',
            type: 'multiselect' as const,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ]
        },
        {
            id: 'city',
            label: 'City',
            type: 'multiselect' as const,
            options: country.topCities.map(city => ({
                value: city.name,
                label: city.name
            }))
        },
        {
            id: 'device',
            label: 'Device',
            type: 'multiselect' as const,
            options: [
                { value: 'mobile', label: 'Mobile' },
                { value: 'desktop', label: 'Desktop' },
                { value: 'tablet', label: 'Tablet' }
            ]
        },
        {
            id: 'minTransactions',
            label: 'Min Transactions',
            type: 'number' as const
        }
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleApplyFilters = () => {
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-xl border border-gray-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center">
                    <motion.button
                        className="mr-3 p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100"
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ArrowLeft size={20} strokeWidth={1.8} />
                    </motion.button>

                    <div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                                <Globe size={20} strokeWidth={1.8} />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-800">{country.country}</h1>
                            <StatusBadge
                                status={country.status as any}
                                size="sm"
                                withIcon
                                withDot={country.status === 'active'}
                                className="ml-3"
                            />
                        </div>
                        <p className="text-gray-500 mt-1 ml-12">{country.region} • {country.timezone} • {country.currency}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Share2 size={16} className="mr-2" strokeWidth={1.8} />
                        Share
                    </motion.button>
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Download size={16} className="mr-2" strokeWidth={1.8} />
                        Export
                    </motion.button>
                    <motion.button
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm shadow-sm"
                        whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Mail size={16} className="mr-2" strokeWidth={1.8} />
                        Message Users
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                {/* Total Users Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-primary-50 rounded-xl p-2">
                            <Users size={20} className="text-primary-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className={`flex items-center ${country.growthRate >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {country.growthRate >= 0 ? (
                                    <ArrowUpRight size={14} className="mr-1" strokeWidth={1.8} />
                                ) : (
                                    <ArrowDownRight size={14} className="mr-1" strokeWidth={1.8} />
                                )}
                                <span className="text-xs font-medium">{Math.abs(country.growthRate)}%</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {country.totalUsers.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-500">Total Users</p>
                </motion.div>

                {/* Active Users Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-50 rounded-xl p-2">
                            <UserCheck size={20} className="text-green-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className="px-2 py-1 bg-green-50 rounded-full text-xs text-green-700 font-medium">
                                {Math.round((country.activeUsers / country.totalUsers) * 100)}%
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {country.activeUsers.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-500">Active Users</p>
                </motion.div>

                {/* Retention Rate Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-primary-50 rounded-xl p-2">
                            <TrendingUp size={20} className="text-primary-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className={`flex items-center text-primary-600`}>
                                <span className="text-xs font-medium">30-day</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {country.userRetentionRate}%
                    </h3>
                    <p className="text-sm text-gray-500">Retention Rate</p>
                </motion.div>

                {/* Revenue Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-amber-50 rounded-xl p-2">
                            <DollarSign size={20} className="text-amber-500" strokeWidth={1.8} />
                        </div>
                        <div className="flex items-center">
                            <div className="px-2 py-1 bg-amber-50 rounded-full text-xs text-amber-700 font-medium">
                                Avg. {country.averageTransactions} txns
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        ₹{country.revenuePerUser.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-500">Revenue Per User</p>
                </motion.div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Growth Chart */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <LineChartIcon size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">User Growth</h3>
                        </div>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                className={`px-3 py-1 text-xs rounded-lg transition-all ${timeframe === 'week' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'}`}
                                onClick={() => handleTimeframeChange('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`px-3 py-1 text-xs rounded-lg transition-all ${timeframe === 'month' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'}`}
                                onClick={() => handleTimeframeChange('month')}
                            >
                                Month
                            </button>
                            <button
                                className={`px-3 py-1 text-xs rounded-lg transition-all ${timeframe === 'year' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'}`}
                                onClick={() => handleTimeframeChange('year')}
                            >
                                Year
                            </button>
                        </div>
                    </div>

                    <div className="h-64">
                        {isLoading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={growthData}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                                                        <p className="text-gray-600 text-xs mb-1">{label}</p>
                                                        <p className="text-sm font-medium text-primary-600 mb-1">
                                                            Total Users: {payload[0]?.value?.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm font-medium text-green-500">
                                                            Active Users: {payload[1]?.value?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#6366F1"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        activeDot={{ r: 6, strokeWidth: 2, stroke: 'white', fill: '#6366F1' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="active"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorActive)"
                                        activeDot={{ r: 6, strokeWidth: 2, stroke: 'white', fill: '#10B981' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Demographics Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Age Distribution */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <div className="flex items-center mb-4">
                            <PieChart size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Age Distribution</h3>
                        </div>

                        <div className="h-48">
                            {isLoading ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={country.userDemographics.ageGroups}
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="percentage"
                                            nameKey="group"
                                            label={(entry) => entry.group}
                                            labelLine={false}
                                        >
                                            {country.userDemographics.ageGroups.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={[
                                                        '#6366F1', '#8B5CF6', '#EC4899', '#0EA5E9', '#14B8A6'
                                                    ][index % 5]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, 'Percentage']}
                                            labelFormatter={(label) => `Age: ${label}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>

                    {/* Payment Methods */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <div className="flex items-center mb-4">
                            <CreditCard size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Payment Methods</h3>
                        </div>

                        <div className="h-48">
                            {isLoading ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={country.transactionMethods}
                                            innerRadius={0}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="percentage"
                                            nameKey="name"
                                        >
                                            {country.transactionMethods.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={[
                                                        '#0EA5E9', '#14B8A6', '#6366F1', '#F59E0B', '#EC4899'
                                                    ][index % 5]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, 'Percentage']}
                                        />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            iconType="circle"
                                            iconSize={8}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                >
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center">
                            <Users size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Top Users from {country.country}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <SearchBox
                                placeholder="Search users..."
                                onSearch={handleSearch}
                                minLength={1}
                                className="w-full sm:w-60"
                            />

                            <FilterPanel
                                title="User Filters"
                                filters={filterOptions}
                                onApplyFilters={handleApplyFilters}
                                className="w-auto"
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <DataTable
                            columns={userColumns}
                            data={usersList}
                            selectable={true}
                            isLoading={isLoading}
                            emptyMessage="No users found for this country."
                            defaultRowsPerPage={itemsPerPage}
                        />
                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <Pagination
                            totalItems={usersList.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            showItemsPerPage={false}
                            showSummary={true}
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-primary-500 to-primary-500 rounded-2xl shadow-md p-6 text-white mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1 }}
                    whileHover={{ y: -2, boxShadow: '0 15px 30px -5px rgba(79, 70, 229, 0.3)' }}
                >
                    <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg font-semibold mb-1">Ready to engage with users in {country.country}?</h3>
                        <p className="text-primary-100">Create targeted campaigns to increase user engagement and retention.</p>
                    </div>
                    <motion.button
                        className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-medium shadow-sm"
                        whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Create Campaign
                    </motion.button>
                </motion.div>
            </div>
            <div className="flex flex-col w-full ">
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <BarChart3 size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Active Users by Time of Day</h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <span>Based on {country.timezone} timezone</span>
                        </div>
                    </div>

                    <div className="h-64">
                        {isLoading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={activeData}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                    barSize={40}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="hour"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
                                                        <p className="text-gray-600 text-xs mb-1">{label}</p>
                                                        <p className="text-sm font-medium text-primary-600 mb-1">
                                                            Active Users: {payload[0]?.value?.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm font-medium text-green-500">
                                                            {payload[0]?.payload?.percentage}% of active users
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="active"
                                        radius={[4, 4, 0, 0]}
                                    >
                                        {activeData.map((index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === 4 || index === 5 ? '#6366F1' : '#A5B4FC'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <motion.div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                    >
                        <div className="flex items-center mb-6">
                            <Smartphone size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Device Distribution</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <div className="flex items-center">
                                        <Smartphone size={14} className="text-primary-500 mr-2" strokeWidth={1.8} />
                                        <span className="text-sm text-gray-700">Mobile</span>
                                    </div>
                                    <span className="text-sm font-medium">{country.primaryDevices.mobile}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-500 rounded-full"
                                        style={{ width: `${country.primaryDevices.mobile}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <div className="flex items-center">
                                        <Laptop size={14} className="text-primary-500 mr-2" strokeWidth={1.8} />
                                        <span className="text-sm text-gray-700">Desktop</span>
                                    </div>
                                    <span className="text-sm font-medium">{country.primaryDevices.desktop}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-500 rounded-full"
                                        style={{ width: `${country.primaryDevices.desktop}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <div className="flex items-center">
                                        <Tablet size={14} className="text-purple-500 mr-2" strokeWidth={1.8} />
                                        <span className="text-sm text-gray-700">Tablet</span>
                                    </div>
                                    <span className="text-sm font-medium">{country.primaryDevices.tablet}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${country.primaryDevices.tablet}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Avg. Session Time</span>
                                    <span className="text-lg font-medium text-gray-800">{country.avgSessionMinutes} min</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-sm text-gray-500">Conversion Rate</span>
                                    <span className="text-lg font-medium text-gray-800">{country.conversionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                    >
                        <div className="flex items-center mb-6">
                            <MapPin size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Top Cities</h3>
                        </div>

                        <div className="space-y-4">
                            {country.topCities.map((city, index) => (
                                <div key={city.name}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm text-gray-700">{city.name}</span>
                                        <span className="text-sm font-medium">{city.users.toLocaleString()} users</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(city.users / country.topCities[0].users) * 100}%`,
                                                background: index === 0
                                                    ? 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                                                    : index === 1
                                                        ? 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)'
                                                        : index === 2
                                                            ? 'linear-gradient(90deg, #A78BFA 0%, #C4B5FD 100%)'
                                                            : 'linear-gradient(90deg, #C4B5FD 0%, #DDD6FE 100%)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Market Penetration</span>
                                    <span className="text-lg font-medium text-gray-800">{(country.marketPenetration * 100).toFixed(1)}%</span>
                                </div>
                                <motion.button
                                    className="text-xs text-primary-600 font-medium flex items-center"
                                    whileHover={{ x: 3 }}
                                >
                                    View Map <ChevronRight size={14} className="ml-1" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                    >
                        <div className="flex items-center mb-6">
                            <Globe size={18} className="text-primary-500 mr-2" strokeWidth={1.8} />
                            <h3 className="font-medium text-gray-800">Language & Demographics</h3>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm text-gray-500 mb-3">Primary Languages</h4>
                            <div className="flex flex-wrap gap-2">
                                {country.languages.map((language) => (
                                    <span
                                        key={language}
                                        className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium"
                                    >
                                        {language}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500 mb-3">Gender Distribution</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm text-gray-700">Male</span>
                                        <span className="text-sm font-medium">{country.userDemographics.gender.male}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full"
                                            style={{ width: `${country.userDemographics.gender.male}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm text-gray-700">Female</span>
                                        <span className="text-sm font-medium">{country.userDemographics.gender.female}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-pink-500 rounded-full"
                                            style={{ width: `${country.userDemographics.gender.female}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm text-gray-700">Other</span>
                                        <span className="text-sm font-medium">{country.userDemographics.gender.other}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${country.userDemographics.gender.other}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Main Age Group</span>
                                    <span className="text-lg font-medium text-gray-800">25-34 (41%)</span>
                                </div>
                                <motion.button
                                    className="text-xs text-primary-600 font-medium flex items-center"
                                    whileHover={{ x: 3 }}
                                >
                                    Full Demographics <ChevronRight size={14} className="ml-1" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CountryDetailPage;