import React from 'react';
import { Cpu, Zap, ShieldCheck, ArrowRight, Activity, GitFork, Play, Sparkles, Layers, CheckCircle2, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onViewDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore, onViewDemo }) => {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-[#892cdc] selection:text-white">
      {/* Top Bar Navigation */}
      <nav className="h-20 border-b border-[#892cdc]/20 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#892cdc] to-[#52057b] p-0.5 shadow-xl flex items-center justify-center forge-glow">
            <div className="w-full h-full bg-[#0a0412] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#bc6ff1]" />
            </div>
          </div>
          <span className="font-black tracking-wider text-xl bg-gradient-to-r from-white via-[#e2d1f7] to-[#bc6ff1] bg-clip-text text-transparent">
            PROCESS FORGE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#domain" className="hover:text-white transition-colors">SIH Domain</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewDemo}
            className="px-4 py-2 rounded-lg text-xs font-semibold forge-btn-secondary cursor-pointer"
          >
            Demo Accounts
          </button>
          <button
            onClick={onExplore}
            className="px-5 py-2 rounded-lg text-xs font-semibold forge-btn-primary flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-16 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#892cdc] opacity-15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180a2c] border border-[#892cdc]/40 text-xs font-semibold text-[#bc6ff1] mb-8 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Smart India Hackathon SA-S03 — Workflow Intelligence Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          Build. Execute.{' '}
          <span className="bg-gradient-to-r from-[#bc6ff1] via-[#892cdc] to-purple-400 bg-clip-text text-transparent">
            Predict. Optimize.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
          Transform fragmented administrative processes into intelligent, predictive, and continuously self-improving workflows powered by stateful multi-agent AI orchestration.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onExplore}
            className="px-8 py-4 rounded-xl font-bold text-sm forge-btn-primary flex items-center gap-3 text-white shadow-xl cursor-pointer"
          >
            <span>Explore Process Forge</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onViewDemo}
            className="px-8 py-4 rounded-xl font-semibold text-sm forge-btn-secondary flex items-center gap-3 text-gray-200 cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#bc6ff1]" />
            <span>View Scholarship Demo</span>
          </button>
        </div>
      </header>

      {/* Process Transformation Philosophy */}
      <section id="vision" className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="forge-card p-8 md:p-12 relative overflow-hidden border-[#892cdc]/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest font-mono text-[#bc6ff1] font-semibold mb-2">
                Central Product Philosophy
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
                Beyond Basic CRUD Automation
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Traditional workflow systems stop at <span className="text-gray-400 font-semibold">Build → Execute → Monitor</span>.
              </p>
              <div className="p-4 rounded-xl bg-[#130726] border border-[#892cdc]/40 text-sm font-semibold text-[#bc6ff1]">
                Process Forge Architecture:
                <div className="text-white mt-1 font-mono text-xs font-bold tracking-wide">
                  Understand → Build → Simulate → Execute → Predict → Explain → Learn → Optimize
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0c0517] border border-[#892cdc]/20 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Explainable AI Decision Passports</h4>
                  <p className="text-xs text-gray-400">Every AI recommendation exposes raw evidence, rule evaluations, and confidence scores for human sign-off.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0c0517] border border-[#892cdc]/20 flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Predictive Bottleneck Engine</h4>
                  <p className="text-xs text-gray-400">Detects SLA breach risks hours before failure and suggests optimal officer task re-assignments.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0c0517] border border-[#892cdc]/20 flex items-start gap-3">
                <GitFork className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Workflow DNA & Self-Optimization</h4>
                  <p className="text-xs text-gray-400">Calculates execution metrics and proposes automatic workflow improvements (e.g. -31% processing time).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Section */}
      <section id="architecture" className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3 text-white">Specialized Multi-Agent AI Core</h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Process Forge uses task-scoped autonomous agents communicating through structured state transitions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'DocumentAgent', desc: 'Validates Aadhaar biometric checksums, income certificates, and marksheet signatures.' },
            { title: 'AcademicAgent', desc: 'Audits student CGPA thresholds, attendance percentages, and active backlogs.' },
            { title: 'FinanceAgent', desc: 'Checks annual income ceilings, fee arrears, and scholarship pool balances.' },
            { title: 'ComplianceAgent', desc: 'Enforces institutional constraints and verifies single-scholarship claims.' },
            { title: 'RoutingAgent', desc: 'Calculates officer workload % and turnaround time for optimal task routing.' },
            { title: 'ExceptionAgent', desc: 'Resolves blurred files, data conflicts, and sends clarification requests.' },
            { title: 'OptimizationAgent', desc: 'Analyzes bottleneck steps and proposes workflow version upgrades.' },
            { title: 'ExecutiveCopilot', desc: 'Provides role-aware natural language insights with evidence citations.' },
          ].map((agent, i) => (
            <div key={i} className="forge-card p-5 border-[#892cdc]/20 hover:border-[#bc6ff1]/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#52057b]/50 border border-[#bc6ff1]/30 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-[#bc6ff1]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{agent.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#892cdc]/20 py-8 px-6 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-gray-300">Process Forge Platform</span> — Smart India Hackathon SA-S03 Prototype
          </div>
          <div className="flex items-center gap-6 text-gray-400">
            <span>Educational Domain</span>
            <span>FastAPI + React</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
