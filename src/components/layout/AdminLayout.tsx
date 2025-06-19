import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import SlimSidebar from './LeftMenu'
import TopNavigation from './TopNavigation'
import PageTitle from '../../elements/PageTitle'
import {
  ArrowUp,
  ArrowDown,
  Shield,
  Clock,
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  DollarSign,
  RefreshCw,
  Activity,
  Lock,
  BarChart3,
  FileText,
  Filter,
  Zap,
  ChevronRight
} from 'lucide-react'
import GradientBackground from '../common/GradientBackground'

const AdminLayout = () => {
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(1800)
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [showGlobalMetrics, setShowGlobalMetrics] = useState(true)
  const [showActivityFeed, setShowActivityFeed] = useState(false)
  const [systemLoad, setSystemLoad] = useState(67)
  const [apiStatus, setApiStatus] = useState({ up: true, latency: 42 })
  const [showQuickTools, setShowQuickTools] = useState(false)

  const activityFeedRef = useRef(null)

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'T-39458', type: 'deposit', amount: '$15,400.00', status: 'completed', timestamp: '2 mins ago', user: 'James Wilson', risk: 'low' },
    { id: 'T-39457', type: 'withdrawal', amount: '$8,750.00', status: 'pending_approval', timestamp: '15 mins ago', user: 'Sarah Chen', risk: 'medium' },
    { id: 'T-39456', type: 'transfer', amount: '$27,500.00', status: 'completed', timestamp: '34 mins ago', user: 'David Karanja', risk: 'low' },
    { id: 'T-39455', type: 'forex', amount: '€12,400.00', status: 'completed', timestamp: '52 mins ago', user: 'Emma Okonjo', risk: 'low' },
    { id: 'T-39454', type: 'withdrawal', amount: '$32,800.00', status: 'flagged', timestamp: '1 hour ago', user: 'Michael Zhang', risk: 'high' },
  ])

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 'A-4957', type: 'security', message: 'Multiple failed login attempts detected', severity: 'high', timestamp: '7 mins ago' },
    { id: 'A-4956', type: 'compliance', message: 'New regulatory update requires action', severity: 'medium', timestamp: '2 hours ago' },
    { id: 'A-4955', type: 'performance', message: 'Database query latency increased by 15%', severity: 'low', timestamp: '3 hours ago' },
  ])

  const quickTools = [
    { id: 'qt-1', name: 'Transaction Verification', icon: CheckCircle, color: 'emerald' },
    { id: 'qt-2', name: 'Risk Assessment', icon: AlertTriangle, color: 'amber' },
    { id: 'qt-3', name: 'Compliance Check', icon: Shield, color: 'violet' },
    { id: 'qt-4', name: 'AML Screening', icon: Filter, color: 'indigo' },
    { id: 'qt-5', name: 'Payment Override', icon: Zap, color: 'orange' },
    { id: 'qt-6', name: 'Account Freeze', icon: Lock, color: 'red' }
  ]

  const systemHealthMetrics = [
    { name: 'API Services', status: 'operational', uptime: '99.998%', incidents: 0 },
    { name: 'Payment Gateway', status: 'operational', uptime: '99.995%', incidents: 0 },
    { name: 'Database Cluster', status: 'operational', uptime: '99.999%', incidents: 0 },
    { name: 'Auth Services', status: 'degraded', uptime: '99.87%', incidents: 1 },
    { name: 'Reporting Engine', status: 'operational', uptime: '99.992%', incidents: 0 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeRemaining(prev => {
        if (prev <= 0) {
          return 10800
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadTimer = setInterval(() => {
      setSystemLoad(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        const newValue = prev + change
        return Math.max(45, Math.min(92, newValue))
      })

      setApiStatus(prev => ({
        ...prev,
        latency: Math.max(15, Math.min(200, prev.latency + (Math.floor(Math.random() * 7) - 3)))
      }))
    }, 5000)

    return () => clearInterval(loadTimer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-500'
      case 'degraded':
        return 'text-amber-500'
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        )
      case 'pending_approval':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
      case 'flagged':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Flagged
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center">
            {status}
          </span>
        )
    }
  }

  // Get risk indicator
  const getRiskIndicator = (risk: any) => {
    switch (risk) {
      case 'low':
        return <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      case 'medium':
        return <span className="w-2 h-2 rounded-full bg-amber-500"></span>
      case 'high':
        return <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      default:
        return <span className="w-2 h-2 rounded-full bg-gray-400"></span>
    }
  }

  // Get alert severity indicator
  const getAlertSeverityIndicator = (severity) => {
    switch (severity) {
      case 'low':
        return <span className="text-blue-500 font-medium">Low</span>
      case 'medium':
        return <span className="text-amber-500 font-medium">Medium</span>
      case 'high':
        return <span className="text-red-500 font-medium animate-pulse">High</span>
      default:
        return <span className="text-gray-500 font-medium">{severity}</span>
    }
  }

  return (
    <div className="relative flex h-screen transition-colors duration-300">
      {/* Position the GradientBackground at the root level with a negative z-index */}
      <div className="absolute inset-0 z-[-1]">
        <GradientBackground />
      </div>

      <PageTitle />
      <SlimSidebar />

      <div className="flex-1 flex flex-col">
        <TopNavigation />

        {showGlobalMetrics && (
          <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm px-4 py-2 transition-all duration-300 mt-[70px]">
            {/* Metrics content */}
          </div>
        )}

        {!showGlobalMetrics && (
          <button
            onClick={() => setShowGlobalMetrics(true)}
            className="absolute z-20 left-[75px] mt-[75px] p-1.5 rounded-r-md bg-white border border-l-0 border-gray-200 shadow-md"
          >
            <BarChart3 size={14} className="text-primary-500" />
          </button>
        )}

        <div className="relative flex flex-1 overflow-hidden">
          <div className={`absolute top-0 left-4 h-full z-20 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-lg border-r border-gray-200/50 ${showQuickTools ? 'w-64' : 'w-0'}`}>
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Zap size={16} className="mr-2 text-primary-500" />
                  Quick Tools
                </h3>

                <div className="space-y-2">
                  {quickTools.map(tool => (
                    <button
                      key={tool.id}
                      className="w-full flex items-center p-3 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className={`p-2 rounded-md bg-${tool.color}-50 mr-3`}>
                        <tool.icon size={16} className={`text-${tool.color}-500`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{tool.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">System Health</h4>

                  <div className="space-y-3">
                    {systemHealthMetrics.map((metric, index) => (
                      <div key={index} className="p-3 rounded-lg bg-white border border-gray-100">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">{metric.name}</span>
                          <div className={`flex items-center text-xs ${getStatusColor(metric.status)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${metric.status === 'operational' ? 'bg-emerald-500' : metric.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'} ${metric.status !== 'operational' ? 'animate-pulse' : ''} mr-1`}></div>
                            {metric.status}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Uptime: {metric.uptime}</span>
                          <span>Incidents: {metric.incidents}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle button */}
            <button
              className="absolute -right-4 top-6 bg-white border border-gray-200 shadow-md rounded-r-md p-1.5"
              onClick={() => setShowQuickTools(!showQuickTools)}
            >
              <ChevronRight size={14} className={`text-primary-500 transition-transform duration-300 ${showQuickTools ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <main className={`flex-1 mt-0 overflow-x-hidden overflow-y-auto p-6 transition-all duration-300 ${showQuickTools ? 'ml-64' : ''}`}>
            <button
              className="fixed z-30 right-6 bottom-6 p-3 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setShowActivityFeed(!showActivityFeed)}
            >
              <Bell size={18} className="text-secondary-600" />
              {(systemAlerts.length > 0 || recentTransactions.some(t => t.status === 'flagged')) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-medium">!</span>
              )}
            </button>

            {/* Activity Feed Slide-in Panel */}
            <div
              ref={activityFeedRef}
              className={`fixed right-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur-md shadow-xl border-l border-gray-200 z-40 transition-transform duration-300 transform ${showActivityFeed ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Real-time Activity</h3>
                <button
                  onClick={() => setShowActivityFeed(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <XCircle size={16} className="text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto h-full pb-24">
                {/* System Alerts Section */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">System Alerts</h4>

                  <div className="space-y-3">
                    {systemAlerts.map((alert, index) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${alert.severity === 'high' ? 'bg-red-50/50 border-red-200' : alert.severity === 'medium' ? 'bg-amber-50/50 border-amber-200' : 'bg-blue-50/50 border-blue-200'}`}
                      >
                        <div className="flex items-start">
                          <div className={`p-1.5 rounded-md ${alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'} mt-0.5 mr-3`}>
                            {alert.type === 'security' ? (
                              <Shield size={14} className={alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'} />
                            ) : alert.type === 'compliance' ? (
                              <FileText size={14} className={alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'} />
                            ) : (
                              <Activity size={14} className={alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'} />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-800">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</span>
                              <span className="text-xs text-gray-500">{alert.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-700 mt-1">{alert.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs">Severity: {getAlertSeverityIndicator(alert.severity)}</span>
                              <button className="text-xs text-primary-600 hover:underline">View Details</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Transactions</h4>

                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className={`p-3 rounded-lg border ${transaction.status === 'flagged' ? 'bg-red-50/30 border-red-100' : transaction.status === 'pending_approval' ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-gray-100'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="p-2 rounded-md bg-white shadow-sm border border-gray-100 mr-3">
                              {transaction.type === 'deposit' ? (
                                <ArrowDown size={14} className="text-emerald-500" />
                              ) : transaction.type === 'withdrawal' ? (
                                <ArrowUp size={14} className="text-amber-500" />
                              ) : transaction.type === 'transfer' ? (
                                <RefreshCw size={14} className="text-primary-500" />
                              ) : (
                                <DollarSign size={14} className="text-indigo-500" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-800">
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                                <span className="mx-1.5 text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{transaction.id}</span>
                              </div>

                              <div className="mt-1 text-xs text-gray-700">
                                {showSensitiveData ? (
                                  <span>{transaction.user}</span>
                                ) : (
                                  <span>●●●● ●●●●</span>
                                )}
                              </div>

                              <div className="mt-1 flex items-center">
                                <span className="font-medium text-sm">
                                  {showSensitiveData ? transaction.amount : transaction.amount.replace(/[0-9]/g, '●')}
                                </span>
                                <span className="ml-2 flex items-center">
                                  {getRiskIndicator(transaction.risk)}
                                  <span className="ml-1 text-[10px] text-gray-500">
                                    {transaction.risk.toUpperCase()} risk
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">{transaction.timestamp}</div>
                            {getTransactionStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Activity Logs */}
                <div className="p-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">User Activity</h4>

                  <div className="space-y-2">
                    <div className="p-2 text-xs text-gray-500 border-l-2 border-emerald-500 pl-3">
                      <span className="font-medium text-emerald-600">Sarah Chen</span> completed client verification <span className="text-gray-400">• 12 minutes ago</span>
                    </div>
                    <div className="p-2 text-xs text-gray-500 border-l-2 border-primary-500 pl-3">
                      <span className="font-medium text-primary-600">Admin</span> updated global risk parameters <span className="text-gray-400">• 34 minutes ago</span>
                    </div>
                    <div className="p-2 text-xs text-gray-500 border-l-2 border-amber-500 pl-3">
                      <span className="font-medium text-amber-600">System</span> ran compliance checks on 145 accounts <span className="text-gray-400">• 1 hour ago</span>
                    </div>
                    <div className="p-2 text-xs text-gray-500 border-l-2 border-blue-500 pl-3">
                      <span className="font-medium text-blue-600">Michael Zhang</span> exported transaction report <span className="text-gray-400">• 2 hours ago</span>
                    </div>
                  </div>

                  <button className="w-full mt-3 py-2 text-xs text-center text-primary-600 hover:underline">
                    View All Activity Logs
                  </button>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default AdminLayout
