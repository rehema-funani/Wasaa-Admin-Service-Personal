import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Activity,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Modal } from "../../../../components/common/Modal";
import {
  AMLRule,
  RuleAction,
  RuleCondition,
  RuleEffectiveness,
  RuleParameter,
} from "../../../../types/compliance";
import { mockRuleEffectiveness, mockRules } from "../../../../data/rules";
import AddEditRuleModal from "../../../../components/finance/AddEditRuleModal";
import DeleteRuleModal from "../../../../components/finance/DeleteRuleModal";

const AMLRulesConfiguration: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [rules, setRules] = useState<AMLRule[]>([]);
  const [ruleEffectiveness, setRuleEffectiveness] = useState<
    RuleEffectiveness[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "monitoring" | "screening" | "detection" | "verification"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    | "all"
    | "transaction"
    | "behavior"
    | "identity"
    | "velocity"
    | "pattern"
    | "geographic"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "testing" | "archived"
  >("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<AMLRule | null>(null);
  const [showSystemRules, setShowSystemRules] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "edit" | "add" | "delete" | "test" | null
  >(null);

  const [ruleFormData, setRuleFormData] = useState<Partial<AMLRule>>({
    name: "",
    description: "",
    ruleType: "transaction",
    category: "detection",
    status: "inactive",
    severity: "medium",
    parameters: [],
    conditions: [],
    actions: [],
  });

  useEffect(() => {
    const fetchAMLRules = async () => {
      setIsLoading(true);
      try {
        // const rulesData = await amlService.getRules();
        // const effectivenessData = await amlService.getRuleEffectiveness();

        setTimeout(() => {
          setRules(mockRules);
          setRuleEffectiveness(mockRuleEffectiveness);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch AML rules", error);
        setErrorMessage("Failed to load AML rules data");
        setIsLoading(false);
      }
    };

    fetchAMLRules();
  }, []);

  const filteredRules = rules.filter((rule) => {
    if (!showSystemRules && rule.isSystemRule) return false;

    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || rule.category === categoryFilter;
    const matchesType = typeFilter === "all" || rule.ruleType === typeFilter;
    const matchesStatus =
      statusFilter === "all" || rule.status === statusFilter;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const getRuleEffectiveness = (ruleId: string) => {
    return ruleEffectiveness.find((item) => item.ruleId === ruleId);
  };

  const handleToggleRuleStatus = (ruleId: string) => {
    const updatedRules = rules.map((rule) => {
      if (rule.id === ruleId) {
        const newStatus: "active" | "inactive" =
          rule.status === "active" ? "inactive" : "active";
        return {
          ...rule,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return rule;
    });

    setRules(updatedRules);
    showSuccess(`Rule status updated successfully`);
  };

  const handleDeleteRule = () => {
    if (!selectedRule) return;

    const updatedRules = rules.filter((rule) => rule.id !== selectedRule.id);

    setRules(updatedRules);
    showSuccess(`Rule "${selectedRule.name}" deleted successfully`);

    setIsModalOpen(false);
    setModalType(null);
    setSelectedRule(null);
  };

  const handleAddRule = () => {
    const newRule: AMLRule = {
      id: `rule-${(rules.length + 1).toString().padStart(3, "0")}`,
      name: ruleFormData.name || "",
      description: ruleFormData.description || "",
      ruleType: (ruleFormData.ruleType as any) || "transaction",
      category: (ruleFormData.category as any) || "detection",
      status: "inactive",
      severity: (ruleFormData.severity as any) || "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
      parameters: ruleFormData.parameters || [],
      conditions: ruleFormData.conditions || [],
      actions: ruleFormData.actions || [],
      version: 1.0,
    };

    setRules([...rules, newRule]);
    showSuccess(`Rule "${newRule.name}" added successfully`);

    setIsModalOpen(false);
    setModalType(null);
    setRuleFormData({
      name: "",
      description: "",
      ruleType: "transaction",
      category: "detection",
      status: "inactive",
      severity: "medium",
      parameters: [],
      conditions: [],
      actions: [],
    });
  };

  const handleUpdateRule = () => {
    if (!selectedRule) return;

    const updatedRules = rules.map((rule) => {
      if (rule.id === selectedRule.id) {
        return {
          ...rule,
          name: ruleFormData.name || rule.name,
          description: ruleFormData.description || rule.description,
          ruleType: (ruleFormData.ruleType as any) || rule.ruleType,
          category: (ruleFormData.category as any) || rule.category,
          severity: (ruleFormData.severity as any) || rule.severity,
          updatedAt: new Date().toISOString(),
          updatedBy: "Current User",
          parameters: ruleFormData.parameters || rule.parameters,
          conditions: ruleFormData.conditions || rule.conditions,
          actions: ruleFormData.actions || rule.actions,
          version: rule.version + 0.1,
        };
      }
      return rule;
    });

    setRules(updatedRules);
    showSuccess(`Rule "${selectedRule.name}" updated successfully`);

    setIsModalOpen(false);
    setModalType(null);
    setSelectedRule(null);
    setRuleFormData({
      name: "",
      description: "",
      ruleType: "transaction",
      category: "detection",
      status: "inactive",
      severity: "medium",
      parameters: [],
      conditions: [],
      actions: [],
    });
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage(null);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const navigateToRuleDetail = (rule: AMLRule) => {
    navigate(`/admin/finance/compliance/rules/${rule.id}`, { state: { rule } });
  };

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
      actions: rule.actions,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openAddRuleModal = () => {
    setRuleFormData({
      name: "",
      description: "",
      ruleType: "transaction",
      category: "detection",
      status: "inactive",
      severity: "medium",
      parameters: [],
      conditions: [],
      actions: [],
    });
    setModalType("add");
    setIsModalOpen(true);
  };

  const openDeleteRuleModal = (rule: AMLRule) => {
    setSelectedRule(rule);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRuleType = (type: string) => {
    switch (type) {
      case "transaction":
        return "Transaction";
      case "behavior":
        return "Behavior";
      case "identity":
        return "Identity";
      case "velocity":
        return "Velocity";
      case "pattern":
        return "Pattern";
      case "geographic":
        return "Geographic";
      default:
        return type;
    }
  };

  const formatCategory = (category: string) => {
    switch (category) {
      case "monitoring":
        return "Monitoring";
      case "screening":
        return "Screening";
      case "detection":
        return "Detection";
      case "verification":
        return "Verification";
      default:
        return category;
    }
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <DollarSign className="w-4 h-4 text-blue-500" />;
      case "behavior":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "identity":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "velocity":
        return <Zap className="w-4 h-4 text-amber-500" />;
      case "pattern":
        return <GitBranch className="w-4 h-4 text-emerald-500" />;
      case "geographic":
        return <Globe className="w-4 h-4 text-rose-500" />;
      default:
        return <Tag className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "monitoring":
        return <Eye className="w-4 h-4 text-blue-500" />;
      case "screening":
        return <Filter className="w-4 h-4 text-amber-500" />;
      case "detection":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "verification":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
      case "inactive":
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white";
      case "testing":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-white";
      case "archived":
        return "bg-gradient-to-r from-rose-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "inactive":
        return <Pause className="w-4 h-4" />;
      case "testing":
        return <Terminal className="w-4 h-4" />;
      case "archived":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-gradient-to-r from-blue-400 to-blue-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white";
      case "high":
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      case "critical":
        return "bg-gradient-to-r from-rose-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white";
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "edit":
        return "Edit AML Rule";
      case "add":
        return "Add New AML Rule";
      case "delete":
        return "Delete AML Rule";
      case "test":
        return "Test AML Rule";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {successMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 shadow-lg shadow-emerald-100/20 animate-fadeIn">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-700 shadow-lg shadow-rose-100/20 animate-fadeIn">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AML Rules Engine</h1>
            <p className="text-blue-100 mt-1">
              Configure and manage anti-money laundering rules
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddRuleModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium shadow-md"
            >
              <PlusCircle size={16} />
              <span>Create New Rule</span>
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-500/20 text-white rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium backdrop-blur-sm">
              <Download size={16} />
              <span>Export Rules</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Shield size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium">Active Rules</h3>
            </div>
            <p className="text-3xl font-bold">
              {rules.filter((rule) => rule.status === "active").length}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-amber-400/20 backdrop-blur-sm text-amber-100 px-2 py-1 rounded-full border border-amber-400/30">
                High Risk:{" "}
                {
                  rules.filter(
                    (rule) =>
                      rule.status === "active" &&
                      (rule.severity === "high" || rule.severity === "critical")
                  ).length
                }
              </span>
              <span className="text-xs bg-blue-400/20 backdrop-blur-sm text-blue-100 px-2 py-1 rounded-full border border-blue-400/30">
                Medium Risk:{" "}
                {
                  rules.filter(
                    (rule) =>
                      rule.status === "active" && rule.severity === "medium"
                  ).length
                }
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Filter size={22} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-medium">Rule Categories</h3>
            </div>
            <p className="text-3xl font-bold">
              {
                Object.keys(
                  rules.reduce(
                    (acc, rule) => ({ ...acc, [rule.category]: true }),
                    {}
                  )
                ).length
              }
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-blue-400/20 backdrop-blur-sm text-blue-100 px-2 py-1 rounded-full border border-blue-400/30">
                Monitoring:{" "}
                {rules.filter((rule) => rule.category === "monitoring").length}
              </span>
              <span className="text-xs bg-emerald-400/20 backdrop-blur-sm text-emerald-100 px-2 py-1 rounded-full border border-emerald-400/30">
                Detection:{" "}
                {rules.filter((rule) => rule.category === "detection").length}
              </span>
              <span className="text-xs bg-purple-400/20 backdrop-blur-sm text-purple-100 px-2 py-1 rounded-full border border-purple-400/30">
                Screening:{" "}
                {rules.filter((rule) => rule.category === "screening").length}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium">Effectiveness</h3>
            </div>
            <p className="text-3xl font-bold">
              {Math.round(
                (ruleEffectiveness.reduce(
                  (acc, curr) => acc + curr.efficiency,
                  0
                ) /
                  ruleEffectiveness.length) *
                  100
              )}
              %
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-emerald-400/20 backdrop-blur-sm text-emerald-100 px-2 py-1 rounded-full border border-emerald-400/30">
                True Positives:{" "}
                {ruleEffectiveness.reduce(
                  (acc, curr) => acc + curr.truePositives,
                  0
                )}
              </span>
              <span className="text-xs bg-rose-400/20 backdrop-blur-sm text-rose-100 px-2 py-1 rounded-full border border-rose-400/30">
                False Positives:{" "}
                {ruleEffectiveness.reduce(
                  (acc, curr) => acc + curr.falsePositives,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-lg font-semibold text-slate-800">AML Rules</h2>
        </div>

        <div className="p-4 border-b border-slate-100 flex flex-wrap md:flex-nowrap gap-3 items-center justify-between bg-white">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 text-sm"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm"
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
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm"
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
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="testing">Testing</option>
              <option value="archived">Archived</option>
            </select>

            <button
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="showSystemRules"
                className="ml-2 text-sm text-slate-600"
              >
                Show System Rules
              </label>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-10">
            <div className="flex flex-col justify-center items-center">
              <RefreshCw
                size={32}
                className="text-blue-500 animate-spin mb-3"
              />
              <span className="text-slate-500 font-medium">
                Loading AML rules...
              </span>
            </div>
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="p-12 text-center">
            <Settings size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">
              No rules found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-slate-50 to-white">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Rule
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Effectiveness
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredRules.map((rule) => {
                  const effectiveness = getRuleEffectiveness(rule.id);

                  return (
                    <tr
                      key={rule.id}
                      className="hover:bg-slate-50 transition duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-3 border border-blue-100">
                            {getRuleTypeIcon(rule.ruleType)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {rule.name}
                            </div>
                            <div
                              className="text-xs text-slate-500 mt-0.5 max-w-[250px] truncate"
                              title={rule.description}
                            >
                              {rule.description}
                            </div>
                            {rule.isSystemRule && (
                              <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                System Rule
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRuleTypeIcon(rule.ruleType)}
                          <span className="ml-2 text-sm text-slate-700">
                            {formatRuleType(rule.ruleType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getCategoryIcon(rule.category)}
                          <span className="ml-2 text-sm text-slate-700">
                            {formatCategory(rule.category)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(
                            rule.status
                          )}`}
                        >
                          {getStatusIcon(rule.status)}
                          {rule.status.charAt(0).toUpperCase() +
                            rule.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getSeverityColor(
                            rule.severity
                          )}`}
                        >
                          {rule.severity.charAt(0).toUpperCase() +
                            rule.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {effectiveness ? (
                          <div className="flex items-center">
                            <div className="mr-2 w-16 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full ${
                                  effectiveness.efficiency >= 0.9
                                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                                    : effectiveness.efficiency >= 0.7
                                    ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                    : effectiveness.efficiency >= 0.5
                                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                    : "bg-gradient-to-r from-rose-400 to-red-500"
                                }`}
                                style={{
                                  width: `${effectiveness.efficiency * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {Math.round(effectiveness.efficiency * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">
                            No data
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(rule.updatedAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            onClick={() => navigateToRuleDetail(rule)}
                            title="View rule details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            onClick={() => openEditRuleModal(rule)}
                            disabled={rule.isSystemRule}
                            title={
                              rule.isSystemRule
                                ? "System rules cannot be edited"
                                : "Edit rule"
                            }
                          >
                            <Edit
                              size={16}
                              className={rule.isSystemRule ? "opacity-40" : ""}
                            />
                          </button>
                          <button
                            className={`${
                              rule.status === "active"
                                ? "text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100"
                                : "text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                            } 
                                                            p-1.5 rounded-lg transition-colors`}
                            onClick={() => handleToggleRuleStatus(rule.id)}
                            title={
                              rule.status === "active"
                                ? "Deactivate rule"
                                : "Activate rule"
                            }
                          >
                            {rule.status === "active" ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} />
                            )}
                          </button>
                          <button
                            className="text-rose-600 hover:text-rose-800 p-1.5 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                            onClick={() => openDeleteRuleModal(rule)}
                            disabled={rule.isSystemRule}
                            title={
                              rule.isSystemRule
                                ? "System rules cannot be deleted"
                                : "Delete rule"
                            }
                          >
                            <Trash2
                              size={16}
                              className={rule.isSystemRule ? "opacity-40" : ""}
                            />
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

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="text-sm text-slate-500">
            Showing {filteredRules.length} of {rules.length} rules
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium disabled:opacity-50 shadow-sm hover:bg-slate-50"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium disabled:opacity-50 shadow-sm hover:bg-slate-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalType(null);
          setSelectedRule(null);
          setRuleFormData({
            name: "",
            description: "",
            ruleType: "transaction",
            category: "detection",
            status: "inactive",
            severity: "medium",
            parameters: [],
            conditions: [],
            actions: [],
          });
        }}
        title={getModalTitle()}
        size="md"
      >
        {(modalType === "edit" || modalType === "add") && (
          <AddEditRuleModal
            modalType={modalType}
            ruleFormData={ruleFormData}
            setRuleFormData={setRuleFormData}
            setIsModalOpen={setIsModalOpen}
            setModalType={setModalType}
            setSelectedRule={setSelectedRule}
            handleAddRule={handleAddRule}
            handleUpdateRule={handleUpdateRule}
          />
        )}

        {modalType === "delete" && selectedRule && (
          <DeleteRuleModal
            selectedRule={selectedRule}
            setIsModalOpen={setIsModalOpen}
            setModalType={setModalType}
            setSelectedRule={setSelectedRule}
            handleDeleteRule={handleDeleteRule}
            formatRuleType={formatRuleType}
          />
        )}
      </Modal>
    </div>
  );
};

export default AMLRulesConfiguration;
