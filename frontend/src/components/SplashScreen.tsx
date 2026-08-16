import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  const stages = [
    'PROCESS FORGE',
    'Initializing Institutional Intelligence...',
    'Loading Multi-Agent Core Engine...',
    'Loading Workflow Predictive Analytics...',
    'System Ready.'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 600);
    const timer2 = setTimeout(() => setStage(2), 1200);
    const timer3 = setTimeout(() => setStage(3), 1800);
    const timer4 = setTimeout(() => setStage(4), 2400);
    const timer5 = setTimeout(() => onComplete(), 2900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white px-4">
      {/* Background glow radial */}
      <div className="absolute w-96 h-96 bg-[#892cdc] opacity-20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#892cdc] to-[#52057b] p-0.5 shadow-2xl flex items-center justify-center forge-glow">
            <div className="w-full h-full bg-[#0a0412] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-10 h-10 text-[#bc6ff1] animate-pulse" />
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-[#bc6ff1] absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-[#e2d1f7] to-[#bc6ff1] bg-clip-text text-transparent mb-2">
          PROCESS FORGE
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#bc6ff1] font-semibold mb-8">
          AI-Powered Workflow Orchestration
        </p>

        {/* Progress Text */}
        <div className="h-10 flex items-center justify-center mb-6">
          <p className="text-sm text-gray-300 font-mono">
            {stages[stage]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1b0933] h-1.5 rounded-full overflow-hidden border border-[#892cdc]/30">
          <div
            className="h-full bg-gradient-to-r from-[#892cdc] to-[#bc6ff1] transition-all duration-500 ease-out"
            style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
          />
        </div>

        {/* Indicator Badges */}
        <div className="mt-8 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SIH SA-S03</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Multi-Agent AI</span>
          <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-purple-400" /> Predict & Optimize</span>
        </div>
      </div>
    </div>
  );
};
