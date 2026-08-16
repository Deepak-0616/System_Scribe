import React, { useState } from 'react';
import { Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const roleModes = [
  { role: 'Student' as UserRole, label: 'Student', email: 'student@forge.edu' },
  { role: 'Officer' as UserRole, label: 'Officer', email: 'officer.b@forge.edu' },
  { role: 'Admin' as UserRole, label: 'Admin', email: 'admin@forge.edu' },
  { role: 'DepartmentHead' as UserRole, label: 'Dept Head', email: 'dean@forge.edu' },
];

export const LandingPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('Student');
  const [email, setEmail] = useState('student@forge.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole, defaultEmail: string) => {
    setActiveRole(role);
    setEmail(defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#020005] text-white flex font-sans selection:bg-[#892cdc] selection:text-white">
      {/* LEFT COLUMN: Login Form & Persona Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-8 z-10 bg-[#04010a] h-full overflow-hidden">
        {/* Top-Left Aligned Brand Logo */}
        <div className="flex items-center gap-3 shrink-0 self-start">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#892cdc] to-[#52057b] p-0.5 shadow-lg flex items-center justify-center forge-glow">
            <div className="w-full h-full bg-[#0a0412] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#bc6ff1]" />
            </div>
          </div>
          <span className="font-black font-[900] tracking-wider text-lg bg-gradient-to-r from-white via-[#e2d1f7] to-[#bc6ff1] bg-clip-text text-transparent">
            SYSTEM SCRIBE
          </span>
        </div>

        {/* Fixed Width & Height Container - Size never shifts when switching profiles */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          <div className="forge-card p-6 sm:p-7 border border-[#892cdc]/40 shadow-2xl bg-[#0c051a]/95 rounded-3xl relative overflow-hidden backdrop-blur-md min-h-[460px] flex flex-col justify-between">
            {/* Ambient Corner Glow inside Card */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#892cdc] opacity-20 blur-2xl rounded-full pointer-events-none" />

            <div>
              <h1 className="text-3xl font-black font-[900] text-white tracking-tight mb-1">
                Welcome back
              </h1>
              <p className="text-xs text-gray-400 mb-4">
                Please enter your details or select your access role
              </p>

              {/* Fixed Dimension Role Separator Buttons directly under Welcome Back */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#06020e] border border-[#892cdc]/30 mb-4 h-11 box-border shrink-0">
                {roleModes.map((item) => {
                  const isActive = activeRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role, item.email)}
                      className={`flex-1 h-9 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center flex items-center justify-center box-border border ${
                        isActive
                          ? 'bg-gradient-to-r from-[#892cdc] to-[#52057b] text-white shadow-md border-[#bc6ff1]/40'
                          : 'text-gray-400 hover:text-white hover:bg-[#130726] border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#06020e] border border-[#892cdc]/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bc6ff1] focus:ring-1 focus:ring-[#bc6ff1] transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#06020e] border border-[#892cdc]/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bc6ff1] focus:ring-1 focus:ring-[#bc6ff1] transition-all"
                    placeholder="••••••••••••"
                  />
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-[#892cdc] bg-[#06020e] text-[#892cdc] focus:ring-0 accent-[#892cdc] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="text-[11px]">Remember for 30 days</span>
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[#bc6ff1] hover:underline text-[11px] font-medium">
                    Forgot password
                  </a>
                </div>

                {/* Constant Width Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#892cdc] to-[#52057b] hover:from-[#9b3df0] hover:to-[#68079d] text-white shadow-lg shadow-[#892cdc]/25 transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#bc6ff1]/30"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>

                {/* Sign in with Google / SSO Button */}
                <button
                  type="button"
                  onClick={() => onLogin(email)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-[#06020e] hover:bg-[#140728] text-gray-200 border border-[#892cdc]/30 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </form>
            </div>

            {/* Don't have an account? Sign up */}
            <div className="text-center text-xs text-gray-400 mt-4 font-normal">
              Don't have an account?{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#bc6ff1] font-semibold hover:underline">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Elevated Vector Illustration Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#18082e] via-[#330752] to-[#52057b] p-8 lg:p-12 items-center justify-center relative overflow-hidden h-full">
        {/* Background Radial Element */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(188,111,241,0.25),transparent_60%)] pointer-events-none" />

        {/* Vector Artwork Container */}
        <div className="relative w-full max-w-md flex flex-col items-center justify-center text-center">
          {/* Main Computer Monitor & AI Assistant SVG Illustration */}
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Monitor Outer Glass Frame */}
            <div className="w-full h-64 bg-[#0d041c]/95 rounded-3xl border-2 border-[#bc6ff1]/40 shadow-2xl p-5 relative flex flex-col justify-between backdrop-blur-md">
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between border-b border-[#892cdc]/30 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[10px] font-mono text-[#bc6ff1]">system_scribe_ai.orchestrator</div>
              </div>

              {/* Monitor Screen Graphic */}
              <div className="flex-1 flex items-center justify-around px-2">
                {/* Checkmark Badge */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-full h-full bg-[#0a0412] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>

                {/* AI Assistant Character Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#892cdc] to-[#bc6ff1] p-1 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full bg-[#150729] rounded-full flex items-center justify-center">
                    <Cpu className="w-12 h-12 text-[#bc6ff1]" />
                  </div>
                </div>
              </div>

              {/* Screen Monitor Stand Base */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#1e073d] border border-[#892cdc]/40 rounded-b-xl" />
            </div>

            {/* Floating Orbit Line Art Icons */}
            <div className="absolute top-2 left-4 w-10 h-10 rounded-2xl bg-[#892cdc]/30 border border-[#bc6ff1]/40 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
              <Cpu className="w-5 h-5 text-[#bc6ff1]" />
            </div>
            <div className="absolute bottom-8 right-4 w-12 h-12 rounded-2xl bg-[#52057b]/40 border border-[#bc6ff1]/40 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          {/* Side Panel Caption */}
          <div className="mt-6 text-center max-w-xs">
            <h3 className="text-lg font-bold text-white mb-1.5">
              Intelligent Workflow Orchestration
            </h3>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Automating institutional administrative processes with stateful multi-agent decision intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
