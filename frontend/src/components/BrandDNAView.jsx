import React from 'react';
import { Type, Palette, MessageSquare, Target, Eye, Activity } from 'lucide-react';

export default function BrandDNAView({ dna }) {
  // Safe parse JSON fields
  const safeParse = (str, fallback) => {
    try { return typeof str === 'string' ? JSON.parse(str) : str; } 
    catch (e) { return fallback; }
  };

  const colors = safeParse(dna.colors, []);
  const fonts = safeParse(dna.fonts, []);
  const toneDescriptors = safeParse(dna.tone_descriptors, []);
  const messagingPillars = safeParse(dna.messaging_pillars, []);

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between border-b border-orange-900/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Extraction Complete
          </div>
          <h2 className="text-3xl font-extrabold text-stone-100 mb-1 uppercase tracking-widest drop-shadow-sm">Brand Memory Core</h2>
          <p className="text-stone-500 font-mono text-sm tracking-widest uppercase">Target Entity: {dna.brand_name || dna.url}</p>
        </div>
        {dna.screenshot_path && (
          <a href={`http://localhost:5000/uploads/${dna.screenshot_path}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-orange-400 hover:text-white text-xs font-bold font-mono tracking-widest uppercase border border-orange-500/30 hover:border-orange-400 bg-orange-500/5 px-6 py-3 rounded-xl transition-all hover:bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <Eye size={16} /> View Source Render
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors Card */}
        <div className="bg-[#0a0604]/80 backdrop-blur-md border border-orange-900/30 rounded-2xl p-8 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-3 mb-8 text-stone-100 font-bold uppercase tracking-widest text-sm relative z-10">
            <Palette className="text-orange-400" size={20} /> Chromatic Spectrum
          </div>
          <div className="flex flex-wrap gap-6 relative z-10">
            {colors.length > 0 ? colors.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center group/color">
                <div 
                  className="w-16 h-16 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.3),0_0_20px_rgba(0,0,0,0.8)] border-2 border-[#0a0604] mb-3 transition-transform duration-300 group-hover/color:scale-110"
                  style={{ backgroundColor: color.hex, boxShadow: `0 0 20px ${color.hex}40` }}
                  title={color.label}
                />
                <span className="text-[10px] text-stone-400 uppercase font-mono tracking-widest">{color.hex}</span>
                <span className="text-[9px] text-stone-600 font-mono tracking-widest uppercase mt-1">{color.label}</span>
              </div>
            )) : <span className="text-sm text-stone-600 font-mono tracking-widest uppercase">No spectrum detected.</span>}
          </div>
        </div>

        {/* Fonts Card */}
        <div className="bg-[#0a0604]/80 backdrop-blur-md border border-orange-900/30 rounded-2xl p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-3 mb-8 text-stone-100 font-bold uppercase tracking-widest text-sm relative z-10">
            <Type className="text-amber-400" size={20} /> Typographic Signatures
          </div>
          <div className="space-y-4 relative z-10">
            {fonts.length > 0 ? fonts.map((font, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.01] rounded-xl border border-orange-900/20 hover:border-amber-500/30 transition-colors">
                <span className="text-stone-200 truncate text-lg font-light" style={{ fontFamily: font }}>{font.replace(/['"]/g, '')}</span>
                <span className="text-[10px] font-mono tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md uppercase">Primary</span>
              </div>
            )) : <span className="text-sm text-stone-600 font-mono tracking-widest uppercase">No fonts detected.</span>}
          </div>
        </div>

        {/* Tone & Voice Card */}
        <div className="bg-[#0a0604]/80 backdrop-blur-md border border-orange-900/30 rounded-2xl p-8 lg:col-span-2 relative overflow-hidden shadow-lg">
          <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-rose-500/5 blur-[100px] rounded-full transform -rotate-45"></div>
          
          <div className="flex flex-col md:flex-row gap-12 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6 text-stone-100 font-bold uppercase tracking-widest text-sm">
                <MessageSquare className="text-rose-400" size={20} /> Semantic Tone
              </div>
              <div className="mb-8 p-6 bg-white/[0.01] border border-orange-900/20 rounded-xl border-l-4 border-l-rose-500 relative">
                <Activity size={100} className="absolute right-[-20px] bottom-[-20px] text-rose-500/5" />
                <p className="text-lg text-stone-300 italic font-serif leading-relaxed font-light">"{dna.vocabulary_style}"</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {toneDescriptors.map((tone, idx) => (
                  <span key={idx} className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                    {tone}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 border-t md:border-t-0 md:border-l border-orange-900/20 pt-8 md:pt-0 md:pl-12">
              <div className="flex items-center gap-3 mb-6 text-stone-100 font-bold uppercase tracking-widest text-sm">
                <Target className="text-orange-400" size={20} /> Core Directives
              </div>
              <ul className="space-y-4">
                {messagingPillars.map((pillar, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-orange-900/20 group hover:border-orange-500/30 transition-colors">
                    <div className="w-6 h-6 rounded bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-[#0a0604] transition-colors">
                      {idx + 1}
                    </div>
                    <span className="text-stone-300 leading-relaxed text-sm font-light">{pillar}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Style Summary */}
      <div className="bg-gradient-to-r from-orange-900/20 to-transparent border-l-2 border-orange-500 p-8 rounded-r-2xl relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-3 mb-4 text-stone-100 font-bold uppercase tracking-widest text-sm relative z-10">
           <Eye className="text-orange-400" size={20} /> Aesthetic Vector
        </div>
        <p className="text-lg text-stone-300 relative z-10 leading-relaxed max-w-4xl font-light">{dna.visual_style || "No specific visual cues extracted from text."}</p>
      </div>
    </div>
  );
}
