import React, { useEffect, useState } from 'react';
import { DashboardMetrics, User } from '../types';
import { apiService } from '../services/api';
import {
  Activity,
  AlertTriangle,
  Zap,
  Clock,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Users,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface CommandCenterProps {
  currentUser: User;
  onNavigate: (tab: string, param?: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ currentUser, onNavigate }) => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mitigated, setMitigated] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const res = await apiService.getDashboard();
    setData(res);
    setLoading(false);
  };

  const handleMitigateBottleneck = async () => {
    await apiService.performTaskAction(1, 'reassign');
    setMitigated(true);
    if (data) {
      setData({
        ...data,
        sla_risk_count: Math.max(0, data.sla_risk_count - 8),
        predicted_bottlenecks: data.predicted_bottlenecks.map(b => 
          b.id === 'b-1' ? { ...b, risk_pct: 35.0, expected_delay: '1.2 hours', suggested_action: 'Mitigated: 8 tasks reassigned to Officer B' } : b
        )
      });
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <Activity className="w-8 h-8 text-[#bc6ff1] animate-spin mb-3" />
        <span className="text-xs font-mono">Loading Institutional Command Center...</span>
      </div>
    );
  }

  const workloadColors: Record<string, string> = {
    FIN: '#ef4444',
    ADM: '#f59e0b',
    ACAD: '#892cdc',
    SS: '#3b82f6',
    EXAM: '#22c55e',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#892cdc]/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Institutional Command Center
            <span className="text-xs font-normal font-mono px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Real-time Telemetry
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitoring active administrative workflows, multi-agent AI execution, and predictive SLA health across Indian Institute of Technology & Science.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('simulator')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold forge-btn-secondary flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-[#bc6ff1]" />
            <span>Run Simulation</span>
          </button>
          <button
            onClick={() => onNavigate('generator')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold forge-btn-primary flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generator</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Workflow Health */}
        <div className="forge-card p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Workflow Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.workflow_health_pct}%</div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1">Optimal Operations</div>
        </div>

        {/* Active Requests */}
        <div className="forge-card p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Active Requests</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.active_requests.toLocaleString()}</div>
          <div className="text-[10px] text-purple-300 mt-1">Across 5 Workflows</div>
        </div>

        {/* SLA Risk */}
        <div className={`forge-card p-4 border-l-4 ${mitigated ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>SLA Risk</span>
            <AlertTriangle className={`w-4 h-4 ${mitigated ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
          </div>
          <div className="text-2xl font-black text-white">{data.sla_risk_count}</div>
          <div className={`text-[10px] font-medium mt-1 ${mitigated ? 'text-emerald-400' : 'text-amber-400'}`}>
            {mitigated ? 'Risk Mitigated' : 'Requires Reassignment'}
          </div>
        </div>

        {/* AI Automations */}
        <div className="forge-card p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>AI Automations</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.ai_automations.toLocaleString()}</div>
          <div className="text-[10px] text-indigo-300 mt-1">Agent Validations</div>
        </div>

        {/* Time Saved */}
        <div className="forge-card p-4 border-l-4 border-l-[#bc6ff1]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Time Saved</span>
            <Clock className="w-4 h-4 text-[#bc6ff1]" />
          </div>
          <div className="text-2xl font-black text-white">{data.time_saved_hours} hrs</div>
          <div className="text-[10px] text-purple-300 mt-1">This Month</div>
        </div>

        {/* Workflow Success Rate */}
        <div className="forge-card p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.workflow_success_rate_pct}%</div>
          <div className="text-[10px] text-cyan-400 mt-1">+2.4% vs Last Term</div>
        </div>
      </div>

      {/* Main Grid: Workload & Bottleneck Engine */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Workload Chart (2 cols) */}
        <div className="lg:col-span-2 forge-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#892cdc]/20 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#bc6ff1]" />
                Institutional Department Workload (%)
              </h3>
              <p className="text-[11px] text-gray-400">Current queue capacity usage across departments</p>
            </div>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="text-xs text-[#bc6ff1] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Explore Digital Twin</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.department_workload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f061b', borderColor: '#892cdc', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#bc6ff1' }}
                />
                <Bar dataKey="workload_pct" radius={[6, 6, 0, 0]}>
                  {data.department_workload.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={workloadColors[entry.code] || '#892cdc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Breakdown Mini Badges */}
          <div className="grid grid-cols-5 gap-2 text-center pt-2">
            {data.department_workload.map((dept) => (
              <div key={dept.code} className="p-2 rounded-lg bg-[#0f061b] border border-[#892cdc]/20">
                <div className="text-[10px] text-gray-400 font-medium truncate">{dept.name}</div>
                <div className="text-xs font-bold text-white mt-0.5">{dept.workload_pct}%</div>
                <div className="text-[9px] text-gray-500 font-mono">{dept.avg_time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Bottleneck Engine (1 col) */}
        <div className="forge-card p-5 flex flex-col justify-between space-y-4">
          <div className="border-b border-[#892cdc]/20 pb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Predictive Bottleneck Engine
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                AI Early Warning
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Predicted SLA breach risks before delay occurs</p>
          </div>

          {data.predicted_bottlenecks.map((btn) => (
            <div key={btn.id} className="p-4 rounded-xl bg-[#140728] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{btn.department}</span>
                <span className="font-mono text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                  {btn.risk_pct}% Risk Score
                </span>
              </div>
              <div className="text-xs text-gray-300">
                Workflow: <span className="text-[#bc6ff1] font-semibold">{btn.workflow}</span>
              </div>
              <div className="text-[11px] text-gray-400 leading-relaxed bg-[#0a0412] p-2.5 rounded-lg border border-[#892cdc]/20">
                {btn.reason} (Expected Delay: <span className="text-amber-300 font-semibold">{btn.expected_delay}</span>)
              </div>

              <div className="pt-1">
                <button
                  onClick={handleMitigateBottleneck}
                  disabled={mitigated}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    mitigated
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'forge-btn-primary'
                  }`}
                >
                  {mitigated ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Reassigned 8 tasks to Officer B (Mitigated)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>{btn.suggested_action}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* AI Self-Optimization Link */}
          <div className="p-3 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#bc6ff1]" />
              <span className="text-xs text-gray-300 font-medium">Workflow Self-Optimization</span>
            </div>
            <button
              onClick={() => onNavigate('dna')}
              className="text-xs text-[#bc6ff1] hover:underline font-semibold cursor-pointer"
            >
              Review Proposals (-31%)
            </button>
          </div>
        </div>
      </div>

      {/* Lower Row: AI Recommendations & Recent Decisions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <div className="forge-card p-5 space-y-4">
          <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#bc6ff1]" />
              AI Agent Recommendations
            </h3>
            <span className="text-xs text-gray-400">Autonomous Optimization Proposals</span>
          </div>

          <div className="space-y-3">
            {data.ai_recommendations.map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{rec.title}</h4>
                  <p className="text-[11px] text-gray-400">{rec.description}</p>
                </div>
                <button
                  onClick={() => rec.id === 'rec-2' ? onNavigate('dna') : handleMitigateBottleneck()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold forge-btn-secondary shrink-0 cursor-pointer"
                >
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Decisions */}
        <div className="forge-card p-5 space-y-4">
          <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recent AI Decision Passports
            </h3>
            <button
              onClick={() => onNavigate('passports')}
              className="text-xs text-[#bc6ff1] hover:underline font-semibold cursor-pointer"
            >
              View All Passports
            </button>
          </div>

          <div className="space-y-3">
            {data.recent_decisions.map((dec) => (
              <div
                key={dec.request_id}
                onClick={() => onNavigate('passports')}
                className="p-3.5 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 hover:border-[#bc6ff1]/50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{dec.request_id}</span>
                    <span className="text-[10px] text-gray-400">• {dec.applicant}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Agent: <span className="text-purple-300 font-mono">{dec.agent}</span> (Confidence: {dec.confidence})
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {dec.recommendation}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1">{dec.human_approval}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
