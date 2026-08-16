import React, { useEffect, useState } from 'react';
import { Application, User } from '../types';
import { apiService } from '../services/api';
import { FileCheck, Plus, ShieldCheck, Clock, ArrowRight, Sparkles, CheckCircle2, UserCheck, AlertCircle, Eye } from 'lucide-react';

interface ApplicationsPageProps {
  currentUser: User;
  onNavigateToPassport: (appId: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ currentUser, onNavigateToPassport }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Application Form State
  const [formData, setFormData] = useState({
    title: 'Merit-cum-Means National Scholarship 2026',
    annual_income: 320000,
    cgpa: 8.7,
    attendance_pct: 89.0,
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const list = await apiService.getApplications();
    setApplications(list);
    if (list.length > 0) {
      const fullApp = await apiService.getApplication(list[0].id);
      setSelectedApp(fullApp);
    }
  };

  const handleSelectApp = async (id: string) => {
    const fullApp = await apiService.getApplication(id);
    setSelectedApp(fullApp);
  };

  const handleSubmitNewApp = async () => {
    setSubmitting(true);
    try {
      const res = await apiService.submitScholarshipApplication(formData);
      setShowSubmitModal(false);
      await loadApplications();
      if (res.application_id) {
        const newFull = await apiService.getApplication(res.application_id);
        setSelectedApp(newFull);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#bc6ff1]" />
            Applications & Flagship Demo
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Scholarship End-to-End Workflow
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track student application submissions, watch real-time stateful multi-agent execution, and review Decision Passports.
          </p>
        </div>

        {currentUser.role === 'Student' && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold forge-btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Scholarship Application</span>
          </button>
        )}
      </div>

      {/* Main Grid: Application List + Detailed Execution View */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Application List (1 col) */}
        <div className="forge-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Active Applications</h3>
          <div className="space-y-2">
            {applications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e0a39] border-[#bc6ff1] forge-glow shadow-lg'
                      : 'bg-[#0f061b] border-[#892cdc]/30 hover:border-[#bc6ff1]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{app.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {app.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-200 truncate">{app.title}</div>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                    <span>Applicant: {app.applicant_name || 'Rahul Sharma'}</span>
                    <span>{app.sla_due_at}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Application Execution Pipeline & Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedApp ? (
            <>
              {/* Application Header Card */}
              <div className="forge-card p-5 border-l-4 border-l-[#bc6ff1] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#892cdc]/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{selectedApp.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {selectedApp.status}
                      </span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-200 mt-0.5">{selectedApp.title}</h2>
                  </div>

                  <button
                    onClick={() => onNavigateToPassport(selectedApp.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold forge-btn-primary flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>View AI Decision Passport</span>
                  </button>
                </div>

                {/* Applicant Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#0a0412] p-3 rounded-xl border border-[#892cdc]/20">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Student Name</span>
                    <span className="font-bold text-white">{selectedApp.applicant?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Academic CGPA</span>
                    <span className="font-bold text-emerald-400">{selectedApp.applicant?.cgpa} / 10.0</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Attendance</span>
                    <span className="font-bold text-purple-300">{selectedApp.applicant?.attendance}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Family Income</span>
                    <span className="font-bold text-gray-200">Rs. {selectedApp.applicant?.annual_income.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Multi-Agent Pipeline Visualization Card */}
              <div className="forge-card p-5 space-y-4">
                <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#bc6ff1]" />
                    Stateful Multi-Agent AI Pipeline
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold font-mono">96% Overall Confidence</span>
                </div>

                {/* Agent Sequence Cards */}
                <div className="grid sm:grid-cols-4 gap-3">
                  {[
                    { agent: 'DocumentAgent', status: 'PASS', score: '0.98', details: 'Aadhaar & Income Verified' },
                    { agent: 'AcademicAgent', status: 'PASS', score: '0.96', details: 'CGPA 8.7 & 89% Attendance' },
                    { agent: 'FinanceAgent', status: 'PASS', score: '0.95', details: 'Income ceiling & zero arrears' },
                    { agent: 'ComplianceAgent', status: 'PASS', score: '0.99', details: 'Disciplinary check passed' },
                  ].map((ag, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white font-mono">{ag.agent}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                          {ag.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-300 leading-tight mb-2">{ag.details}</div>
                      <div className="text-[9px] text-gray-500 font-mono">Confidence: {ag.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="forge-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#892cdc]/20 pb-3">
                  Workflow Execution Timeline
                </h3>
                <div className="space-y-3">
                  {selectedApp.timeline?.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="mt-0.5">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : step.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-200">{step.step}</div>
                        {step.assigned_to && (
                          <div className="text-[11px] text-purple-300 mt-0.5">Assigned to: {step.assigned_to}</div>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">{step.timestamp || step.sla}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="forge-card p-12 text-center text-xs text-gray-400">
              Select an application from the list to view multi-agent state telemetry
            </div>
          )}
        </div>
      </div>

      {/* New Application Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="forge-card p-6 max-w-lg w-full space-y-4 border-[#bc6ff1]/50 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-[#892cdc]/30 pb-3">
              Submit Student Scholarship Application
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1 font-medium">Scholarship Scheme</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0a0412] border border-[#892cdc]/40 rounded-xl p-3 text-white focus:outline-none focus:border-[#bc6ff1]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Annual Income (Rs)</label>
                  <input
                    type="number"
                    value={formData.annual_income}
                    onChange={(e) => setFormData({ ...formData, annual_income: Number(e.target.value) })}
                    className="w-full bg-[#0a0412] border border-[#892cdc]/40 rounded-xl p-3 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Current CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                    className="w-full bg-[#0a0412] border border-[#892cdc]/40 rounded-xl p-3 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-medium">Attendance %</label>
                  <input
                    type="number"
                    value={formData.attendance_pct}
                    onChange={(e) => setFormData({ ...formData, attendance_pct: Number(e.target.value) })}
                    className="w-full bg-[#0a0412] border border-[#892cdc]/40 rounded-xl p-3 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewApp}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold forge-btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {submitting ? 'Running Agents...' : 'Submit & Execute AI Agents'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
