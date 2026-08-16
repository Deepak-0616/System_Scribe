import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Zap, CheckCircle2, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

interface PredictivePageProps {
  onNavigate: (tab: string) => void;
}

export const PredictivePage: React.FC<PredictivePageProps> = ({ onNavigate }) => {
  const [mitigated, setMitigated] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Predictive Bottleneck Engine
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Machine Learning Queue Risk
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Calculates SLA breach probabilities before failure by analyzing queue growth rates, historical processing times, and staff availability.
          </p>
        </div>
      </div>

      {/* Main Risk Alert Banner */}
      <div className="forge-card p-6 border-l-4 border-l-amber-500 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#892cdc]/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-base font-bold text-white">Finance Verification SLA Breach Predicted</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Department: <strong className="text-white">Finance & Accounts</strong> • Workflow: <strong className="text-purple-300">Student Scholarship Application</strong>
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-amber-400">{mitigated ? '35.0%' : '82.0%'}</div>
            <div className="text-[10px] text-gray-400 font-mono">SLA Breach Risk Score</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#0a0412] border border-[#892cdc]/20">
            <span className="text-gray-400 block text-[10px]">Queue Surge Factor</span>
            <span className="font-bold text-white text-sm">+31% Submissions</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0412] border border-[#892cdc]/20">
            <span className="text-gray-400 block text-[10px]">Expected SLA Overrun</span>
            <span className="font-bold text-amber-300 text-sm">{mitigated ? '1.2 Hours' : '6.5 Hours'}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0412] border border-[#892cdc]/20">
            <span className="text-gray-400 block text-[10px]">Affected Pending Tasks</span>
            <span className="font-bold text-gray-200 text-sm">{mitigated ? '0 Tasks' : '8 Pending Tasks'}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setMitigated(!mitigated)}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
              mitigated
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'forge-btn-primary'
            }`}
          >
            {mitigated ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Reassigned 8 tasks to Officer B — SLA Breach Risk Reduced to 35%</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Execute Auto-Recommendation: Reassign 8 pending tasks to Officer B</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
