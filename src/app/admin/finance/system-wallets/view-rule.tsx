import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Activity,
  Users,
  Zap,
  GitBranch,
  Globe,
  Tag,
  Eye,
  Filter,
  Info,
  Terminal,
  XCircle,
  Copy,
  Download,
  Clock,
  User,
} from "lucide-react";
import { AMLRule, RuleEffectiveness } from "../../../../types/compliance";
import { mockRuleEffectiveness, mockRules } from "../../../../data/rules";

const RuleDetailPage: React.FC = () => {
  const { ruleId } = useParams<{ ruleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [rule, setRule] = useState<AMLRule | null>(null);
  const [ruleEffectiveness, setRuleEffectiveness] =
    useState<RuleEffectiveness | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "parameters" | "conditions" | "actions" | "history"
  >("overview");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRuleDetails = async () => {
      setIsLoading(true);
      try {
        if (location.state?.rule) {
          setRule(location.state.rule);
          const effectiveness = mockRuleEffectiveness.find(
            (item) => item.ruleId === location.state.rule.id
          );
          setRuleEffectiveness(effectiveness || null);
          setIsLoading(false);
          return;
        }

        // Otherwise fetch the rule by ID
        // const ruleData = await amlService.getRuleById(ruleId);
        // const effectivenessData = await amlService.getRuleEffectivenessById(ruleId);

        setTimeout(() => {
          const foundRule = mockRules.find((r) => r.id === ruleId);
          const foundEffectiveness = mockRuleEffectiveness.find(
            (item) => item.ruleId === ruleId
          );

          if (foundRule) {
            setRule(foundRule);
            setRuleEffectiveness(foundEffectiveness || null);
          } else {
            setErrorMessage("Rule not found");
          }

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch rule details", error);
        setErrorMessage("Failed to load rule details");
        setIsLoading(false);
      }
    };

    fetchRuleDetails();
  }, [ruleId, location.state]);

  const handleToggleRuleStatus = () => {
    if (!rule) return;

    const newStatus: "active" | "inactive" =
      rule.status === "active" ? "inactive" : "active";
    setRule({
      ...rule,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    showSuccess(`Rule status updated to ${newStatus}`);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage(null);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
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

  // Get rule type icon
  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case "behavior":
        return <Activity className="w-5 h-5 text-blue-500" />;
      case "identity":
        return <Users className="w-5 h-5 text-purple-500" />;
      case "velocity":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "pattern":
        return <GitBranch className="w-5 h-5 text-emerald-500" />;
      case "geographic":
        return <Globe className="w-5 h-5 text-rose-500" />;
      default:
        return <Tag className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "monitoring":
        return <Eye className="w-5 h-5 text-blue-500" />;
      case "screening":
        return <Filter className="w-5 h-5 text-amber-500" />;
      case "detection":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case "verification":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get status badge color
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

  // Get status icon
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

  const renderParametersSection = () => {
    if (!rule?.parameters || rule.parameters.length === 0) {
      return (
        <p className="text-sm text-slate-500 italic">No parameters defined</p>
      );
    }

    return (
      <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-slate-50 to-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {rule.parameters.map((param) => (
                <tr
                  key={param.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                    {param.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                    {param.dataType}
                    {param.unit && (
                      <span className="ml-1 text-xs">({param.unit})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {Array.isArray(param.value)
                      ? param.value.join(", ")
                      : String(param.value)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {param.description || "No description"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderConditionsSection = () => {
    if (!rule?.conditions || rule.conditions.length === 0) {
      return (
        <p className="text-sm text-slate-500 italic">No conditions defined</p>
      );
    }

    return (
      <div className="space-y-3">
        {rule.conditions.map((condition, index) => (
          <div
            key={condition.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-700 flex items-center">
                <div className="p-1.5 rounded-full bg-blue-50 mr-2">
                  <Filter className="w-4 h-4 text-blue-500" />
                </div>
                Condition #{index + 1}
              </div>
              {index > 0 && (
                <div className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100 font-medium">
                  {condition.logicalOperator || "AND"}
                </div>
              )}
            </div>
            <div className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-blue-600 font-medium">
                {condition.field}
              </span>
              <span className="mx-1.5 text-slate-500">
                {condition.operator}
              </span>
              <span className="text-amber-600 font-medium">
                {typeof condition.value === "string" &&
                condition.valueType === "parameter"
                  ? `${condition.value} (parameter)`
                  : Array.isArray(condition.value)
                  ? condition.value.join(", ")
                  : String(condition.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatActionType = (type: string) => {
    switch (type) {
      case "generate_alert":
        return "Generate Alert";
      case "block_transaction":
        return "Block Transaction";
      case "escalate":
        return "Escalate";
      case "request_verification":
        return "Request Verification";
      case "notify":
        return "Notify";
      case "log":
        return "Log";
      case "reduce_limits":
        return "Reduce Limits";
      default:
        return type;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "generate_alert":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "block_transaction":
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case "escalate":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "request_verification":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case "notify":
        return <Info className="w-4 h-4 text-blue-500" />;
      case "log":
        return <Terminal className="w-4 h-4 text-slate-500" />;
      case "reduce_limits":
        return <DollarSign className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const renderActionsSection = () => {
    if (!rule?.actions || rule.actions.length === 0) {
      return (
        <p className="text-sm text-slate-500 italic">No actions defined</p>
      );
    }

    return (
      <div className="space-y-3">
        {rule.actions.map((action, index) => (
          <div
            key={action.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center mb-2">
              <div className="p-1.5 rounded-full bg-blue-50 mr-2">
                {getActionIcon(action.actionType)}
              </div>
              <div className="text-sm font-medium text-slate-700">
                Action #{index + 1}: {formatActionType(action.actionType)}
              </div>
            </div>
            <div className="text-sm text-slate-600">
              {action.description && (
                <div className="mb-2 text-sm text-slate-500">
                  {action.description}
                </div>
              )}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                {Object.entries(action.parameters).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-slate-500">{key}:</span>
                    <span className="text-slate-700 font-medium">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverviewSection = () => {
    if (!rule) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Rule Description
            </h3>
            <p className="text-slate-600 whitespace-pre-line">
              {rule.description || "No description provided."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Conditions Summary
            </h3>
            {rule.conditions && rule.conditions.length > 0 ? (
              <div className="space-y-3">
                {rule.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="text-sm">
                      {index > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mr-2">
                          {condition.logicalOperator || "AND"}
                        </span>
                      )}
                      <span className="text-blue-600 font-medium">
                        {condition.field}
                      </span>
                      <span className="mx-1 text-slate-500">
                        {condition.operator}
                      </span>
                      <span className="text-amber-600 font-medium">
                        {typeof condition.value === "string"
                          ? condition.value
                          : Array.isArray(condition.value)
                          ? condition.value.join(", ")
                          : String(condition.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">
                No conditions defined for this rule.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Actions Summary
            </h3>
            {rule.actions && rule.actions.length > 0 ? (
              <div className="space-y-3">
                {rule.actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="p-1.5 rounded-full bg-blue-50 mr-3">
                      {getActionIcon(action.actionType)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">
                        {formatActionType(action.actionType)}
                      </div>
                      {action.description && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {action.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">
                No actions defined for this rule.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Rule Properties
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Rule Type</div>
                <div className="flex items-center">
                  <div className="p-1.5 rounded-full bg-blue-50 mr-2">
                    {getRuleTypeIcon(rule.ruleType)}
                  </div>
                  <span className="text-slate-700 font-medium">
                    {formatRuleType(rule.ruleType)}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Category</div>
                <div className="flex items-center">
                  <div className="p-1.5 rounded-full bg-blue-50 mr-2">
                    {getCategoryIcon(rule.category)}
                  </div>
                  <span className="text-slate-700 font-medium">
                    {formatCategory(rule.category)}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Status</div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(
                    rule.status
                  )}`}
                >
                  {getStatusIcon(rule.status)}
                  {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                </span>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Severity</div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getSeverityColor(
                    rule.severity
                  )}`}
                >
                  {rule.severity.charAt(0).toUpperCase() +
                    rule.severity.slice(1)}
                </span>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Version</div>
                <div className="text-slate-700 font-medium">
                  v{rule.version.toFixed(1)}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500 mb-1">Rule ID</div>
                <div className="flex items-center">
                  <div className="text-slate-700 font-mono text-sm mr-2">
                    {rule.id}
                  </div>
                  <button
                    className="p-1 text-slate-400 hover:text-blue-500"
                    title="Copy rule ID"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {ruleEffectiveness && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Effectiveness
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-2">
                    Efficiency Rate
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-slate-100 rounded-full h-3 mr-3">
                      <div
                        className={`h-3 rounded-full ${
                          ruleEffectiveness.efficiency >= 0.9
                            ? "bg-gradient-to-r from-emerald-400 to-green-500"
                            : ruleEffectiveness.efficiency >= 0.7
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : ruleEffectiveness.efficiency >= 0.5
                            ? "bg-gradient-to-r from-amber-400 to-orange-500"
                            : "bg-gradient-to-r from-rose-400 to-red-500"
                        }`}
                        style={{
                          width: `${ruleEffectiveness.efficiency * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-slate-700">
                      {Math.round(ruleEffectiveness.efficiency * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-1">
                      True Positives
                    </div>
                    <div className="text-lg font-bold text-emerald-700">
                      {ruleEffectiveness.truePositives}
                    </div>
                  </div>

                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <div className="text-xs text-rose-600 mb-1">
                      False Positives
                    </div>
                    <div className="text-lg font-bold text-rose-700">
                      {ruleEffectiveness.falsePositives}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-1">
                    Last Triggered
                  </div>
                  <div className="text-slate-700">
                    {ruleEffectiveness.lastTriggered
                      ? formatDate(ruleEffectiveness.lastTriggered)
                      : "Never"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 flex flex-col items-center mr-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <User size={18} className="text-blue-500" />
                  </div>
                  <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Created
                  </div>
                  <div className="text-sm text-slate-500 flex items-center mt-1">
                    <Clock size={14} className="mr-1" />
                    {formatDate(rule.createdAt)}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    by {rule.createdBy}
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 flex flex-col items-center mr-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Edit size={18} className="text-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Last Updated
                  </div>
                  <div className="text-sm text-slate-500 flex items-center mt-1">
                    <Clock size={14} className="mr-1" />
                    {formatDate(rule.updatedAt)}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    by {rule.updatedBy || rule.createdBy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <div className="text-slate-600 font-medium">
            Loading rule details...
          </div>
        </div>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="flex flex-col items-center max-w-md text-center p-8 bg-white rounded-xl shadow-xl border border-slate-200">
          <AlertTriangle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Rule Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The rule you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Rules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-12">
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-b-3xl shadow-xl mb-8">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/compliance/aml/rules")}
              className="flex items-center mr-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-2xl font-bold flex-grow">{rule.name}</h1>
            <div className="flex items-center gap-2">
              {!rule.isSystemRule && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/compliance/aml/rules/${rule.id}/edit`, {
                        state: { rule },
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors text-sm"
                    title="Edit rule"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/compliance/aml/rules/${rule.id}/delete`, {
                        state: { rule },
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 backdrop-blur-sm rounded-lg transition-colors text-sm"
                    title="Delete rule"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              )}
              <button
                onClick={handleToggleRuleStatus}
                className={`flex items-center gap-1.5 px-3 py-1.5 ${
                  rule.status === "active"
                    ? "bg-orange-500/20 hover:bg-orange-500/30"
                    : "bg-emerald-500/20 hover:bg-emerald-500/30"
                } backdrop-blur-sm rounded-lg transition-colors text-sm`}
                title={
                  rule.status === "active" ? "Deactivate rule" : "Activate rule"
                }
              >
                {rule.status === "active" ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
                <span>
                  {rule.status === "active" ? "Deactivate" : "Activate"}
                </span>
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors text-sm"
                title="Export rule"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {getRuleTypeIcon(rule.ruleType)}
              <span className="ml-2 text-sm">
                {formatRuleType(rule.ruleType)}
              </span>
            </div>
            <div className="flex items-center bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {getCategoryIcon(rule.category)}
              <span className="ml-2 text-sm">
                {formatCategory(rule.category)}
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(
                rule.status
              )}`}
            >
              {getStatusIcon(rule.status)}
              {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getSeverityColor(
                rule.severity
              )}`}
            >
              {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}{" "}
              Severity
            </span>
            {rule.isSystemRule && (
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                System Rule
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              className={`px-5 py-3 text-sm font-medium ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-5 py-3 text-sm font-medium ${
                activeTab === "parameters"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("parameters")}
            >
              Parameters ({rule.parameters?.length || 0})
            </button>
            <button
              className={`px-5 py-3 text-sm font-medium ${
                activeTab === "conditions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("conditions")}
            >
              Conditions ({rule.conditions?.length || 0})
            </button>
            <button
              className={`px-5 py-3 text-sm font-medium ${
                activeTab === "actions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("actions")}
            >
              Actions ({rule.actions?.length || 0})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "overview" && renderOverviewSection()}
          {activeTab === "parameters" && renderParametersSection()}
          {activeTab === "conditions" && renderConditionsSection()}
          {activeTab === "actions" && renderActionsSection()}
        </div>
      </div>
    </div>
  );
};

export default RuleDetailPage;
