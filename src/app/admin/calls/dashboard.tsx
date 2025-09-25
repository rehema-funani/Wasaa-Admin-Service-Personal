// import React, { useState, useEffect } from 'react';
// import { motion, type Variants } from 'framer-motion';
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ReferenceLine,
// } from 'recharts';
// import { 
//   Phone, 
//   Clock, 
//   Activity, 
//   Bell,

//   ArrowUpRight,
//   Signal
// } from 'lucide-react';
// // import { KPICard } from '../../components/dashboard/KPICard';
// import { KPICard } from '../../../components/dashboard/KPICard';
// // import { Card } from '../../components/common/Card';
// import { Card } from '../../../components/common/Card';
// // import { Badge } from '../../components/common/Badge';
// import { Badge } from '../../../components/common/Badge';
// // import { callsService } from '../../../api/services/calls';
// import { callsService } from '../../../api/services/calls';

// interface DashboardStats {
//   activeCalls: number;
//   avgCallDuration: number;
//   qosScore: number;
// }

// interface Activity {
//   id: string;
//   type: 'call_start' | 'moderation';
//   user?: string;
//   target?: string;
//   time: string;

//   icon: React.ElementType;
//   color: string;
//   moderator?: string;
//   action?: string;
//   role?: string;
// }

// const activityColorClasses: { [key: string]: { bg: string; text: string } } = {

//   green: { bg: 'bg-green-500', text: 'text-green-500' },
//   blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
//   orange: { bg: 'bg-orange-500', text: 'text-orange-500' },
//   purple: { bg: 'bg-purple-500', text: 'text-purple-500' },
//   default: { bg: 'bg-gray-500', text: 'text-gray-500' },
// };

// const qosData = [
//   { time: '24h ago', score: 91 },
//   { time: '18h ago', score: 94 },
//   { time: '12h ago', score: 88 },
//   { time: '6h ago', score: 92 },
//   { time: 'now', score: 95 },
// ];

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="p-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
//         <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{`Time: ${label}`}</p>
//         <p className="text-lg font-bold text-primary-500">{`QoS Score: ${payload[0].value}%`}</p>
//       </div>
//     );
//   }
//   return null;
// };

// const Dashboard: React.FC = () => {
//   const [stats, setStats] = useState<DashboardStats>({
//     activeCalls: 342,
//     avgCallDuration: 12,
//     qosScore: 92,
//   });
//   const [loading, setLoading] = useState(true);
//   const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       // Fetch all dashboard data in parallel
//       const [callsData, activityData] = await Promise.all([
//         callsService.getAnalytics('24h'),
//         Promise.resolve([
//           { id: '1', type: 'call_start' as const, user: 'U123', target: 'C101', time: new Date(Date.now() - 2 * 60 * 1000).toISOString(), icon: Phone, color: 'green' },
//           { id: '3', type: 'moderation' as const, moderator: 'Mod123', action: 'muted', target: 'U456', time: new Date(Date.now() - 12 * 60 * 1000).toISOString(), icon: Bell, color: 'orange' },
//         ] as Activity[])
//       ]);

//       setStats({
//         activeCalls: callsData.activeCalls || 192,
//         avgCallDuration: callsData.avgDuration || 1,
//         qosScore: callsData.avgQoS || 92,
//       });
//       setRecentActivity(activityData);
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { type: 'spring', stiffness: 300, damping: 25 },
//     },
//   };

