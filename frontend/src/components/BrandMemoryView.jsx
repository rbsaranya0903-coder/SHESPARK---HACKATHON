import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Eye, Mic, Diamond, AlertTriangle, RefreshCw, Edit3, PenTool, Sparkles, Users, Key, Ban, Palette, Type, Save, Briefcase, Link, Crosshair } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const mockBrandMemory = {
  confidence: 94,
  status: "Excellent",
  coverage: "13/13",
  lastUpdated: "2 hrs ago",
  missingItem: null,
  mission: "To democratize access to enterprise-grade AI tools.",
  vision: "A world where every brand can authentically represent itself.",
  usp: "The only AI platform that creates a living digital twin.",
  voice: "Professional yet approachable.",
  writingStyle: "Active voice. Short sentences. Data-backed claims.",
  personality: "Innovative, Trustworthy, Empowering.",
  keywords: ["intelligent", "protected", "authentic"],
  avoidWords: ["cheap", "complicated"],
  colors: [
    { label: "Primary", hex: "#4F46E5" },
    { label: "Secondary", hex: "#7C3AED" },
    { label: "Accent", hex: "#10B981" }
  ],
  typography: "Primary: Inter. Secondary: Outfit."
};

const CardHeader = ({ icon: Icon, title, iconClass }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2 font-bold text-theme-text-primary text-sm">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass}`}>
        <Icon size={16} />
      </div>
      {title}
    </div>
  </div>
);

