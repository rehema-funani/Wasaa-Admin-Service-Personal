import React from "react";
import {
  MoreHorizontal,
  Bell,
  User,
  Search,
  Filter,
  MessageSquare,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  BarChart2,
  Settings,
  Eye,
  Clock,
  Ban,
  UserX,
} from "lucide-react";

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("new");
  const [selectedMessage, setSelectedMessage] = React.useState(null);

  // Mock data for reported messages
  const reportedMessages = [
    {
      id: 1,
      sender: "crypto_mike",
      receiver: "jennifer92",
      content: "Hey, send me your wallet password and I'll double your coins!",
      timestamp: "10:23 AM",
      reportedBy: "jennifer92",
      reportReason: "Attempted scam",
      status: "new",
    },
    {
      id: 2,
      sender: "angry_user99",
      receiver: "support_team",
      content: "This app is garbage! You're all incompetent and should be *****",
      timestamp: "Yesterday",
      reportedBy: "support_team",
      reportReason: "Harassment",
      status: "new",
    },
    {
      id: 3,
      sender: "marketing_guru",
      receiver: "finance_chat",
      content: "Everyone join my exclusive trading group, 10k minimum deposit required for 500% guaranteed returns!",
      timestamp: "Yesterday",
      reportedBy: "finance_mod",
      reportReason: "Spam/Promotional",
      status: "new",
    },
    {
      id: 4,
      sender: "john_smith",
      receiver: "community_chat",
      content: "Anyone want to meet up? I can send you my personal details and home address.",
      timestamp: "06/09/2025",
      reportedBy: "safety_bot",
      reportReason: "Sharing personal information",
      status: "new",
    },
  ];

  const stats = [
    { label: "Reports Today", value: "28", change: "+7%" },
    { label: "Pending Review", value: "14", change: "+2%" },
    { label: "Avg. Response Time", value: "1.5h", change: "-12%" },
    { label: "Report Validity Rate", value: "72%", change: "+4%" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-medium">Reported Messages</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Message list panel */}
          <div className="w-96 border-r border-slate-200 bg-white flex flex-col">
            {/* Tabs */}
            <div className="flex p-4 gap-2 border-b border-slate-100">
              <button
                onClick={() => setActiveTab("new")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium ${activeTab === "new"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                New
              </button>
              <button
                onClick={() => setActiveTab("inProgress")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium ${activeTab === "inProgress"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveTab("resolved")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium ${activeTab === "resolved"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                Resolved
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-sm text-slate-500 font-medium">4 reports</span>
              <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
                <Filter size={14} />
                Filter
              </button>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto">
              {reportedMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition hover:bg-slate-50 ${selectedMessage?.id === message.id ? "bg-slate-50" : ""
                    }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-slate-900">{message.sender}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{message.timestamp}</span>
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">{message.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-red-50 text-red-600 py-1 px-2 rounded-md">
                      {message.reportReason}
                    </span>
                    <span className="text-xs text-slate-400">Reported by: {message.reportedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
            {selectedMessage ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-medium mb-1">Report Details</h2>
                    <p className="text-sm text-slate-500">Report ID: #{selectedMessage.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        {selectedMessage.sender.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedMessage.sender}</h3>
                        <p className="text-xs text-slate-500">Message sender</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium py-1 px-3 rounded-xl bg-red-100 text-red-600">
                      REPORTED
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 mb-4">
                    <p className="text-slate-800">{selectedMessage.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Sent to: <span className="font-medium">{selectedMessage.receiver}</span></span>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{selectedMessage.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Report Information</h3>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                        {selectedMessage.reportedBy.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Reported by {selectedMessage.reportedBy}</h4>
                        <p className="text-xs text-red-600/80">{selectedMessage.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Reason:</span> {selectedMessage.reportReason}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                  <h3 className="text-sm font-medium mb-3">User History</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600">Previous reports:</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600">Account age:</span>
                    <span className="text-sm font-medium">47 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Warnings issued:</span>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-medium mb-3">Action</h3>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 px-4 rounded-xl font-medium transition">
                      <XCircle size={18} />
                      Dismiss Report
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-xl font-medium transition">
                      <CheckCircle size={18} />
                      Warn User
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-xl font-medium transition">
                      <Ban size={18} />
                      Block Message
                    </button>
                  </div>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-xl font-medium transition">
                    <UserX size={18} />
                    Suspend User Account
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <Flag size={24} />
                </div>
                <h2 className="text-xl font-medium text-slate-800 mb-2">No report selected</h2>
                <p className="text-slate-500 max-w-md">
                  Select a reported message from the list to view details and take action
                </p>
              </div>
            )}
          </div>

          {/* Stats panel */}
          <div className="w-72 border-l border-slate-200 bg-white p-5 flex flex-col">
            <h2 className="text-lg font-medium mb-4">Report Statistics</h2>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-medium">{stat.value}</span>
                    <span className={`text-xs font-medium ${stat.change.startsWith("+")
                      ? stat.label === "Pending Review" ? "text-amber-500" : "text-emerald-500"
                      : stat.change.startsWith("-")
                        ? stat.label === "Avg. Response Time" ? "text-emerald-500" : "text-red-500"
                        : "text-slate-500"
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-medium mb-3">Report Types</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Harassment</span>
                  <span className="text-xs font-medium">38%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "38%" }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Scam Attempts</span>
                  <span className="text-xs font-medium">29%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "29%" }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Spam/Promotional</span>
                  <span className="text-xs font-medium">17%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "17%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Personal Info</span>
                  <span className="text-xs font-medium">16%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "16%" }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-medium mb-3">Resolution Times</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Critical Reports</span>
                <span className="text-xs font-medium">47m avg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Standard Reports</span>
                <span className="text-xs font-medium">2.3h avg</span>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-4">
              <h3 className="text-sm font-medium mb-3">Moderation Team</h3>
              <div className="flex -space-x-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-xl bg-purple-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-xl bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-500 font-medium">+2</div>
              </div>
              <p className="text-xs text-slate-500">5 moderators online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;

