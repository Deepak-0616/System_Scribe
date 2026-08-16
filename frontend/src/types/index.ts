export type UserRole = 'Student' | 'Officer' | 'Admin' | 'DepartmentHead';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: number;
  is_active: boolean;
  student_id_no?: string;
  cgpa?: number;
  attendance_pct?: number;
  annual_income?: number;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'document_verification' | 'ai_validation' | 'human_review' | 'notification' | 'end' | 'exception';
  label: string;
  department: string;
  role: string;
  agent: string;
  sla_hours: number;
  requires_human: boolean;
  rules?: string[];
}

export interface WorkflowEdge {
  id?: string;
  source: string;
  target: string;
  condition?: string;
}

export interface Workflow {
  id: number;
  name: string;
  description: string;
  domain: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  sla_hours: number;
  node_count?: number;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export interface AgentEvaluation {
  agent: string;
  status: 'PASS' | 'FAIL' | 'EXCEPTION' | 'WARN';
  confidence: number;
  details?: Record<string, any>;
  evidence: string[];
}

export interface PassportData {
  request_id: string;
  applicant: string;
  workflow: string;
  agent_evaluations: AgentEvaluation[];
  overall_recommendation: string;
  overall_confidence: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  requires_human_approval: boolean;
  human_approval_reason: string;
}

export interface Application {
  id: string;
  applicant_id?: number;
  workflow_id?: number;
  title: string;
  applicant_name?: string;
  student_id?: string;
  workflow_name?: string;
  status: 'submitted' | 'in_progress' | 'pending_human_review' | 'exception' | 'approved' | 'rejected';
  current_node_id: string;
  risk_score: number;
  submitted_at: string;
  sla_due_at: string;
  applicant?: {
    name: string;
    id_no: string;
    cgpa: number;
    attendance: number;
    annual_income: number;
  };
  details?: Record<string, any>;
  passport?: PassportData;
  timeline?: Array<{
    step: string;
    status: 'completed' | 'in_progress' | 'pending';
    agent?: string;
    assigned_to?: string;
    timestamp?: string;
    sla?: string;
  }>;
}

export interface WorkflowTask {
  id: number;
  application_id: string;
  title: string;
  department: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'escalated' | 'exception';
  ai_recommendation: string;
  ai_confidence: number;
  sla_due: string;
  passport?: PassportData;
}

export interface ExceptionRecord {
  id: number;
  application_id: string;
  exception_type: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolution_note?: string;
  created_at: string;
}

export interface WorkflowDNA {
  workflow_id: number;
  workflow_name: string;
  avg_processing_time: string;
  sla_compliance: string;
  failure_rate: string;
  bottleneck_department: string;
  automation_potential: string;
  total_executions: number;
  rejection_rate: string;
  peak_period: string;
  avg_tasks_per_request: number;
  department_breakdown: Record<string, string>;
}

export interface OptimizationProposal {
  id: number;
  workflow_id: number;
  title: string;
  issue: string;
  proposal: string;
  projected_time_reduction: string;
  projected_task_reduction: string;
  status: 'proposed' | 'approved' | 'rejected' | 'applied';
}

export interface DepartmentTwin {
  id: number;
  name: string;
  code: string;
  capacity: number;
  workload_pct: number;
  avg_processing_time: string;
  officers: Array<{ name: string; status: string }>;
}

export interface DigitalTwin {
  institution: string;
  departments: DepartmentTwin[];
}

export interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entity_id: string;
  details: string;
  source: string;
  timestamp: string;
}

export interface BottleneckPrediction {
  id: string;
  department: string;
  workflow: string;
  risk_pct: number;
  expected_delay: string;
  reason: string;
  suggested_action: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  action: string;
}

export interface RecentDecision {
  request_id: string;
  applicant: string;
  agent: string;
  recommendation: string;
  confidence: string;
  human_approval: string;
}

export interface DashboardMetrics {
  workflow_health_pct: number;
  active_requests: number;
  sla_risk_count: number;
  ai_automations: number;
  time_saved_hours: number;
  workflow_success_rate_pct: number;
  overview: {
    active: number;
    completed: number;
    pending: number;
    failed: number;
    escalated: number;
  };
  department_workload: Array<{ name: string; code: string; workload_pct: number; avg_time: string }>;
  predicted_bottlenecks: BottleneckPrediction[];
  ai_recommendations: AIRecommendation[];
  recent_decisions: RecentDecision[];
}
