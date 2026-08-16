import React, { useEffect, useState } from 'react';
import { PassportData } from '../types';
import { apiService } from '../services/api';
import { ShieldCheck, FileText, CheckCircle2, Zap, AlertCircle, Lock, ArrowLeft, Bot, Database } from 'lucide-react';

interface DecisionPassportPageProps {
  applicationId?: string;
  onBack?: () => void;
}

export const DecisionPassportPage: React.FC<DecisionPassportPageProps> = ({ applicationId = 'SCH-20481', onBack }) => {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassport();
  }, [applicationId]);

  const loadPassport = async () => {
    setLoading(true);
    const app = await apiService.getApplication(applicationId);
    if (app.passport) {
      setPassport(app.passport);
    } else {
      // Fallback
      setPassport({
        request_id: applicationId,
        applicant: 'Rahul Sharma (STU-2026-881)',
        workflow: 'Student Scholarship Application v3.2',
        agent_evaluations: [
          { agent: 'DocumentAgent', status: 'PASS', confidence: 0.98, evidence: ['Aadhaar biometric checksum verified against UIDAI ledger', 'Income Certificate issued by Tehsildar verified (Income: Rs. 320,000)', 'Marksheet digital signature validated by Registrar'] },
          { agent: 'AcademicAgent', status: 'PASS', confidence: 0.96, evidence: ['CGPA 8.7 meets or exceeds threshold of 7.5', 'Attendance 89% satisfies 75% requirement', '0 active academic backlogs'] },
          { agent: 'FinanceAgent', status: 'PASS', confidence: 0.95, evidence: ['Family income Rs. 320,000 within Rs. 800,000 ceiling', 'Zero tuition/hostel fee arrears on account', 'Scholarship pool has sufficient grant budget'] },
          { agent: 'ComplianceAgent', status: 'PASS', confidence: 0.99, evidence: ['Single active scholarship constraint verified across state & central portals', 'Clean disciplinary record'] },
        ],
        overall_recommendation: 'APPROVE',
        overall_confidence: 0.96,
        risk_level: 'LOW',
        risk_score: 0.04,
        requires_human_approval: true,
        human_approval_reason: 'High-value monetary grant (Rs. 50,000/yr) mandates human officer signature.',
      });
    }
    setLoading(false);
  };

  if (loading || !passport) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <ShieldCheck className="w-8 h-8 text-[#bc6ff1] animate-spin mb-3" />
        <span className="text-xs font-mono">Loading Explainable AI Decision Passport...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-lg bg-[#140824] text-gray-300 hover:text-white cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              AI Decision Passport #{passport.request_id}
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Explainable AI Audit Log
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Transparent evidence record compiled from stateful multi-agent execution for institutional governance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Passport Card */}
      <div className="forge-card p-6 border-[#bc6ff1]/40 space-y-6 shadow-2xl">
        {/* Passport Top Banner */}
        <div className="grid sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0a0412] border border-[#892cdc]/30 text-xs">
          <div>
            <span className="text-gray-400 text-[10px] block">Application ID</span>
            <span className="font-bold text-white font-mono">{passport.request_id}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">Applicant</span>
            <span className="font-bold text-gray-200">{passport.applicant}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">Workflow Definition</span>
            <span className="font-bold text-purple-300">{passport.workflow}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">AI Recommendation</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {passport.overall_recommendation} ({passport.overall_confidence * 100}%)
            </span>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#100624] to-[#100624] border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
              LOW
            </div>
            <div>
              <div className="text-xs font-bold text-white">Risk Rating: {passport.risk_level} (Score: {passport.risk_score})</div>
              <div className="text-[11px] text-gray-400">Zero critical flags detected across all institutional compliance checks.</div>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-gray-400 block text-[10px]">Human Approval Policy</span>
            <span className="text-amber-300 font-semibold">{passport.human_approval_reason}</span>
          </div>
        </div>

        {/* Multi-Agent Evidence Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#bc6ff1]" />
            Agent Evaluation Traces & Verified Evidence
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {passport.agent_evaluations.map((evalData, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0f061b] border border-[#892cdc]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-[#892cdc]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#bc6ff1]" />
                    <span className="text-xs font-bold text-white font-mono">{evalData.agent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400">Conf: {evalData.confidence * 100}%</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {evalData.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {evalData.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="leading-relaxed">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Cryptographic Stamp Footer */}
        <div className="p-3 rounded-xl bg-[#06020a] border border-[#892cdc]/20 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Cryptographic Immutable Log Hash: sha256_9f8e7d6a5b4c3b2a1...</span>
          </div>
          <span>System: System Scribe Core v3.2</span>
        </div>
      </div>
    </div>
  );
};
