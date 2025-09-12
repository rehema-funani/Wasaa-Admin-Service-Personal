import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  UserCheck,
  Image as ImageIcon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  BarChart2,
  Clock as ClockIcon,
  Flag,
  User,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  ExternalLink,
  X,
  Upload,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Info,
  HelpCircle,
  Settings
} from "lucide-react";

const KYCVerificationQueuePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [filters, setFilters] = useState({
    status: "all", 
    priority: "all", 
    dateRange: "all", 
    documentType: "all" // all, businessRegistration, taxCertificate, ownerIdentification, etc.
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [stats, setStats] = useState({
    totalPending: 0,
    approvedToday: 0,
    rejectedToday: 0,
    averageProcessingTime: 0
  });
  const [notesInput, setNotesInput] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  
  const sampleVerificationRequests = [
    {
      id: "VER-2024-0001",
      businessId: "BUS-001",
      businessName: "TechnoHub Solutions",
      ownerName: "John Kamau",
      submissionDate: "2024-04-05T08:30:00Z",
      status: "pending",
      priority: "high",
      documentsCount: 3,
      contact: {
        email: "john@technohub.co.ke",
        phone: "+254 712 345 678"
      },
      location: "Nairobi, Kenya",
      notes: "Submitted all required documents. Owner ID requires additional verification.",
      documents: [
        {
          id: "DOC-001",
          type: "businessRegistration",
          name: "Business Registration Certificate",
          dateUploaded: "2024-04-05T08:25:00Z",
          fileUrl: "https://example.com/documents/business-reg.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "1.2 MB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-002",
          type: "taxCertificate",
          name: "KRA Tax PIN Certificate",
          dateUploaded: "2024-04-05T08:27:00Z",
          fileUrl: "https://example.com/documents/tax-cert.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "850 KB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-003",
          type: "ownerIdentification",
          name: "Owner ID Document",
          dateUploaded: "2024-04-05T08:29:00Z",
          fileUrl: "https://example.com/documents/owner-id.jpg",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "flagged",
          fileSize: "1.5 MB",
          mimeType: "image/jpeg",
          flag: "ID expiration date unclear"
        }
      ]
    },
    {
      id: "VER-2024-0002",
      businessId: "BUS-002",
      businessName: "Sunshine Grocers",
      ownerName: "Mary Wanjiku",
      submissionDate: "2024-04-04T15:20:00Z",
      status: "pending",
      priority: "medium",
      documentsCount: 4,
      contact: {
        email: "mary@sunshinegrocers.co.ke",
        phone: "+254 722 987 654"
      },
      location: "Mombasa, Kenya",
      notes: "Business registration certificate appears to be expired. Follow up required.",
      documents: [
        {
          id: "DOC-004",
          type: "businessRegistration",
          name: "Business Registration Certificate",
          dateUploaded: "2024-04-04T15:15:00Z",
          fileUrl: "https://example.com/documents/sunshine-reg.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "flagged",
          fileSize: "1.1 MB",
          mimeType: "application/pdf",
          flag: "Certificate appears expired"
        },
        {
          id: "DOC-005",
          type: "taxCertificate",
          name: "KRA Tax PIN Certificate",
          dateUploaded: "2024-04-04T15:17:00Z",
          fileUrl: "https://example.com/documents/sunshine-tax.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "920 KB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-006",
          type: "ownerIdentification",
          name: "Owner ID Document",
          dateUploaded: "2024-04-04T15:18:00Z",
          fileUrl: "https://example.com/documents/mary-id.jpg",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "1.3 MB",
          mimeType: "image/jpeg"
        },
        {
          id: "DOC-007",
          type: "utilityBill",
          name: "Utility Bill",
          dateUploaded: "2024-04-04T15:19:00Z",
          fileUrl: "https://example.com/documents/sunshine-utility.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "750 KB",
          mimeType: "application/pdf"
        }
      ]
    },
    {
      id: "VER-2024-0003",
      businessId: "BUS-003",
      businessName: "EcoTech Solutions",
      ownerName: "David Ochieng",
      submissionDate: "2024-04-03T10:45:00Z",
      status: "approved",
      priority: "medium",
      documentsCount: 3,
      approvedBy: "Jane Admin",
      approvedDate: "2024-04-06T09:30:00Z",
      contact: {
        email: "david@ecotech.co.ke",
        phone: "+254 733 456 789"
      },
      location: "Kisumu, Kenya",
      notes: "All documents verified successfully. Business approval granted.",
      documents: [
        {
          id: "DOC-008",
          type: "businessRegistration",
          name: "Business Registration Certificate",
          dateUploaded: "2024-04-03T10:40:00Z",
          fileUrl: "https://example.com/documents/ecotech-reg.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "approved",
          fileSize: "1.4 MB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-009",
          type: "taxCertificate",
          name: "KRA Tax PIN Certificate",
          dateUploaded: "2024-04-03T10:42:00Z",
          fileUrl: "https://example.com/documents/ecotech-tax.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "approved",
          fileSize: "980 KB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-010",
          type: "ownerIdentification",
          name: "Owner ID Document",
          dateUploaded: "2024-04-03T10:44:00Z",
          fileUrl: "https://example.com/documents/david-id.jpg",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "approved",
          fileSize: "1.2 MB",
          mimeType: "image/jpeg"
        }
      ]
    },
    {
      id: "VER-2024-0004",
      businessId: "BUS-004",
      businessName: "Urban Styles Boutique",
      ownerName: "Sarah Mwangi",
      submissionDate: "2024-04-02T14:10:00Z",
      status: "rejected",
      priority: "low",
      documentsCount: 3,
      rejectedBy: "John Admin",
      rejectedDate: "2024-04-05T11:20:00Z",
      rejectionReason: "Business registration certificate is invalid. Tax certificate appears to be manipulated.",
      contact: {
        email: "sarah@urbanstyles.co.ke",
        phone: "+254 744 789 012"
      },
      location: "Nakuru, Kenya",
      notes: "Document verification failed. Suspected document forgery.",
      documents: [
        {
          id: "DOC-011",
          type: "businessRegistration",
          name: "Business Registration Certificate",
          dateUploaded: "2024-04-02T14:05:00Z",
          fileUrl: "https://example.com/documents/urban-reg.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "rejected",
          fileSize: "1.1 MB",
          mimeType: "application/pdf",
          flag: "Certificate appears forged"
        },
        {
          id: "DOC-012",
          type: "taxCertificate",
          name: "KRA Tax PIN Certificate",
          dateUploaded: "2024-04-02T14:07:00Z",
          fileUrl: "https://example.com/documents/urban-tax.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "rejected",
          fileSize: "890 KB",
          mimeType: "application/pdf",
          flag: "Signs of manipulation detected"
        },
        {
          id: "DOC-013",
          type: "ownerIdentification",
          name: "Owner ID Document",
          dateUploaded: "2024-04-02T14:09:00Z",
          fileUrl: "https://example.com/documents/sarah-id.jpg",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "1.3 MB",
          mimeType: "image/jpeg"
        }
      ]
    },
    {
      id: "VER-2024-0005",
      businessId: "BUS-005",
      businessName: "Savanna Tours & Safaris",
      ownerName: "James Kipchoge",
      submissionDate: "2024-04-06T09:15:00Z",
      status: "pending",
      priority: "high",
      documentsCount: 5,
      contact: {
        email: "james@savannatours.co.ke",
        phone: "+254 755 234 567"
      },
      location: "Nairobi, Kenya",
      notes: "Tourism license needs special verification with Tourism Board.",
      documents: [
        {
          id: "DOC-014",
          type: "businessRegistration",
          name: "Business Registration Certificate",
          dateUploaded: "2024-04-06T09:05:00Z",
          fileUrl: "https://example.com/documents/savanna-reg.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "1.5 MB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-015",
          type: "taxCertificate",
          name: "KRA Tax PIN Certificate",
          dateUploaded: "2024-04-06T09:07:00Z",
          fileUrl: "https://example.com/documents/savanna-tax.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "950 KB",
          mimeType: "application/pdf"
        },
        {
          id: "DOC-016",
          type: "ownerIdentification",
          name: "Owner ID Document",
          dateUploaded: "2024-04-06T09:09:00Z",
          fileUrl: "https://example.com/documents/james-id.jpg",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "1.4 MB",
          mimeType: "image/jpeg"
        },
        {
          id: "DOC-017",
          type: "businessPermit",
          name: "Tourism License",
          dateUploaded: "2024-04-06T09:11:00Z",
          fileUrl: "https://example.com/documents/tourism-license.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "flagged",
          fileSize: "1.2 MB",
          mimeType: "application/pdf",
          flag: "Requires verification with Tourism Board"
        },
        {
          id: "DOC-018",
          type: "utilityBill",
          name: "Utility Bill",
          dateUploaded: "2024-04-06T09:13:00Z",
          fileUrl: "https://example.com/documents/savanna-utility.pdf",
          thumbnailUrl: "https://via.placeholder.com/200x150",
          status: "pending",
          fileSize: "780 KB",
          mimeType: "application/pdf"
        }
      ]
    }
  ];
  
  const documentTypeLabels = {
    businessRegistration: "Business Registration",
    taxCertificate: "Tax Certificate",
    ownerIdentification: "Owner ID",
    utilityBill: "Utility Bill",
    businessPermit: "Business Permit",
    bankStatement: "Bank Statement"
  };
  
  useEffect(() => {
    fetchVerificationRequests();
  }, [currentPage, itemsPerPage, filters]);
  
  const fetchVerificationRequests = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        setVerificationRequests(sampleVerificationRequests);
        setFilteredRequests(applyFilters(sampleVerificationRequests));
        setTotalItems(sampleVerificationRequests.length);
        
        // Calculate stats
        const pendingCount = sampleVerificationRequests.filter(req => req.status === "pending").length;
        const approvedToday = sampleVerificationRequests.filter(req => 
          req.status === "approved" && 
          new Date(req.approvedDate).toDateString() === new Date().toDateString()
        ).length;
        const rejectedToday = sampleVerificationRequests.filter(req => 
          req.status === "rejected" && 
          new Date(req.rejectedDate).toDateString() === new Date().toDateString()
        ).length;
        
        setStats({
          totalPending: pendingCount,
          approvedToday,
          rejectedToday,
          averageProcessingTime: 32 // in hours, would be calculated from real data
        });
        
        setIsLoading(false);
      }, 1000);
      
      // In a real app, you would fetch verification requests from the API
      // const response = await kycService.getVerificationRequests({
      //   page: currentPage,
      //   limit: itemsPerPage,
      //   ...filters
      // });
      // setVerificationRequests(response.data);
      // setTotalItems(response.total);
      // setStats(response.stats);
    } catch (error) {
      console.error("Error fetching verification requests:", error);
      setIsLoading(false);
    }
  };
  
  const applyFilters = (requests) => {
    return requests.filter(request => {
      // Apply status filter
      if (filters.status !== "all" && request.status !== filters.status) {
        return false;
      }
      
      // Apply priority filter
      if (filters.priority !== "all" && request.priority !== filters.priority) {
        return false;
      }
      
      // Apply date range filter
      if (filters.dateRange !== "all") {
        const submissionDate = new Date(request.submissionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (filters.dateRange === "today") {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (submissionDate < today || submissionDate >= tomorrow) {
            return false;
          }
        } else if (filters.dateRange === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (submissionDate < weekAgo) {
            return false;
          }
        } else if (filters.dateRange === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          if (submissionDate < monthAgo) {
            return false;
          }
        }
      }
      
      // Apply document type filter
      if (filters.documentType !== "all") {
        const hasDocumentType = request.documents.some(
          doc => doc.type === filters.documentType
        );
        if (!hasDocumentType) {
          return false;
        }
      }
      
      // Apply search term
      if (searchTerm.trim()) {
        const lowercaseSearch = searchTerm.toLowerCase();
        return (
          request.businessName.toLowerCase().includes(lowercaseSearch) ||
          request.ownerName.toLowerCase().includes(lowercaseSearch) ||
          request.id.toLowerCase().includes(lowercaseSearch) ||
          request.businessId.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      return true;
    });
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredRequests(applyFilters(verificationRequests.filter(request => {
      const lowercaseSearch = e.target.value.toLowerCase();
      return (
        request.businessName.toLowerCase().includes(lowercaseSearch) ||
        request.ownerName.toLowerCase().includes(lowercaseSearch) ||
        request.id.toLowerCase().includes(lowercaseSearch) ||
        request.businessId.toLowerCase().includes(lowercaseSearch)
      );
    })));
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };
  
  const resetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      dateRange: "all",
      documentType: "all"
    });
    setShowFilterModal(false);
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  
  const viewRequest = (request: any) => {
    setSelectedRequest(request);
  };
  
  const closeRequestDetails = () => {
    setSelectedRequest(null);
    setNotesInput("");
  };
  
  const viewDocument = (document: any) => {
    setCurrentDocument(document);
    setShowDocumentViewer(true);
  };
  
  const approveDocument = (documentId: string) => {
    const updatedDocuments = selectedRequest.documents.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, status: "approved" };
      }
      return doc;
    });
    
    setSelectedRequest({
      ...selectedRequest,
      documents: updatedDocuments
    });
  };
  
  const rejectDocument = (documentId: string, reason: any) => {
    const updatedDocuments = selectedRequest.documents.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, status: "rejected", flag: reason };
      }
      return doc;
    });
    
    setSelectedRequest({
      ...selectedRequest,
      documents: updatedDocuments
    });
  };
  
  const flagDocument = (documentId: any, flag: any) => {
    const updatedDocuments = selectedRequest.documents.map(doc => {
      if (doc.id === documentId) {
        return { ...doc, status: "flagged", flag };
      }
      return doc;
    });
    
    setSelectedRequest({
      ...selectedRequest,
      documents: updatedDocuments
    });
  };
  
  const saveNotes = () => {
    setSelectedRequest({
      ...selectedRequest,
      notes: notesInput
    });
    
    // In a real app, you would save the notes to the API
    // kycService.updateVerificationNotes(selectedRequest.id, notesInput);
  };
  
  const handleApproveRequest = () => {
    setShowApprovalModal(true);
  };
  
  const confirmApproval = () => {
    // In a real app, you would call the API to approve the request
    // kycService.approveVerification(selectedRequest.id, approvalReason);
    
    const updatedRequests = verificationRequests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "approved",
          approvedBy: "Current Admin",
          approvedDate: new Date().toISOString(),
          notes: selectedRequest.notes,
          documents: selectedRequest.documents
        };
      }
      return req;
    });
    
    setVerificationRequests(updatedRequests);
    setFilteredRequests(applyFilters(updatedRequests));
    
    setShowApprovalModal(false);
    closeRequestDetails();
  };
  
  const handleRejectRequest = () => {
    setShowRejectionModal(true);
  };
  
  const confirmRejection = () => {
    // In a real app, you would call the API to reject the request
    // kycService.rejectVerification(selectedRequest.id, rejectionReason);
    
    const updatedRequests = verificationRequests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "rejected",
          rejectedBy: "Current Admin",
          rejectedDate: new Date().toISOString(),
          rejectionReason: rejectionReason,
          notes: selectedRequest.notes,
          documents: selectedRequest.documents
        };
      }
      return req;
    });
    
    setVerificationRequests(updatedRequests);
    setFilteredRequests(applyFilters(updatedRequests));
    
    setShowRejectionModal(false);
    closeRequestDetails();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  const getTimeElapsed = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": {
        color: "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        dot: "bg-amber-400 dark:bg-amber-500",
      },
      "approved": {
        color: "bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        dot: "bg-green-400 dark:bg-green-500",
      },
      "rejected": {
        color: "bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        dot: "bg-red-400 dark:bg-red-500",
      },
      "flagged": {
        color: "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        dot: "bg-blue-400 dark:bg-blue-500",
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="text-sm font-medium capitalize">{status}</span>
      </div>
    );
  };
  
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      "high": {
        color: "bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        icon: "🔥",
      },
      "medium": {
        color: "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        icon: "⚡",
      },
      "low": {
        color: "bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        icon: "📝",
      },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color}`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium capitalize">{priority}</span>
      </div>
    );
  };
  
  const getDocumentStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { color: "text-amber-600 dark:text-amber-400" },
      "approved": { color: "text-green-600 dark:text-green-400" },
      "rejected": { color: "text-red-600 dark:text-red-400" },
      "flagged": { color: "text-blue-600 dark:text-blue-400" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = status === "approved" ? CheckCircle : 
                 status === "rejected" ? XCircle : 
                 status === "flagged" ? AlertTriangle : 
                 Clock;

    return (
      <div className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium capitalize">{status}</span>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                onClick={() => navigate("/admin/business/dashboard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400 bg-clip-text text-transparent">
                  KYC Verification Queue
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Review and process business verification requests
                </p>
              </div>
            </div>

            <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
                onClick={fetchVerificationRequests}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                title="Refresh Queue"
              >
                <RefreshCw size={18} />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/business/kyc-settings")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={16} />
                KYC Settings
              </motion.button>
            </div>
          </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/20 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Verification</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stats.totalPending}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                <Clock className="text-amber-500 dark:text-amber-400" size={20} />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/20 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approved Today</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stats.approvedToday}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/20 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rejected Today</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stats.rejectedToday}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
                <XCircle className="text-red-500 dark:text-red-400" size={20} />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-white/20 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Processing Time</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stats.averageProcessingTime}h
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <BarChart2 className="text-blue-500 dark:text-blue-400" size={20} />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              placeholder="Search by business name, owner, or ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 px-3 py-2 text-gray-700 dark:text-gray-300"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <motion.button
              className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilterModal(true)}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">More Filters</span>
            </motion.button>
          </div>
        </div>
        
        {/* Verification Queue Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading verification requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No verification requests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || filters.status !== "all" || filters.priority !== "all" || filters.dateRange !== "all" || filters.documentType !== "all" ? 
                "Try adjusting your filters or search terms" : 
                "There are no verification requests in the queue at the moment"
              }
            </p>
            {(searchTerm || filters.status !== "all" || filters.priority !== "all" || filters.dateRange !== "all" || filters.documentType !== "all") && (
              <motion.button
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                onClick={resetFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={16} />
                Reset Filters
              </motion.button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-white/20 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Business
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Submission
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => viewRequest(request)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {request.businessName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {request.businessName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {request.ownerName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(request.submissionDate)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getTimeElapsed(request.submissionDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {request.documentsCount} documents
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.documents.filter(doc => doc.status === "approved").length} approved,{" "}
                          {request.documents.filter(doc => doc.status === "flagged").length} flagged
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewRequest(request);
                            }}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show
                </span>
                <select
                  className="mx-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-600"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  entries
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
                </span>
                <button
                  className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {selectedRequest && (
        <div className="fixed inset-0 z-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
                 onClick={closeRequestDetails}></div>
            
            <section className="absolute inset-y-0 right-0 max-w-2xl w-full flex">
              <motion.div 
                className="relative w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col overflow-y-auto"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="mr-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                        onClick={closeRequestDetails}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Verification Request
                        </h2>
                        <p className="text-blue-100 text-sm">
                          ID: {selectedRequest.id}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6">
                  {/* Business Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Business Information
                    </h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4 mb-4">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {selectedRequest.businessName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {selectedRequest.businessName}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400">
                            Business ID: {selectedRequest.businessId}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Owner: {selectedRequest.ownerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Location: {selectedRequest.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <a 
                            href={`mailto:${selectedRequest.contact.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedRequest.contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <a 
                            href={`tel:${selectedRequest.contact.phone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {selectedRequest.contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Submission Date
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(selectedRequest.submissionDate)}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Priority
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {selectedRequest.priority}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Documents
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRequest.documentsCount} total
                        </div>
                      </div>
                    </div>
                    
                    {selectedRequest.status === "approved" && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-green-800 dark:text-green-300">
                              Approved on {formatDate(selectedRequest.approvedDate)}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-400">
                              By: {selectedRequest.approvedBy}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedRequest.status === "rejected" && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800 dark:text-red-300">
                              Rejected on {formatDate(selectedRequest.rejectedDate)}
                            </div>
                            <div className="text-sm text-red-700 dark:text-red-400">
                              By: {selectedRequest.rejectedBy}
                            </div>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                              Reason: {selectedRequest.rejectionReason}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Documents */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Verification Documents
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedRequest.documents.map((document) => (
                        <div 
                          key={document.id}
                          className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => viewDocument(document)}
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center mr-4">
                              {document.mimeType.startsWith("image/") ? (
                                <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {document.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                                <span>{documentTypeLabels[document.type] || document.type}</span>
                                <span>•</span>
                                <span>{document.fileSize}</span>
                                <span>•</span>
                                <span>{formatDate(document.dateUploaded)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {getDocumentStatusBadge(document.status)}
                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Verification Notes
                    </h3>
                    
                    <div className="mb-4">
                      <textarea
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        rows={4}
                        placeholder="Add notes about this verification request..."
                        value={notesInput || selectedRequest.notes || ""}
                        onChange={(e) => setNotesInput(e.target.value)}
                      ></textarea>
                      
                      <div className="flex justify-end mt-2">
                        <button
                          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                          onClick={saveNotes}
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                    
                    {document.flag && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-amber-800 dark:text-amber-300">
                              Document Flag
                            </div>
                            <div className="text-sm text-amber-700 dark:text-amber-400">
                              {document.flag}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Footer Actions */}
                {selectedRequest.status === "pending" && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-750">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-xl font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApproveRequest}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Verification
                      </motion.button>
                      
                      <motion.button
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-xl font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRejectRequest}
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Verification
                      </motion.button>
                    </div>
                    
                    <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <p>All documents must be reviewed before approving</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </section>
          </div>
        </div>
      )}
      
      {/* Document Viewer Modal */}
      {showDocumentViewer && currentDocument && (
        <div className="fixed inset-0 z-30 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
              onClick={() => setShowDocumentViewer(false)}
            ></div>
            
            <section className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div 
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentDocument.mimeType.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {currentDocument.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={currentDocument.fileUrl}
                      download
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    
                    <button
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDocumentViewer(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Document Preview */}
                <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {currentDocument.mimeType.startsWith("image/") ? (
                    <img 
                      src={currentDocument.fileUrl || currentDocument.thumbnailUrl} 
                      alt={currentDocument.name}
                      className="max-w-full max-h-[60vh] object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Preview not available for this document type
                      </p>
                      <a
                        href={currentDocument.fileUrl}
                        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Document
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Document Information
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Type: {documentTypeLabels[currentDocument.type] || currentDocument.type}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Size: {currentDocument.fileSize}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Uploaded: {formatDate(currentDocument.dateUploaded)}
                        </span>
                        <div>
                          {getDocumentStatusBadge(currentDocument.status)}
                        </div>
                      </div>
                      
                      {currentDocument.flag && (
                        <div className="mt-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-lg text-sm inline-flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{currentDocument.flag}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1"
                        onClick={() => approveDocument(currentDocument.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      
                      <button
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
                        onClick={() => {
                          const reason = prompt("Enter rejection reason:");
                          if (reason) rejectDocument(currentDocument.id, reason);
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      
                      <button
                        className="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1"
                        onClick={() => {
                          const flag = prompt("Enter flag reason:");
                          if (flag) flagDocument(currentDocument.id, flag);
                        }}
                      >
                        <Flag className="w-4 h-4" />
                        Flag
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      )}
      
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-30 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
              onClick={() => setShowFilterModal(false)}
            ></div>
            
            <section className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div 
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col w-full max-w-md overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Filter Verification Requests
                  </h3>
                  <button
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowFilterModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange("priority", e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Submission Date
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                    </select>
                  </div>
                  
                  {/* Document Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document Type
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      value={filters.documentType}
                      onChange={(e) => handleFilterChange("documentType", e.target.value)}
                    >
                      <option value="all">All Document Types</option>
                      {Object.entries(documentTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex justify-between">
                  <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    onClick={() => setShowFilterModal(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      )}
      
      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-30 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
              onClick={() => setShowApprovalModal(false)}
            ></div>
            
            <section className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div 
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col w-full max-w-md overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-bold">
                    Approve Verification
                  </h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to approve this verification request for <strong>{selectedRequest?.businessName}</strong>?
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
                      rows={3}
                      placeholder="Add any notes about this approval..."
                      value={approvalReason}
                      onChange={(e) => setApprovalReason(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Approving this verification will grant the business full access to the platform features.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex justify-between">
                  <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowApprovalModal(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                    onClick={confirmApproval}
                  >
                    Confirm Approval
                  </button>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      )}
      
      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-30 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
              onClick={() => setShowRejectionModal(false)}
            ></div>
            
            <section className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div 
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col w-full max-w-md overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center text-red-600 dark:text-red-400">
                  <XCircle className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-bold">
                    Reject Verification
                  </h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to reject this verification request for <strong>{selectedRequest?.businessName}</strong>?
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600"
                      rows={3}
                      placeholder="Explain why this verification request is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Rejecting this verification will prevent the business from accessing platform features. The business can resubmit with corrected information.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex justify-between">
                  <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowRejectionModal(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={confirmRejection}
                    disabled={!rejectionReason.trim()}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default KYCVerificationQueuePage;