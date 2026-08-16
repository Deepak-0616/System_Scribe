import React, { useEffect, useState } from 'react';
import { WorkflowDNA, OptimizationProposal } from '../types';
import { apiService } from '../services/api';
import confetti from 'canvas-confetti';
import { Dna, Sparkles, CheckCircle2, TrendingUp, Clock, Zap, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const WorkflowDnaPage: React.FC = () => {
  const [dna, setDna] = useState<WorkflowDNA | null>(null);
  const [proposals, setProposals] = useState<OptimizationProposal[]>([]);
  const [applied, setApplied] = useState(false);
  const [version, setVersion] = useState('3.2');

  useEffect(() => {
    loadDna();
  }, []);

  const loadDna = async () => {
    const d = await apiService.getWorkflowDNA(1);
    const p = await apiService.getOptimizationProposals();
    setDna(d);
    setProposals(p);
  };

  const handleApplyProposal = async (proposalId: number) => {
    await apiService.applyOptimizationProposal(proposalId);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    setApplied(true);
    setVersion('3.3 (Self-Optimized)');
    if (dna) {
      setDna({
        ...dna,
        avg_processing_time: '2.6 days',
        sla_compliance: '97.4%',
        automation_potential: '82.0%',
      });
    }
  };

  if (!dna) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Dna className="w-6 h-6 text-[#bc6ff1]" />
            Workflow DNA & Self-Optimization Engine
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Continuous Improvement
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Calculates execution metrics for published workflows, detects redundant manual steps, and proposes automated self-optimizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-950 text-[#bc6ff1] border border-[#bc6ff1]/40">
            Active Version: {version}
          </span>
        </div>
      </div>

      {/* DNA Metrics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="forge-card p-4 border-l-4 border-l-[#bc6ff1]">
          <div className="text-[10px] text-gray-400 font-medium">Avg Processing Time</div>
          <div className="text-2xl font-black text-white mt-1">{dna.avg_processing_time}</div>
          <div className="text-[9px] text-emerald-400 mt-0.5">{applied ? '-31% Reduced' : 'Benchmark Target'}</div>
        </div>

        <div className="forge-card p-4 border-l-4 border-l-emerald-500">
          <div className="text-[10px] text-gray-400 font-medium">SLA Compliance</div>
          <div className="text-2xl font-black text-white mt-1">{dna.sla_compliance}</div>
          <div className="text-[9px] text-emerald-400 mt-0.5">Institutional Standard</div>
        </div>

        <div className="forge-card p-4 border-l-4 border-l-red-500">
          <div className="text-[10px] text-gray-400 font-medium">Failure Rate</div>
          <div className="text-2xl font-black text-white mt-1">{dna.failure_rate}</div>
          <div className="text-[9px] text-gray-400 mt-0.5">Validation Errors</div>
        </div>

        <div className="forge-card p-4 border-l-4 border-l-amber-500">
          <div className="text-[10px] text-gray-400 font-medium">Bottleneck Dept</div>
          <div className="text-xl font-bold text-white mt-1">{dna.bottleneck_department}</div>
          <div className="text-[9px] text-amber-400 mt-0.5">Highest Latency</div>
        </div>

        <div className="forge-card p-4 border-l-4 border-l-indigo-500">
          <div className="text-[10px] text-gray-400 font-medium">Automation Potential</div>
          <div className="text-2xl font-black text-white mt-1">{dna.automation_potential}</div>
          <div className="text-[9px] text-indigo-300 mt-0.5">Agent Eligible</div>
        </div>

        <div className="forge-card p-4 border-l-4 border-l-cyan-500">
          <div className="text-[10px] text-gray-400 font-medium">Total Executions</div>
          <div className="text-2xl font-black text-white mt-1">{dna.total_executions.toLocaleString()}</div>
          <div className="text-[9px] text-cyan-400 mt-0.5">Completed Workflows</div>
        </div>
      </div>

      {/* Self-Optimization Proposals Section */}
      <div className="forge-card p-6 space-y-4 border-[#bc6ff1]/40 shadow-xl">
        <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#bc6ff1]" />
            AI Autonomous Optimization Proposal
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">Admin Sign-off Required</span>
        </div>

        {proposals.map((prop) => (
          <div key={prop.id} className="p-5 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">{prop.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{prop.issue}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#0a0412] border border-[#892cdc]/20 text-xs">
              <span className="text-[#bc6ff1] font-semibold block mb-1">Optimization Action:</span>
              <p className="text-gray-300">{prop.proposal}</p>
            </div>

            {/* Projected Impact Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#15082a] border border-[#892cdc]/20">
                <span className="text-gray-400 text-[10px] block">Projected Time Reduction</span>
                <span className="font-bold text-emerald-400 text-sm">{prop.projected_time_reduction}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#15082a] border border-[#892cdc]/20">
                <span className="text-gray-400 text-[10px] block">Manual Task Reduction</span>
                <span className="font-bold text-purple-300 text-sm">{prop.projected_task_reduction}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#15082a] border border-[#892cdc]/20">
                <span className="text-gray-400 text-[10px] block">Version Upgrade</span>
                <span className="font-bold text-gray-200 text-sm">v3.2 → v3.3</span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                onClick={() => handleApplyProposal(prop.id)}
                disabled={applied}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
                  applied
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'forge-btn-primary'
                }`}
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Optimization Proposal Applied! Workflow Upgraded to Version 3.3 (-31% Processing Time)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Approve Proposal & Upgrade Workflow to Version 3.3 (-31% Processing Time)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
