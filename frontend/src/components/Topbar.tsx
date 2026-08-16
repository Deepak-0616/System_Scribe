import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Cpu, Bell, Bot, ChevronDown, UserCheck, Shield, Sparkles } from 'lucide-react';

interface TopbarProps {
  currentUser: User;
  onSwitchUser: (email: string) => void;
  onToggleCopilot: () => void;
  unreadNotificationsCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  onSwitchUser,
  onToggleCopilot,
  unreadNotificationsCount = 3,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const demoAccounts = [
    { label: 'Rahul Sharma (Student)', email: 'student@forge.edu', role: 'Student' },
    { label: 'Officer B (Finance Officer)', email: 'officer.b@forge.edu', role: 'Officer' },
    { label: 'Vikram Seth (Workflow Admin)', email: 'admin@forge.edu', role: 'Admin' },
    { label: 'Dr. Arisudan Rao (Dean Student Welfare)', email: 'dean@forge.edu', role: 'DepartmentHead' },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Student':
        return 'forge-badge-purple';
      case 'Officer':
        return 'forge-badge-green';
      case 'Admin':
        return 'forge-badge-warning';
      case 'DepartmentHead':
        return 'forge-badge-danger';
      default:
        return 'forge-badge-purple';
    }
  };

  return (
    <header className="h-16 bg-[#0a0412] border-b border-[#892cdc]/20 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#892cdc] to-[#bc6ff1] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0412] rounded-[7px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#bc6ff1]" />
            </div>
          </div>
          <div>
            <span className="font-black tracking-wide text-lg bg-gradient-to-r from-white via-[#e2d1f7] to-[#bc6ff1] bg-clip-text text-transparent">
              SYSTEM SCRIBE
            </span>
            <span className="ml-2 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              SIH SA-S03
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-[#160b24] border border-[#892cdc]/20 text-xs text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-emerald-400 font-medium">Demo AI Mode Active</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Multi-Agent Core v3.2</span>
        </div>
      </div>

      {/* Actions & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* AI Copilot Toggle Button */}
        <button
          onClick={onToggleCopilot}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#52057b] to-[#892cdc] hover:from-[#660899] hover:to-[#9b3df0] text-white text-xs font-semibold shadow-md transition-all border border-[#bc6ff1]/30 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[#bc6ff1]" />
          <span>AI Copilot</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-lg bg-[#140824] hover:bg-[#230d3d] border border-[#892cdc]/20 text-gray-300 transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#140824] hover:bg-[#200b38] border border-[#892cdc]/30 text-left transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#52057b] border border-[#bc6ff1]/40 flex items-center justify-center text-xs font-bold text-[#bc6ff1]">
              {currentUser.full_name[0]}
            </div>
            <div className="hidden sm:block text-xs">
              <div className="font-semibold text-gray-100 flex items-center gap-1.5">
                {currentUser.full_name}
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f061b] border border-[#892cdc]/40 shadow-2xl z-50 py-2">
              <div className="px-3 py-1.5 border-b border-[#892cdc]/20 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Switch Role / Demo Persona
              </div>
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    onSwitchUser(account.email);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[#230d3e] transition-colors flex items-center justify-between ${
                    currentUser.email === account.email ? 'bg-[#52057b]/30 font-semibold text-[#bc6ff1]' : 'text-gray-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-gray-200">{account.label}</div>
                    <div className="text-[10px] text-gray-400">{account.email}</div>
                  </div>
                  {currentUser.email === account.email && (
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
