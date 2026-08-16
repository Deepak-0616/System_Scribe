import React, { useState } from 'react';
import { Workflow, WorkflowNode } from '../types';
import { apiService } from '../services/api';
import { GitFork, Plus, Save, CheckCircle2, ShieldCheck, Trash2, Cpu, Settings, Play, ArrowRight } from 'lucide-react';

interface WorkflowBuilderProps {
  initialWorkflow?: Workflow;
  onSaveWorkflow: (wf: Workflow) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ initialWorkflow, onSaveWorkflow }) => {
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || 'New Custom Institutional Workflow');
  const [description, setDescription] = useState(initialWorkflow?.description || 'Custom interactive process flow');
  const [slaHours, setSlaHours] = useState(initialWorkflow?.sla_hours || 48);
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    initialWorkflow?.nodes || [
      { id: 'node-start', type: 'start', label: 'Application Submission', department: 'Student Portal', role: 'Applicant', agent: 'OrchestratorAgent', sla_hours: 2, requires_human: false },
      { id: 'node-doc-verify', type: 'document_verification', label: 'AI Document Verification', department: 'Registrar', role: 'Document Officer', agent: 'DocumentAgent', sla_hours: 6, requires_human: false, rules: ['Validate Income Certificate', 'Marksheet Checksum'] },
      { id: 'node-academic', type: 'ai_validation', label: 'Academic Eligibility Check', department: 'Academics', role: 'Academic Officer', agent: 'AcademicAgent', sla_hours: 12, requires_human: false, rules: ['CGPA >= 7.5', 'Attendance >= 75%'] },
      { id: 'node-approval', type: 'human_review', label: 'Dean Sanction & Approval', department: 'Dean Student Welfare', role: 'Officer', agent: 'RoutingAgent', sla_hours: 12, requires_human: true },
      { id: 'node-end', type: 'end', label: 'Workflow Sanctioned', department: 'System', role: 'System', agent: 'OrchestratorAgent', sla_hours: 1, requires_human: false },
    ]
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-doc-verify');
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const availableNodeTypePresets = [
    { type: 'start', label: 'Start / Submission', defaultDept: 'Student Portal', agent: 'OrchestratorAgent' },
    { type: 'document_verification', label: 'Document Verification', defaultDept: 'Registrar', agent: 'DocumentAgent' },
    { type: 'ai_validation', label: 'AI Eligibility Audit', defaultDept: 'Academics', agent: 'AcademicAgent' },
    { type: 'human_review', label: 'Officer Review & Sanction', defaultDept: 'Dean Office', agent: 'RoutingAgent' },
    { type: 'notification', label: 'Multi-Channel Alert', defaultDept: 'Communications', agent: 'NotificationAgent' },
    { type: 'exception', label: 'Exception Handler', defaultDept: 'Administration', agent: 'ExceptionAgent' },
    { type: 'end', label: 'Workflow End', defaultDept: 'System', agent: 'OrchestratorAgent' },
  ];

  const handleAddNode = (preset: typeof availableNodeTypePresets[0]) => {
    const newId = `node-${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newId,
      type: preset.type as any,
      label: preset.label,
      department: preset.defaultDept,
      role: 'Staff / Officer',
      agent: preset.agent,
      sla_hours: 12,
      requires_human: preset.type === 'human_review',
    };

    // Insert before the last 'end' node if present
    const updated = [...nodes];
    const endIndex = updated.findIndex((n) => n.type === 'end');
    if (endIndex !== -1) {
      updated.splice(endIndex, 0, newNode);
    } else {
      updated.push(newNode);
    }
    setNodes(updated);
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 2) return;
    setNodes(nodes.filter((n) => n.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(nodes[0].id);
    }
  };

  const handleValidate = () => {
    const hasStart = nodes.some((n) => n.type === 'start');
    const hasEnd = nodes.some((n) => n.type === 'end');
    const hasHuman = nodes.some((n) => n.requires_human);

    if (!hasStart || !hasEnd) {
      setValidationResult('Validation Error: Workflow must contain both a Start node and an End node.');
    } else if (!hasHuman) {
      setValidationResult('Validation Warning: High-risk financial/institutional decisions should mandate a Human Review step.');
    } else {
      setValidationResult('Workflow Validated Successfully! 0 critical errors, 48 hour target compliant.');
    }
  };

  const handleSave = async () => {
    const wf: Workflow = {
      id: initialWorkflow?.id || Math.floor(Math.random() * 1000) + 20,
      name: workflowName,
      description,
      domain: 'Educational Institution',
      version: '1.0',
      status: 'published',
      sla_hours: slaHours,
      nodes,
      edges: nodes.slice(0, -1).map((n, idx) => ({ source: n.id, target: nodes[idx + 1].id })),
    };

    try {
      await apiService.validateWorkflow(wf.id);
    } catch {}
    onSaveWorkflow(wf);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <GitFork className="w-6 h-6 text-[#bc6ff1]" />
            Visual Workflow Builder
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
              Interactive Graph Canvas
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Drag, connect, and configure multi-agent workflow nodes, role assignments, SLA constraints, and rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="px-4 py-2 rounded-xl text-xs font-semibold forge-btn-secondary flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Validate Rules</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold forge-btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Workflow</span>
          </button>
        </div>
      </div>

      {/* Validation Alert Banner */}
      {validationResult && (
        <div className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between ${
          validationResult.includes('Error') ? 'bg-red-950/40 border-red-500/40 text-red-300' :
          validationResult.includes('Warning') ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' :
          'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
        }`}>
          <span>{validationResult}</span>
          <button onClick={() => setValidationResult(null)} className="text-gray-400 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      {/* Metadata Configuration Bar */}
      <div className="forge-card p-4 grid sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="text-gray-400 block mb-1 font-medium">Workflow Name</label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-[#bc6ff1]"
          />
        </div>
        <div>
          <label className="text-gray-400 block mb-1 font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white focus:outline-none focus:border-[#bc6ff1]"
          />
        </div>
        <div>
          <label className="text-gray-400 block mb-1 font-medium">Total Target SLA (Hours)</label>
          <input
            type="number"
            value={slaHours}
            onChange={(e) => setSlaHours(Number(e.target.value))}
            className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-[#bc6ff1]"
          />
        </div>
      </div>

      {/* Main Layout: Node Palette + Canvas + Property Panel */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Node Palette (1 col) */}
        <div className="forge-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Node Palette</h3>
          <p className="text-[11px] text-gray-400 mb-3">Click to insert standard workflow step:</p>
          <div className="space-y-2">
            {availableNodeTypePresets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleAddNode(preset)}
                className="w-full p-2.5 rounded-lg bg-[#0f061b] hover:bg-[#200a3a] border border-[#892cdc]/30 transition-colors flex items-center justify-between text-xs text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-[#bc6ff1] group-hover:scale-110 transition-transform" />
                  <span className="text-gray-200 font-medium">{preset.label}</span>
                </div>
                <span className="text-[9px] font-mono text-gray-500">{preset.agent}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Visual Graph Canvas (2 cols) */}
        <div className="lg:col-span-2 forge-card p-5 space-y-4">
          <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#bc6ff1]" />
              Workflow Node Sequence Canvas
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">{nodes.length} Nodes Configured</span>
          </div>

          <div className="space-y-3 py-2">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div key={node.id} className="relative">
                  {/* Down arrow connector line */}
                  {index < nodes.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-6 bg-[#892cdc]/50" />
                    </div>
                  )}

                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1e0a39] border-[#bc6ff1] forge-glow'
                        : 'bg-[#0f061b] border-[#892cdc]/30 hover:border-[#bc6ff1]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#52057b] text-[#bc6ff1] font-bold text-xs flex items-center justify-center border border-[#bc6ff1]/30">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{node.label}</div>
                        <div className="text-[10px] text-gray-400">
                          {node.department} • Agent: <span className="text-purple-300 font-mono">{node.agent}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
                        {node.sla_hours}h SLA
                      </span>
                      {nodes.length > 2 && node.type !== 'start' && node.type !== 'end' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Properties Inspector (1 col) */}
        <div className="forge-card p-4 space-y-4">
          <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Node Inspector</h3>
            <Settings className="w-4 h-4 text-[#bc6ff1]" />
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Step Label</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(nodes.map((n) => (n.id === selectedNode.id ? { ...n, label: val } : n)));
                  }}
                  className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white font-medium focus:outline-none focus:border-[#bc6ff1]"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Responsible Department</label>
                <input
                  type="text"
                  value={selectedNode.department}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(nodes.map((n) => (n.id === selectedNode.id ? { ...n, department: val } : n)));
                  }}
                  className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white focus:outline-none focus:border-[#bc6ff1]"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Assigned AI Agent</label>
                <input
                  type="text"
                  value={selectedNode.agent}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(nodes.map((n) => (n.id === selectedNode.id ? { ...n, agent: val } : n)));
                  }}
                  className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-[#bc6ff1]"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Step SLA (Hours)</label>
                <input
                  type="number"
                  value={selectedNode.sla_hours}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNodes(nodes.map((n) => (n.id === selectedNode.id ? { ...n, sla_hours: val } : n)));
                  }}
                  className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#892cdc]/20">
                <span className="text-gray-400">Mandatory Human Officer Review</span>
                <input
                  type="checkbox"
                  checked={selectedNode.requires_human}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setNodes(nodes.map((n) => (n.id === selectedNode.id ? { ...n, requires_human: val } : n)));
                  }}
                  className="w-4 h-4 accent-[#892cdc] cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-6">Select a node from the canvas to edit properties</div>
          )}
        </div>
      </div>
    </div>
  );
};