export default function BrandMemoryView({ selectedCompany }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    industry: '',
    target_audience: '',
    competitors: '',
    social_links: '',
    mission: '',
    vision: '',
    usp: '',
    voice: '',
    keywords: '',
    avoidWords: '',
    typography: ''
  });
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  const safeParse = (str) => {
    try {
      if (!str) return [];
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? Object.values(parsed) : []);
    } catch (e) {
      return [];
    }
  };

  const safeParseObj = (str) => {
    try {
      if (!str) return {};
      return JSON.parse(str) || {};
    } catch (e) {
      return {};
    }
  };

  useEffect(() => {
    if (userId && selectedCompany) {
      axios.get(`${API_URL}/onboarding/${userId}`).then(res => {
        if (res.data.profile) {
          const p = res.data.profile;
          const details = safeParseObj(p.brand_details);
          setProfile({ ...p, brand_details_obj: details });
          
          setEditForm({
            industry: p.industry || '',
            target_audience: p.target_audience || '',
            competitors: safeParse(p.competitors).join(', '),
            social_links: safeParse(p.social_links).join(', '),
            mission: details.mission || '',
            vision: details.vision || '',
            usp: details.brand_usp || '',
            voice: safeParse(details.selected_voices).join(', ') || '',
            keywords: details.words_to_use || '',
            avoidWords: details.words_to_avoid || '',
            typography: details.typography || ''
          });
        }
      }).catch(err => console.error(err));
    }
  }, [userId, selectedCompany]);

  const handleSave = async () => {
    try {
      const dataToSave = {
        industry: editForm.industry,
        target_audience: editForm.target_audience,
        competitors: editForm.competitors.split(',').map(s => s.trim()).filter(Boolean),
        social_links: editForm.social_links.split(',').map(s => s.trim()).filter(Boolean),
        brand_details: {
          ...(profile?.brand_details_obj || {}),
          mission: editForm.mission,
          vision: editForm.vision,
          brand_usp: editForm.usp,
          selected_voices: editForm.voice.split(',').map(s => s.trim()).filter(Boolean),
          words_to_use: editForm.keywords,
          words_to_avoid: editForm.avoidWords,
          typography: editForm.typography
        }
      };
      
      await axios.post(`${API_URL}/onboarding/${userId}/step`, {
        step: profile?.onboarding_step || 6,
        data: dataToSave
      });
      
      setProfile({
        ...profile,
        industry: dataToSave.industry,
        target_audience: dataToSave.target_audience,
        competitors: JSON.stringify(dataToSave.competitors),
        social_links: JSON.stringify(dataToSave.social_links),
        brand_details_obj: dataToSave.brand_details,
        brand_details: JSON.stringify(dataToSave.brand_details)
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const details = profile?.brand_details_obj || {};
  
  // Construct the active memory object dynamically from profile, falling back to mock data
  const memory = {
    confidence: profile ? 98 : mockBrandMemory.confidence,
    status: profile ? "Optimal" : mockBrandMemory.status,
    coverage: profile ? "100%" : mockBrandMemory.coverage,
    lastUpdated: profile ? "Just now" : mockBrandMemory.lastUpdated,
    missingItem: null,
    mission: details.mission || mockBrandMemory.mission,
    vision: details.vision || mockBrandMemory.vision,
    usp: details.brand_usp || mockBrandMemory.usp,
    voice: (safeParse(details.selected_voices).length > 0 ? safeParse(details.selected_voices).join(', ') : mockBrandMemory.voice),
    personality: "Derived from user input",
    keywords: details.words_to_use ? details.words_to_use.split(',').map(s=>s.trim()) : mockBrandMemory.keywords,
    avoidWords: details.words_to_avoid ? details.words_to_avoid.split(',').map(s=>s.trim()) : mockBrandMemory.avoidWords,
    colors: details.colors ? [
      { label: "Primary", hex: details.colors.primary || "#000000" },
      { label: "Secondary", hex: details.colors.secondary || "#000000" },
      { label: "Accent", hex: details.colors.accent || "#000000" }
    ] : mockBrandMemory.colors,
    typography: details.typography || mockBrandMemory.typography
  };

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (memory.confidence / 100) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-theme-text-secondary font-medium mb-1">
            Brand Intelligence · Digital Twin
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Brand Memory</h1>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-xl bg-theme-accent-primary text-white font-semibold text-sm flex items-center gap-2 hover:bg-theme-accent-hover transition-colors shadow-md"
          >
            <Edit3 size={15} /> Edit Entire DNA
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl bg-theme-input text-theme-text-primary font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-theme-success-text text-white font-semibold text-sm flex items-center gap-2 shadow-md"
            >
              <Save size={15} /> Save All Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#24215f] rounded-2xl p-8 relative overflow-hidden text-white shadow-xl">
        <div className="absolute right-[-10%] top-0 w-1/2 h-full bg-gradient-to-l from-[#4b35bc] to-transparent opacity-80 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-[30%] h-full bg-gradient-to-l from-[#6145ef]/60 to-transparent blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={radius} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="6" fill="transparent" />
              <circle cx="40" cy="40" r={radius} stroke="#d1c4e9" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
              {memory.confidence}%
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-[#a59ce0] text-sm font-semibold mb-1">Brand Memory Confidence</h4>
            <h2 className="text-3xl font-bold mb-2">{memory.status}</h2>
            <p className="text-[#c1b5ea] text-sm max-w-lg">
              Your brand digital twin is actively learning from your ongoing evaluations.
            </p>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-theme-text-primary border-b border-theme-border-subtle pb-4">Edit Core Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Industry</label>
              <input type="text" value={editForm.industry} onChange={e => setEditForm({...editForm, industry: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Target Audience</label>
              <input type="text" value={editForm.target_audience} onChange={e => setEditForm({...editForm, target_audience: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Competitors (comma separated)</label>
              <input type="text" value={editForm.competitors} onChange={e => setEditForm({...editForm, competitors: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Social Links (comma separated)</label>
              <input type="text" value={editForm.social_links} onChange={e => setEditForm({...editForm, social_links: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-theme-text-primary border-b border-theme-border-subtle pb-4 mt-8">Edit Strategic Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Mission</label>
              <textarea value={editForm.mission} onChange={e => setEditForm({...editForm, mission: e.target.value})} className="w-full h-24 bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Vision</label>
              <textarea value={editForm.vision} onChange={e => setEditForm({...editForm, vision: e.target.value})} className="w-full h-24 bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Unique Selling Proposition (USP)</label>
              <textarea value={editForm.usp} onChange={e => setEditForm({...editForm, usp: e.target.value})} className="w-full h-24 bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Brand Voice (comma separated)</label>
              <textarea value={editForm.voice} onChange={e => setEditForm({...editForm, voice: e.target.value})} className="w-full h-24 bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-theme-text-primary border-b border-theme-border-subtle pb-4 mt-8">Edit Style & Keywords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Keywords to Use (comma separated)</label>
              <input type="text" value={editForm.keywords} onChange={e => setEditForm({...editForm, keywords: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Words to Avoid (comma separated)</label>
              <input type="text" value={editForm.avoidWords} onChange={e => setEditForm({...editForm, avoidWords: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-theme-text-secondary uppercase">Typography Guidelines</label>
              <input type="text" value={editForm.typography} onChange={e => setEditForm({...editForm, typography: e.target.value})} className="w-full bg-theme-input border border-theme-border rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Target} title="Mission" iconClass="bg-rose-100 dark:bg-rose-500/20 text-rose-500" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.mission}</p>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Eye} title="Vision" iconClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.vision}</p>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Diamond} title="Unique Selling Proposition" iconClass="bg-blue-100 dark:bg-blue-500/20 text-blue-500" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.usp}</p>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Mic} title="Brand Voice" iconClass="bg-slate-200 dark:bg-slate-600/40 text-slate-600 dark:text-slate-300" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.voice}</p>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Users} title="Target Audience" iconClass="bg-purple-100 dark:bg-purple-500/20 text-purple-500" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{profile?.target_audience || 'Not specified'}</p>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Briefcase} title="Industry" iconClass="bg-orange-100 dark:bg-orange-500/20 text-orange-500" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{profile?.industry || 'Not specified'}</p>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Key} title="Keywords to Use" iconClass="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500" />
            <div className="flex flex-wrap gap-2">
              {memory.keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 text-xs font-semibold">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Ban} title="Words to Avoid" iconClass="bg-rose-100 dark:bg-rose-500/20 text-rose-500" />
            <div className="flex flex-wrap gap-2">
              {memory.avoidWords.map((word, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 text-xs font-semibold flex items-center gap-1">
                  <span className="text-[10px]">✕</span> {word}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Palette} title="Brand Colors" iconClass="bg-pink-100 dark:bg-pink-500/20 text-pink-500" />
            <div className="flex flex-wrap gap-4">
              {memory.colors.map((color, i) => (
                <div key={i} className="flex flex-col gap-1 items-center">
                  <div 
                    className="w-12 h-12 rounded-lg border border-theme-border-subtle shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  />
                  <div className="text-[10px] text-theme-text-secondary text-center">
                    <div className="font-semibold">{color.label}</div>
                    <div className="font-mono opacity-80 uppercase">{color.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader icon={Type} title="Typography" iconClass="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" />
            <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.typography}</p>
          </div>
        </div>
      )}
    </div>
  );
}
