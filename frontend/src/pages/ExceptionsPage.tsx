import React, { useEffect, useState } from 'react';
import { ExceptionRecord } from '../types';
import { apiService } from '../services/api';
import { AlertTriangle, CheckCircle2, Bot, ArrowRight, ShieldCheck } from 'lucide-react';

export const ExceptionsPage: React.FC = () => {
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExceptions();
  }, []);

  const loadExceptions = async () => {
    setLoading(true);
    const data = await apiService.getExceptions();
    setExceptions(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Exceptions Intelligence Center
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Autonomous Exception Routing
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Instead of terminating failed workflows, ExceptionAgent creates clarification loops, requests missing documents, and resumes stateful execution automatically.
          </p>
        </div>
      </div>

      {/* Exception Records Grid */}
      <div className="space-y-4">
        {exceptions.map((exc) => (
          <div key={exc.id} className="forge-card p-5 border-l-4 border-l-emerald-500 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">{exc.application_id}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                  {exc.exception_type}
                </span>
              </div>

              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {exc.status.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{exc.description}</p>

            {exc.resolution_note && (
              <div className="p-3 rounded-xl bg-[#0a0412] border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Resolution: {exc.resolution_note}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