//   const renderActivityMessage = (activity: Activity) => {
//     switch (activity.type) {
//       case 'call_start':
//         return <><span className="font-medium">{activity.user}</span> started call <span className="font-medium">{activity.target}</span></>;
//       case 'moderation':
//         return <>Moderator <span className="font-medium">{activity.moderator}</span> {activity.action} <span className="font-medium">{activity.target}</span></>;
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//         className="space-y-8"
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         {/* Page Header */}
//         <motion.div variants={itemVariants}>
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//                 WasaaChat Calls Admin
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 Real-time monitoring and management dashboard
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm text-green-700 dark:text-green-400 font-medium">
//                   System Online
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* KPI Cards */}
//         <motion.div 
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
//           variants={itemVariants}
//         >
//           <KPICard
//             title="Active Calls"
//             value={stats.activeCalls}
//             change="+8.2%"
//             isPositive={true}
//             icon={<Phone size={24} className="text-white" />}
//             gradient="bg-gradient-to-br from-green-500 to-emerald-500"
//             description="Currently live"
//           />
//           <KPICard
//             title="Avg Call Duration"
//             value={`${stats.avgCallDuration} min`}
//             change="+2.1%"
//             isPositive={true}
//             icon={<Clock size={24} className="text-white" />}
//             gradient="bg-gradient-to-br from-purple-500 to-violet-500"
//             description="Per call average"
//           />
//           <KPICard
//             title="QoS Score"
//             value={`${stats.qosScore}%`}
//             change="+1.8%"
//             isPositive={true}
//             icon={<Signal size={24} className="text-white" />}
//             gradient="bg-gradient-to-br from-orange-500 to-red-500"
//             description="Quality of Service"
//           />

//         </motion.div>

//         {/* Charts Section */}
//         <motion.div className="grid grid-cols-1 lg:grid-cols-1 gap-8" variants={itemVariants}>
//           {/* QoS Trends Chart */}
//           <Card className="p-6" hover>
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 QoS Trends (Last 24h)
//               </h3>
//               <Badge variant="success" size="sm">Real-time</Badge>
//             </div>
//             <div className="h-64 rounded-lg bg-gradient-to-b from-blue-50/50 to-transparent dark:from-gray-800/20 dark:to-transparent p-2">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={qosData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
//                   <defs>
//                     <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
//                       <stop offset="0%" stopColor="#3b82f6" />
//                       <stop offset="100%" stopColor="#8b5cf6" />
//                     </linearGradient>
//                     <linearGradient id="colorQoS" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
//                     </linearGradient>
//                     <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//                       <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3b82f6" floodOpacity="0.3"/>
//                     </filter>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 220, 0.1)" vertical={false} />
//                   <XAxis 
//                     dataKey="time" 
//                     stroke="var(--muted-foreground)" 
//                     fontSize={12} 
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <YAxis 
//                     stroke="var(--muted-foreground)" 
//                     fontSize={12} 
//                     tickLine={false}
//                     axisLine={false}
//                     domain={[80, 100]} 
//                     tickFormatter={(value) => `${value}%`}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <ReferenceLine y={92} label={{ value: 'Avg', position: 'insideTopLeft', fill: 'var(--muted-foreground)', fontSize: 12 }} stroke="rgba(139, 92, 246, 0.5)" strokeDasharray="4 4" />
//                   <Area 
//                     type="basis" 
//                     dataKey="score" 
//                     stroke="url(#strokeGradient)" 
//                     strokeWidth={3}
//                     filter="url(#shadow)"
//                     fillOpacity={1} 
//                     fill="url(#colorQoS)" 
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </motion.div>

//         {/* Activity and Revenue Section */}
//         <motion.div className="grid grid-cols-1 lg:grid-cols-1 gap-8" variants={itemVariants}>
//           {/* Recent Activity Feed */}
//           <Card className="p-6" hover>
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Recent Activity
//               </h3>
//               <button className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center">
//                 View all <ArrowUpRight size={16} className="ml-1" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               {recentActivity.map((activity) => {
//                 const ActivityIcon = activity.icon;
//                 const colorClass = activityColorClasses[activity.color] || activityColorClasses.default;
//                 return (
//                   <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                     <div className={`w-2 h-2 ${colorClass.bg} rounded-full mt-2 flex-shrink-0 ${activity.type === 'call_start' ? 'animate-pulse' : ''}`}></div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 dark:text-white">
//                         {renderActivityMessage(activity)}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {new Date(activity.time).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <ActivityIcon size={16} className={`${colorClass.text} mt-0.5 flex-shrink-0`} />
//                   </div>
//                 );
//               })}
//             </div>
//           </Card>
//         </motion.div>
//       </motion.div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { 
  Phone, 
  Clock, 
  Activity, 
  Bell,

  ArrowUpRight,
  Signal
} from 'lucide-react';
// import { KPICard } from '../../components/dashboard/KPICard';
import { KPICard } from '../../../components/dashboard/KPICard';
// import { Card } from '../../components/common/Card';
import { Card } from '../../../components/common/Card';
// import { Badge } from '../../components/common/Badge';
import { Badge } from '../../../components/common/Badge';
// import { callsService } from '../../../api/services/calls';
import { callsService } from '../../../api/services/calls';

