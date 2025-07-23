import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Globe,
  DollarSign,
  Clock,
  Shield,
  Users,
  Edit,
  AlertCircle,
  Loader,
  Camera,
  MessageCircle,
  Settings,
  BellRing,
  Heart,
  Bookmark,
  Link,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink,
  Flag,
  CheckCircle,
  Copy,
  Activity,
  CreditCard,
  HelpCircle,
  X,
  ArrowLeft,
  IdCardIcon,
} from "lucide-react";
import userService from "../../../../api/services/users";
import { useParams } from "react-router-dom";

export default function ResponsiveUserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    preferences: true,
    social: true,
    security: true,
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("User ID is missing");
        }

        const userData = await userService.getUserById(id);
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError("Failed to load user details. Please try again.");
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBackClick = () => {
    // We would normally use navigation here
    console.log("Back button clicked");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Loader size={40} className="text-indigo-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-red-600 text-center mb-6">{error}</p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="flex flex-col items-center">
            <User size={48} className="text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No User Found
            </h2>
            <p className="text-gray-600 text-center mb-6">
              No user data is available for this profile.
            </p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = `${userData.first_name?.[0] || ""}${
    userData.last_name?.[0] || ""
  }`.toUpperCase();

  const fullName =
    `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
    userData.username;

  const renderKycBadge = (level) => {
    const colors = {
      basic: "bg-blue-100 text-blue-700 border-blue-200",
      intermediate: "bg-amber-100 text-amber-700 border-amber-200",
      advanced: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
          colors[level] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        <Shield size={14} className="mr-1.5" />
        KYC: {level?.charAt(0).toUpperCase() + level?.slice(1) || "None"}
      </span>
    );
  };

  const InfoCard = ({
    title,
    icon: Icon,
    children,
    expanded = true,
    toggleExpand,
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center">
          {Icon && <Icon size={18} className="text-indigo-500 mr-2" />}
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {toggleExpand && (
          <button
            onClick={toggleExpand}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>
      {expanded && <div className="p-4">{children}</div>}
    </div>
  );

  // Info item component
  const InfoItem = ({ label, value, icon: Icon, copyable = false }) => (
    <div className="flex items-center py-2.5 border-b border-gray-100 last:border-b-0">
      {Icon && <Icon size={16} className="text-gray-400 mr-3 flex-shrink-0" />}
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex items-center mt-0.5">
          <p className="text-base text-gray-800">{value || "Not set"}</p>
          {copyable && value && (
            <button className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Copy size={14} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Stats item
  const StatItem = ({ label, value, icon: Icon, color = "indigo" }) => {
    const bgColors = {
      indigo: "bg-indigo-100",
      emerald: "bg-emerald-100",
      amber: "bg-amber-100",
      purple: "bg-purple-100",
      red: "bg-red-100",
      blue: "bg-blue-100",
    };

    const textColors = {
      indigo: "text-indigo-700",
      emerald: "text-emerald-700",
      amber: "text-amber-700",
      purple: "text-purple-700",
      red: "text-red-700",
      blue: "text-blue-700",
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
        <div className="flex items-center mb-2">
          <div
            className={`w-10 h-10 rounded-lg ${bgColors[color]} ${textColors[color]} flex items-center justify-center mr-3`}
          >
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBackClick}
            className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:bg-opacity-100 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              {userData.profile_picture ? (
                <img
                  src={userData.profile_picture}
                  alt={fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                  {userInitials}
                </div>
              )}
              <div className="absolute bottom-3 right-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1 pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {fullName}
              </h1>
              <p className="text-gray-600 mb-3">@{userData.username}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {renderKycBadge(userData.kyc_level)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-8">
            <button
              className={`py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "activity"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </button>
            <button
              className={`py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "wallets"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("wallets")}
            >
              Wallets
            </button>
            <button
              className={`py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "security"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-1">
              {/* Basic Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatItem
                  label="Followers"
                  value={userData.followers || 0}
                  icon={Users}
                  color="indigo"
                />
                <StatItem
                  label="Following"
                  value={userData.following || 0}
                  icon={Users}
                  color="purple"
                />
              </div>

              {userData.about && (
                <InfoCard title="About" icon={User} toggleExpand={undefined}>
                  <p className="text-gray-700 whitespace-pre-line">
                    {userData.about}
                  </p>
                </InfoCard>
              )}

              <InfoCard
                title="Quick Actions"
                icon={Activity}
                toggleExpand={undefined}
              >
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <MessageCircle
                        size={18}
                        className="mr-3 text-indigo-500"
                      />
                      <span className="font-medium">Send Message</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <BellRing size={18} className="mr-3 text-indigo-500" />
                      <span className="font-medium">Send Notification</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Flag size={18} className="mr-3 text-red-500" />
                      <span className="font-medium">Report User</span>
                    </div>
                  </button>
                </div>
              </InfoCard>

              {/* Preferences Section */}
              <InfoCard
                title="Preferences"
                icon={Settings}
                expanded={expandedSections.preferences}
                toggleExpand={() => toggleSection("preferences")}
              >
                {userData.preferences && (
                  <div className="space-y-1">
                    <InfoItem
                      label="Language"
                      value={
                        userData.preferences.default_language?.toUpperCase() ||
                        "Not set"
                      }
                      icon={Globe}
                    />
                    <InfoItem
                      label="Currency"
                      value={userData.preferences.default_currency || "Not set"}
                      icon={DollarSign}
                    />
                    <InfoItem
                      label="Timezone"
                      value={userData.preferences.default_timezone || "Not set"}
                      icon={Clock}
                    />
                  </div>
                )}
              </InfoCard>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Personal Information */}
              <InfoCard
                title="Personal Information"
                icon={User}
                expanded={expandedSections.personal}
                toggleExpand={() => toggleSection("personal")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  <InfoItem
                    label="First Name"
                    value={userData.first_name}
                    icon={User}
                  />
                  <InfoItem
                    label="Last Name"
                    value={userData.last_name}
                    icon={User}
                  />
                  <InfoItem
                    label="Email"
                    value={userData.email}
                    icon={Mail}
                    copyable
                  />
                  <InfoItem
                    label="Phone Number"
                    value={userData.phone_number}
                    icon={Phone}
                  />
                  <InfoItem
                    label="Gender"
                    value={
                      userData.gender
                        ? userData.gender.charAt(0).toUpperCase() +
                          userData.gender.slice(1)
                        : null
                    }
                    icon={User}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(userData.dob)}
                    icon={Calendar}
                  />
                  <InfoItem
                    label="Country"
                    value={userData.country}
                    icon={MapPin}
                  />
                  <InfoItem label="City" value={userData.city} icon={MapPin} />
                </div>
              </InfoCard>

              <InfoCard title="Verification Status" icon={Shield} toggleExpand={undefined}>
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                      <CheckCircle size={32} />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                    {userData.kyc_level === "advanced"
                      ? "Fully Verified"
                      : userData.kyc_level === "intermediate"
                      ? "Partially Verified"
                      : "Basic Verification"}
                  </h3>

                  <p className="text-center text-gray-600 mb-4">
                    {userData.kyc_level === "advanced"
                      ? "This user has completed all verification steps."
                      : userData.kyc_level === "intermediate"
                      ? "This user has completed identity verification."
                      : "This user has completed basic verification."}
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 flex-1">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600">Email</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 flex-1">
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600">Phone</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 flex-1">
                      <div className="flex items-center">
                        <Shield size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600">KYC</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          userData.kyc_level === "advanced"
                            ? "bg-green-100 text-green-800"
                            : userData.kyc_level === "intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {userData.kyc_level === "advanced" ? (
                          <CheckCircle size={12} className="mr-1" />
                        ) : (
                          <AlertCircle size={12} className="mr-1" />
                        )}
                        {userData.kyc_level === "advanced"
                          ? "Complete"
                          : userData.kyc_level === "intermediate"
                          ? "Partial"
                          : "Basic"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Verification Progress
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      {userData.kyc_level === "advanced"
                        ? "100%"
                        : userData.kyc_level === "intermediate"
                        ? "66%"
                        : "33%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{
                        width:
                          userData.kyc_level === "advanced"
                            ? "100%"
                            : userData.kyc_level === "intermediate"
                            ? "66%"
                            : "33%",
                      }}
                    ></div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Activity size={18} className="text-indigo-500 mr-2" />
                Recent Activity
              </h3>
            </div>
            <div className="p-8 text-center">
              <Activity size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg text-gray-700 mb-2">No recent activity</p>
              <p className="text-gray-500">
                This user doesn't have any recent activity.
              </p>
            </div>
          </div>
        )}

        {activeTab === "wallets" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <CreditCard size={18} className="text-indigo-500 mr-2" />
                Wallet Information
              </h3>
            </div>
            <div className="p-8 text-center">
              <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg text-gray-700 mb-2">
                No wallet information
              </p>
              <p className="text-gray-500">
                This user doesn't have any wallet information.
              </p>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Shield size={18} className="text-indigo-500 mr-2" />
                Security Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Shield size={16} className="text-indigo-500 mr-2" />
                    Account Status
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle size={14} className="mr-1.5" />
                    Active
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Clock size={16} className="text-indigo-500 mr-2" />
                    Last Login
                  </h4>
                  <p className="text-gray-700">2 days ago</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-medium text-gray-800 mb-4">
                  Security Settings
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        Two-factor Authentication
                      </p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Not Enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        Account Recovery
                      </p>
                      <p className="text-sm text-gray-500">
                        Setup recovery options for your account
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} className="mr-1" />
                      Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
