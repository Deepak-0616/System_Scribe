import React, { useEffect, useState } from 'react';
import { DigitalTwin as DigitalTwinType } from '../types';
import { apiService } from '../services/api';
import { Network, Users, Building, ChevronRight, Activity, ArrowUpRight, Zap } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const [twin, setTwin] = useState<DigitalTwinType | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<number>(1);
  const [simulatedCuts, setSimulatedCuts] = useState(false);

  useEffect(() => {
    loadTwin();
  }, []);

  const loadTwin = async () => {
    const data = await apiService.getDigitalTwin();
    setTwin(data);
  };

  if (!twin) return null;

  const selectedDept = twin.departments.find((d) => d.id === selectedDeptId) || twin.departments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-[#bc6ff1]" />
            Institutional Digital Twin
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Structural Topology & Staff Workload
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Structural model mapping institution departments, staff allocations, active task queues, and inter-department dependencies.
          </p>
        </div>

        <button
          onClick={() => setSimulatedCuts(!simulatedCuts)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border transition-colors ${
            simulatedCuts
              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
              : 'forge-btn-secondary'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{simulatedCuts ? 'Reset Staffing Scenario' : 'Scenario: Remove 2 Finance Officers'}</span>
        </button>
      </div>

      {/* Main Structural Map */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Hierarchy Cards (1 col) */}
        <div className="forge-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#bc6ff1]" />
            {twin.institution}
          </h3>

          <div className="space-y-2">
            {twin.departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              const effectiveWorkload = simulatedCuts && dept.code === 'FIN' ? 98.0 : dept.workload_pct;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1e0a39] border-[#bc6ff1] forge-glow shadow-md'
                      : 'bg-[#0f061b] border-[#892cdc]/30 hover:border-[#bc6ff1]/40'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {dept.name}
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#892cdc]/20 text-[#bc6ff1]">
                        {dept.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Avg turnaround: {dept.avg_processing_time}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-black ${effectiveWorkload > 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {effectiveWorkload}%
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">Workload</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Topology & Officer Staff View (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="forge-card p-5 border-l-4 border-l-[#bc6ff1] space-y-4">
            <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">{selectedDept.name} ({selectedDept.code})</h2>
                <p className="text-xs text-gray-400">Department Capacity & Active Queue Telemetry</p>
              </div>

              <div className="text-right text-xs">
                <span className="text-gray-400 block text-[10px]">Queue Capacity</span>
                <span className="font-bold text-white">{selectedDept.capacity} Tasks / Day</span>
              </div>
            </div>

            {/* Officer Workload Cards */}
            <div>
              <h4 className="text-xs font-bold text-gray-200 mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#bc6ff1]" />
                Assigned Officers & Real-time Workload Status
              </h4>

              <div className="grid sm:grid-cols-2 gap-3">
                {selectedDept.officers.map((off, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{off.name}</div>
                      <div className="text-[11px] text-purple-300 mt-0.5">{off.status}</div>
                    </div>
                    <Activity className="w-4 h-4 text-[#bc6ff1]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
