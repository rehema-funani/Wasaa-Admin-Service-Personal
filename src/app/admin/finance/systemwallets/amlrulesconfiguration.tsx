import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Search,
    RefreshCw,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    Download,
    Settings,
    Edit,
    Trash2,
    PlusCircle,
    Play,
    Pause,
    BarChart3,
    Tag,
    Zap,
    DollarSign,
    Globe,
    GitBranch,
    Info,
    Users,
    Terminal,
    Activity
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
// import amlService from '../../../../api/services/aml';

interface AMLRule {
    id: string;
    name: string;
    description: string;
    ruleType: 'transaction' | 'behavior' | 'identity' | 'velocity' | 'pattern' | 'geographic';
    category: 'monitoring' | 'screening' | 'detection' | 'verification';
    status: 'active' | 'inactive' | 'testing' | 'archived';
    severity: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy?: string;
    parameters: RuleParameter[];
    conditions: RuleCondition[];
    actions: RuleAction[];
    triggerCount?: number;
    lastTriggered?: string;
    falsePositiveRate?: number;
    version: number;
    isSystemRule?: boolean;
}

// Types for rule parameters
interface RuleParameter {
    id: string;
    name: string;
    dataType: 'number' | 'string' | 'boolean' | 'date' | 'list';
    value: any;
    description?: string;
    unit?: string;
    minValue?: number;
    maxValue?: number;
    options?: string[];
}

// Types for rule conditions
interface RuleCondition {
    id: string;
    field: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'between' | 'regex';
    value: any;
    valueType: 'static' | 'parameter' | 'dynamic';
    logicalOperator?: 'AND' | 'OR';
}

// Types for rule actions
interface RuleAction {
    id: string;
    actionType: 'generate_alert' | 'block_transaction' | 'escalate' | 'request_verification' | 'notify' | 'log' | 'reduce_limits';
    parameters: { [key: string]: any };
    description?: string;
}

// Types for rule effectiveness
interface RuleEffectiveness {
    ruleId: string;
    ruleName: string;
    totalTriggers: number;
    truePositives: number;
    falsePositives: number;
    efficiency: number;
    lastEvaluated: string;
}

