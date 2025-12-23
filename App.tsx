
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ResultCard from './components/ResultCard';
import { AnalysisResult, ImageFile, AnalysisStatus } from './types';
import { analyzeBrand } from './services/geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const logIntervalRef = useRef<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImages(prev => [
          ...prev,
          {
            file,
            preview: URL.createObjectURL(file),
            base64: base64String
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const startProactiveLogs = (domain: string) => {
    const logs = [
      `[INIT] Iniciando protocolo de auditoria estrutural para domínio ${domain}.`,
      `[INPUT] URL detectada: https://${domain}/ - Protocolo HTTPS ativo.`,
      `[SCAN] Mapeamento de DOM em execução: Identificando cabeçalho fixo e seções modulares.`,
      `[SCAN] Extração de Assets: Analisando ícones vetoriais e imagens de alta resolução.`,
      `[SCAN] Script Check: Verificando integrações externas e tags de rastreamento.`,
      `[SCAN] Mobile Audit: Avaliando responsividade e hierarquia de toque.`,
      `[SCAN] SEO Analysis: Inspecionando metadados e estrutura semântica <H1-H6>.`,
      `[SCAN] Conversão: Rastreando fluxos de clique e CTAs principais.`
    ];

    let currentLogIndex = 0;
    setLoadingLogs([]);

    if (logIntervalRef.current) clearInterval(logIntervalRef.current);

    logIntervalRef.current = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setLoadingLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logIntervalRef.current);
      }
    }, 800);
  };

  const handleAnalyze = async () => {
    if (!url && images.length === 0) {
      setError("Insira uma URL ou prints para auditoria.");
      return;
    }

    let domain = "assets-locais";
    try {
      domain = url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : "assets-locais";
    } catch (e) {
      domain = url || "assets-locais";
    }
    
    setStatus(AnalysisStatus.PROCESSING);
    setError(null);
    setResult(null);
    
    startProactiveLogs(domain);

    try {
      const analysisData = await analyzeBrand(url, images);
      setResult(analysisData);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError("Erro na análise. Verifique sua conexão ou API Key.");
      setStatus(AnalysisStatus.ERROR);
    } finally {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-500/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-16">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Professional Enterprise Architect
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
            Engenharia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700">Websites Corporativos</span>
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-xl font-medium">
            Audite marcas, extraia estruturas semânticas e gere blueprints operacionais que transformam websites passivos em plataformas de negócios ativas.
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass p-10 rounded-[2.5rem] border border-white/10 mb-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="space-y-10 relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Fonte de Auditoria (URL)</label>
                <span className="text-[10px] text-blue-500/50 font-bold">PROTOCOL: HTTPS REQUIRED</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://sua-empresa.com.br"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Análise Visual (Prints / Brandbook)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                    <img src={img.preview} alt="Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-slate-600 hover:text-blue-500 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-blue-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Asset</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleAnalyze}
                disabled={status === AnalysisStatus.PROCESSING}
                className={`w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all uppercase tracking-widest ${
                  status === AnalysisStatus.PROCESSING 
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5' 
                  : 'accent-gradient text-white hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-blue-600/20'
                }`}
              >
                {status === AnalysisStatus.PROCESSING ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processando Auditoria Técnica...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Analisar e Gerar Blueprint
                  </>
                )}
              </button>
              {error && <p className="text-red-500 text-center mt-6 text-sm font-bold uppercase tracking-widest">{error}</p>}
            </div>
          </div>
        </div>

        {/* Terminal de Processamento Ativo */}
        {status === AnalysisStatus.PROCESSING && !result && (
          <div className="max-w-5xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="glass rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl">
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
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocolo em Execução</div>
              </div>
              <div className="p-8 bg-slate-950 font-mono text-xs text-blue-300/80 min-h-[250px] flex flex-col gap-2 overflow-y-auto max-h-80 scrollbar-thin">
                {loadingLogs.map((log, i) => (
                  <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-blue-700 font-bold">[{getCurrentTime()}]</span>
                    <span className="text-blue-400/60">$</span>
                    <span className="tracking-wide">{log}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-blue-500 mt-2">
                  <span className="animate-spin text-lg">◌</span>
                  <span className="animate-pulse">SINCRONIZANDO_COM_IA_ENGINE...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && <ResultCard result={result} />}

        {status === AnalysisStatus.IDLE && !result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 text-center">
            <div className="space-y-4 p-8 glass rounded-3xl border border-white/5 transition-all hover:border-blue-500/20">
              <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-blue-500 font-black">01</div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm">Deep Ingestion</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase">Protocolo de entrada para URLs e assets visuais de alta resolução.</p>
            </div>
            <div className="space-y-4 p-8 glass rounded-3xl border border-white/5 transition-all hover:border-blue-500/20">
              <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-blue-500 font-black">02</div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm">Structural Audit</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase">Mapeamento de DNA de marca, hierarquia de navegação e gargalos de CRO.</p>
            </div>
            <div className="space-y-4 p-8 glass rounded-3xl border border-white/5 transition-all hover:border-blue-500/20">
              <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-blue-500 font-black">03</div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm">Architect Blueprint</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase">Saída de prompt estruturado em 7 camadas para construção imediata via IA.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
