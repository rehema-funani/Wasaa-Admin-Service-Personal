import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    Eye,
    Download,
    Upload,
    User,
    FileText,
    Shield,
    Calendar,
    Globe,
    Flag,
    UserX,
    ChevronDown,
    MapPin,
    FileCheck,
    FileX,
    Fingerprint,
    Camera,
    CheckSquare,
    Slash,
    File
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
// import kycService from '../../../../api/services/kyc';

interface KYCVerification {
    id: string;
    userId: string;
    userName: string;
    email: string;
    phone: string;
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    submittedAt: string;
    verifiedAt?: string;
    rejectedAt?: string;
    expiresAt?: string;
    documentType: 'national_id' | 'passport' | 'drivers_license';
    nationality: string;
    countryCode: string;
    verificationMethod: 'document' | 'biometric' | 'document_and_biometric';
    verificationScore?: number;
    verifiedBy?: string;
    rejectedBy?: string;
    rejectionReason?: string;
    notes?: string;
    documentImageUrl?: string;
    selfieImageUrl?: string;
    providerReference?: string;
    providerName?: 'internal' | 'jumio' | 'smile_id' | 'other';
}

// Types for countries
interface Country {
    name: string;
    code: string;
}

const verification: React.FC = () => {
    // State management
    const [verifications, setVerifications] = useState<KYCVerification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected' | 'expired'>('all');
    const [timeframeFilter, setTimeframeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
    const [countryFilter, setCountryFilter] = useState<string>('all');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedVerification, setSelectedVerification] = useState<KYCVerification | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'view' | 'verify' | 'reject' | 'documents' | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [verificationNote, setVerificationNote] = useState<string>('');

    // Mock country data
    const countries: Country[] = [
        { name: 'Kenya', code: 'KE' },
        { name: 'Nigeria', code: 'NG' },
        { name: 'South Africa', code: 'ZA' },
        { name: 'Ghana', code: 'GH' },
        { name: 'Uganda', code: 'UG' },
        { name: 'Tanzania', code: 'TZ' },
        { name: 'Rwanda', code: 'RW' },
        { name: 'Ethiopia', code: 'ET' },
        { name: 'United States', code: 'US' },
        { name: 'United Kingdom', code: 'GB' }
    ];

    // Mock data for KYC verifications
    const mockVerifications: KYCVerification[] = [
        {
            id: 'kyc-001',
            userId: 'user-001',
            userName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+254712345678',
            status: 'pending',
            submittedAt: '2025-05-19T09:30:00Z',
            documentType: 'national_id',
            nationality: 'Kenyan',
            countryCode: 'KE',
            verificationMethod: 'document',
            providerName: 'internal'
        },
        {
            id: 'kyc-002',
            userId: 'user-002',
            userName: 'Alice Smith',
            email: 'alice.smith@example.com',
            phone: '+254723456789',
            status: 'verified',
            submittedAt: '2025-05-18T14:15:00Z',
            verifiedAt: '2025-05-18T16:45:00Z',
            expiresAt: '2026-05-18T16:45:00Z',
            documentType: 'passport',
            nationality: 'British',
            countryCode: 'GB',
            verificationMethod: 'document_and_biometric',
            verificationScore: 0.92,
            verifiedBy: 'KYC Officer',
            providerName: 'jumio',
            providerReference: 'JUM-123456789'
        },
        {
            id: 'kyc-003',
            userId: 'user-003',
            userName: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            phone: '+254734567890',
            status: 'rejected',
            submittedAt: '2025-05-17T11:10:00Z',
            rejectedAt: '2025-05-17T13:25:00Z',
            documentType: 'drivers_license',
            nationality: 'Nigerian',
            countryCode: 'NG',
            verificationMethod: 'document',
            rejectedBy: 'Compliance Officer',
            rejectionReason: 'Document appears altered. Inconsistent data on ID.',
            notes: 'User submitted ID with visible signs of manipulation. Advised to resubmit with valid documents.',
            providerName: 'smile_id',
            providerReference: 'SMI-987654321'
        },
        {
            id: 'kyc-004',
            userId: 'user-004',
            userName: 'Mary Wilson',
            email: 'mary.wilson@example.com',
            phone: '+254745678901',
            status: 'expired',
            submittedAt: '2024-05-16T08:20:00Z',
            verifiedAt: '2024-05-16T10:05:00Z',
            expiresAt: '2025-05-16T10:05:00Z',
            documentType: 'national_id',
            nationality: 'Kenyan',
            countryCode: 'KE',
            verificationMethod: 'biometric',
            verificationScore: 0.88,
            verifiedBy: 'KYC Manager',
            providerName: 'internal'
        },
        {
            id: 'kyc-005',
            userId: 'user-005',
            userName: 'David Lee',
            email: 'david.lee@example.com',
            phone: '+254756789012',
            status: 'pending',
            submittedAt: '2025-05-19T07:15:00Z',
            documentType: 'passport',
            nationality: 'South African',
            countryCode: 'ZA',
            verificationMethod: 'document_and_biometric',
            providerName: 'jumio',
            providerReference: 'JUM-234567890'
        },
        {
            id: 'kyc-006',
            userId: 'user-006',
            userName: 'Sarah Brown',
            email: 'sarah.brown@example.com',
            phone: '+254767890123',
            status: 'verified',
            submittedAt: '2025-05-15T13:40:00Z',
            verifiedAt: '2025-05-15T15:10:00Z',
            expiresAt: '2026-05-15T15:10:00Z',
            documentType: 'national_id',
            nationality: 'Ghanaian',
            countryCode: 'GH',
            verificationMethod: 'document',
            verificationScore: 0.95,
            verifiedBy: 'Compliance Manager',
            providerName: 'smile_id',
            providerReference: 'SMI-345678901'
        },
        {
            id: 'kyc-007',
            userId: 'user-007',
            userName: 'Michael Taylor',
            email: 'michael.taylor@example.com',
            phone: '+254778901234',
            status: 'rejected',
            submittedAt: '2025-05-14T09:20:00Z',
            rejectedAt: '2025-05-14T11:35:00Z',
            documentType: 'drivers_license',
            nationality: 'Tanzanian',
            countryCode: 'TZ',
            verificationMethod: 'document',
            rejectedBy: 'KYC Specialist',
            rejectionReason: 'Document expired. ID expiration date has passed.',
            providerName: 'internal'
        },
        {
            id: 'kyc-008',
            userId: 'user-008',
            userName: 'Jennifer Garcia',
            email: 'jennifer.garcia@example.com',
            phone: '+1234567890',
            status: 'pending',
            submittedAt: '2025-05-18T16:50:00Z',
            documentType: 'passport',
            nationality: 'American',
            countryCode: 'US',
            verificationMethod: 'document_and_biometric',
            providerName: 'jumio',
            providerReference: 'JUM-456789012'
        }
    ];

    // Load KYC verification data
    useEffect(() => {
        // Simulating API call
        const fetchKYCVerifications = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be:
                // const kyc = await kycService.getVerifications();

                // For now, using mock data with a timeout for loading simulation
                setTimeout(() => {
                    setVerifications(mockVerifications);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch KYC verifications', error);
                setErrorMessage('Failed to load KYC verifications');
                setIsLoading(false);
            }
        };

        fetchKYCVerifications();
    }, []);

    // Filter KYC verifications based on search, status, timeframe and country
    const filteredVerifications = verifications.filter(verification => {
        const matchesSearch =
            verification.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            verification.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            verification.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            verification.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            verification.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;

        const matchesCountry = countryFilter === 'all' || verification.countryCode === countryFilter;

        if (timeframeFilter === 'all') return matchesSearch && matchesStatus && matchesCountry;

        const submittedDate = new Date(verification.submittedAt);
        const now = new Date();
        const timeDiff = now.getTime() - submittedDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        const matchesTimeframe =
            (timeframeFilter === '24h' && daysDiff <= 1) ||
            (timeframeFilter === '7d' && daysDiff <= 7) ||
            (timeframeFilter === '30d' && daysDiff <= 30);

        return matchesSearch && matchesStatus && matchesTimeframe && matchesCountry;
    });

    // Handle status update
    const handleStatusUpdate = (verificationId: string, newStatus: 'verified' | 'rejected', note: string = '') => {
        // In a real implementation, this would call an API
        // For this prototype, we'll just update the state

        const updatedVerifications = verifications.map(verification => {
            if (verification.id === verificationId) {
                const updatedVerification = { ...verification, status: newStatus };

                if (newStatus === 'verified') {
                    updatedVerification.verifiedBy = 'Current Admin';
                    updatedVerification.verifiedAt = new Date().toISOString();
                    updatedVerification.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now
                    if (note) updatedVerification.notes = note;
                } else if (newStatus === 'rejected') {
                    updatedVerification.rejectedBy = 'Current Admin';
                    updatedVerification.rejectedAt = new Date().toISOString();
                    updatedVerification.rejectionReason = note;
                }

                return updatedVerification;
            }
            return verification;
        });

        setVerifications(updatedVerifications);

        const actionText = newStatus === 'verified' ? 'verified' : 'rejected';
        showSuccess(`KYC verification successfully ${actionText}`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setSelectedVerification(null);
        setRejectionReason('');
        setVerificationNote('');
    };

    // Show success message with a timeout
    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setErrorMessage(null);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Show error message with a timeout
    const showError = (message: string) => {
        setErrorMessage(message);
        setSuccessMessage(null);
        setTimeout(() => {
            setErrorMessage(null);
        }, 3000);
    };

    // Open verification view modal
    const openVerificationViewModal = (verification: KYCVerification) => {
        setSelectedVerification(verification);
        setModalType('view');
        setIsModalOpen(true);
    };

    // Open verify modal
    const openVerifyModal = (verification: KYCVerification) => {
        setSelectedVerification(verification);
        setModalType('verify');
        setIsModalOpen(true);
    };

    // Open reject modal
    const openRejectModal = (verification: KYCVerification) => {
        setSelectedVerification(verification);
        setModalType('reject');
        setIsModalOpen(true);
    };

    // Open documents modal
    const openDocumentsModal = (verification: KYCVerification) => {
        setSelectedVerification(verification);
        setModalType('documents');
        setIsModalOpen(true);
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format document type
    const formatDocumentType = (type: string) => {
        if (type === 'national_id') return 'National ID';
        if (type === 'passport') return 'Passport';
        if (type === 'drivers_license') return 'Driver\'s License';
        return type;
    };

    // Format verification method
    const formatVerificationMethod = (method: string) => {
        if (method === 'document') return 'Document Verification';
        if (method === 'biometric') return 'Biometric Verification';
        if (method === 'document_and_biometric') return 'Document & Biometric';
        return method;
    };

    // Format provider name
    const formatProviderName = (provider?: string) => {
        if (!provider) return 'N/A';
        if (provider === 'internal') return 'Internal Verification';
        if (provider === 'jumio') return 'Jumio';
        if (provider === 'smile_id') return 'Smile ID';
        return provider;
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'verified':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'verified':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            case 'expired':
                return <Slash className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Get document type icon
    const getDocumentTypeIcon = (type: string) => {
        switch (type) {
            case 'national_id':
                return <FileCheck className="w-4 h-4 text-blue-600" />;
            case 'passport':
                return <FileText className="w-4 h-4 text-purple-600" />;
            case 'drivers_license':
                return <FileCheck className="w-4 h-4 text-green-600" />;
            default:
                return <File className="w-4 h-4 text-gray-600" />;
        }
    };

    // Get verification method icon
    const getVerificationMethodIcon = (method: string) => {
        switch (method) {
            case 'document':
                return <FileCheck className="w-4 h-4" />;
            case 'biometric':
                return <Fingerprint className="w-4 h-4" />;
            case 'document_and_biometric':
                return <Shield className="w-4 h-4" />;
            default:
                return <FileCheck className="w-4 h-4" />;
        }
    };

    // Get modal title
    const getModalTitle = () => {
        if (!selectedVerification) return '';

        switch (modalType) {
            case 'view':
                return `KYC Verification Details: ${selectedVerification.userName}`;
            case 'verify':
                return 'Approve KYC Verification';
            case 'reject':
                return 'Reject KYC Verification';
            case 'documents':
                return 'Verification Documents';
            default:
                return '';
        }
    };

    // Get KYC counts by status
    const getStatusCounts = () => {
        return {
            pending: verifications.filter(v => v.status === 'pending').length,
            verified: verifications.filter(v => v.status === 'verified').length,
            rejected: verifications.filter(v => v.status === 'rejected').length,
            expired: verifications.filter(v => v.status === 'expired').length
        };
    };

    const counts = getStatusCounts();

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">KYC Verification Dashboard</h1>
                            <p className="text-gray-500 text-sm mt-1">Monitor and manage user identity verification requests and compliance status</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
                                disabled={isLoading}
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                    }, 800);
                                }}
                            >
                                <RefreshCw size={16} />
                                <span>Refresh</span>
                            </button>

                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition-all text-sm"
                            >
                                <Download size={16} />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, phone or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter('pending')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'pending' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setStatusFilter('verified')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'verified' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Verified
                                </button>
                                <button
                                    onClick={() => setStatusFilter('rejected')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'rejected' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Rejected
                                </button>
                                <button
                                    onClick={() => setStatusFilter('expired')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'expired' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Expired
                                </button>
                            </div>

                            <div className="relative">
                                <select
                                    value={countryFilter}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                                >
                                    <option value="all">All Countries</option>
                                    {countries.map(country => (
                                        <option key={country.code} value={country.code}>{country.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDown size={16} className="text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setTimeframeFilter('24h')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === '24h' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    24h
                                </button>
                                <button
                                    onClick={() => setTimeframeFilter('7d')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === '7d' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    7d
                                </button>
                                <button
                                    onClick={() => setTimeframeFilter('30d')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === '30d' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    30d
                                </button>
                                <button
                                    onClick={() => setTimeframeFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    All
                                </button>
                            </div>

                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-red-700">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        <span className="text-sm">{errorMessage}</span>
                    </div>
                )}

                {/* KYC Status Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Pending Verifications</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{counts.pending}</p>
                        <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Verified Users</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{counts.verified}</p>
                        <p className="text-xs text-gray-500 mt-1">Successfully verified</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle size={20} className="text-red-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Rejected</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{counts.rejected}</p>
                        <p className="text-xs text-gray-500 mt-1">Failed verification</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Slash size={20} className="text-gray-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Expired</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{counts.expired}</p>
                        <p className="text-xs text-gray-500 mt-1">Needs renewal</p>
                    </div>
                </div>

                {/* KYC Verifications Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">KYC Verification Requests</h2>
                    </div>

                    {isLoading ? (
                        // Loading skeleton
                        <div className="p-8">
                            <div className="flex justify-center items-center">
                                <RefreshCw size={24} className="text-gray-400 animate-spin" />
                                <span className="ml-2 text-gray-500">Loading KYC verifications...</span>
                            </div>
                        </div>
                    ) : filteredVerifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <UserX size={36} className="mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No verifications found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredVerifications.map((verification) => (
                                        <tr key={verification.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                        <User size={16} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{verification.userName}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">{verification.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-2">
                                                        {getDocumentTypeIcon(verification.documentType)}
                                                    </div>
                                                    <div className="text-sm text-gray-900">{formatDocumentType(verification.documentType)}</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-sm text-gray-900 flex items-center">
                                                        <Globe size={16} className="text-gray-400 mr-1.5" />
                                                        {verification.nationality}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                                                    {getStatusIcon(verification.status)}
                                                    {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(verification.submittedAt)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatProviderName(verification.providerName)}</div>
                                                {verification.providerReference && (
                                                    <div className="text-xs text-gray-500">Ref: {verification.providerReference}</div>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                                        onClick={() => openVerificationViewModal(verification)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        onClick={() => openDocumentsModal(verification)}
                                                    >
                                                        <FileText size={18} />
                                                    </button>

                                                    {verification.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="text-green-600 hover:text-green-900 p-1"
                                                                onClick={() => openVerifyModal(verification)}
                                                            >
                                                                <CheckCircle2 size={18} />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                onClick={() => openRejectModal(verification)}
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {filteredVerifications.length} of {verifications.length} verifications
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm disabled:opacity-50"
                                disabled
                            >
                                Previous
                            </button>
                            <button
                                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm disabled:opacity-50"
                                disabled
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50/70 rounded-xl p-4 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Shield size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About KYC Verification</h3>
                            <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                                KYC (Know Your Customer) verifications help ensure platform safety and regulatory compliance.
                                <br />• <strong>Pending:</strong> New verification requests awaiting review
                                <br />• <strong>Verified:</strong> Approved identities with full transaction privileges
                                <br />• <strong>Rejected:</strong> Failed due to document issues or data mismatch
                                <br />• <strong>Expired:</strong> Requires renewal based on compliance policies
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedVerification(null);
                    setRejectionReason('');
                    setVerificationNote('');
                }}
                title={getModalTitle()}
                size={modalType === 'documents' ? 'lg' : 'md'}
            >
                {modalType === 'view' && selectedVerification && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVerification.status)}`}>
                                        {getStatusIcon(selectedVerification.status)}
                                        {selectedVerification.status.charAt(0).toUpperCase() + selectedVerification.status.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: {selectedVerification.id}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">User:</div>
                                    <div className="font-medium text-gray-800">{selectedVerification.userName}</div>
                                    <div className="text-gray-600 text-xs mt-0.5">{selectedVerification.email}</div>
                                    <div className="text-gray-600 text-xs">{selectedVerification.phone}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Nationality:</div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                        <Flag className="w-4 h-4 mr-1.5 text-gray-500" />
                                        {selectedVerification.nationality}
                                    </div>
                                    <div className="text-gray-600 text-xs mt-0.5">Submitted on {formatDate(selectedVerification.submittedAt)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <div className="text-gray-500">Document Type:</div>
                                        <div className="font-medium text-gray-800 flex items-center">
                                            {getDocumentTypeIcon(selectedVerification.documentType)}
                                            <span className="ml-1.5">{formatDocumentType(selectedVerification.documentType)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-gray-500">Method:</div>
                                        <div className="font-medium text-gray-800 flex items-center">
                                            {getVerificationMethodIcon(selectedVerification.verificationMethod)}
                                            <span className="ml-1.5">{formatVerificationMethod(selectedVerification.verificationMethod)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-gray-500">Provider:</div>
                                        <div className="font-medium text-gray-800">{formatProviderName(selectedVerification.providerName)}</div>
                                    </div>
                                    {selectedVerification.providerReference && (
                                        <div className="flex justify-between">
                                            <div className="text-gray-500">Reference:</div>
                                            <div className="font-medium text-gray-800">{selectedVerification.providerReference}</div>
                                        </div>
                                    )}
                                    {selectedVerification.verificationScore !== undefined && (
                                        <div className="flex justify-between">
                                            <div className="text-gray-500">Score:</div>
                                            <div className="font-medium text-gray-800">{(selectedVerification.verificationScore * 100).toFixed(1)}%</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Status Timeline</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-full">
                                            <Upload size={14} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-800">Submitted</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(selectedVerification.submittedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedVerification.verifiedBy && selectedVerification.verifiedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-green-100 rounded-full">
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Verified</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedVerification.verifiedAt)} by {selectedVerification.verifiedBy}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedVerification.rejectedBy && selectedVerification.rejectedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-red-100 rounded-full">
                                                <XCircle size={14} className="text-red-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Rejected</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedVerification.rejectedAt)} by {selectedVerification.rejectedBy}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedVerification.expiresAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-yellow-100 rounded-full">
                                                <Calendar size={14} className="text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Expires</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedVerification.expiresAt)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {(selectedVerification.notes || selectedVerification.rejectionReason) && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    {selectedVerification.rejectionReason ? 'Rejection Reason' : 'Notes'}
                                </h3>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                    {selectedVerification.rejectionReason || selectedVerification.notes}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => openDocumentsModal(selectedVerification)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
                            >
                                View Documents
                            </button>

                            {selectedVerification.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => openRejectModal(selectedVerification)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => openVerifyModal(selectedVerification)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                                    >
                                        Verify
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {modalType === 'verify' && selectedVerification && (
                    <div className="space-y-4 p-1">
                        <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        You are about to verify the identity of <strong>{selectedVerification.userName}</strong>. This will grant the user full access to platform services. This action will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-700 font-medium mb-1">User Details</div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">Name:</span>
                                        <span className="text-gray-800">{selectedVerification.userName}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="text-gray-800">{selectedVerification.email}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="text-gray-800">{selectedVerification.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Nationality:</span>
                                        <span className="text-gray-800">{selectedVerification.nationality}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-gray-700 font-medium mb-1">Document Details</div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">Type:</span>
                                        <span className="text-gray-800">{formatDocumentType(selectedVerification.documentType)}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">Method:</span>
                                        <span className="text-gray-800">{formatVerificationMethod(selectedVerification.verificationMethod)}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-500">Submitted:</span>
                                        <span className="text-gray-800">{formatDate(selectedVerification.submittedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Provider:</span>
                                        <span className="text-gray-800">{formatProviderName(selectedVerification.providerName)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Note (Optional)</label>
                            <textarea
                                value={verificationNote}
                                onChange={(e) => setVerificationNote(e.target.value)}
                                placeholder="Add any additional notes about this verification..."
                                rows={3}
                                className="p-3 w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedVerification.id, 'verified', verificationNote)}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                            >
                                Confirm Verification
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'reject' && selectedVerification && (
                    <div className="space-y-4 p-1">
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        You are about to reject the KYC verification for <strong>{selectedVerification.userName}</strong>.
                                        This will limit the user's access to platform services. Rejection requires a reason and will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason <span className="text-red-500">*</span></label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Provide a detailed reason for rejecting this verification..."
                                rows={4}
                                className="p-3 w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                                required
                            />
                            {rejectionReason.length === 0 && (
                                <p className="mt-1 text-sm text-red-600">A rejection reason is required</p>
                            )}
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Common Rejection Reasons</div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setRejectionReason("Document is illegible or unclear.")}
                                    className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
                                >
                                    Document is illegible or unclear
                                </button>
                                <button
                                    onClick={() => setRejectionReason("Document appears to be modified or tampered with.")}
                                    className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
                                >
                                    Document appears tampered with
                                </button>
                                <button
                                    onClick={() => setRejectionReason("Document has expired or is no longer valid.")}
                                    className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
                                >
                                    Document has expired
                                </button>
                                <button
                                    onClick={() => setRejectionReason("Information on document doesn't match provided details.")}
                                    className="text-xs text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
                                >
                                    Information mismatch
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedVerification.id, 'rejected', rejectionReason)}
                                disabled={rejectionReason.length === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'documents' && selectedVerification && (
                    <div className="space-y-6 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-800">
                                    {formatDocumentType(selectedVerification.documentType)} - {selectedVerification.userName}
                                </h3>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVerification.status)}`}>
                                    {getStatusIcon(selectedVerification.status)}
                                    {selectedVerification.status.charAt(0).toUpperCase() + selectedVerification.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Submitted on {formatDate(selectedVerification.submittedAt)}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Document Image */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">ID Document</h3>
                                <div className="bg-gray-100 rounded-lg p-2 h-64 flex items-center justify-center overflow-hidden">
                                    {selectedVerification.documentImageUrl ? (
                                        <img
                                            src={selectedVerification.documentImageUrl}
                                            alt="ID Document"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Document image placeholder</p>
                                            <p className="text-xs text-gray-400 mt-1">(Document would be displayed here)</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800">
                                        <Download size={14} className="mr-1" />
                                        Download Document
                                    </button>
                                </div>
                            </div>

                            {/* Selfie/Portrait Image */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Portrait Photo</h3>
                                <div className="bg-gray-100 rounded-lg p-2 h-64 flex items-center justify-center overflow-hidden">
                                    {selectedVerification.selfieImageUrl ? (
                                        <img
                                            src={selectedVerification.selfieImageUrl}
                                            alt="Selfie"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Portrait photo placeholder</p>
                                            <p className="text-xs text-gray-400 mt-1">(Selfie would be displayed here)</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800">
                                        <Download size={14} className="mr-1" />
                                        Download Photo
                                    </button>
                                </div>
                            </div>
                        </div>

                        {selectedVerification.verificationMethod === 'document_and_biometric' && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Biometric Verification Results</h3>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-gray-600">Face Match Confidence:</span>
                                        <div className="flex items-center">
                                            <div className="w-32 h-3 bg-gray-200 rounded-full mr-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${selectedVerification.verificationScore && selectedVerification.verificationScore > 0.9
                                                            ? 'bg-green-500'
                                                            : selectedVerification.verificationScore && selectedVerification.verificationScore > 0.7
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${selectedVerification.verificationScore ? selectedVerification.verificationScore * 100 : 75}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {selectedVerification.verificationScore
                                                    ? `${(selectedVerification.verificationScore * 100).toFixed(1)}%`
                                                    : '75.0%'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <p className="mb-1"><strong>Liveness Check:</strong> {selectedVerification.status === 'verified' ? 'Passed' : selectedVerification.status === 'rejected' ? 'Failed' : 'Pending'}</p>
                                        <p><strong>Provider Analysis:</strong> {selectedVerification.providerName === 'jumio' ? 'Jumio Netverify' : selectedVerification.providerName === 'smile_id' ? 'Smile ID Document Verification' : 'Internal Analysis'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedVerification.status === 'pending' && (
                            <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                                <button
                                    onClick={() => openRejectModal(selectedVerification)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => openVerifyModal(selectedVerification)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                                >
                                    Verify
                                </button>
                            </div>
                        )}

                        {selectedVerification.status !== 'pending' && (
                            <div className="flex justify-end pt-4 mt-5 border-t border-gray-200">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default verification;