const AMLRulesConfiguration: React.FC = () => {
    // State management
    const [rules, setRules] = useState<AMLRule[]>([]);
    const [ruleEffectiveness, setRuleEffectiveness] = useState<RuleEffectiveness[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'monitoring' | 'screening' | 'detection' | 'verification'>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'transaction' | 'behavior' | 'identity' | 'velocity' | 'pattern' | 'geographic'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'testing' | 'archived'>('all');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedRule, setSelectedRule] = useState<AMLRule | null>(null);
    const [showSystemRules, setShowSystemRules] = useState<boolean>(true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'view' | 'edit' | 'add' | 'delete' | 'test' | null>(null);

    // State for rule editing
    const [ruleFormData, setRuleFormData] = useState<Partial<AMLRule>>({
        name: '',
        description: '',
        ruleType: 'transaction',
        category: 'detection',
        status: 'inactive',
        severity: 'medium',
        parameters: [],
        conditions: [],
        actions: []
    });

    const mockRules: AMLRule[] = [
        {
            id: 'rule-001',
            name: 'High Volume Transaction Monitoring',
            description: 'Detects unusually high transaction volumes from a single user in a short time period',
            ruleType: 'velocity',
            category: 'monitoring',
            status: 'active',
            severity: 'high',
            createdAt: '2025-01-15T10:30:00Z',
            updatedAt: '2025-03-22T14:15:00Z',
            createdBy: 'System Administrator',
            updatedBy: 'Compliance Manager',
            parameters: [
                {
                    id: 'param-001',
                    name: 'transactionCountThreshold',
                    dataType: 'number',
                    value: 10,
                    description: 'Number of transactions that triggers the rule',
                    unit: 'transactions'
                },
                {
                    id: 'param-002',
                    name: 'timeWindow',
                    dataType: 'number',
                    value: 24,
                    description: 'Time window to analyze',
                    unit: 'hours'
                },
                {
                    id: 'param-003',
                    name: 'userAverageMultiplier',
                    dataType: 'number',
                    value: 5,
                    description: 'Multiplier of user average transaction volume',
                    minValue: 2,
                    maxValue: 10
                }
            ],
            conditions: [
                {
                    id: 'cond-001',
                    field: 'transaction.count',
                    operator: '>',
                    value: 'transactionCountThreshold',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-002',
                    field: 'transaction.timeWindow',
                    operator: '<=',
                    value: 'timeWindow',
                    valueType: 'parameter'
                }
            ],
            actions: [
                {
                    id: 'action-001',
                    actionType: 'generate_alert',
                    parameters: {
                        alertType: 'high_volume',
                        riskLevel: 'high'
                    }
                }
            ],
            triggerCount: 152,
            lastTriggered: '2025-05-19T08:30:00Z',
            falsePositiveRate: 0.23,
            version: 2.1,
            isSystemRule: true
        },
        {
            id: 'rule-002',
            name: 'Sanctioned Countries Detection',
            description: 'Blocks transactions involving sanctioned countries or regions',
            ruleType: 'geographic',
            category: 'screening',
            status: 'active',
            severity: 'critical',
            createdAt: '2025-02-10T09:45:00Z',
            updatedAt: '2025-04-15T16:20:00Z',
            createdBy: 'Compliance Officer',
            parameters: [
                {
                    id: 'param-004',
                    name: 'sanctionedCountries',
                    dataType: 'list',
                    value: ['NK', 'IR', 'CU', 'SY', 'RU', 'BY'],
                    description: 'List of sanctioned countries (ISO codes)'
                }
            ],
            conditions: [
                {
                    id: 'cond-003',
                    field: 'transaction.originCountry',
                    operator: 'in',
                    value: 'sanctionedCountries',
                    valueType: 'parameter',
                    logicalOperator: 'OR'
                },
                {
                    id: 'cond-004',
                    field: 'transaction.destinationCountry',
                    operator: 'in',
                    value: 'sanctionedCountries',
                    valueType: 'parameter'
                }
            ],
            actions: [
                {
                    id: 'action-002',
                    actionType: 'block_transaction',
                    parameters: {
                        reason: 'Sanctioned country involved'
                    }
                },
                {
                    id: 'action-003',
                    actionType: 'generate_alert',
                    parameters: {
                        alertType: 'restricted_country',
                        riskLevel: 'critical'
                    }
                }
            ],
            triggerCount: 18,
            lastTriggered: '2025-05-18T10:45:00Z',
            falsePositiveRate: 0.05,
            version: 1.2,
            isSystemRule: true
        },
        {
            id: 'rule-003',
            name: 'Structured Transaction Detection',
            description: 'Identifies multiple small transactions that appear designed to avoid reporting thresholds',
            ruleType: 'pattern',
            category: 'detection',
            status: 'active',
            severity: 'high',
            createdAt: '2025-03-05T13:20:00Z',
            updatedAt: '2025-04-20T11:10:00Z',
            createdBy: 'System Administrator',
            updatedBy: 'Compliance Manager',
            parameters: [
                {
                    id: 'param-005',
                    name: 'reportingThreshold',
                    dataType: 'number',
                    value: 10000,
                    description: 'Regulatory reporting threshold amount',
                    unit: 'KES'
                },
                {
                    id: 'param-006',
                    name: 'transactionCountThreshold',
                    dataType: 'number',
                    value: 3,
                    description: 'Minimum number of transactions to trigger the rule'
                },
                {
                    id: 'param-007',
                    name: 'timeWindow',
                    dataType: 'number',
                    value: 48,
                    description: 'Time window to analyze',
                    unit: 'hours'
                }
            ],
            conditions: [
                {
                    id: 'cond-005',
                    field: 'transaction.count',
                    operator: '>=',
                    value: 'transactionCountThreshold',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-006',
                    field: 'transaction.amount',
                    operator: '<',
                    value: 'reportingThreshold',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-007',
                    field: 'transaction.total',
                    operator: '>=',
                    value: 'reportingThreshold',
                    valueType: 'parameter'
                }
            ],
            actions: [
                {
                    id: 'action-004',
                    actionType: 'generate_alert',
                    parameters: {
                        alertType: 'structured_transactions',
                        riskLevel: 'high'
                    }
                }
            ],
            triggerCount: 42,
            lastTriggered: '2025-05-16T13:10:00Z',
            falsePositiveRate: 0.18,
            version: 2.0,
            isSystemRule: true
        },
        {
            id: 'rule-004',
            name: 'New Account Rapid Withdrawal',
            description: 'Detects when a new account makes a deposit followed by a rapid withdrawal',
            ruleType: 'behavior',
            category: 'detection',
            status: 'testing',
            severity: 'medium',
            createdAt: '2025-04-12T15:30:00Z',
            updatedAt: '2025-05-02T10:25:00Z',
            createdBy: 'Compliance Analyst',
            parameters: [
                {
                    id: 'param-008',
                    name: 'accountAgeDays',
                    dataType: 'number',
                    value: 30,
                    description: 'Maximum age of account in days'
                },
                {
                    id: 'param-009',
                    name: 'withdrawalTimeHours',
                    dataType: 'number',
                    value: 48,
                    description: 'Maximum time between deposit and withdrawal',
                    unit: 'hours'
                },
                {
                    id: 'param-010',
                    name: 'minAmount',
                    dataType: 'number',
                    value: 5000,
                    description: 'Minimum amount to trigger the rule',
                    unit: 'KES'
                }
            ],
            conditions: [
                {
                    id: 'cond-008',
                    field: 'account.age',
                    operator: '<',
                    value: 'accountAgeDays',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-009',
                    field: 'transaction.sequence',
                    operator: '=',
                    value: 'deposit_then_withdrawal',
                    valueType: 'static',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-010',
                    field: 'transaction.timeBetween',
                    operator: '<',
                    value: 'withdrawalTimeHours',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-011',
                    field: 'transaction.amount',
                    operator: '>=',
                    value: 'minAmount',
                    valueType: 'parameter'
                }
            ],
            actions: [
                {
                    id: 'action-005',
                    actionType: 'generate_alert',
                    parameters: {
                        alertType: 'unusual_pattern',
                        riskLevel: 'medium'
                    }
                },
                {
                    id: 'action-006',
                    actionType: 'reduce_limits',
                    parameters: {
                        limitFactor: 0.5,
                        durationDays: 7
                    }
                }
            ],
            triggerCount: 15,
            lastTriggered: '2025-05-18T14:15:00Z',
            falsePositiveRate: 0.33,
            version: 1.0
        },
        {
            id: 'rule-005',
            name: 'Multiple Registration Attempts',
            description: 'Identifies multiple account registration attempts from the same device or IP address',
            ruleType: 'identity',
            category: 'verification',
            status: 'active',
            severity: 'medium',
            createdAt: '2025-02-25T11:40:00Z',
            updatedAt: '2025-04-10T09:15:00Z',
            createdBy: 'Security Team Lead',
            parameters: [
                {
                    id: 'param-011',
                    name: 'attemptThreshold',
                    dataType: 'number',
                    value: 3,
                    description: 'Number of registration attempts that triggers the rule'
                },
                {
                    id: 'param-012',
                    name: 'timeWindow',
                    dataType: 'number',
                    value: 72,
                    description: 'Time window to analyze',
                    unit: 'hours'
                }
            ],
            conditions: [
                {
                    id: 'cond-012',
                    field: 'registration.count',
                    operator: '>',
                    value: 'attemptThreshold',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-013',
                    field: 'registration.timeWindow',
                    operator: '<=',
                    value: 'timeWindow',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-014',
                    field: 'registration.uniqueEmails',
                    operator: '>',
                    value: 1,
                    valueType: 'static'
                }
            ],
            actions: [
                {
                    id: 'action-007',
                    actionType: 'request_verification',
                    parameters: {
                        verificationType: 'enhanced_kyc',
                        reason: 'Multiple registration attempts detected'
                    }
                },
                {
                    id: 'action-008',
                    actionType: 'generate_alert',
                    parameters: {
                        alertType: 'multiple_accounts',
                        riskLevel: 'medium'
                    }
                }
            ],
            triggerCount: 38,
            lastTriggered: '2025-05-17T09:20:00Z',
            falsePositiveRate: 0.15,
            version: 1.5,
            isSystemRule: true
        },
        {
            id: 'rule-006',
            name: 'Custom High Risk Transaction Rule',
            description: 'Customer-defined rule for detecting specific transaction patterns',
            ruleType: 'transaction',
            category: 'detection',
            status: 'inactive',
            severity: 'high',
            createdAt: '2025-05-10T14:20:00Z',
            updatedAt: '2025-05-10T14:20:00Z',
            createdBy: 'Compliance Manager',
            parameters: [
                {
                    id: 'param-013',
                    name: 'amountThreshold',
                    dataType: 'number',
                    value: 50000,
                    description: 'Transaction amount threshold',
                    unit: 'KES'
                },
                {
                    id: 'param-014',
                    name: 'highRiskCountries',
                    dataType: 'list',
                    value: ['AF', 'IQ', 'LY', 'SO', 'SD', 'YE'],
                    description: 'List of high-risk countries'
                }
            ],
            conditions: [
                {
                    id: 'cond-015',
                    field: 'transaction.amount',
                    operator: '>=',
                    value: 'amountThreshold',
                    valueType: 'parameter',
                    logicalOperator: 'AND'
                },
                {
                    id: 'cond-016',
                    field: 'transaction.destinationCountry',
                    operator: 'in',
                    value: 'highRiskCountries',
                    valueType: 'parameter'
                }
            ],
            actions: [
                {
                    id: 'action-009',
                    actionType: 'escalate',
                    parameters: {
                        escalationLevel: 'compliance_manager',
                        priority: 'high'
                    }
                },
                {
                    id: 'action-010',
                    actionType: 'generate_alert',
                    parameters: {
                        alertType: 'high_risk_transaction',
                        riskLevel: 'high'
                    }
                }
            ],
            triggerCount: 0,
            version: 1.0
        }
    ];

    const mockRuleEffectiveness: RuleEffectiveness[] = [
        {
            ruleId: 'rule-001',
            ruleName: 'High Volume Transaction Monitoring',
            totalTriggers: 152,
            truePositives: 117,
            falsePositives: 35,
            efficiency: 0.77,
            lastEvaluated: '2025-05-19T08:30:00Z'
        },
        {
            ruleId: 'rule-002',
            ruleName: 'Sanctioned Countries Detection',
            totalTriggers: 18,
            truePositives: 17,
            falsePositives: 1,
            efficiency: 0.95,
            lastEvaluated: '2025-05-18T10:45:00Z'
        },
        {
            ruleId: 'rule-003',
            ruleName: 'Structured Transaction Detection',
            totalTriggers: 42,
            truePositives: 34,
            falsePositives: 8,
            efficiency: 0.82,
            lastEvaluated: '2025-05-16T13:10:00Z'
        },
        {
            ruleId: 'rule-004',
            ruleName: 'New Account Rapid Withdrawal',
            totalTriggers: 15,
            truePositives: 10,
            falsePositives: 5,
            efficiency: 0.67,
            lastEvaluated: '2025-05-18T14:15:00Z'
        },
        {
            ruleId: 'rule-005',
            ruleName: 'Multiple Registration Attempts',
            totalTriggers: 38,
            truePositives: 32,
            falsePositives: 6,
            efficiency: 0.85,
            lastEvaluated: '2025-05-17T09:20:00Z'
        }
    ];

    // Load AML rule data
    useEffect(() => {
        // Simulating API call
        const fetchAMLRules = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be:
                // const rulesData = await amlService.getRules();
                // const effectivenessData = await amlService.getRuleEffectiveness();

                // For now, using mock data with a timeout for loading simulation
                setTimeout(() => {
                    setRules(mockRules);
                    setRuleEffectiveness(mockRuleEffectiveness);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch AML rules', error);
                setErrorMessage('Failed to load AML rules data');
                setIsLoading(false);
            }
        };

        fetchAMLRules();
    }, []);

    // Filter rules based on search, category, type and status
    const filteredRules = rules.filter(rule => {
        if (!showSystemRules && rule.isSystemRule) return false;

        const matchesSearch =
            rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rule.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
        const matchesType = typeFilter === 'all' || rule.ruleType === typeFilter;
        const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;

        return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });

    // Get rule effectiveness data
    const getRuleEffectiveness = (ruleId: string) => {
        return ruleEffectiveness.find(item => item.ruleId === ruleId);
    };

    // Handle toggling rule status
    const handleToggleRuleStatus = (ruleId: string) => {
        // In a real implementation, this would call an API
        const updatedRules = rules.map(rule => {
            if (rule.id === ruleId) {
                const newStatus: 'active' | 'inactive' = rule.status === 'active' ? 'inactive' : 'active';
                return { ...rule, status: newStatus, updatedAt: new Date().toISOString() };
            }
            return rule;
        });

        setRules(updatedRules);
        showSuccess(`Rule status updated successfully`);
    };

    // Handle deleting a rule
    const handleDeleteRule = () => {
        if (!selectedRule) return;

        // In a real implementation, this would call an API
        const updatedRules = rules.filter(rule => rule.id !== selectedRule.id);

        setRules(updatedRules);
        showSuccess(`Rule "${selectedRule.name}" deleted successfully`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setSelectedRule(null);
    };

    // Handle adding a rule
    const handleAddRule = () => {
        // In a real implementation, this would call an API
        const newRule: AMLRule = {
            id: `rule-${(rules.length + 1).toString().padStart(3, '0')}`,
            name: ruleFormData.name || '',
            description: ruleFormData.description || '',
            ruleType: ruleFormData.ruleType as any || 'transaction',
            category: ruleFormData.category as any || 'detection',
            status: 'inactive',
            severity: ruleFormData.severity as any || 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Current User',
            parameters: ruleFormData.parameters || [],
            conditions: ruleFormData.conditions || [],
            actions: ruleFormData.actions || [],
            version: 1.0
        };

        setRules([...rules, newRule]);
        showSuccess(`Rule "${newRule.name}" added successfully`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setRuleFormData({
            name: '',
            description: '',
            ruleType: 'transaction',
            category: 'detection',
            status: 'inactive',
            severity: 'medium',
            parameters: [],
            conditions: [],
            actions: []
        });
    };

    // Handle updating a rule
    const handleUpdateRule = () => {
        if (!selectedRule) return;

        // In a real implementation, this would call an API
        const updatedRules = rules.map(rule => {
            if (rule.id === selectedRule.id) {
                return {
                    ...rule,
                    name: ruleFormData.name || rule.name,
                    description: ruleFormData.description || rule.description,
                    ruleType: ruleFormData.ruleType as any || rule.ruleType,
                    category: ruleFormData.category as any || rule.category,
                    severity: ruleFormData.severity as any || rule.severity,
                    updatedAt: new Date().toISOString(),
                    updatedBy: 'Current User',
                    parameters: ruleFormData.parameters || rule.parameters,
                    conditions: ruleFormData.conditions || rule.conditions,
                    actions: ruleFormData.actions || rule.actions,
                    version: rule.version + 0.1
                };
            }
            return rule;
        });

        setRules(updatedRules);
        showSuccess(`Rule "${selectedRule.name}" updated successfully`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setSelectedRule(null);
        setRuleFormData({
            name: '',
            description: '',
            ruleType: 'transaction',
            category: 'detection',
            status: 'inactive',
            severity: 'medium',
            parameters: [],
            conditions: [],
            actions: []
        });
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

    // Open rule view modal
    const openViewRuleModal = (rule: AMLRule) => {
        setSelectedRule(rule);
        setModalType('view');
        setIsModalOpen(true);
    };

    // Open rule edit modal
    const openEditRuleModal = (rule: AMLRule) => {
        setSelectedRule(rule);
        setRuleFormData({
            name: rule.name,
            description: rule.description,
            ruleType: rule.ruleType,
            category: rule.category,
            status: rule.status,
            severity: rule.severity,
            parameters: rule.parameters,
            conditions: rule.conditions,
            actions: rule.actions
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    // Open add rule modal
    const openAddRuleModal = () => {
        setRuleFormData({
            name: '',
            description: '',
            ruleType: 'transaction',
            category: 'detection',
            status: 'inactive',
            severity: 'medium',
            parameters: [],
            conditions: [],
            actions: []
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    // Open delete rule confirmation modal
    const openDeleteRuleModal = (rule: AMLRule) => {
        setSelectedRule(rule);
        setModalType('delete');
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

    // Format rule type
    const formatRuleType = (type: string) => {
        switch (type) {
            case 'transaction': return 'Transaction';
            case 'behavior': return 'Behavior';
            case 'identity': return 'Identity';
            case 'velocity': return 'Velocity';
            case 'pattern': return 'Pattern';
            case 'geographic': return 'Geographic';
            default: return type;
        }
    };

    // Format category
    const formatCategory = (category: string) => {
        switch (category) {
            case 'monitoring': return 'Monitoring';
            case 'screening': return 'Screening';
            case 'detection': return 'Detection';
            case 'verification': return 'Verification';
            default: return category;
        }
    };

    // Get rule type icon
    const getRuleTypeIcon = (type: string) => {
        switch (type) {
            case 'transaction':
                return <DollarSign className="w-4 h-4 text-indigo-600" />;
            case 'behavior':
                return <Activity className="w-4 h-4 text-blue-600" />;
            case 'identity':
                return <Users className="w-4 h-4 text-purple-600" />;
            case 'velocity':
                return <Zap className="w-4 h-4 text-orange-600" />;
            case 'pattern':
                return <GitBranch className="w-4 h-4 text-green-600" />;
            case 'geographic':
                return <Globe className="w-4 h-4 text-red-600" />;
            default:
                return <Tag className="w-4 h-4 text-gray-600" />;
        }
    };

    // Get category icon
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'monitoring':
                return <Eye className="w-4 h-4 text-blue-600" />;
            case 'screening':
                return <Filter className="w-4 h-4 text-orange-600" />;
            case 'detection':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'verification':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            default:
                return <Info className="w-4 h-4 text-gray-600" />;
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'testing':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Play className="w-4 h-4" />;
            case 'inactive':
                return <Pause className="w-4 h-4" />;
            case 'testing':
                return <Terminal className="w-4 h-4" />;
            case 'archived':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Info className="w-4 h-4" />;
        }
    };

    // Get severity badge color
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low':
                return 'bg-blue-100 text-blue-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Function to render parameters section in view modal
    const renderParametersSection = (parameters: RuleParameter[]) => {
        if (!parameters || parameters.length === 0) {
            return <p className="text-sm text-gray-500 italic">No parameters defined</p>;
        }

        return (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Value</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {parameters.map((param) => (
                                <tr key={param.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-indigo-600">
                                        {param.name}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {param.dataType}
                                        {param.unit && <span className="ml-1 text-xs">({param.unit})</span>}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                        {Array.isArray(param.value)
                                            ? param.value.join(', ')
                                            : String(param.value)}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-500">
                                        {param.description || 'No description'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Function to render conditions section in view modal
    const renderConditionsSection = (conditions: RuleCondition[]) => {
        if (!conditions || conditions.length === 0) {
            return <p className="text-sm text-gray-500 italic">No conditions defined</p>;
        }

        return (
            <div>
                {conditions.map((condition, index) => (
                    <div key={condition.id} className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-gray-700">
                                Condition #{index + 1}
                            </div>
                            {index > 0 && (
                                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {condition.logicalOperator || 'AND'}
                                </div>
                            )}
                        </div>
                        <div className="text-sm">
                            <span className="text-indigo-600 font-medium">{condition.field}</span>
                            <span className="mx-1 text-gray-500">{condition.operator}</span>
                            <span className="text-orange-600 font-medium">
                                {typeof condition.value === 'string' && condition.valueType === 'parameter'
                                    ? `${condition.value} (parameter)`
                                    : Array.isArray(condition.value)
                                        ? condition.value.join(', ')
                                        : String(condition.value)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Function to render actions section in view modal
    const renderActionsSection = (actions: RuleAction[]) => {
        if (!actions || actions.length === 0) {
            return <p className="text-sm text-gray-500 italic">No actions defined</p>;
        }

        return (
            <div>
                {actions.map((action, index) => (
                    <div key={action.id} className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            Action #{index + 1}: {formatActionType(action.actionType)}
                        </div>
                        <div className="text-sm text-gray-600">
                            {action.description && (
                                <div className="mb-1 text-xs text-gray-500">{action.description}</div>
                            )}
                            {Object.entries(action.parameters).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                    <span className="text-gray-500">{key}: </span>
                                    <span className="text-gray-700 font-medium">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Format action type
    const formatActionType = (type: string) => {
        switch (type) {
            case 'generate_alert': return 'Generate Alert';
            case 'block_transaction': return 'Block Transaction';
            case 'escalate': return 'Escalate';
            case 'request_verification': return 'Request Verification';
            case 'notify': return 'Notify';
            case 'log': return 'Log';
            case 'reduce_limits': return 'Reduce Limits';
            default: return type;
        }
    };

    // Get modal title
    const getModalTitle = () => {
        switch (modalType) {
            case 'view':
                return selectedRule ? `AML Rule: ${selectedRule.name}` : 'Rule Details';
            case 'edit':
                return 'Edit AML Rule';
            case 'add':
                return 'Add New AML Rule';
            case 'delete':
                return 'Delete AML Rule';
            case 'test':
                return 'Test AML Rule';
            default:
                return '';
        }
    };

    // Render the component
    return (
        <div>
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

            {/* AML Rules Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Play size={20} className="text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Active Rules</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {rules.filter(rule => rule.status === 'active').length}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                            High Risk: {rules.filter(rule => rule.status === 'active' && (rule.severity === 'high' || rule.severity === 'critical')).length}
                        </span>
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                            Medium Risk: {rules.filter(rule => rule.status === 'active' && rule.severity === 'medium').length}
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BarChart3 size={20} className="text-blue-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Rule Categories</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {rules.length}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            Monitoring: {rules.filter(rule => rule.category === 'monitoring').length}
                        </span>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            Detection: {rules.filter(rule => rule.category === 'detection').length}
                        </span>
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                            Screening: {rules.filter(rule => rule.category === 'screening').length}
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 size={20} className="text-green-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Effectiveness</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {Math.round(ruleEffectiveness.reduce((acc, curr) => acc + curr.efficiency, 0) / ruleEffectiveness.length * 100)}%
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            True Positives: {ruleEffectiveness.reduce((acc, curr) => acc + curr.truePositives, 0)}
                        </span>
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                            False Positives: {ruleEffectiveness.reduce((acc, curr) => acc + curr.falsePositives, 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* AML Rules Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">AML Rules</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={openAddRuleModal}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            <PlusCircle size={16} />
                            <span>Add Rule</span>
                        </button>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-200 flex flex-wrap md:flex-nowrap gap-3 items-center justify-between">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search rules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                        >
                            <option value="all">All Categories</option>
                            <option value="monitoring">Monitoring</option>
                            <option value="screening">Screening</option>
                            <option value="detection">Detection</option>
                            <option value="verification">Verification</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="transaction">Transaction</option>
                            <option value="behavior">Behavior</option>
                            <option value="identity">Identity</option>
                            <option value="velocity">Velocity</option>
                            <option value="pattern">Pattern</option>
                            <option value="geographic">Geographic</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="testing">Testing</option>
                            <option value="archived">Archived</option>
                        </select>

                        <button
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                            onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    setIsLoading(false);
                                }, 800);
                            }}
                        >
                            <RefreshCw size={16} />
                        </button>

                        <div className="flex items-center ml-2">
                            <input
                                type="checkbox"
                                id="showSystemRules"
                                checked={showSystemRules}
                                onChange={() => setShowSystemRules(!showSystemRules)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showSystemRules" className="ml-2 text-sm text-gray-600">
                                Show System Rules
                            </label>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8">
                        <div className="flex justify-center items-center">
                            <RefreshCw size={24} className="text-gray-400 animate-spin" />
                            <span className="ml-2 text-gray-500">Loading AML rules...</span>
                        </div>
                    </div>
                ) : filteredRules.length === 0 ? (
                    <div className="p-8 text-center">
                        <Settings size={36} className="mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No rules found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectiveness</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRules.map((rule) => {
                                    const effectiveness = getRuleEffectiveness(rule.id);

                                    return (
                                        <tr key={rule.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                        {getRuleTypeIcon(rule.ruleType)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 max-w-[250px] truncate" title={rule.description}>
                                                            {rule.description}
                                                        </div>
                                                        {rule.isSystemRule && (
                                                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                                System Rule
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getRuleTypeIcon(rule.ruleType)}
                                                    <span className="ml-2 text-sm text-gray-900">{formatRuleType(rule.ruleType)}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getCategoryIcon(rule.category)}
                                                    <span className="ml-2 text-sm text-gray-900">{formatCategory(rule.category)}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                                                    {getStatusIcon(rule.status)}
                                                    {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                                                    {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                {effectiveness ? (
                                                    <div className="flex items-center">
                                                        <div className="mr-2 w-12 bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className={`h-2.5 rounded-full ${effectiveness.efficiency >= 0.9 ? 'bg-green-500' :
                                                                        effectiveness.efficiency >= 0.7 ? 'bg-blue-500' :
                                                                            effectiveness.efficiency >= 0.5 ? 'bg-yellow-500' :
                                                                                'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${effectiveness.efficiency * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-700">
                                                            {Math.round(effectiveness.efficiency * 100)}%
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">No data</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(rule.updatedAt)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                                        onClick={() => openViewRuleModal(rule)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        onClick={() => openEditRuleModal(rule)}
                                                        disabled={rule.isSystemRule}
                                                        title={rule.isSystemRule ? "System rules cannot be edited" : "Edit rule"}
                                                    >
                                                        <Edit size={16} className={rule.isSystemRule ? "opacity-40" : ""} />
                                                    </button>
                                                    <button
                                                        className={`${rule.status === 'active' ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'} p-1`}
                                                        onClick={() => handleToggleRuleStatus(rule.id)}
                                                    >
                                                        {rule.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        onClick={() => openDeleteRuleModal(rule)}
                                                        disabled={rule.isSystemRule}
                                                        title={rule.isSystemRule ? "System rules cannot be deleted" : "Delete rule"}
                                                    >
                                                        <Trash2 size={16} className={rule.isSystemRule ? "opacity-40" : ""} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {filteredRules.length} of {rules.length} rules
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

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedRule(null);
                    setRuleFormData({
                        name: '',
                        description: '',
                        ruleType: 'transaction',
                        category: 'detection',
                        status: 'inactive',
                        severity: 'medium',
                        parameters: [],
                        conditions: [],
                        actions: []
                    });
                }}
                title={getModalTitle()}
                size={modalType === 'view' ? 'lg' : 'md'}
            >
                {modalType === 'view' && selectedRule && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedRule.severity)}`}>
                                        {selectedRule.severity.charAt(0).toUpperCase() + selectedRule.severity.slice(1)} Severity
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRule.status)}`}>
                                        {getStatusIcon(selectedRule.status)}
                                        {selectedRule.status.charAt(0).toUpperCase() + selectedRule.status.slice(1)}
                                    </span>
                                    {selectedRule.isSystemRule && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            System Rule
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">ID: {selectedRule.id} (v{selectedRule.version})</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Type:</div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                        <div className="mr-2">
                                            {getRuleTypeIcon(selectedRule.ruleType)}
                                        </div>
                                        {formatRuleType(selectedRule.ruleType)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Category:</div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                        <div className="mr-2">
                                            {getCategoryIcon(selectedRule.category)}
                                        </div>
                                        {formatCategory(selectedRule.category)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="text-gray-500">Description:</div>
                                <div className="font-medium text-gray-800 mt-1">{selectedRule.description}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Created By</h3>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <div className="font-medium text-gray-800">{selectedRule.createdBy}</div>
                                    <div className="text-gray-500 text-xs mt-1">{formatDate(selectedRule.createdAt)}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <div className="font-medium text-gray-800">{selectedRule.updatedBy || 'N/A'}</div>
                                    <div className="text-gray-500 text-xs mt-1">{formatDate(selectedRule.updatedAt)}</div>
                                </div>
                            </div>
                        </div>

                        {selectedRule.triggerCount !== undefined && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Trigger Statistics</h3>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-700">Total Triggers:</span>
                                            <span className="text-sm font-medium text-gray-900">{selectedRule.triggerCount}</span>
                                        </div>
                                        {selectedRule.lastTriggered && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Last Triggered:</span>
                                                <span className="text-sm text-gray-500">{formatDate(selectedRule.lastTriggered)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedRule.falsePositiveRate !== undefined && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Effectiveness</h3>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="mb-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-700">Accuracy Rate:</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {(1 - selectedRule.falsePositiveRate) * 100}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${(1 - selectedRule.falsePositiveRate) >= 0.9 ? 'bg-green-500' :
                                                                (1 - selectedRule.falsePositiveRate) >= 0.7 ? 'bg-blue-500' :
                                                                    (1 - selectedRule.falsePositiveRate) >= 0.5 ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                            }`}
                                                        style={{ width: `${(1 - selectedRule.falsePositiveRate) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">False Positive Rate:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {selectedRule.falsePositiveRate * 100}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Parameters</h3>
                            {renderParametersSection(selectedRule.parameters)}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Conditions</h3>
                            {renderConditionsSection(selectedRule.conditions)}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
                            {renderActionsSection(selectedRule.actions)}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>

                            {!selectedRule.isSystemRule && (
                                <button
                                    onClick={() => openEditRuleModal(selectedRule)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
                                >
                                    Edit Rule
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {(modalType === 'edit' || modalType === 'add') && (
                    <div className="space-y-4 p-1">
                        {modalType === 'edit' ? (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            You are editing an AML rule. Changes may affect detection patterns and alerts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Info className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            You are creating a new AML rule. The rule will be set to inactive by default until you activate it.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                            <input
                                type="text"
                                value={ruleFormData.name}
                                onChange={(e) => setRuleFormData({ ...ruleFormData, name: e.target.value })}
                                placeholder="Enter rule name..."
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={ruleFormData.description}
                                onChange={(e) => setRuleFormData({ ...ruleFormData, description: e.target.value })}
                                placeholder="Enter rule description..."
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                                <select
                                    value={ruleFormData.ruleType}
                                    onChange={(e) => setRuleFormData({ ...ruleFormData, ruleType: e.target.value as any })}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                                >
                                    <option value="transaction">Transaction</option>
                                    <option value="behavior">Behavior</option>
                                    <option value="identity">Identity</option>
                                    <option value="velocity">Velocity</option>
                                    <option value="pattern">Pattern</option>
                                    <option value="geographic">Geographic</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={ruleFormData.category}
                                    onChange={(e) => setRuleFormData({ ...ruleFormData, category: e.target.value as any })}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                                >
                                    <option value="monitoring">Monitoring</option>
                                    <option value="screening">Screening</option>
                                    <option value="detection">Detection</option>
                                    <option value="verification">Verification</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select
                                value={ruleFormData.severity}
                                onChange={(e) => setRuleFormData({ ...ruleFormData, severity: e.target.value as any })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Rule Configuration</h3>
                            <p className="text-sm text-gray-500 mb-3">
                                In a complete implementation, this section would include interfaces for configuring:
                            </p>
                            <ul className="text-sm text-gray-600 space-y-2 ml-5 list-disc">
                                <li>Rule parameters (thresholds, criteria values)</li>
                                <li>Rule conditions (logical expressions, comparison operators)</li>
                                <li>Rule actions (alerts, blocking, notifications)</li>
                                <li>Testing capabilities against historical data</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setSelectedRule(null);
                                    setRuleFormData({
                                        name: '',
                                        description: '',
                                        ruleType: 'transaction',
                                        category: 'detection',
                                        status: 'inactive',
                                        severity: 'medium',
                                        parameters: [],
                                        conditions: [],
                                        actions: []
                                    });
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={modalType === 'add' ? handleAddRule : handleUpdateRule}
                                disabled={!ruleFormData.name || !ruleFormData.description}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {modalType === 'add' ? 'Add Rule' : 'Update Rule'}
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'delete' && selectedRule && (
                    <div className="space-y-4 p-1">
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        Are you sure you want to delete this AML rule? This action cannot be undone and may affect compliance monitoring.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Rule Name:</div>
                                    <div className="font-medium text-gray-800">{selectedRule.name}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Rule Type:</div>
                                    <div className="font-medium text-gray-800">{formatRuleType(selectedRule.ruleType)}</div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="text-gray-500">Description:</div>
                                <div className="font-medium text-gray-800">{selectedRule.description}</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setSelectedRule(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteRule}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                            >
                                Delete Rule
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AMLRulesConfiguration;