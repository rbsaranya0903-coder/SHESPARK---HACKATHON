import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, TrendingUp, AlertTriangle, Loader2, Zap, Radio, FastForward, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function OpportunityRadarView({ selectedCompany, onTriggerAction }) {
  const [loading, setLoading] = useState(false);
  const [radarData, setRadarData] = useState(null);
  const [error, setError] = useState(null);

  const fetchRadar = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/ai/opportunity-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: selectedCompany })
      });
      
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch opportunity radar data');
      }
      
      setRadarData(data);
    } catch (err) {
      console.error("API failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, [selectedCompany]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-theme-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-theme-accent-secondary text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Compass size={12} /> Market Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Opportunity Radar</h1>
          <p className="text-sm text-theme-text-secondary mt-1">Macro trend analysis and strategic pivots for <span className="font-bold text-theme-accent-primary">{selectedCompany}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchRadar}
            className="px-4 py-2 bg-theme-input border border-theme-border rounded-xl text-xs font-semibold text-theme-text-primary hover:bg-theme-border transition-colors flex items-center gap-2 shadow-sm"
          >
            <Activity size={14} /> Scan Market
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-theme-danger-bg border border-theme-danger-border text-theme-danger-text px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-theme-text-secondary border border-theme-border border-dashed rounded-2xl bg-theme-card/50">
          <Loader2 size={32} className="animate-spin text-theme-accent-secondary mb-4" />
          <p className="text-sm font-semibold text-theme-text-primary">Scanning Media Landscape...</p>
          <p className="text-xs opacity-70 mt-1">Analyzing cultural shifts and market gaps for {selectedCompany}</p>
        </div>
      ) : radarData ? (
        <div className="space-y-6">
          
          {/* Top Trends Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {radarData.trends?.map((trend, idx) => (
              <div key={idx} className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-sm hover:border-theme-border-subtle transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-theme-accent-primary/20 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-theme-accent-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-theme-text-secondary font-mono mb-1 uppercase tracking-wider">Trend Shift</div>
                  <div className="text-sm font-bold text-theme-text-primary leading-tight">{trend.name}</div>
                  <div className="mt-2 w-full h-1.5 bg-theme-border rounded-full overflow-hidden">
                    <div className="h-full bg-theme-accent-primary" style={{ width: `${trend.impact}%` }}></div>
                  </div>
                  <div className="text-[9px] text-theme-text-secondary mt-1 font-mono text-right">Impact: {trend.impact}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Timeline View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            
            {/* FOCUS: NOW */}
            <div className="bg-gradient-to-b from-theme-bg to-theme-card border border-theme-border rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Zap size={16} />
                </div>
                <h3 className="text-sm font-bold text-theme-text-primary uppercase tracking-widest">Focus: Now</h3>
              </div>
              
              <div className="space-y-4">
                {radarData.now?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-theme-input/50 border border-theme-border-subtle rounded-xl relative group">
                    <div className="w-1 h-full bg-emerald-500 absolute left-0 top-0 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h4 className="text-sm font-bold text-theme-text-primary mb-1">{item.title}</h4>
                    <p className="text-xs text-theme-text-secondary leading-relaxed mb-4">{item.description}</p>
                    <button 
                      onClick={() => onTriggerAction?.(`Draft an immediate action plan for: ${item.title}. The goal is to ${item.description}. Brand: ${selectedCompany}.`)}
                      className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      {item.action} <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FOCUS: FUTURE */}
            <div className="bg-gradient-to-b from-theme-bg to-theme-card border border-theme-border rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <FastForward size={16} />
                </div>
                <h3 className="text-sm font-bold text-theme-text-primary uppercase tracking-widest">Focus: Future</h3>
              </div>
              
              <div className="space-y-4">
                {radarData.future?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-theme-input/50 border border-theme-border-subtle rounded-xl relative group">
                    <div className="w-1 h-full bg-indigo-500 absolute left-0 top-0 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h4 className="text-sm font-bold text-theme-text-primary mb-1">{item.title}</h4>
                    <p className="text-xs text-theme-text-secondary leading-relaxed mb-4">{item.description}</p>
                    <button 
                      onClick={() => onTriggerAction?.(`Draft a long-term strategic plan to position ${selectedCompany} for the upcoming shift: ${item.title}. The goal is to ${item.description}.`)}
                      className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      {item.action} <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
}
