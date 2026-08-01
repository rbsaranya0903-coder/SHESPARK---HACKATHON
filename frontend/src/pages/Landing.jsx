import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Cpu, Target, Eye, Shield, Activity, ChevronRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0604] text-stone-300 font-sans overflow-x-hidden selection:bg-orange-500/30">
      
      {/* Background Effects - Elegant Copper/Orange */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900/20 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d977060a_1px,transparent_1px),linear-gradient(to_bottom,#d977060a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-orange-900/20 bg-[#0a0604]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center rounded-xl font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-100 to-orange-400 text-xl tracking-widest uppercase">
              BrandSphere AI
            </span>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => navigate('/login')} className="text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-orange-400 transition-colors">
                System Access
             </button>
             <button onClick={() => navigate('/login')} className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-100 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                Initialize Entity
             </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono mb-8 uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.1)]">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              v1.0.4-beta Deployed
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter leading-tight drop-shadow-sm">
              Extract Visual DNA. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-rose-500">
                Dominate the Grid.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              BrandSphere AI deploys advanced neural networks to scrape, analyze, and codify your brand's core identity. Extract typography, chromatic spectrums, and semantic tone from any domain in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => navigate('/login')} className="relative group bg-orange-500 text-[#0a0604] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.3)] border border-orange-400/50">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-[#0a0604] transition-colors duration-500">
                  Deploy Scrapers <ChevronRight size={18} />
                </span>
              </button>
              <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth'})} className="px-8 py-4 rounded-xl font-mono uppercase tracking-widest text-xs text-stone-400 hover:text-orange-200 border border-orange-900/30 hover:bg-orange-900/20 transition-all">
                View Architecture
              </button>
            </div>
          </div>
        </section>

        {/* System Overview / Features */}
        <section className="py-24 px-6 border-t border-orange-900/20 bg-[#0a0604]/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-3xl font-bold text-stone-100 uppercase tracking-widest mb-4">Core Capabilities</h2>
               <p className="text-orange-700 font-mono text-sm tracking-widest uppercase">System Architecture Overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/[0.01] border border-orange-900/30 p-10 rounded-3xl relative overflow-hidden group hover:border-orange-500/50 transition-colors duration-500 shadow-lg">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full group-hover:bg-orange-500/20 transition-colors"></div>
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-[inset_0_0_15px_rgba(249,115,22,0.2)]">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-bold text-stone-100 mb-4 tracking-wide relative z-10">Brand DNA Extraction</h3>
                <p className="text-stone-400 leading-relaxed relative z-10 font-light">
                  Input any URL. Our headless cluster infiltrates the DOM to extract exact computed typography, dynamic visual styles, and pixel-perfect chromatic spectrums.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/[0.01] border border-orange-900/30 p-10 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-colors duration-500 shadow-lg">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-colors"></div>
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold text-stone-100 mb-4 tracking-wide relative z-10">Semantic LLM Analysis</h3>
                <p className="text-stone-400 leading-relaxed relative z-10 font-light">
                  Raw textual payloads are piped into advanced Language Models to synthesize your precise communication tone, vocabulary algorithms, and messaging pillars.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/[0.01] border border-orange-900/30 p-10 rounded-3xl relative overflow-hidden group hover:border-rose-500/50 transition-colors duration-500 shadow-lg">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 blur-3xl rounded-full group-hover:bg-rose-500/20 transition-colors"></div>
                <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-[inset_0_0_15px_rgba(244,63,94,0.2)]">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-stone-100 mb-4 tracking-wide relative z-10">Competitor Threat Radar</h3>
                <p className="text-stone-400 leading-relaxed relative z-10 font-light">
                  Monitor rival entities. Compare brand matrices side-by-side to identify semantic gaps, visual anomalies, and strategic audience vectors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 relative overflow-hidden border-t border-orange-900/20">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-900/10 z-0"></div>
           <div className="max-w-4xl mx-auto text-center relative z-10 bg-[#0a0604]/80 backdrop-blur-xl border border-orange-900/40 p-16 rounded-3xl shadow-[0_0_50px_rgba(249,115,22,0.1)]">
             <Shield size={48} className="text-orange-500 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
             <h2 className="text-4xl font-extrabold text-white mb-6 uppercase tracking-widest">Ready to initialize?</h2>
             <p className="text-stone-400 mb-10 text-lg font-light">Secure your brand's digital perimeter today.</p>
             <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-orange-400 to-orange-600 text-[#0a0604] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:from-orange-300 hover:to-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                Create Entity Account
             </button>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-900/20 bg-[#0a0604] py-8 relative z-10 text-center">
         <p className="text-[10px] font-mono text-stone-600 tracking-[0.2em] uppercase">
            © 2026 BrandSphere AI Core Systems. All protocols secured.
         </p>
      </footer>
    </div>
  );
}