interface DashboardStats {
  activeCalls: number;
  avgCallDuration: number;
  qosScore: number;
}

interface Activity {
  id: string;
  type: 'call_start' | 'moderation';
  user?: string;
  target?: string;
  time: string;

  icon: React.ElementType;
  color: string;
  moderator?: string;
  action?: string;
  role?: string;
}

const activityColorClasses: { [key: string]: { bg: string; text: string } } = {

  green: { bg: 'bg-green-500', text: 'text-green-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500' },
  default: { bg: 'bg-gray-500', text: 'text-gray-500' },
};

const qosData = [
  { time: '24h ago', score: 91 },
  { time: '18h ago', score: 93 },
  { time: '12h ago', score: 88 },
  { time: '6h ago', score: 93 },
  { time: 'now', score: 95 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{`Time: ${label}`}</p>
        <p className="text-lg font-bold text-primary-500">{`QoS Score: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeCalls: 342,
    avgCallDuration: 12,
    qosScore: 92,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all dashboard data in parallel
      const [callsData, activityData] = await Promise.all([
        callsService.getAnalytics('24h'),
        Promise.resolve([
          { id: '1', type: 'call_start' as const, user: 'U123', target: 'C101', time: new Date(Date.now() - 2 * 60 * 1000).toISOString(), icon: Phone, color: 'green' },
          { id: '3', type: 'moderation' as const, moderator: 'Mod123', action: 'muted', target: 'U456', time: new Date(Date.now() - 12 * 60 * 1000).toISOString(), icon: Bell, color: 'orange' },
        ] as Activity[])
      ]);

      setStats({
        activeCalls: callsData.activeCalls || 192,
        avgCallDuration: callsData.avgDuration || 1,
        qosScore: callsData.avgQoS || 92,
      });
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
  };

  const renderActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'call_start':
        return <><span className="font-medium">{activity.user}</span> started call <span className="font-medium">{activity.target}</span></>;
      case 'moderation':
        return <>Moderator <span className="font-medium">{activity.moderator}</span> {activity.action} <span className="font-medium">{activity.target}</span></>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                WasaaChat Calls Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time monitoring and management dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={itemVariants}
        >
          <KPICard
            title="Active Calls"
            value={stats.activeCalls}
            change="+8.2%"
            isPositive={true}
            icon={<Phone size={24} className="text-white" />}
            gradient="bg-gradient-to-br from-green-500 to-emerald-500"
            description="Currently live"
          />
          <KPICard
            title="Avg Call Duration"
            value={`${stats.avgCallDuration} min`}
            change="+2.1%"
            isPositive={true}
            icon={<Clock size={24} className="text-white" />}
            gradient="bg-gradient-to-br from-purple-500 to-violet-500"
            description="Per call average"
          />
          <KPICard
            title="QoS Score"
            value={`${stats.qosScore}%`}
            change="+1.8%"
            isPositive={true}
            icon={<Signal size={24} className="text-white" />}
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            description="Quality of Service"
          />

        </motion.div>

        {/* Charts Section */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-1 gap-8" variants={itemVariants}>
          {/* QoS Trends Chart */}
          <Card className="p-6" hover>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                QoS Trends (Last 24h)
              </h3>
              <Badge variant="success" size="sm">Real-time</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={qosData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorQoS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 220, 0.1)" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    domain={[80, 100]} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotoneX" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorQoS)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Activity and Revenue Section */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-1 gap-8" variants={itemVariants}>
          {/* Recent Activity Feed */}
          <Card className="p-6" hover>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center">
                View all <ArrowUpRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const ActivityIcon = activity.icon;
                const colorClass = activityColorClasses[activity.color] || activityColorClasses.default;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-2 h-2 ${colorClass.bg} rounded-full mt-2 flex-shrink-0 ${activity.type === 'call_start' ? 'animate-pulse' : ''}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {renderActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.time).toLocaleTimeString()}
                      </p>
                    </div>
                    <ActivityIcon size={16} className={`${colorClass.text} mt-0.5 flex-shrink-0`} />
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </motion.div>
  );
};

export default Dashboard;