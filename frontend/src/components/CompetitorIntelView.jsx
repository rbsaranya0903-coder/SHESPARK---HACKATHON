import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle, Loader2, Zap, ShieldAlert, CheckCircle2, ChevronRight, Search } from 'lucide-react';

export default function CompetitorIntelView({ selectedCompany, onTriggerAction }) {
  const [competitors] = useState(['Nike', 'Adidas', 'Puma', 'Under Armour', 'Lululemon']);
  const [selectedCompetitor, setSelectedCompetitor] = useState('Nike');
  const [loading, setLoading] = useState(false);
  const [intelData, setIntelData] = useState(null);
  const [error, setError] = useState(null);

  const fetchIntel = async (competitor) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/ai/competitor-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: selectedCompany, competitor })
      });
      
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch competitor intel');
      }
      
      setIntelData(data);
    } catch (err) {
      console.error("Competitor Intel API failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically on mount or when competitor/company changes
  useEffect(() => {
    fetchIntel(selectedCompetitor);
  }, [selectedCompetitor, selectedCompany]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-theme-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-theme-accent-primary/10 border border-theme-accent-primary/20 text-theme-accent-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Target size={12} /> Strategic Intel
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Competitor Analysis</h1>
          <p className="text-sm text-theme-text-secondary mt-1">Real-time threat assessment for <span className="font-bold text-theme-accent-primary">{selectedCompany}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-secondary" />
            <select
              value={selectedCompetitor}
              onChange={(e) => setSelectedCompetitor(e.target.value)}
              className="appearance-none pl-9 pr-10 py-2.5 bg-theme-input border border-theme-border rounded-xl text-xs font-semibold text-theme-text-primary focus:outline-none focus:border-theme-accent-primary shadow-sm hover:border-theme-border-subtle transition-colors"
            >
              {competitors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-secondary pointer-events-none rotate-90" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-theme-danger-bg border border-theme-danger-border text-theme-danger-text px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-theme-text-secondary border border-theme-border border-dashed rounded-2xl bg-theme-card/50">
          <Loader2 size={32} className="animate-spin text-theme-accent-primary mb-4" />
          <p className="text-sm font-semibold text-theme-text-primary">Gathering Intelligence...</p>
          <p className="text-xs opacity-70 mt-1">Analyzing recent market moves by {selectedCompetitor}</p>
        </div>
      ) : intelData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Advancement Card */}
          <div className="lg:col-span-1 bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm hover:border-theme-border-subtle transition-colors flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Recent Advancement</h3>
                <p className="text-sm font-bold text-theme-text-primary">{selectedCompetitor}</p>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-theme-text-primary leading-tight mb-3">
                {intelData.advancementTitle}
              </h2>
              <p className="text-sm text-theme-text-secondary leading-relaxed">
                {intelData.advancementDescription}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-theme-border-subtle flex items-center justify-between text-[10px] font-mono text-theme-text-secondary">
              <span>Source: AI Market Analysis</span>
              <span>Updated: Just now</span>
            </div>
          </div>

          {/* Impact Analysis Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-theme-bg to-theme-card border border-theme-border rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {/* Threat Level Indicator */}
            <div className="absolute top-6 right-6">
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm font-bold text-xs uppercase tracking-wider ${
                intelData.threatLevel?.toLowerCase() === 'high' || intelData.threatLevel?.toLowerCase() === 'critical'
                  ? 'bg-theme-danger-bg text-theme-danger-text border-theme-danger-border'
                  : intelData.threatLevel?.toLowerCase() === 'medium'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : 'bg-theme-success-bg text-theme-success-text border-theme-success-border'
              }`}>
                {intelData.threatLevel?.toLowerCase() === 'high' || intelData.threatLevel?.toLowerCase() === 'critical' 
                  ? <ShieldAlert size={14} className="animate-pulse" /> 
                  : intelData.threatLevel?.toLowerCase() === 'medium'
                  ? <AlertTriangle size={14} />
                  : <CheckCircle2 size={14} />
                }
                Threat: {intelData.threatLevel}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-theme-accent-primary/10 text-theme-accent-primary flex items-center justify-center">
                <Zap size={16} />
              </div>
              <h3 className="text-sm font-bold text-theme-text-primary">Impact on {selectedCompany}</h3>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-theme-text-primary leading-relaxed font-medium">
                {intelData.impactAnalysis}
              </p>
            </div>

            {/* Simulated Action Items */}
            <div className="mt-8 pt-6 border-t border-theme-border-subtle">
              <h4 className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider mb-4">Recommended AI Counter-Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onClick={() => onTriggerAction?.(`Draft a response strategy and counter-campaign against ${selectedCompetitor}'s recent advancement: "${intelData?.advancementTitle}". Our brand is ${selectedCompany}.`)}
                  className="p-3 bg-theme-input hover:bg-theme-border border border-theme-border-subtle rounded-xl text-left transition-colors group"
                >
                  <div className="text-xs font-bold text-theme-text-primary group-hover:text-theme-accent-primary transition-colors">Generate Counter-Campaign</div>
                  <div className="text-[10px] text-theme-text-secondary mt-1">Draft a response strategy instantly</div>
                </button>
                <button 
                  onClick={() => onTriggerAction?.(`Analyze potential audience drift. How many of ${selectedCompany}'s customers might shift loyalty to ${selectedCompetitor} because of their new "${intelData?.advancementTitle}", and how do we retain them?`)}
                  className="p-3 bg-theme-input hover:bg-theme-border border border-theme-border-subtle rounded-xl text-left transition-colors group"
                >
                  <div className="text-xs font-bold text-theme-text-primary group-hover:text-theme-accent-primary transition-colors">Analyze Audience Drift</div>
                  <div className="text-[10px] text-theme-text-secondary mt-1">See if customers are shifting loyalty</div>
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
}
