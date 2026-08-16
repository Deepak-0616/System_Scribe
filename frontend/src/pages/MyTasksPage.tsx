import React, { useEffect, useState } from 'react';
import { WorkflowTask } from '../types';
import { apiService } from '../services/api';
import confetti from 'canvas-confetti';
import { CheckSquare, Clock, ShieldCheck, CheckCircle2, XCircle, UserPlus, FileText, AlertCircle, Bot, Sparkles } from 'lucide-react';

interface MyTasksPageProps {
  onNavigateToPassport: (appId: string) => void;
}

export const MyTasksPage: React.FC<MyTasksPageProps> = ({ onNavigateToPassport }) => {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const list = await apiService.getTasks();
    setTasks(list);
    setLoading(false);
  };

  const handleAction = async (taskId: number, action: 'approve' | 'reject' | 'reassign') => {
    try {
      const res = await apiService.performTaskAction(taskId, action);
      if (action === 'approve') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        setActionSuccess('Scholarship Application SCH-20481 Approved & Sanctioned!');
      } else if (action === 'reassign') {
        setActionSuccess('Task reassigned to Officer B (Finance Associate).');
      } else {
        setActionSuccess('Task rejected.');
      }
      setTasks(tasks.filter((t) => t.id !== taskId));
      setSelectedTask(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#bc6ff1]" />
            Intelligent Task Inbox
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Officer Dashboard
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review pending institutional tasks enriched with AI agent recommendations, evidence passports, and workload-aware routing.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Task List Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Task Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Assigned Queue Tasks ({tasks.length})
          </h3>

          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`forge-card p-5 border transition-all cursor-pointer space-y-3 ${
                  selectedTask?.id === task.id
                    ? 'border-[#bc6ff1] forge-glow shadow-xl bg-[#1d0b38]'
                    : 'border-[#892cdc]/30 hover:border-[#bc6ff1]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">{task.application_id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                      {task.priority} Priority
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {task.sla_due}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-white">{task.title}</h2>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#892cdc]/20">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#bc6ff1]" />
                    <span className="text-gray-300">
                      AI Recommendation: <strong className="text-emerald-400">{task.ai_recommendation}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] text-purple-300 font-mono">{task.department}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="forge-card p-12 text-center text-xs text-gray-400">
              No active tasks pending officer review in your inbox.
            </div>
          )}
        </div>

        {/* Selected Task & Decision Passport Action Drawer (1 col) */}
        <div className="space-y-4">
          {selectedTask ? (
            <div className="forge-card p-5 space-y-4 border-[#bc6ff1]/50 shadow-xl">
              <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Officer Approval Panel
                </h3>
                <span className="text-xs text-gray-400 font-mono">{selectedTask.application_id}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0a0412] border border-[#892cdc]/20 space-y-1">
                  <div className="text-gray-400 text-[10px]">AI Verification Confidence</div>
                  <div className="text-lg font-black text-emerald-400">96.0% (Low Risk Score: 0.04)</div>
                  <div className="text-[11px] text-gray-300 mt-1">
                    All 4 agents (Document, Academic, Finance, Compliance) have completed audits with zero flags.
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToPassport(selectedTask.application_id)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold forge-btn-secondary flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#bc6ff1]" />
                  <span>Inspect Full Decision Passport Evidence</span>
                </button>

                {/* Decision Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleAction(selectedTask.id, 'approve')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Sanction Grant (Rs. 50,000)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAction(selectedTask.id, 'reassign')}
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-[#180b2d] hover:bg-[#280e4b] text-purple-300 border border-[#892cdc]/40 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Reassign Task</span>
                    </button>
                    <button
                      onClick={() => handleAction(selectedTask.id, 'reject')}
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="forge-card p-8 text-center text-xs text-gray-400">
              Select a task from your queue to open the officer approval panel
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
