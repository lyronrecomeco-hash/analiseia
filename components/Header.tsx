
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 border-b border-white/10 bg-slate-950/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 accent-gradient rounded-lg flex items-center justify-center glow">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SitePrint <span className="text-blue-500">AI</span></h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Architect Engine</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#" className="hover:text-white transition-colors">Casos de Uso</a>
          <a href="#" className="hover:text-white transition-colors">Preços</a>
        </nav>
        <button className="px-4 py-2 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors">
          Entrar
        </button>
      </div>
    </header>
  );
};

export default Header;
