import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Activity, Sliders, AlertTriangle, Users, TrendingUp, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const WorkflowSimulator: React.FC = () => {
  const [volume, setVolume] = useState(1.4); // +40%
  const [capacity, setCapacity] = useState(1.0); // 100% capacity
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    runSimulation();
  }, [volume, capacity]);

  const runSimulation = async () => {
    const res = await apiService.simulateWorkflow(volume, capacity);
    setResults(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#bc6ff1]" />
            Workflow Simulator & What-If Engine
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Scenario Modeling
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Simulate future administrative load changes, staffing cuts, or volume spikes to forecast queue backlogs and SLA compliance.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          Simulated Projections — Sandbox Environment
        </div>
      </div>

      {/* Interactive Controls & Results Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls Slider Box (1 col) */}
        <div className="forge-card p-5 space-y-6 border-[#bc6ff1]/40 shadow-xl">
          <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#bc6ff1]" />
              Scenario Variables
            </h3>
          </div>

          {/* Slider 1: Application Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-medium">Application Submission Volume</span>
              <span className="font-mono font-bold text-[#bc6ff1] text-sm">
                +{((volume - 1.0) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[#892cdc] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>Baseline (1.0x)</span>
              <span>+50%</span>
              <span>+150% Peak</span>
            </div>
          </div>

          {/* Slider 2: Staff Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-medium">Staffing & Department Capacity</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {((capacity - 1.0) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>-50% Staff Cuts</span>
              <span>Normal (1.0x)</span>
              <span>+50% Hired</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] text-gray-400 font-medium block">Load Preset Scenarios:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setVolume(1.4); setCapacity(1.0); }}
                className="py-1.5 px-2 rounded-lg bg-[#0f061b] hover:bg-[#200b3b] border border-[#892cdc]/30 text-[11px] text-gray-300 transition-colors text-left cursor-pointer"
              >
                🎓 Semester End (+40% Volume)
              </button>
              <button
                onClick={() => { setVolume(1.8); setCapacity(0.8); }}
                className="py-1.5 px-2 rounded-lg bg-[#0f061b] hover:bg-[#200b3b] border border-[#892cdc]/30 text-[11px] text-gray-300 transition-colors text-left cursor-pointer"
              >
                ⚠️ Staff Shortage (-20% Capacity)
              </button>
            </div>
          </div>
        </div>

        {/* Projected Simulation Results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {results && (
            <>
              {/* Simulation Projected Metrics Grid */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="forge-card p-4 border-l-4 border-l-amber-500">
                  <span className="text-gray-400 text-[10px] block">Projected SLA Breach Risk</span>
                  <div className="text-3xl font-black text-amber-400 mt-1">
                    {results.projections.projected_sla_breach_probability}
                  </div>
                  <span className="text-[10px] text-amber-300 mt-1 block">Expected Failure Rate</span>
                </div>

                <div className="forge-card p-4 border-l-4 border-l-[#bc6ff1]">
                  <span className="text-gray-400 text-[10px] block">Projected Processing Time</span>
                  <div className="text-3xl font-black text-white mt-1">
                    {results.projections.projected_avg_processing_days} Days
                  </div>
                  <span className="text-[10px] text-purple-300 mt-1 block">Queue Growth: {results.projections.queue_growth_factor}</span>
                </div>

                <div className="forge-card p-4 border-l-4 border-l-indigo-500">
                  <span className="text-gray-400 text-[10px] block">Staffing Adjustment Needed</span>
                  <div className="text-3xl font-black text-indigo-400 mt-1">
                    +{results.projections.required_additional_staff} Officers
                  </div>
                  <span className="text-[10px] text-indigo-300 mt-1 block">To Maintain 48h SLA</span>
                </div>
              </div>

              {/* AI Recommendation Mitigation Box */}
              <div className="forge-card p-5 space-y-3 border-emerald-500/40">
                <div className="flex items-center justify-between border-b border-[#892cdc]/20 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Simulated AI Mitigation Recommendation
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold">Policy Change Proposal</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0a0412] border border-emerald-500/30 text-xs text-gray-200">
                  <span className="text-emerald-400 font-bold block mb-1">Suggested Automation Rule:</span>
                  {results.projections.recommended_automation_rule}
                </div>

                <p className="text-[11px] text-gray-400">
                  Enabling auto-approval for low-value verified grants reduces officer queue backlog by 42% and prevents predicted SLA breaches.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
