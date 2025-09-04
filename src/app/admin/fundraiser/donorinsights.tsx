import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  Users,
  Gift,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader,
  ChevronRight,
  ChevronLeft,
  Eye,
  Heart,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bookmark,
  UserCheck,
  Flag,
  BarChart2,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Settings,
  Briefcase,
  MessageCircle
} from "lucide-react";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Mock data service for donors
const donorService = {
  getDonors: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const donors = Array.from({ length: 50 }).map((_, index) => {
          // Generate random donor data
          const firstNames = ["John", "Sarah", "David", "Mary", "James", "Linda", "Michael", "Patricia", "Robert", "Jennifer"];
          const lastNames = ["Smith", "Johnson", "Kimani", "Ochieng", "Doe", "Williams", "Brown", "Jones", "Miller", "Davis"];
          
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const name = `${firstName} ${lastName}`;
          
          // Random donor status
          const statuses = ["active", "inactive", "new", "recurring", "high_value"];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Random donor info
          const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
          const phone = status === "high_value" ? `+254${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null;
          
          // Random locations in Kenya
          const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", "Machakos", "Malindi", "Kitale", "Naivasha"];
          const location = locations[Math.floor(Math.random() * locations.length)];
          
          // Random dates in the last 2 years
          const daysAgo = Math.floor(Math.random() * 730);
          const firstDonationDate = subDays(new Date(), daysAgo);
          
          // Random donation amounts
          const totalDonated = Math.floor(Math.random() * 50000) + 500;
          const averageDonation = Math.floor(totalDonated / (Math.floor(Math.random() * 10) + 1));
          
          // Random number of donations
          const donationCount = Math.floor(Math.random() * 20) + 1;
          
          // Generate donation history
          const donationHistory = Array.from({ length: donationCount }).map((_, i) => {
            const donationDate = subDays(new Date(), Math.floor(Math.random() * daysAgo));
            const amount = Math.floor(Math.random() * 5000) + 100;
            const campaignTitles = [
              "Medical Fund for Sarah",
              "Build a School in Nakuru",
              "Emergency Relief for Flood Victims",
              "Support Local Artists Initiative",
              "Children's Cancer Treatment Fund",
              "Community Garden Project",
              "Elderly Care Program",
              "Youth Sports Equipment Drive",
              "Scholarship for Underprivileged Students",
              "Wildlife Conservation Effort"
            ];
            
            return {
              id: `don-${index}-${i}`,
              date: donationDate,
              amount,
              campaignId: `camp-${Math.floor(Math.random() * 20) + 1}`,
              campaignTitle: campaignTitles[Math.floor(Math.random() * campaignTitles.length)],
              status: Math.random() > 0.1 ? "completed" : "refunded"
            };
          }).sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // For recurring donors
          const isRecurring = status === "recurring" || Math.random() > 0.7;
          const recurringDetails = isRecurring ? {
            frequency: ["weekly", "monthly", "quarterly"][Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 2000) + 200,
            nextDonationDate: subDays(new Date(), -Math.floor(Math.random() * 30) - 1),
            startedDate: subDays(new Date(), Math.floor(Math.random() * 365) + 30),
            status: ["active", "paused", "cancelled"][Math.floor(Math.random() * 3)],
            recurringCount: Math.floor(Math.random() * 12) + 1
          } : null;
          
          // For high-value donors
          const preferredCommunication = status === "high_value" ? 
            ["email", "phone", "both"][Math.floor(Math.random() * 3)] : "email";
            
          // KYC verification for high-value donors
          const kycVerified = status === "high_value" ? Math.random() > 0.3 : false;
          
          // Notes for some donors
          const hasNotes = Math.random() > 0.7;
          const notes = hasNotes ? [
            {
              id: `note-${index}-1`,
              content: "Donor expressed interest in mentoring scholarship recipients.",
              date: subDays(new Date(), Math.floor(Math.random() * 60) + 1),
              author: "admin"
            },
            {
              id: `note-${index}-2`,
              content: "Donor prefers to be contacted in the evenings after 6 PM.",
              date: subDays(new Date(), Math.floor(Math.random() * 120) + 60),
              author: "system"
            }
          ] : [];
          
          // Generate engagement metrics
          const clickRate = Math.random() * 0.5;
          const openRate = Math.random() * 0.7;
          const responseRate = Math.random() * 0.3;
          
          // Referred other donors
          const referredDonors = Math.floor(Math.random() * 5);
          
          // For some donors, add support tickets
          const supportTicketsCount = Math.floor(Math.random() * 3);
          const supportTickets = supportTicketsCount > 0 ? Array.from({ length: supportTicketsCount }).map((_, i) => {
            const ticketTypes = ["refund_request", "donation_issue", "receipt_request", "account_update", "general_question"];
            const type = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
            const ticketStatuses = ["open", "closed", "in_progress"];
            const ticketStatus = ticketStatuses[Math.floor(Math.random() * ticketStatuses.length)];
            
            return {
              id: `ticket-${index}-${i}`,
              type,
              status: ticketStatus,
              created: subDays(new Date(), Math.floor(Math.random() * 180) + 1),
              lastUpdated: subDays(new Date(), Math.floor(Math.random() * 30) + 1),
              subject: type === "refund_request" 
                ? "Request for donation refund" 
                : type === "donation_issue"
                ? "Issue with donation processing"
                : type === "receipt_request"
                ? "Request for donation receipt"
                : type === "account_update"
                ? "Need to update account information"
                : "Question about campaigns"
            };
          }) : [];
          
          // Random donor tags
          const availableTags = ["regular", "corporate", "high_potential", "newsletter", "event_attendee", "volunteer", "international", "local_business"];
          const tagCount = Math.floor(Math.random() * 4);
          const tags = Array.from(new Set(Array.from({ length: tagCount }).map(() => availableTags[Math.floor(Math.random() * availableTags.length)])));
          
          // Add fraud/suspicious flag for some donors
          const isFlagged = Math.random() < 0.08;
          const flagReason = isFlagged ? 
            ["Unusual donation pattern", "Multiple declined payments", "Suspicious IP activity", "Potential chargeback risk"][Math.floor(Math.random() * 4)] 
            : null;
          
          return {
            id: `donor-${index + 1000}`,
            name,
            email,
            phone,
            location,
            status,
            firstDonationDate,
            totalDonated,
            donationCount,
            averageDonation,
            lastDonationDate: donationHistory[0]?.date,
            donationHistory,
            isRecurring,
            recurringDetails,
            preferredCommunication,
            kycVerified,
            notes,
            clickRate,
            openRate,
            responseRate,
            referredDonors,
            supportTickets,
            tags,
            isFlagged,
            flagReason,
            lastEngagement: Math.random() > 0.5 ? subDays(new Date(), Math.floor(Math.random() * 30)) : null,
            // For high value donors, add occupation and company
            occupation: status === "high_value" ? ["Doctor", "Engineer", "Business Owner", "Teacher", "Lawyer", "Accountant"][Math.floor(Math.random() * 6)] : null,
            company: status === "high_value" ? ["ABC Corporation", "XYZ Limited", "Tech Innovations", "Global Solutions", "Local Enterprise"][Math.floor(Math.random() * 5)] : null
          };
        });
        
        resolve({
          data: donors,
          pagination: {
            page: 1,
            limit: 20,
            total: 50
          }
        });
      }, 1000);
    });
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;
  
  switch (status) {
    case "active":
      bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
      icon = <CheckCircle size={12} className="mr-1.5" />;
      break;
    case "recurring":
      bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      icon = <RefreshCw size={12} className="mr-1.5" />;
      break;
    case "high_value":
      bgColor = "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      icon = <DollarSign size={12} className="mr-1.5" />;
      break;
    case "new":
      bgColor = "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      icon = <Users size={12} className="mr-1.5" />;
      break;
    case "inactive":
      bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
      icon = <Clock size={12} className="mr-1.5" />;
      break;
    default:
      break;
  }
  
  const displayStatus = status === "high_value" 
    ? "High Value" 
    : status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {displayStatus}
    </span>
  );
};

// Tag Component
const DonorTag = ({ tag }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  
  switch (tag) {
    case "regular":
      bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      break;
    case "corporate":
      bgColor = "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400";
      break;
    case "high_potential":
      bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
      break;
    case "newsletter":
      bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      break;
    case "event_attendee":
      bgColor = "bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400";
      break;
    case "volunteer":
      bgColor = "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      break;
    case "international":
      bgColor = "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400";
      break;
    case "local_business":
      bgColor = "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      break;
    default:
      break;
  }
  
  const displayTag = tag.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {displayTag}
    </span>
  );
};

// KYC Verification Badge
const KycBadge = ({ verified }) => {
  return verified ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
      <UserCheck size={12} className="mr-1.5" />
      KYC Verified
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
      <AlertTriangle size={12} className="mr-1.5" />
      KYC Needed
    </span>
  );
};

// Chart Component
const SimpleBarChart = ({ data, title, subtext, valuePrefix = "", className = "" }) => {
  // Find max value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{subtext}</p>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="text-gray-700 dark:text-gray-300">{valuePrefix}{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ value, title, subtitle, className = "" }) => {
  // Calculate the SVG parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">{title}</h3>
      <div className="flex justify-center items-center">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              className="dark:stroke-gray-700"
            />
            
            {/* Foreground circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B81" />
                <stop offset="100%" stopColor="#B75BFF" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DonorInsightsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, donations, engagement, support
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    donationAmount: "all",
    dateRange: "all",
    isRecurring: "all",
    location: "",
    tags: [],
    flagged: false,
    sortBy: "recent",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [statsData, setStatsData] = useState({
    totalDonors: 0,
    activeDonors: 0,
    recurringDonors: 0,
    highValueDonors: 0,
    newDonorsThisMonth: 0,
    flaggedDonors: 0,
  });
  const [newNote, setNewNote] = useState("");

  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await donorService.getDonors();

        setDonors(response.data);
        setFilteredDonors(response.data);
        setPagination(response.pagination);

        // Calculate stats
        const oneMonthAgo = subDays(new Date(), 30);

        const stats = {
          totalDonors: response.data.length,
          activeDonors: response.data.filter(
            (donor) => donor.status === "active"
          ).length,
          recurringDonors: response.data.filter((donor) => donor.isRecurring)
            .length,
          highValueDonors: response.data.filter(
            (donor) => donor.status === "high_value"
          ).length,
          newDonorsThisMonth: response.data.filter((donor) =>
            isAfter(parseISO(donor.firstDonationDate), oneMonthAgo)
          ).length,
          flaggedDonors: response.data.filter((donor) => donor.isFlagged)
            .length,
        };

        setStatsData(stats);
      } catch (error) {
        console.error("Error loading donors:", error);
        toast.error("Failed to load donor data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Close donor details when clicking outside
    const handleClickOutside = (event) => {
      if (selectedDonor && !event.target.closest(".donor-details-panel")) {
        setSelectedDonor(null);
        setActiveTab("overview");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters(filters, donors);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = donors.filter(
      (donor) =>
        donor.name.toLowerCase().includes(lowercaseQuery) ||
        donor.email.toLowerCase().includes(lowercaseQuery) ||
        (donor.location &&
          donor.location.toLowerCase().includes(lowercaseQuery)) ||
        (donor.phone && donor.phone.toLowerCase().includes(lowercaseQuery))
    );

    applyFilters(filters, filtered);
  };

  const applyFilters = (newFilters, items = donors) => {
    setFilters(newFilters);

    let filtered = [...items];

    // Filter by status
    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter((donor) =>
        newFilters.status.includes(donor.status)
      );
    }

    // Filter by donation amount
    if (newFilters.donationAmount !== "all") {
      const amountRanges = {
        small: { min: 0, max: 5000 },
        medium: { min: 5000, max: 20000 },
        large: { min: 20000, max: Infinity },
      };

      const range = amountRanges[newFilters.donationAmount];
      filtered = filtered.filter(
        (donor) =>
          donor.totalDonated >= range.min && donor.totalDonated < range.max
      );
    }

    // Filter by date range (first donation date)
    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "30days": 30,
        "90days": 90,
        "180days": 180,
        "365days": 365,
      };

      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter(
        (donor) => new Date(donor.firstDonationDate) >= cutoffDate
      );
    }

    // Filter by recurring status
    if (newFilters.isRecurring !== "all") {
      const isRecurring = newFilters.isRecurring === "yes";
      filtered = filtered.filter((donor) => donor.isRecurring === isRecurring);
    }

    // Filter by location
    if (newFilters.location) {
      filtered = filtered.filter(
        (donor) =>
          donor.location &&
          donor.location
            .toLowerCase()
            .includes(newFilters.location.toLowerCase())
      );
    }

    // Filter by tags
    if (newFilters.tags && newFilters.tags.length > 0) {
      filtered = filtered.filter((donor) => {
        if (!donor.tags || donor.tags.length === 0) return false;
        return newFilters.tags.some((tag) => donor.tags.includes(tag));
      });
    }

    // Filter flagged donors
    if (newFilters.flagged) {
      filtered = filtered.filter((donor) => donor.isFlagged);
    }

    // Apply sorting
    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case "recent":
          filtered.sort(
            (a, b) =>
              new Date(b.lastDonationDate) - new Date(a.lastDonationDate)
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) =>
              new Date(a.firstDonationDate) - new Date(b.firstDonationDate)
          );
          break;
        case "amount_high":
          filtered.sort((a, b) => b.totalDonated - a.totalDonated);
          break;
        case "amount_low":
          filtered.sort((a, b) => a.totalDonated - b.totalDonated);
          break;
        case "name_az":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_za":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "donations_count":
          filtered.sort((a, b) => b.donationCount - a.donationCount);
          break;
        default:
          break;
      }
    }

    setFilteredDonors(filtered);
  };

  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      donationAmount: "all",
      dateRange: "all",
      isRecurring: "all",
      location: "",
      tags: [],
      flagged: false,
      sortBy: "recent",
    };

    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredDonors(donors);
  };

  const handleExport = () => {
    toast.success("Donor data exported successfully");
  };

  const refreshData = async () => {
    setIsFetching(true);

    try {
      const response = await donorService.getDonors();

      setDonors(response.data);
      setFilteredDonors(response.data);
      setPagination(response.pagination);

      // Calculate stats
      const oneMonthAgo = subDays(new Date(), 30);

      const stats = {
        totalDonors: response.data.length,
        activeDonors: response.data.filter((donor) => donor.status === "active")
          .length,
        recurringDonors: response.data.filter((donor) => donor.isRecurring)
          .length,
        highValueDonors: response.data.filter(
          (donor) => donor.status === "high_value"
        ).length,
        newDonorsThisMonth: response.data.filter((donor) =>
          isAfter(parseISO(donor.firstDonationDate), oneMonthAgo)
        ).length,
        flaggedDonors: response.data.filter((donor) => donor.isFlagged).length,
      };

      setStatsData(stats);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const viewDonorDetails = (donor) => {
    setSelectedDonor(donor);
    setActiveTab("overview");
  };

  const addNote = () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    const newNoteObj = {
      id: `note-${Date.now()}`,
      content: newNote,
      date: new Date(),
      author: "admin",
    };

    // Update the selected donor
    const updatedNotes = [newNoteObj, ...(selectedDonor.notes || [])];

    const updatedDonor = {
      ...selectedDonor,
      notes: updatedNotes,
    };

    // Update in the lists
    setDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
    );

    setFilteredDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
    );

    setSelectedDonor(updatedDonor);
    setNewNote("");
    toast.success("Note added successfully");
  };

  const addTag = (tag) => {
    if (!selectedDonor) return;

    // Check if tag already exists
    if (selectedDonor.tags && selectedDonor.tags.includes(tag)) {
      toast.error("Tag already exists");
      return;
    }

    const updatedTags = [...(selectedDonor.tags || []), tag];

    const updatedDonor = {
      ...selectedDonor,
      tags: updatedTags,
    };

    // Update in the lists
    setDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
    );

    setFilteredDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
    );

    setSelectedDonor(updatedDonor);
    toast.success(`Tag "${tag}" added successfully`);
  };

  const removeTag = (tag) => {
    if (!selectedDonor || !selectedDonor.tags) return;

    const updatedTags = selectedDonor.tags.filter((t) => t !== tag);

    const updatedDonor = {
      ...selectedDonor,
      tags: updatedTags,
    };

    // Update in the lists
    setDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
    );

    setFilteredDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === selectedDonor.id ? updatedDonor : d))
    );

    setSelectedDonor(updatedDonor);
    toast.success(`Tag "${tag}" removed`);
  };

  const flagDonor = (donorId, reason) => {
    const donor = donors.find((d) => d.id === donorId);
    if (!donor) return;

    const flagReason = reason || "Manual flag by admin";

    const updatedDonor = {
      ...donor,
      isFlagged: true,
      flagReason,
    };

    // Update in the lists
    setDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === donorId ? updatedDonor : d))
    );

    setFilteredDonors((prevDonors) =>
      prevDonors.map((d) => (d.id === donorId ? updatedDonor : d))
    );

    // If the selected donor is being flagged, update it too
    if (selectedDonor && selectedDonor.id === donorId) {
      setSelectedDonor(updatedDonor);
    }

    toast.success(`Donor ${donorId} has been flagged: ${flagReason}`);
  };

  const unflagDonor = (donorId) => {
    // Update in the lists
    setDonors((prevDonors) =>
      prevDonors.map((d) =>
        d.id === donorId ? { ...d, isFlagged: false, flagReason: null } : d
      )
    );

    setFilteredDonors((prevDonors) =>
      prevDonors.map((d) =>
        d.id === donorId ? { ...d, isFlagged: false, flagReason: null } : d
      )
    );

    // If the selected donor is being unflagged, update it too
    if (selectedDonor && selectedDonor.id === donorId) {
      setSelectedDonor({
        ...selectedDonor,
        isFlagged: false,
        flagReason: null,
      });
    }

    toast.success(`Flag removed from donor ${donorId}`);
  };

  const sendEmail = () => {
    toast.success(`Email sent to ${selectedDonor.name}`);
  };

  const changePage = (newPage) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination({
        ...pagination,
        page: newPage,
      });

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, pagination.page - delta);
      i <= Math.min(totalPages - 1, pagination.page + delta);
      i++
    ) {
      range.push(i);
    }

    if (pagination.page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-8 w-full mx-auto max-w-[1600px] bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-4 bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <Users className="text-white" size={20} />
            </span>
            Donor Insights
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-14">
            Analyze and manage donor profiles and donation patterns
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={refreshData}
            disabled={isFetching}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Total Donors */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Donors
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.totalDonors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total registered donors
          </p>
        </motion.div>

        {/* Active Donors */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Active Donors
            </p>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.activeDonors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recently active donors
          </p>
        </motion.div>

        {/* Recurring Donors */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Recurring Donors
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RefreshCw size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.recurringDonors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recurring donation subscribers
          </p>
        </motion.div>

        {/* High Value Donors */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              High Value Donors
            </p>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.highValueDonors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Major contributors
          </p>
        </motion.div>

        {/* New Donors */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              New Donors (30d)
            </p>
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.newDonorsThisMonth.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            New donors in last 30 days
          </p>
        </motion.div>

        {/* Flagged Donors */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Flagged Donors
            </p>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <Flag size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.flaggedDonors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Suspicious donor accounts
          </p>
        </motion.div>
      </motion.div>

      {/* Search & Filter Controls */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search donors by name, email, location..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              whileHover={{
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
                backgroundColor: "#f9fafb",
              }}
              whileTap={{ y: 0 }}
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Donor Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Donor Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "active",
                        "inactive",
                        "new",
                        "recurring",
                        "high_value",
                      ].map((status) => (
                        <label
                          key={status}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...filters.status, status]
                                : filters.status.filter((s) => s !== status);
                              handleFilterChange({
                                ...filters,
                                status: newStatus,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {status === "high_value" ? "High Value" : status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Donation Amount Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Donation Amount
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.donationAmount}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          donationAmount: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; 5,000 KES)</option>
                      <option value="medium">
                        Medium (5,000 - 20,000 KES)
                      </option>
                      <option value="large">Large (&gt; 20,000 KES)</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Donation Date
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                      <option value="180days">Last 6 Months</option>
                      <option value="365days">Last Year</option>
                    </select>
                  </div>

                  {/* Recurring Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recurring Status
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.isRecurring}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          isRecurring: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Donors</option>
                      <option value="yes">Recurring Donors Only</option>
                      <option value="no">Non-Recurring Donors Only</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City or region..."
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "regular",
                        "corporate",
                        "high_potential",
                        "newsletter",
                        "volunteer",
                        "international",
                      ].map((tag) => (
                        <label key={tag} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.tags.includes(tag)}
                            onChange={(e) => {
                              const newTags = e.target.checked
                                ? [...filters.tags, tag]
                                : filters.tags.filter((t) => t !== tag);
                              handleFilterChange({
                                ...filters,
                                tags: newTags,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {tag.replace("_", " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Flagged Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Flagged Status
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                          checked={filters.flagged}
                          onChange={(e) => {
                            handleFilterChange({
                              ...filters,
                              flagged: e.target.checked,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Show only flagged donors
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          sortBy: e.target.value,
                        })
                      }
                    >
                      <option value="recent">Recent Donation</option>
                      <option value="oldest">First Donation (Oldest)</option>
                      <option value="amount_high">
                        Total Donated (High to Low)
                      </option>
                      <option value="amount_low">
                        Total Donated (Low to High)
                      </option>
                      <option value="name_az">Name (A-Z)</option>
                      <option value="name_za">Name (Z-A)</option>
                      <option value="donations_count">
                        Number of Donations
                      </option>
                    </select>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <motion.button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-[#FF6B81] dark:text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-xl text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Donors Count Display */}
      <motion.div
        className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <Users size={14} className="mr-2 text-[#FF6B81]" />
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
            {filteredDonors.length}
          </span>
          {filteredDonors.length !== pagination.total && (
            <>
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
                {pagination.total}
              </span>
            </>
          )}
          donors
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={36} className="text-[#FF6B81] animate-spin mr-4" />
          <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Loading donor data...
          </span>
        </div>
      ) : filteredDonors.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm py-16 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-700 rounded-full mb-5">
            <Users size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
            No donors found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <motion.button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-[#FF6B81]/10 text-[#FF6B81] rounded-xl text-sm hover:bg-[#FF6B81]/20 transition-colors shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Clear filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Donors Table */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Donations
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      First/Last Donation
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredDonors.map((donor) => (
                    <tr
                      key={donor.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        donor.isFlagged ? "bg-red-50 dark:bg-red-900/10" : ""
                      }`}
                      onClick={() => viewDonorDetails(donor)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B81]/20 to-[#B75BFF]/20 flex items-center justify-center">
                            <span className="text-lg font-medium text-[#FF6B81]">
                              {donor.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {donor.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {donor.location || "Unknown location"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white mb-1 flex items-center">
                          <Mail size={12} className="mr-1.5" />
                          {donor.email}
                        </div>
                        {donor.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Phone size={12} className="mr-1.5" />
                            {donor.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="mb-2">
                          <StatusBadge status={donor.status} />
                        </div>
                        {donor.isRecurring && (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              <RefreshCw size={10} className="mr-1" />
                              {donor.recurringDetails.frequency
                                .charAt(0)
                                .toUpperCase() +
                                donor.recurringDetails.frequency.slice(1)}
                            </span>
                          </div>
                        )}
                        {donor.tags && donor.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {donor.tags.slice(0, 2).map((tag) => (
                              <DonorTag key={tag} tag={tag} />
                            ))}
                            {donor.tags.length > 2 && (
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                                +{donor.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          KES {donor.totalDonated.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="mr-2">
                            {donor.donationCount} donations
                          </span>
                          <span>
                            Avg: KES {donor.averageDonation.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white flex items-center">
                          <Calendar size={12} className="mr-1.5" />
                          First:{" "}
                          {format(
                            new Date(donor.firstDonationDate),
                            "MMM d, yyyy"
                          )}
                        </div>
                        {donor.lastDonationDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                            <Calendar size={12} className="mr-1.5" />
                            Last:{" "}
                            {format(
                              new Date(donor.lastDonationDate),
                              "MMM d, yyyy"
                            )}
                          </div>
                        )}
                        {donor.isRecurring &&
                          donor.recurringDetails.status === "active" && (
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                              <Calendar size={12} className="mr-1.5" />
                              Next:{" "}
                              {format(
                                new Date(
                                  donor.recurringDetails.nextDonationDate
                                ),
                                "MMM d, yyyy"
                              )}
                            </div>
                          )}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewDonorDetails(donor);
                            }}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                            title="Send Email"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`Sending email to ${donor.name}`);
                            }}
                          >
                            <Mail size={18} />
                          </button>

                          {donor.isFlagged ? (
                            <button
                              className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title={`Flagged: ${donor.flagReason}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                unflagDonor(donor.id);
                              }}
                            >
                              <Flag size={18} />
                            </button>
                          ) : (
                            <button
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Flag Donor"
                              onClick={(e) => {
                                e.stopPropagation();
                                flagDonor(donor.id);
                              }}
                            >
                              <Flag size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {!isLoading && filteredDonors.length > 0 && totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {startItem}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pagination.total}
                    </span>{" "}
                    donors
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === 1
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNumber === "number" &&
                          changePage(pageNumber)
                        }
                        disabled={pageNumber === "..."}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pageNumber === pagination.page
                            ? "bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white shadow-sm"
                            : pageNumber === "..."
                            ? "text-gray-400 dark:text-gray-500 cursor-default"
                            : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === totalPages
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Donor Details Panel */}
      <AnimatePresence>
        {selectedDonor && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedDonor(null);
              setActiveTab("overview");
            }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden donor-details-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-white">
                        {selectedDonor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        {selectedDonor.name}
                        {selectedDonor.isFlagged && (
                          <span className="ml-2 text-xs bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center">
                            <Flag size={10} className="mr-1" />
                            Flagged
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedDonor.id} • First donation:{" "}
                        {format(
                          new Date(selectedDonor.firstDonationDate),
                          "MMMM d, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <StatusBadge status={selectedDonor.status} />
                    {selectedDonor.isRecurring && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        <RefreshCw size={12} className="mr-1.5" />
                        Recurring
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "overview"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "donations"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("donations")}
                  >
                    Donation History
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "engagement"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("engagement")}
                  >
                    Engagement
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "support"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("support")}
                  >
                    Support
                    {selectedDonor.supportTickets &&
                      selectedDonor.supportTickets.length > 0 && (
                        <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                          {selectedDonor.supportTickets.length}
                        </span>
                      )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Contact Information */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Mail
                              className="text-gray-400 mt-0.5 mr-3"
                              size={16}
                            />
                            <div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                Email
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedDonor.email}
                              </p>
                            </div>
                          </div>

                          {selectedDonor.phone && (
                            <div className="flex items-start">
                              <Phone
                                className="text-gray-400 mt-0.5 mr-3"
                                size={16}
                              />
                              <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  Phone
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {selectedDonor.phone}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedDonor.location && (
                            <div className="flex items-start">
                              <MapPin
                                className="text-gray-400 mt-0.5 mr-3"
                                size={16}
                              />
                              <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  Location
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {selectedDonor.location}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedDonor.status === "high_value" && (
                            <>
                              {selectedDonor.occupation && (
                                <div className="flex items-start">
                                  <Briefcase
                                    className="text-gray-400 mt-0.5 mr-3"
                                    size={16}
                                  />
                                  <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      Occupation
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {selectedDonor.occupation}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {selectedDonor.company && (
                                <div className="flex items-start">
                                  <Briefcase
                                    className="text-gray-400 mt-0.5 mr-3"
                                    size={16}
                                  />
                                  <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      Company
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {selectedDonor.company}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          <div className="flex items-start">
                            <MessageSquare
                              className="text-gray-400 mt-0.5 mr-3"
                              size={16}
                            />
                            <div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                Preferred Communication
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {selectedDonor.preferredCommunication ||
                                  "Email"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          {selectedDonor.status === "high_value" && (
                            <div className="mb-3">
                              <KycBadge verified={selectedDonor.kycVerified} />
                            </div>
                          )}

                          <button
                            className="w-full px-4 py-2 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm hover:bg-[#FF6B81]/20 transition-colors mt-2"
                            onClick={sendEmail}
                          >
                            <Mail size={14} className="inline mr-2" />
                            Send Email
                          </button>
                        </div>
                      </div>

                      {/* Donation Summary */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Donation Summary
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Total Donated
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              KES {selectedDonor.totalDonated.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Total Donations
                              </p>
                              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                {selectedDonor.donationCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Average Donation
                              </p>
                              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                KES{" "}
                                {selectedDonor.averageDonation.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              First Donation
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {format(
                                new Date(selectedDonor.firstDonationDate),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          </div>

                          {selectedDonor.lastDonationDate && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Last Donation
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {format(
                                  new Date(selectedDonor.lastDonationDate),
                                  "MMMM d, yyyy"
                                )}
                              </p>
                            </div>
                          )}

                          {selectedDonor.isRecurring && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Recurring Donation
                                </p>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    selectedDonor.recurringDetails.status ===
                                    "active"
                                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                      : selectedDonor.recurringDetails
                                          .status === "paused"
                                      ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                  }`}
                                >
                                  {selectedDonor.recurringDetails.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    selectedDonor.recurringDetails.status.slice(
                                      1
                                    )}
                                </span>
                              </div>

                              <p className="text-sm text-gray-900 dark:text-white flex justify-between">
                                <span>Amount:</span>
                                <span className="font-medium">
                                  KES{" "}
                                  {selectedDonor.recurringDetails.amount.toLocaleString()}
                                </span>
                              </p>

                              <p className="text-sm text-gray-900 dark:text-white flex justify-between">
                                <span>Frequency:</span>
                                <span className="font-medium capitalize">
                                  {selectedDonor.recurringDetails.frequency}
                                </span>
                              </p>

                              <p className="text-sm text-gray-900 dark:text-white flex justify-between">
                                <span>Started:</span>
                                <span className="font-medium">
                                  {format(
                                    new Date(
                                      selectedDonor.recurringDetails.startedDate
                                    ),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </p>

                              {selectedDonor.recurringDetails.status ===
                                "active" && (
                                <p className="text-sm text-gray-900 dark:text-white flex justify-between mt-1">
                                  <span>Next donation:</span>
                                  <span className="font-medium">
                                    {format(
                                      new Date(
                                        selectedDonor.recurringDetails.nextDonationDate
                                      ),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags & Notes */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Tags & Notes
                        </h3>
                        <div className="mb-5">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Donor Tags
                          </p>
                          {selectedDonor.tags &&
                          selectedDonor.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedDonor.tags.map((tag) => (
                                <div key={tag} className="flex items-center">
                                  <DonorTag tag={tag} />
                                  <button
                                    className="ml-1 text-gray-400 hover:text-red-500"
                                    onClick={() => removeTag(tag)}
                                  >
                                    <XCircle size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No tags added
                            </p>
                          )}

                          <div className="mt-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              Add Tag
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "regular",
                                "corporate",
                                "high_potential",
                                "newsletter",
                                "volunteer",
                                "international",
                              ]
                                .filter(
                                  (tag) =>
                                    !selectedDonor.tags ||
                                    !selectedDonor.tags.includes(tag)
                                )
                                .slice(0, 4)
                                .map((tag) => (
                                  <button
                                    key={tag}
                                    className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                    onClick={() => addTag(tag)}
                                  >
                                    +{" "}
                                    {tag
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Add Note
                          </p>
                          <textarea
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent min-h-[80px]"
                            placeholder="Add notes about this donor..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          ></textarea>
                          <button
                            className="mt-2 px-4 py-1.5 text-white bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] rounded-lg text-sm hover:opacity-90 transition-colors"
                            onClick={addNote}
                          >
                            Add Note
                          </button>
                        </div>

                        {selectedDonor.notes &&
                          selectedDonor.notes.length > 0 && (
                            <div className="mt-6">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Notes History
                              </p>
                              <div className="space-y-3">
                                {selectedDonor.notes.map((note) => (
                                  <div
                                    key={note.id}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                                  >
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      {note.content}
                                    </p>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      <span>{note.author}</span>
                                      <span>
                                        {format(
                                          new Date(note.date),
                                          "MMM d, yyyy"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Analytics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recent Donation Trends */}
                      <SimpleBarChart
                        data={[
                          {
                            label: "This Month",
                            value: Math.floor(Math.random() * 10000) + 500,
                          },
                          {
                            label: "1 Month Ago",
                            value: Math.floor(Math.random() * 10000) + 500,
                          },
                          {
                            label: "2 Months Ago",
                            value: Math.floor(Math.random() * 10000) + 500,
                          },
                          {
                            label: "3 Months Ago",
                            value: Math.floor(Math.random() * 10000) + 500,
                          },
                        ]}
                        title="Recent Donation Trends"
                        subtext="Monthly donation amounts"
                        valuePrefix="KES "
                      />

                      {/* Campaign Distribution */}
                      <SimpleBarChart
                        data={Array.from(
                          new Set(
                            selectedDonor.donationHistory.map(
                              (d) => d.campaignTitle
                            )
                          )
                        )
                          .slice(0, 5)
                          .map((campaign) => ({
                            label: campaign,
                            value: selectedDonor.donationHistory
                              .filter((d) => d.campaignTitle === campaign)
                              .reduce((sum, d) => sum + d.amount, 0),
                          }))
                          .sort((a, b) => b.value - a.value)}
                        title="Donation Distribution by Campaign"
                        subtext="Top campaigns supported"
                        valuePrefix="KES "
                      />

                      {/* Engagement Rate Chart */}
                      <div className="grid grid-cols-2 gap-4">
                        <DonutChart
                          value={Math.floor(selectedDonor.openRate * 100)}
                          title="Email Open Rate"
                          subtitle="of emails"
                        />
                        <DonutChart
                          value={Math.floor(selectedDonor.clickRate * 100)}
                          title="Email Click Rate"
                          subtitle="of emails"
                        />
                      </div>

                      {/* Referral Stats */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Referrals & Engagement
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                          Donor influence and engagement metrics
                        </p>

                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                <Users size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Referred Donors
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  New donors brought in
                                </p>
                              </div>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {selectedDonor.referredDonors}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                                <MessageCircle size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Response Rate
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Communication engagement
                                </p>
                              </div>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {Math.round(selectedDonor.responseRate * 100)}%
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                                <Calendar size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Last Engagement
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Recent interaction
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDonor.lastEngagement
                                ? format(
                                    new Date(selectedDonor.lastEngagement),
                                    "MMM d, yyyy"
                                  )
                                : "No recent engagement"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Donations Tab */}
                {activeTab === "donations" && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Donation History
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Complete record of donations from {selectedDonor.name}
                      </p>
                    </div>

                    {selectedDonor.donationHistory &&
                    selectedDonor.donationHistory.length > 0 ? (
                      <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Campaign
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {selectedDonor.donationHistory.map((donation) => (
                              <tr
                                key={donation.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {format(
                                      new Date(donation.date),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(donation.date), "h:mm a")}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    KES {donation.amount.toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 dark:text-white line-clamp-1">
                                    {donation.campaignTitle}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {donation.campaignId}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {donation.status === "completed" ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                      <CheckCircle
                                        size={12}
                                        className="mr-1.5"
                                      />
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                      <RotateCcw size={12} className="mr-1.5" />
                                      Refunded
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <button
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    onClick={() =>
                                      toast.success(
                                        `Viewing donation details: ${donation.id}`
                                      )
                                    }
                                  >
                                    <ExternalLink size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                          <Gift
                            size={24}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                          No donations found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          This donor hasn't made any donations yet.
                        </p>
                      </div>
                    )}

                    {/* Donation Patterns */}
                    {selectedDonor.donationHistory &&
                      selectedDonor.donationHistory.length > 1 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                              Donation Patterns
                            </h3>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Most Common Amount
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    KES{" "}
                                    {
                                      Object.entries(
                                        selectedDonor.donationHistory.reduce(
                                          (acc, donation) => {
                                            acc[donation.amount] =
                                              (acc[donation.amount] || 0) + 1;
                                            return acc;
                                          },
                                          {}
                                        )
                                      ).sort((a, b) => b[1] - a[1])[0][0]
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Largest Donation
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    KES{" "}
                                    {Math.max(
                                      ...selectedDonor.donationHistory.map(
                                        (d) => d.amount
                                      )
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Donation Frequency
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {Math.round(
                                      (new Date().getTime() -
                                        new Date(
                                          selectedDonor.firstDonationDate
                                        ).getTime()) /
                                        (1000 *
                                          60 *
                                          60 *
                                          24 *
                                          selectedDonor.donationCount)
                                    )}{" "}
                                    days
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Average time between donations
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Favorite Campaign
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {Object.entries(
                                      selectedDonor.donationHistory.reduce(
                                        (acc, donation) => {
                                          acc[donation.campaignTitle] =
                                            (acc[donation.campaignTitle] || 0) +
                                            1;
                                          return acc;
                                        },
                                        {}
                                      )
                                    )
                                      .sort((a, b) => b[1] - a[1])[0][0]
                                      .split(" ")
                                      .slice(0, 2)
                                      .join(" ")}
                                    ...
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                              Growth Trends
                            </h3>
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                                  <TrendingUp size={18} />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Growth in Average Donation
                                  </p>
                                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {Math.floor(Math.random() * 40) + 5}%
                                    <span className="text-emerald-600 dark:text-emerald-400 text-sm ml-1">
                                      <ArrowUp size={12} className="inline" />{" "}
                                      Increase
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <p className="mb-2">Recommended Actions:</p>
                              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start">
                                  <ThumbsUp
                                    size={16}
                                    className="text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5"
                                  />
                                  {selectedDonor.isRecurring
                                    ? "Send thank-you for ongoing support"
                                    : "Invite to become a recurring donor"}
                                </li>
                                <li className="flex items-start">
                                  <ThumbsUp
                                    size={16}
                                    className="text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5"
                                  />
                                  {selectedDonor.status === "high_value"
                                    ? "Invite to special donor events"
                                    : "Send impact report on favorite campaign"}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Engagement Tab */}
                {activeTab === "engagement" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Engagement */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Email Engagement
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Open Rate
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {Math.round(selectedDonor.openRate * 100)}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            vs. {Math.round(Math.random() * 30 + 40)}% avg
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Click Rate
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {Math.round(selectedDonor.clickRate * 100)}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            vs. {Math.round(Math.random() * 15 + 10)}% avg
                          </p>
                        </div>
                      </div>

                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Recent Campaigns Engaged With
                      </h4>
                      <ul className="space-y-2">
                        {selectedDonor.donationHistory
                          .slice(0, 3)
                          .map((donation) => (
                            <li
                              key={donation.id}
                              className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                {donation.campaignTitle}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(
                                    new Date(donation.date),
                                    "MMM d, yyyy"
                                  )}
                                </div>
                                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                  KES {donation.amount.toLocaleString()}
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>

                    {/* Channel Preferences */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Communication Preferences
                      </h3>

                      <div className="mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Preferred Channels
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <div className="flex items-center">
                              <Mail className="text-gray-400 mr-3" size={18} />
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Email
                              </p>
                            </div>
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                                style={{
                                  width: `${selectedDonor.openRate * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          {selectedDonor.phone && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <div className="flex items-center">
                                <Phone
                                  className="text-gray-400 mr-3"
                                  size={18}
                                />
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Phone
                                </p>
                              </div>
                              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                                  style={{
                                    width: `${
                                      selectedDonor.preferredCommunication ===
                                        "phone" ||
                                      selectedDonor.preferredCommunication ===
                                        "both"
                                        ? 85
                                        : 40
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommended Engagement Strategies */}
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Engagement Recommendations
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg">
                          <CheckCircle
                            size={18}
                            className="text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDonor.openRate > 0.5
                                ? "Send targeted campaign updates"
                                : "Re-engage with special impact story"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {selectedDonor.openRate > 0.5
                                ? "Donor shows high email engagement"
                                : "Donor may need re-engagement content"}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg">
                          <CheckCircle
                            size={18}
                            className="text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDonor.donationCount > 5
                                ? "Invite to donor appreciation event"
                                : "Share success stories from funded projects"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {selectedDonor.donationCount > 5
                                ? "Loyal donor deserves recognition"
                                : "Build stronger connection to impact"}
                            </p>
                          </div>
                        </li>
                      </ul>

                      <div className="mt-6">
                        <button
                          className="w-full px-4 py-2 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm hover:bg-[#FF6B81]/20 transition-colors"
                          onClick={() =>
                            toast.success(
                              `Engagement campaign scheduled for ${selectedDonor.name}`
                            )
                          }
                        >
                          <Mail size={14} className="inline mr-2" />
                          Schedule Engagement Campaign
                        </button>
                      </div>
                    </div>

                    {/* Referrals */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Referrals & Influence
                      </h3>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Referred Donors
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {selectedDonor.referredDonors}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Value Created
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              KES{" "}
                              {(
                                selectedDonor.referredDonors *
                                (Math.random() * 3000 + 2000)
                              ).toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Network Influence Score
                      </h4>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-1">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                          style={{
                            width: `${
                              (selectedDonor.referredDonors / 4) * 50 +
                              selectedDonor.responseRate * 50
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>

                      {/* Referral campaign suggestions */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Suggested Referral Campaigns
                        </h4>
                        <ul className="space-y-2">
                          <li className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDonor.referredDonors > 1
                                ? "Friend Matching Campaign"
                                : "First-Time Referral Bonus"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {selectedDonor.referredDonors > 1
                                ? "Matching donation for each referred friend"
                                : "Special recognition for first successful referral"}
                            </p>
                          </li>
                          <li className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Social Media Ambassador
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Invite to share campaign on social platforms
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Donation Behavior */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Donation Behavior
                      </h3>

                      <div className="mb-6 space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Causes of Interest
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(
                              new Set(
                                selectedDonor.donationHistory.map((d) => {
                                  const title = d.campaignTitle.toLowerCase();
                                  if (
                                    title.includes("medical") ||
                                    title.includes("cancer")
                                  )
                                    return "Medical";
                                  if (
                                    title.includes("school") ||
                                    title.includes("education") ||
                                    title.includes("scholarship")
                                  )
                                    return "Education";
                                  if (
                                    title.includes("emergency") ||
                                    title.includes("relief")
                                  )
                                    return "Emergency Relief";
                                  if (
                                    title.includes("community") ||
                                    title.includes("local")
                                  )
                                    return "Community";
                                  if (
                                    title.includes("wildlife") ||
                                    title.includes("conservation")
                                  )
                                    return "Conservation";
                                  if (
                                    title.includes("children") ||
                                    title.includes("youth")
                                  )
                                    return "Children";
                                  return "Other";
                                })
                              )
                            ).map((cause) => (
                              <span
                                key={cause}
                                className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              >
                                {cause}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Donation Patterns
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Donation Timing
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {selectedDonor.donationHistory.length > 3
                                  ? "Regular Giver"
                                  : "Event Responder"}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Donation Size
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {selectedDonor.totalDonated > 10000
                                  ? "Major Donor"
                                  : selectedDonor.totalDonated > 5000
                                  ? "Mid-Level"
                                  : "Grassroots"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Next Best Actions
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                          <Heart
                            size={18}
                            className="text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDonor.donationHistory.length > 5
                                ? "Invite to recurring giving program"
                                : "Share impact stories from favorite cause"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Suggested contact time:{" "}
                              {Math.random() > 0.5 ? "Morning" : "Evening"}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                          <Heart
                            size={18}
                            className="text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedDonor.status === "high_value"
                                ? "Personal thank you call"
                                : "Send campaign update with testimonials"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Reinforce impact of donations
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Support Tab */}
                {activeTab === "support" && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Support Tickets
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Support history and inquiries from {selectedDonor.name}
                      </p>
                    </div>

                    {selectedDonor.supportTickets &&
                    selectedDonor.supportTickets.length > 0 ? (
                      <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Subject
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {selectedDonor.supportTickets.map((ticket) => (
                              <tr
                                key={ticket.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {format(
                                      new Date(ticket.created),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Last updated:{" "}
                                    {format(
                                      new Date(ticket.lastUpdated),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 dark:text-white">
                                    {ticket.subject}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {ticket.id}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      ticket.type === "refund_request"
                                        ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        : ticket.type === "donation_issue"
                                        ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                        : ticket.type === "receipt_request"
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        : ticket.type === "account_update"
                                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {ticket.type
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {ticket.status === "open" ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                      Open
                                    </span>
                                  ) : ticket.status === "in_progress" ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                      In Progress
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                      Closed
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <button
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    onClick={() =>
                                      toast.success(
                                        `Viewing ticket details: ${ticket.id}`
                                      )
                                    }
                                  >
                                    <ExternalLink size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                          <MessageCircle
                            size={24}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                          No support tickets found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          This donor hasn't opened any support tickets.
                        </p>
                      </div>
                    )}

                    {/* Communication Preferences */}
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Donor Communication Preferences
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Contact Channels
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Mail
                                  className="text-gray-400 mr-3"
                                  size={16}
                                />
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Email Updates
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                                  Subscribed
                                </span>
                                <div className="w-10 h-5 relative inline-flex items-center rounded-full bg-emerald-500">
                                  <span className="absolute right-1 w-3 h-3 rounded-full bg-white"></span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Mail
                                  className="text-gray-400 mr-3"
                                  size={16}
                                />
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Newsletter
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                                  Subscribed
                                </span>
                                <div className="w-10 h-5 relative inline-flex items-center rounded-full bg-emerald-500">
                                  <span className="absolute right-1 w-3 h-3 rounded-full bg-white"></span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Phone
                                  className="text-gray-400 mr-3"
                                  size={16}
                                />
                                <p className="text-sm text-gray-900 dark:text-white">
                                  SMS Updates
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                                  {selectedDonor.phone
                                    ? "Opted In"
                                    : "No phone"}
                                </span>
                                <div
                                  className={`w-10 h-5 relative inline-flex items-center rounded-full ${
                                    selectedDonor.phone
                                      ? "bg-emerald-500"
                                      : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                >
                                  <span
                                    className={`absolute ${
                                      selectedDonor.phone ? "right-1" : "left-1"
                                    } w-3 h-3 rounded-full bg-white`}
                                  ></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Notification Preferences
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-start">
                                <Info
                                  className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                  size={16}
                                />
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Campaign Updates
                                </p>
                              </div>
                              <div className="w-10 h-5 relative inline-flex items-center rounded-full bg-emerald-500">
                                <span className="absolute right-1 w-3 h-3 rounded-full bg-white"></span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-start">
                                <Info
                                  className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                  size={16}
                                />
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Donation Receipts
                                </p>
                              </div>
                              <div className="w-10 h-5 relative inline-flex items-center rounded-full bg-emerald-500">
                                <span className="absolute right-1 w-3 h-3 rounded-full bg-white"></span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-start">
                                <Info
                                  className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                  size={16}
                                />
                                <p className="text-sm text-gray-900 dark:text-white">
                                  Impact Reports
                                </p>
                              </div>
                              <div className="w-10 h-5 relative inline-flex items-center rounded-full bg-emerald-500">
                                <span className="absolute right-1 w-3 h-3 rounded-full bg-white"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          className="w-full px-4 py-2 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm hover:bg-[#FF6B81]/20 transition-colors"
                          onClick={() =>
                            toast.success(
                              `Communication preferences updated for ${selectedDonor.name}`
                            )
                          }
                        >
                          <Settings size={14} className="inline mr-2" />
                          Update Communication Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-between gap-4">
                <div>
                  <button
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      setSelectedDonor(null);
                      setActiveTab("overview");
                    }}
                  >
                    <XCircle size={16} className="inline mr-2" />
                    Close
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-5 py-2.5 text-[#FF6B81] bg-[#FF6B81]/10 hover:bg-[#FF6B81]/20 rounded-xl text-sm transition-colors"
                    onClick={() =>
                      toast.success(
                        `Viewing all donations from ${selectedDonor.name}`
                      )
                    }
                  >
                    <Gift size={16} className="inline mr-2" />
                    View All Donations
                  </button>

                  <button
                    className="px-5 py-2.5 text-white bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] rounded-xl text-sm transition-colors shadow-sm hover:opacity-90"
                    onClick={sendEmail}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Send Email
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DonorInsightsPage;