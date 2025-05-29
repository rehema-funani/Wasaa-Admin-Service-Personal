export interface AMLRule {
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

export interface RuleParameter {
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

export interface RuleCondition {
    id: string;
    field: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'between' | 'regex';
    value: any;
    valueType: 'static' | 'parameter' | 'dynamic';
    logicalOperator?: 'AND' | 'OR';
}

export interface RuleAction {
    id: string;
    actionType: 'generate_alert' | 'block_transaction' | 'escalate' | 'request_verification' | 'notify' | 'log' | 'reduce_limits';
    parameters: { [key: string]: any };
    description?: string;
}

export interface RuleEffectiveness {
    ruleId: string;
    ruleName: string;
    totalTriggers: number;
    truePositives: number;
    falsePositives: number;
    efficiency: number;
    lastEvaluated: string;
    lastTriggered?: string;
}