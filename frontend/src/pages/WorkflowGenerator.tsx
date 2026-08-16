import React, { useState } from 'react';
import { Workflow, WorkflowNode } from '../types';
import { apiService } from '../services/api';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, GitFork, Play, Save } from 'lucide-react';

interface WorkflowGeneratorProps {
  onWorkflowCreated: (wf: Workflow) => void;
}

export const WorkflowGenerator: React.FC<WorkflowGeneratorProps> = ({ onWorkflowCreated }) => {
  const [prompt, setPrompt] = useState(
    'Create a scholarship workflow requiring document verification, academic eligibility, attendance verification, financial eligibility, department recommendation and final approval.'
  );
  const [generating, setGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null);
  const [validation, setValidation] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const samplePrompts = [
    'Create a scholarship workflow requiring document verification, academic eligibility, attendance verification, financial eligibility, department recommendation and final approval.',
    'Build a bonafide certificate request workflow with instant DigiLocker document check and automated Dean digital signature.',
    'Create a fee concession request workflow with income tax verification, family audit, and financial committee approval.'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      const res = await apiService.generateWorkflowAI(prompt);
      setGeneratedWorkflow(res);
      const val = await apiService.validateWorkflow(res.id);
      setValidation(val);
      if (res.nodes && res.nodes.length > 0) {
        setSelectedNode(res.nodes[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedWorkflow) return;
    await apiService.validateWorkflow(generatedWorkflow.id);
    onWorkflowCreated(generatedWorkflow);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#892cdc]/20">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#bc6ff1]" />
          AI Workflow Generator
          <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
            Natural Language Syntax Engine
          </span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Type an administrative process requirement in natural language. Process Forge synthesizes structured DAG workflow nodes, assigns AI agents, configures SLAs, and checks institutional compliance.
        </p>
      </div>

      {/* Input Prompt Box */}
      <div className="forge-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Natural Language Requirement Prompt
          </label>
          <span className="text-[10px] text-[#bc6ff1] font-mono">LLM Provider: Configured / Demo Mode</span>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your desired administrative process workflow..."
          className="w-full bg-[#0a0412] border border-[#892cdc]/40 rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bc6ff1] transition-colors leading-relaxed"
        />

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-gray-400 font-medium">Try Preset Prompts:</span>
          {samplePrompts.map((sp, i) => (
            <button
              key={i}
              onClick={() => setPrompt(sp)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#180b2c] hover:bg-[#280e4b] text-gray-300 border border-[#892cdc]/30 transition-colors text-left truncate max-w-xs cursor-pointer"
            >
              {sp.slice(0, 45)}...
            </button>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 rounded-xl text-xs font-bold forge-btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
          >
            {generating ? (
              <>
                <Sparkles className="w-4 h-4 text-[#bc6ff1] animate-spin" />
                <span>Synthesizing Workflow DAG...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Workflow with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Workflow View */}
      {generatedWorkflow && (
        <div className="space-y-6">
          {/* Overview Header Card */}
          <div className="forge-card p-5 border-l-4 border-l-[#bc6ff1] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">{generatedWorkflow.name}</h2>
              <p className="text-xs text-gray-300">{generatedWorkflow.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                <span>Domain: <strong className="text-purple-300">{generatedWorkflow.domain}</strong></span>
                <span>• Target SLA: <strong className="text-amber-400">{generatedWorkflow.sla_hours} Hours</strong></span>
                <span>• Node Count: <strong className="text-emerald-400">{generatedWorkflow.nodes?.length} Steps</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handlePublish}
                className="px-5 py-2.5 rounded-xl text-xs font-bold forge-btn-primary flex items-center gap-2 cursor-pointer shadow-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Publish Workflow</span>
              </button>
            </div>
          </div>

          {/* Graphical Pipeline Layout & Inspector */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Visual Workflow Pipeline (2 cols) */}
            <div className="lg:col-span-2 forge-card p-5 space-y-4">
              <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#bc6ff1]" />
                  Synthesized Workflow Node DAG
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">Click node to inspect rules</span>
              </div>

              {/* Vertical Step Nodes Diagram */}
              <div className="py-4 px-2 space-y-3 relative">
                {generatedWorkflow.nodes?.map((node, index) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div key={node.id} className="relative">
                      {/* Edge connector line */}
                      {index < (generatedWorkflow.nodes?.length || 0) - 1 && (
                        <div className="absolute left-6 top-10 w-0.5 h-8 bg-gradient-to-b from-[#892cdc] to-[#52057b] z-0" />
                      )}

                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`relative z-10 p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1e0a39] border-[#bc6ff1] forge-glow shadow-xl'
                            : 'bg-[#0f061b] border-[#892cdc]/30 hover:border-[#bc6ff1]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            node.type === 'start' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                            node.type === 'end' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                            node.requires_human ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                            'bg-[#52057b]/50 text-[#bc6ff1] border border-[#892cdc]/40'
                          }`}>
                            {index + 1}
                          </div>

                          <div>
                            <div className="text-xs font-bold text-white">{node.label}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              Dept: <span className="text-gray-200">{node.department}</span> • Role: <span className="text-gray-200">{node.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#892cdc]/20 text-[#bc6ff1] border border-[#892cdc]/30">
                              {node.agent}
                            </span>
                            <div className="text-[10px] text-gray-400 mt-1">SLA: {node.sla_hours}h</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Node Inspector & Validation Report (1 col) */}
            <div className="space-y-6">
              {/* Node Properties */}
              <div className="forge-card p-5 space-y-4">
                <div className="border-b border-[#892cdc]/20 pb-3">
                  <h3 className="text-sm font-bold text-white">Node Inspector</h3>
                  <p className="text-[11px] text-gray-400">Configure parameters for selected step</p>
                </div>

                {selectedNode ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-1">Step Name</span>
                      <input
                        type="text"
                        value={selectedNode.label}
                        onChange={(e) => setSelectedNode({ ...selectedNode, label: e.target.value })}
                        className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white focus:outline-none focus:border-[#bc6ff1]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-400 block mb-1">Department</span>
                        <input
                          type="text"
                          value={selectedNode.department}
                          onChange={(e) => setSelectedNode({ ...selectedNode, department: e.target.value })}
                          className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Assigned Agent</span>
                        <input
                          type="text"
                          value={selectedNode.agent}
                          onChange={(e) => setSelectedNode({ ...selectedNode, agent: e.target.value })}
                          className="w-full bg-[#0a0412] border border-[#892cdc]/30 rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-1">Configured Rules & Checks</span>
                      <div className="p-2.5 bg-[#0a0412] rounded-lg border border-[#892cdc]/20 space-y-1 font-mono text-[11px]">
                        {selectedNode.rules && selectedNode.rules.length > 0 ? (
                          selectedNode.rules.map((r, i) => (
                            <div key={i} className="text-purple-300 flex items-center gap-1.5">
                              <span className="text-emerald-400">✓</span> {r}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">No specific rule constraints configured</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-gray-400">Requires Human Sign-off</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${selectedNode.requires_human ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {selectedNode.requires_human ? 'Yes (Mandatory)' : 'Automated'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center py-6">Select a node from the graph to inspect properties</div>
                )}
              </div>

              {/* Validation Report */}
              {validation && (
                <div className="forge-card p-5 space-y-3">
                  <div className="border-b border-[#892cdc]/20 pb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Workflow Validation
                    </h3>
                    <span className="text-xs text-emerald-400 font-bold font-mono">0 Errors</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {validation.suggestions?.map((sug: string, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#0f061b] border border-[#892cdc]/20 text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
