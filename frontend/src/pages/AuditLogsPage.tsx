import React, { useEffect, useState } from 'react';
import { AuditLog } from '../types';
import { apiService } from '../services/api';
import { History, ShieldCheck, Lock, FileText } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await apiService.getAuditLogs();
    setLogs(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-[#bc6ff1]" />
            Immutable Audit Trail Ledger
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Append-Only System Log
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Every significant event (workflow changes, AI agent executions, human officer approvals, self-optimizations) is recorded in an immutable audit ledger.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="forge-card p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#892cdc]/30 text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Action</th>
                <th className="pb-3 px-3">Entity</th>
                <th className="pb-3 px-3">Event Details</th>
                <th className="pb-3 px-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#892cdc]/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#140728] transition-colors">
                  <td className="py-3 px-3 font-mono text-gray-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-[#bc6ff1]">{log.action}</td>
                  <td className="py-3 px-3 text-gray-200">{log.entity} #{log.entity_id}</td>
                  <td className="py-3 px-3 text-gray-300 max-w-md leading-relaxed">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 text-[11px]">{log.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
