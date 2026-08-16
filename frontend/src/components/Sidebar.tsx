import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Sparkles,
  GitFork,
  FileCheck,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
  Activity,
  Network,
  Dna,
  History,
  AlertTriangle,
  FolderTree
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, roles: ['Student', 'Officer', 'Admin', 'DepartmentHead'] },
    { id: 'applications', label: 'Applications & Demo', icon: FileCheck, roles: ['Student', 'Officer', 'Admin', 'DepartmentHead'] },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, roles: ['Officer', 'Admin', 'DepartmentHead'] },
    { id: 'generator', label: 'AI Workflow Generator', icon: Sparkles, roles: ['Admin', 'DepartmentHead'] },
    { id: 'builder', label: 'Visual Workflow Builder', icon: GitFork, roles: ['Admin', 'DepartmentHead'] },
    { id: 'passports', label: 'AI Decision Passports', icon: ShieldCheck, roles: ['Officer', 'Admin', 'DepartmentHead'] },
    { id: 'predictions', label: 'Predictive Intelligence', icon: TrendingUp, roles: ['Officer', 'Admin', 'DepartmentHead'] },
    { id: 'simulator', label: 'Workflow Simulator', icon: Activity, roles: ['Admin', 'DepartmentHead'] },
    { id: 'digital-twin', label: 'Digital Twin', icon: Network, roles: ['Admin', 'DepartmentHead'] },
    { id: 'dna', label: 'Workflow DNA', icon: Dna, roles: ['Admin', 'DepartmentHead'] },
    { id: 'exceptions', label: 'Exceptions Intelligence', icon: AlertTriangle, roles: ['Officer', 'Admin', 'DepartmentHead'] },
    { id: 'audit-logs', label: 'Audit Logs', icon: History, roles: ['Officer', 'Admin', 'DepartmentHead'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#0a0412] border-r border-[#892cdc]/20 flex flex-col justify-between py-4 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-500">
          Main Navigation
        </div>

        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#892cdc]/30 to-[#52057b]/40 text-[#bc6ff1] border border-[#892cdc]/50 font-semibold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-[#180a2c]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#bc6ff1]' : 'text-gray-400'}`} />
              <span>{item.label}</span>
              {item.id === 'generator' && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

    </aside>
  );
};
