
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleLogs([]);
    let timer: any;
    result.analysisLogs.forEach((log, index) => {
      timer = setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, index * 180);
    });
    return () => clearTimeout(timer);
  }, [result]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8">
      
      {/* Terminal de Auditoria Profissional */}
      <div className="glass rounded-3xl border border-blue-500/30 overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.4)]">
        <div className="bg-[#0f172a] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/50"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="animate-pulse w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Phase 01: Structural Scanning</span>
          </div>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
          >
            {showLogs ? 'ESCONDER CONSOLE' : 'MOSTRAR CONSOLE'}
          </button>
        </div>
        {showLogs && (
          <div 
            ref={scrollRef}
            className="p-8 bg-slate-950 font-mono text-xs text-blue-300/90 h-64 overflow-y-auto scrollbar-thin selection:bg-blue-500/40"
          >
            {visibleLogs.map((log, i) => (
              <div key={i} className="mb-2 flex gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                <span className="text-blue-700 font-bold">[{getCurrentTime()}]</span>
                <span className="text-blue-400/60">$</span>
                <span className="tracking-wide">{log}</span>
              </div>
            ))}
            {visibleLogs.length < result.analysisLogs.length && (
              <div className="flex items-center gap-2 text-blue-500 mt-2">
                <span className="animate-spin text-lg">◌</span>
                <span className="animate-pulse">FINALIZANDO_ANALISE_ESTRUTURAL...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Diagnostics & Brand Identity */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-8 rounded-[2rem] border border-white/10 group">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-6">Mapeamento Genético</h3>
            <div className="space-y-2 mb-6">
              <p className="text-3xl font-black text-white tracking-tighter leading-none">{result.brandName}</p>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{result.positioning}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-8">
              {result.colors.map((color, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-white/5 p-2 rounded-xl text-center">
                  <div className="w-full aspect-square rounded-lg mb-2 shadow-inner border border-white/10" style={{ backgroundColor: color }}></div>
                  <span className="text-[9px] font-mono text-slate-500">{color.toUpperCase()}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fragilidades Identificadas</h4>
              {result.conversionBottlenecks.map((b, i) => (
                <div key={i} className="flex gap-4 items-start bg-red-500/5 border border-red-500/10 p-4 rounded-2xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <p className="text-[11px] text-red-200/70 font-medium leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              Injeção Operacional
            </h3>
            <div className="space-y-4">
              {result.missingFeatures.map((f, i) => (
                <div key={i} className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl transition-all hover:border-emerald-500/30">
                  <p className="text-white text-xs font-black mb-1 uppercase tracking-tight">{f.feature}</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed font-medium uppercase">{f.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: The Blueprint */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass rounded-[2.5rem] border border-blue-500/20 p-10 relative overflow-hidden bg-slate-900/20">
            <div className="absolute top-0 right-0 p-10">
              <button 
                onClick={handleCopy}
                className="group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-xs font-black transition-all glow active:scale-95 uppercase tracking-widest"
              >
                {copied ? 'Copiado para Área de Transferência' : 'Copiar Blueprint Master'}
                <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${copied ? 'opacity-0' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-black text-white flex items-center gap-4">
                <span className="text-blue-500">Phase 02:</span>
                Architect Blueprint
              </h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">Documento técnico estruturado em 7 camadas de ativação digital.</p>
            </div>

            <div className="relative group rounded-3xl overflow-hidden border border-white/5">
              <div className="bg-slate-950 p-10 font-mono text-[13px] leading-[1.8] text-blue-100/90 max-h-[850px] overflow-y-auto scrollbar-thin whitespace-pre-wrap selection:bg-blue-500/40 border-l-[6px] border-l-blue-600 shadow-inner">
                {result.finalPrompt}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Navegação e Estrutura Proposta</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.suggestedStructure.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-900/80 border border-white/5 p-5 rounded-2xl transition-all hover:bg-slate-800">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-[11px] font-black border border-blue-500/20">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider truncate">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
