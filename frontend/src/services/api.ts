import axios from 'axios';
import {
  DashboardMetrics,
  Workflow,
  Application,
  WorkflowTask,
  WorkflowDNA,
  OptimizationProposal,
  DigitalTwin,
  AuditLog,
  ExceptionRecord,
  User
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const apiService = {
  // Auth
  async login(email: string): Promise<{ access_token: string; user: User }> {
    try {
      const response = await api.post('/auth/login', { email, password: 'password123' });
      return response.data;
    } catch {
      // Fallback local auth mock
      let role: User['role'] = 'Student';
      let full_name = 'Rahul Sharma';
      let id_no: string | undefined = 'STU-2026-881';

      if (email.includes('officer')) {
        role = 'Officer';
        full_name = 'Officer B (Finance Associate)';
        id_no = undefined;
      } else if (email.includes('admin')) {
        role = 'Admin';
        full_name = 'Vikram Seth (Workflow Admin)';
        id_no = undefined;
      } else if (email.includes('dean')) {
        role = 'DepartmentHead';
        full_name = 'Dr. Arisudan Rao (Dean Student Welfare)';
        id_no = undefined;
      }

      return {
        access_token: 'demo_token_123',
        user: {
          id: 1,
          email,
          full_name,
          role,
          is_active: true,
          student_id_no: id_no,
          cgpa: role === 'Student' ? 8.7 : undefined,
          attendance_pct: role === 'Student' ? 89.0 : undefined,
          annual_income: role === 'Student' ? 320000.0 : undefined,
        },
      };
    }
  },

  // Command Center Dashboard
  async getDashboard(): Promise<DashboardMetrics> {
    try {
      const res = await api.get('/dashboard');
      return res.data;
    } catch {
      return {
        workflow_health_pct: 92.0,
        active_requests: 2481,
        sla_risk_count: 37,
        ai_automations: 1284,
        time_saved_hours: 312,
        workflow_success_rate_pct: 94.6,
        overview: { active: 2481, completed: 18420, pending: 312, failed: 14, escalated: 8 },
        department_workload: [
          { name: 'Finance & Accounts', code: 'FIN', workload_pct: 82.0, avg_time: '18 hrs' },
          { name: 'Admissions', code: 'ADM', workload_pct: 67.0, avg_time: '12 hrs' },
          { name: 'Academics', code: 'ACAD', workload_pct: 60.0, avg_time: '14 hrs' },
          { name: 'Student Services', code: 'SS', workload_pct: 54.0, avg_time: '10 hrs' },
          { name: 'Examination Cell', code: 'EXAM', workload_pct: 43.0, avg_time: '8 hrs' },
        ],
        predicted_bottlenecks: [
          {
            id: 'b-1',
            department: 'Finance & Accounts',
            workflow: 'Student Scholarship Application',
            risk_pct: 82.0,
            expected_delay: '6.5 hours',
            reason: 'Queue increased 31% due to semester end sanction submissions',
            suggested_action: 'Reassign 8 pending verification tasks to Officer B',
          },
        ],
        ai_recommendations: [
          {
            id: 'rec-1',
            title: 'Finance Reassignment Recommendation',
            description: 'Finance verification is predicted to exceed SLA by 6.5 hours.',
            action: 'Reassign 8 tasks to Officer B',
          },
          {
            id: 'rec-2',
            title: 'Scholarship Workflow Self-Optimization',
            description: 'Remove redundant manual income verification already verified by DocumentAgent.',
            action: 'Apply Proposal (-31% time)',
          },
        ],
        recent_decisions: [
          {
            request_id: 'SCH-20481',
            applicant: 'Rahul Sharma',
            agent: 'DecisionEngine',
            recommendation: 'APPROVE',
            confidence: '96%',
            human_approval: 'Pending Officer Signature',
          },
        ],
      };
    }
  },

  // Workflows
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const res = await api.get('/workflows');
      return res.data;
    } catch {
      return [
        {
          id: 1,
          name: 'Student Scholarship Application',
          description: 'Flagship AI workflow for verifying student documents, academic marks, financial background, institutional rules, and officer sanction.',
          domain: 'Educational Institution',
          version: '3.2',
          status: 'published',
          sla_hours: 48,
          node_count: 8,
        },
        {
          id: 2,
          name: 'Bonafide / Certificate Request',
          description: 'Automated student identity and bonafide certificate verification and issuance.',
          domain: 'Educational Institution',
          version: '1.0',
          status: 'published',
          sla_hours: 24,
          node_count: 5,
        },
        {
          id: 3,
          name: 'Admission Application Workflow',
          description: 'Document validation and merit list scoring for new student admissions.',
          domain: 'Educational Institution',
          version: '1.0',
          status: 'published',
          sla_hours: 72,
          node_count: 6,
        },
      ];
    }
  },

  async getWorkflow(id: number): Promise<Workflow> {
    try {
      const res = await api.get(`/workflows/${id}`);
      return res.data;
    } catch {
      return {
        id,
        name: 'Student Scholarship Application',
        description: 'Flagship AI workflow for verifying student documents, academic marks, financial background, institutional rules, and officer sanction.',
        domain: 'Educational Institution',
        version: '3.2',
        status: 'published',
        sla_hours: 48,
        nodes: [
          { id: 'node-start', type: 'start', label: 'Application Submission', department: 'Student Portal', role: 'Student / Applicant', agent: 'OrchestratorAgent', sla_hours: 2, requires_human: false },
          { id: 'node-doc-verify', type: 'document_verification', label: 'AI Document Verification', department: 'Registrar', role: 'Document Officer', agent: 'DocumentAgent', sla_hours: 6, requires_human: false, rules: ['Validate Income Certificate', 'Marksheet Checksum'] },
          { id: 'node-academic', type: 'ai_validation', label: 'Academic Eligibility Check', department: 'Academics', role: 'Academic Officer', agent: 'AcademicAgent', sla_hours: 12, requires_human: false, rules: ['CGPA >= 7.5', 'Attendance >= 75%'] },
          { id: 'node-finance', type: 'ai_validation', label: 'Financial Audit & Fee Check', department: 'Finance & Accounts', role: 'Finance Officer', agent: 'FinanceAgent', sla_hours: 12, requires_human: false, rules: ['Income <= Rs 800,000', 'Zero fee arrears'] },
          { id: 'node-compliance', type: 'ai_validation', label: 'Institutional Rule Compliance', department: 'Administration', role: 'Compliance Officer', agent: 'ComplianceAgent', sla_hours: 6, requires_human: false },
          { id: 'node-approval', type: 'human_review', label: 'Dean Sanction & Approval', department: 'Dean Student Welfare', role: 'Officer / Staff', agent: 'RoutingAgent', sla_hours: 8, requires_human: true },
          { id: 'node-notify', type: 'notification', label: 'Multi-channel Alert', department: 'System', role: 'System', agent: 'NotificationAgent', sla_hours: 1, requires_human: false },
          { id: 'node-end', type: 'end', label: 'Scholarship Sanctioned', department: 'System', role: 'System', agent: 'OrchestratorAgent', sla_hours: 1, requires_human: false },
        ],
        edges: [
          { id: 'e1', source: 'node-start', target: 'node-doc-verify' },
          { id: 'e2', source: 'node-doc-verify', target: 'node-academic' },
          { id: 'e3', source: 'node-academic', target: 'node-finance' },
          { id: 'e4', source: 'node-finance', target: 'node-compliance' },
          { id: 'e5', source: 'node-compliance', target: 'node-approval' },
          { id: 'e6', source: 'node-approval', target: 'node-notify' },
          { id: 'e7', source: 'node-notify', target: 'node-end' },
        ],
      };
    }
  },

  async generateWorkflowAI(prompt: string): Promise<Workflow> {
    try {
      const res = await api.post('/workflows/generate', { prompt });
      return res.data;
    } catch {
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        name: `AI Generated: ${prompt.slice(0, 35)}...`,
        description: `Generated AI workflow for prompt: "${prompt}"`,
        domain: 'Educational Institution',
        version: '1.0',
        status: 'draft',
        sla_hours: 48,
        nodes: [
          { id: 'node-1', type: 'start', label: 'Student Application Submission', department: 'Student Portal', role: 'Student / Applicant', agent: 'OrchestratorAgent', sla_hours: 2, requires_human: false },
          { id: 'node-2', type: 'document_verification', label: 'AI Document Verification', department: 'Registrar', role: 'Document Officer', agent: 'DocumentAgent', sla_hours: 6, requires_human: false },
          { id: 'node-3', type: 'ai_validation', label: 'Academic Eligibility Check', department: 'Academics', role: 'Academic Officer', agent: 'AcademicAgent', sla_hours: 12, requires_human: false },
          { id: 'node-4', type: 'ai_validation', label: 'Financial Arrears Audit', department: 'Finance & Accounts', role: 'Finance Officer', agent: 'FinanceAgent', sla_hours: 12, requires_human: false },
          { id: 'node-5', type: 'human_review', label: 'Department Officer Sign-off', department: 'Dean Office', role: 'Officer / Staff', agent: 'RoutingAgent', sla_hours: 12, requires_human: true },
          { id: 'node-6', type: 'end', label: 'Workflow Finalized', department: 'System', role: 'System', agent: 'OrchestratorAgent', sla_hours: 1, requires_human: false },
        ],
        edges: [
          { id: 'e1', source: 'node-1', target: 'node-2' },
          { id: 'e2', source: 'node-2', target: 'node-3' },
          { id: 'e3', source: 'node-3', target: 'node-4' },
          { id: 'e4', source: 'node-4', target: 'node-5' },
          { id: 'e5', source: 'node-5', target: 'node-6' },
        ],
      };
    }
  },

  async validateWorkflow(id: number) {
    try {
      const res = await api.post(`/workflows/${id}/validate`);
      return res.data;
    } catch {
      return {
        is_valid: true,
        critical_errors: 0,
        warnings: 1,
        suggestions: ['SLA target is within institutional compliance limits.', 'Human review step properly configured.'],
      };
    }
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    try {
      const res = await api.get('/applications');
      return res.data;
    } catch {
      return [
        {
          id: 'SCH-20481',
          title: 'Merit-cum-Means National Scholarship 2026',
          applicant_name: 'Rahul Sharma',
          student_id: 'STU-2026-881',
          workflow_name: 'Student Scholarship Application',
          status: 'pending_human_review',
          current_node_id: 'node-approval',
          risk_score: 0.04,
          submitted_at: '2026-08-16 08:30',
          sla_due_at: 'Due in 14 hrs',
        },
      ];
    }
  },

  async getApplication(id: string): Promise<Application> {
    try {
      const res = await api.get(`/applications/${id}`);
      return res.data;
    } catch {
      return {
        id: 'SCH-20481',
        title: 'Merit-cum-Means National Scholarship 2026',
        applicant: {
          name: 'Rahul Sharma',
          id_no: 'STU-2026-881',
          cgpa: 8.7,
          attendance: 89.0,
          annual_income: 320000.0,
        },
        workflow_name: 'Student Scholarship Application',
        status: 'pending_human_review',
        current_node_id: 'node-approval',
        risk_score: 0.04,
        submitted_at: '2026-08-16 08:30',
        sla_due_at: 'Due in 14 hrs',
        details: {
          scholarship_name: 'Merit-cum-Means Engineering Grant',
          amount_per_year: 50000,
          annual_income: 320000,
          cgpa: 8.7,
          attendance: 89,
        },
        passport: {
          request_id: 'SCH-20481',
          applicant: 'Rahul Sharma (STU-2026-881)',
          workflow: 'Student Scholarship Application v3.2',
          agent_evaluations: [
            {
              agent: 'DocumentAgent',
              status: 'PASS',
              confidence: 0.98,
              evidence: ['Income Tax Return receipt verified', 'Semester 5 Marksheet verified', 'Bank Passbook IFSC matched'],
            },
            {
              agent: 'AcademicAgent',
              status: 'PASS',
              confidence: 0.96,
              evidence: ['CGPA: 8.7 >= 7.5 threshold', 'Attendance: 89% >= 75% threshold', 'Backlogs: 0'],
            },
            {
              agent: 'FinanceAgent',
              status: 'PASS',
              confidence: 0.95,
              evidence: ['Annual Family Income: Rs. 320,000 <= Rs. 800,000 limit', 'Tuition Fee Arrears: Rs. 0'],
            },
            {
              agent: 'ComplianceAgent',
              status: 'PASS',
              confidence: 0.99,
              evidence: ['Single active scholarship rule checked across national database', 'Disciplinary rating: 100/100'],
            },
          ],
          overall_recommendation: 'APPROVE',
          overall_confidence: 0.96,
          risk_level: 'LOW',
          risk_score: 0.04,
          requires_human_approval: true,
          human_approval_reason: 'High-value monetary grant (Rs. 50,000/yr) mandates human officer signature.',
        },
        timeline: [
          { step: 'Application Submitted', status: 'completed', timestamp: '10 hrs ago' },
          { step: 'AI Document Verification', status: 'completed', agent: 'DocumentAgent', timestamp: '8 hrs ago' },
          { step: 'Academic Eligibility Audit', status: 'completed', agent: 'AcademicAgent', timestamp: '6 hrs ago' },
          { step: 'Financial & Fee Check', status: 'completed', agent: 'FinanceAgent', timestamp: '4 hrs ago' },
          { step: 'Dean Sanction & Approval', status: 'in_progress', assigned_to: 'Officer B (Finance)', sla: 'Due in 14 hrs' },
          { step: 'Multi-Channel Alert', status: 'pending' },
        ],
      };
    }
  },

  async submitScholarshipApplication(data: { title: string; annual_income: number; cgpa: number; attendance_pct: number }) {
    try {
      const res = await api.post('/applications/submit', { workflow_id: 1, ...data });
      return res.data;
    } catch {
      return {
        message: 'Scholarship Application submitted successfully',
        application_id: `SCH-2048${Math.floor(Math.random() * 100) + 10}`,
      };
    }
  },

  // Tasks
  async getTasks(): Promise<WorkflowTask[]> {
    try {
      const res = await api.get('/tasks');
      return res.data;
    } catch {
      return [
        {
          id: 1,
          application_id: 'SCH-20481',
          title: 'Scholarship Final Approval: Rahul Sharma',
          department: 'Finance & Accounts',
          priority: 'high',
          status: 'pending',
          ai_recommendation: 'APPROVE (96% Confidence)',
          ai_confidence: 0.96,
          sla_due: 'Due in 14 hrs',
          passport: {
            request_id: 'SCH-20481',
            applicant: 'Rahul Sharma (STU-2026-881)',
            workflow: 'Student Scholarship Application v3.2',
            agent_evaluations: [
              { agent: 'DocumentAgent', status: 'PASS', confidence: 0.98, evidence: ['Aadhaar biometric checksum verified', 'Income Certificate tax ID matches Tehsildar ledger'] },
              { agent: 'AcademicAgent', status: 'PASS', confidence: 0.96, evidence: ['CGPA 8.7 >= 7.5', 'Attendance 89% >= 75%'] },
              { agent: 'FinanceAgent', status: 'PASS', confidence: 0.95, evidence: ['Income Rs. 320,000 <= 800,000 limit', 'Zero arrears'] },
              { agent: 'ComplianceAgent', status: 'PASS', confidence: 0.99, evidence: ['Clean disciplinary record'] },
            ],
            overall_recommendation: 'APPROVE',
            overall_confidence: 0.96,
            risk_level: 'LOW',
            risk_score: 0.04,
            requires_human_approval: true,
            human_approval_reason: 'High-value monetary grant (Rs. 50,000/yr) mandates human officer signature.',
          },
        },
      ];
    }
  },

  async performTaskAction(taskId: number, action: 'approve' | 'reject' | 'reassign', notes?: string) {
    try {
      const res = await api.post(`/tasks/${taskId}/action`, { action, notes });
      return res.data;
    } catch {
      return { message: `Task ${action} successfully`, status: action };
    }
  },

  // Workflow DNA & Self Optimization
  async getWorkflowDNA(id: number = 1): Promise<WorkflowDNA> {
    try {
      const res = await api.get(`/intelligence/dna/${id}`);
      return res.data;
    } catch {
      return {
        workflow_id: id,
        workflow_name: 'Student Scholarship Application v3.2',
        avg_processing_time: '3.8 days',
        sla_compliance: '91.0%',
        failure_rate: '7.2%',
        bottleneck_department: 'Finance & Accounts',
        automation_potential: '68.0%',
        total_executions: 1284,
        rejection_rate: '4.1%',
        peak_period: 'June – August',
        avg_tasks_per_request: 7,
        department_breakdown: { Registrar: '0.6 hrs', Academics: '1.2 hrs', Finance: '1.8 hrs', Administration: '0.2 hrs' },
      };
    }
  },

  async getOptimizationProposals(): Promise<OptimizationProposal[]> {
    try {
      const res = await api.get('/intelligence/optimization-proposals');
      return res.data;
    } catch {
      return [
        {
          id: 1,
          workflow_id: 1,
          title: 'Eliminate Duplicate Manual Income Verification',
          issue: 'Finance verification step duplicates income tax verification already conducted by DocumentAgent.',
          proposal: 'Auto-pass financial verification if income certificate digital signature matches tax database API.',
          projected_time_reduction: '-31%',
          projected_task_reduction: '-18%',
          status: 'proposed',
        },
      ];
    }
  },

  async applyOptimizationProposal(proposalId: number) {
    try {
      const res = await api.post(`/intelligence/optimization-proposals/${proposalId}/apply`);
      return res.data;
    } catch {
      return { message: 'Optimization proposal applied successfully. Workflow upgraded to v3.3.', status: 'applied' };
    }
  },

  // Simulator & Digital Twin
  async getDigitalTwin(): Promise<DigitalTwin> {
    try {
      const res = await api.get('/intelligence/digital-twin');
      return res.data;
    } catch {
      return {
        institution: 'Indian Institute of Technology & Science',
        departments: [
          { id: 1, name: 'Finance & Accounts', code: 'FIN', capacity: 60, workload_pct: 82.0, avg_processing_time: '18 hrs', officers: [{ name: 'Officer A', status: 'Busy (91% workload)' }, { name: 'Officer B', status: 'Available (42% workload)' }] },
          { id: 2, name: 'Admissions', code: 'ADM', capacity: 50, workload_pct: 67.0, avg_processing_time: '12 hrs', officers: [{ name: 'Staff 1', status: 'Normal' }, { name: 'Staff 2', status: 'Normal' }] },
          { id: 3, name: 'Academics', code: 'ACAD', capacity: 55, workload_pct: 60.0, avg_processing_time: '14 hrs', officers: [{ name: 'Staff A', status: 'Normal' }] },
        ],
      };
    }
  },

  async simulateWorkflow(volumeMultiplier: number, capacityMultiplier: number) {
    try {
      const res = await api.post('/intelligence/simulate', null, { params: { volume_multiplier: volumeMultiplier, capacity_multiplier: capacityMultiplier } });
      return res.data;
    } catch {
      const baseProb = 12.0;
      const projProb = Math.min(99.0, baseProb * (volumeMultiplier / capacityMultiplier) * 2.5);
      return {
        simulation_parameters: {
          volume_increase_pct: `+${((volumeMultiplier - 1.0) * 100).toFixed(0)}%`,
          capacity_change: `${((capacityMultiplier - 1.0) * 100).toFixed(0)}%`,
        },
        projections: {
          projected_avg_processing_days: (3.8 * volumeMultiplier).toFixed(1),
          projected_sla_breach_probability: `${projProb.toFixed(1)}%`,
          queue_growth_factor: `${(volumeMultiplier * 1.3).toFixed(1)}x`,
          bottleneck_department: 'Finance & Accounts',
          required_additional_staff: Math.max(1, Math.round(volumeMultiplier * 2)),
          recommended_automation_rule: 'Enable auto-approval for scholarship grants below Rs 25,000',
        },
      };
    }
  },

  // Copilot Chat
  async chatCopilot(message: string, user_role: string) {
    try {
      const res = await api.post('/intelligence/copilot/chat', { message, user_role });
      return res.data;
    } catch {
      return {
        answer: `System Scribe Intelligence Response: Based on your role (${user_role}), all active institutional workflows are operating at 94.6% efficiency. 1,284 tasks were automated by AI agents this month.`,
        evidence_sources: ['Institutional Command Center', 'Audit Logs'],
      };
    }
  },

  // Audit Logs & Exceptions
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await api.get('/intelligence/audit-logs');
      return res.data;
    } catch {
      return [
        { id: 1, action: 'WORKFLOW_PUBLISHED', entity: 'Workflow', entity_id: '1', details: 'Published Student Scholarship Application v3.2', source: 'System', timestamp: '2026-08-16 10:00:00' },
      ];
    }
  },

  async getExceptions(): Promise<ExceptionRecord[]> {
    try {
      const res = await api.get('/intelligence/exceptions');
      return res.data;
    } catch {
      return [
        { id: 1, application_id: 'SCH-20481', exception_type: 'missing_document', description: 'Blurred income tax certificate detected by DocumentAgent. Requested DigiLocker upload.', status: 'resolved', resolution_note: 'Student re-synced via DigiLocker.', created_at: '2026-08-16 09:15' },
      ];
    }
  },
};
