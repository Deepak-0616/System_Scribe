import React, { useState } from 'react';
import { UserRole } from '../types';
import { apiService } from '../services/api';
import { Bot, X, Send, Sparkles, ShieldCheck, Database, FileText } from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  evidence?: string[];
  timestamp: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose, userRole }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello! I am your Executive Copilot. Ask me anything about active applications, bottlenecks, officer workloads, or decision passports. (Role: ${userRole})`,
      evidence: ['Institutional Command Center', 'Audit Ledger'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts: Record<UserRole, string[]> = {
    Student: [
      'Why is my application pending?',
      'What are the 4 AI validation checks?',
      'When will my scholarship grant be disbursed?'
    ],
    Officer: [
      'What should I prioritize today?',
      'Show evidence for scholarship SCH-20481',
      'Why was task assigned to me?'
    ],
    Admin: [
      'Which workflow causes the largest delay?',
      'Show optimization proposals for Finance',
      'What is the current SLA compliance %?'
    ],
    DepartmentHead: [
      'Why has finance processing slowed down?',
      'Simulate 40% increase in applications',
      'Show department workload breakdown'
    ]
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await apiService.chatCopilot(textToSend, userRole);
      const aiMsg: Message = {
        sender: 'ai',
        text: res.answer,
        evidence: res.evidence_sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'System Scribe AI Copilot is currently operating in offline state.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#0c0517] border-l border-[#892cdc]/40 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#892cdc]/30 flex items-center justify-between bg-[#140826]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#892cdc] to-[#bc6ff1] p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0412] rounded-[6px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#bc6ff1]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Executive Copilot
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[10px] text-gray-400 font-mono">
              Authorized Scope: <span className="text-[#bc6ff1] font-semibold">{userRole}</span>
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#230c3f] transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#892cdc] to-[#52057b] text-white rounded-br-none shadow-md border border-[#bc6ff1]/30'
                  : 'bg-[#180a2f] text-gray-200 rounded-bl-none border border-[#892cdc]/30 shadow-md'
              }`}
            >
              <p>{m.text}</p>
              {m.evidence && m.evidence.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#892cdc]/20 text-[10px]">
                  <div className="font-semibold text-[#bc6ff1] mb-1 flex items-center gap-1">
                    <Database className="w-3 h-3 text-purple-400" /> Verified Evidence Sources:
                  </div>
                  <ul className="list-disc list-inside text-gray-400 space-y-0.5">
                    {m.evidence.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
            <Bot className="w-4 h-4 text-[#bc6ff1] animate-spin" />
            <span>Analyzing institutional records...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-[#0a0412] border-t border-[#892cdc]/20">
        <p className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          Suggested Queries for {userRole}:
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickPrompts[userRole].map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#180b2d] hover:bg-[#2c0e52] text-gray-300 border border-[#892cdc]/30 transition-colors text-left cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-[#140826] p-1.5 rounded-xl border border-[#892cdc]/40 focus-within:border-[#bc6ff1]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot about workflows, tasks, SLAs..."
            className="flex-1 bg-transparent px-3 text-xs text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 rounded-lg bg-gradient-to-r from-[#892cdc] to-[#52057b] text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
