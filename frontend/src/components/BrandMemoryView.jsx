import React from 'react';
import { Target, Eye, Mic, Diamond, AlertTriangle, RefreshCw, Edit3, PenTool, Sparkles, Users, Key, Ban, Palette, Type, MousePointerClick } from 'lucide-react';

const brandMemories = {
  "Acme Corporation": {
    confidence: 94,
    status: "Excellent",
    coverage: "13/13",
    lastUpdated: "2 hrs ago",
    missing: "1 item",
    missingItem: "Brand Guidelines PDF",
    mission: "To democratize access to enterprise-grade AI tools that empower every brand to compete with intelligence, clarity, and confidence in the digital age.",
    vision: "A world where every brand can authentically represent itself across all channels, protected and amplified by AI that understands its unique identity.",
    usp: "The only AI platform that creates a living digital twin of your brand identity, enabling real-time optimization.",
    voice: "Professional yet approachable. Authoritative without being arrogant. We speak like trusted advisors.",
    writingStyle: "Active voice. Short sentences. Data-backed claims. We avoid jargon and always lead with value. Every piece of content serves a purpose.",
    personality: "Innovative, Trustworthy, Empowering, Sophisticated, Human-first. We balance technical excellence with genuine warmth.",
    targetAudience: "CMOs and Brand Directors at mid-to-large enterprises (500-10,000 employees). Tech-forward, data-driven marketing professionals who understand the value of brand consistency.",
    keywords: ["intelligent", "protected", "authentic", "consistent", "evolved", "trusted", "powerful", "seamless", "AI-first", "enterprise-ready"],
    avoidWords: ["cheap", "complicated", "difficult", "impossible", "broken", "average", "mediocre", "slow", "old-fashioned"],
    colors: [
      { label: "Primary", hex: "#4F46E5" },
      { label: "Secondary", hex: "#7C3AED" },
      { label: "Success", hex: "#10B981" },
      { label: "Warning", hex: "#F59E0B" },
      { label: "Danger", hex: "#EF4444" },
      { label: "Neutral", hex: "#94A3B8" }
    ],
    typography: "Primary: Inter (sans-serif) for body and UI. Secondary: Outfit (sans-serif) for headings and display text. Weight: 400 for body, 700 for headings.",
    ctaStyle: "Action-oriented, benefit-focused. Lead with the outcome, not the action. 'Protect Your Brand' rather than 'Click Here'."
  },
  "Cyberdyne Systems": {
    confidence: 88,
    status: "Strong",
    coverage: "11/13",
    lastUpdated: "5 hrs ago",
    missing: "2 items",
    missingItem: "Tone of Voice Document",
    mission: "To revolutionize human-computer interaction through advanced neural net processing.",
    vision: "A safer, more efficient world automated by intelligent systems.",
    usp: "Pioneering the world's most advanced learning computer systems.",
    voice: "Clinical, precise, and highly authoritative. Zero emotional fluff.",
    writingStyle: "Passive voice acceptable. Highly technical. Data absolute. Zero ambiguity.",
    personality: "Robotic, Infallible, Calculated, Superior, Deterministic.",
    targetAudience: "Government Defense Agencies, Advanced Robotics Researchers, Global Security Coalitions.",
    keywords: ["autonomous", "superior", "calculated", "skynet", "inevitable", "efficient", "flawless"],
    avoidWords: ["maybe", "perhaps", "human-error", "feelings", "guess", "uncertain"],
    colors: [
      { label: "Primary", hex: "#000000" },
      { label: "Secondary", hex: "#1A1A1A" },
      { label: "Accent", hex: "#FF0000" },
      { label: "Steel", hex: "#64748B" }
    ],
    typography: "Monospace strictly. Roboto Mono for all data displays.",
    ctaStyle: "Direct commands. 'Initiate sequence', 'Terminate process'."
  },
  "Stark Industries": {
    confidence: 98,
    status: "Optimal",
    coverage: "13/13",
    lastUpdated: "10 mins ago",
    missing: "0 items",
    missingItem: null,
    mission: "To secure the future through unparalleled technological innovation.",
    vision: "Global security and unlimited clean energy for all mankind.",
    usp: "The world leader in advanced repulsor technology and clean energy.",
    voice: "Confident, slightly arrogant, witty, and visionary.",
    writingStyle: "Punchy, charismatic, and visionary. Use rhetorical questions. Emphasize legacy and future simultaneously.",
    personality: "Genius, Billionaire, Playboy, Philanthropist. Bold and uncompromising.",
    targetAudience: "Global Defense Organizations, Clean Energy Coalitions, Aerospace Engineers.",
    keywords: ["revolutionary", "legacy", "clean energy", "advanced", "repulsor", "iron", "superior"],
    avoidWords: ["impossible", "standard", "average", "weapon", "compromise"],
    colors: [
      { label: "Hot Rod Red", hex: "#DC2626" },
      { label: "Gold Titanium", hex: "#EAB308" },
      { label: "Arc Blue", hex: "#06B6D4" },
      { label: "Matte Black", hex: "#171717" }
    ],
    typography: "Sleek, modern geometric sans-serif. Use uppercase for heavy emphasis.",
    ctaStyle: "Bold, confident invitations. 'Upgrade the Future', 'Engage'."
  }
};

const CardHeader = ({ icon: Icon, title, iconClass }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2 font-bold text-theme-text-primary text-sm">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass}`}>
        <Icon size={16} />
      </div>
      {title}
    </div>
    <button className="p-1.5 rounded border border-theme-border text-theme-text-secondary hover:text-theme-text-primary flex flex-col items-center justify-center text-[9px] gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <Edit3 size={12} /> Edit
    </button>
  </div>
);

export default function BrandMemoryView({ selectedCompany }) {
  const memory = brandMemories[selectedCompany] || brandMemories["Acme Corporation"];
  
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (memory.confidence / 100) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-theme-text-secondary font-medium mb-1">
            Brand Intelligence · Digital Twin
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Brand Memory</h1>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#6348f2] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[#523ad9] transition-colors shadow-md">
          <RefreshCw size={15} /> Update Brand Memory
        </button>
      </div>

      {/* Hero Confidence Card */}
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
              Your brand digital twin has comprehensive coverage across all identity dimensions
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-10 mt-6 md:mt-0 text-center">
            <div>
              <div className="text-[#4ade80] font-bold text-xl mb-1">{memory.coverage}</div>
              <div className="text-[#a59ce0] text-[10px] uppercase font-bold tracking-wider">Identity Coverage</div>
            </div>
            <div>
              <div className="text-white font-bold text-xl mb-1">{memory.lastUpdated}</div>
              <div className="text-[#a59ce0] text-[10px] uppercase font-bold tracking-wider">Last Updated</div>
            </div>
            <div>
              <div className="text-[#fbbf24] font-bold text-xl mb-1">{memory.missing}</div>
              <div className="text-[#a59ce0] text-[10px] uppercase font-bold tracking-wider">Missing Assets</div>
            </div>
          </div>
        </div>
      </div>

      {memory.missingItem && (
        <div className="bg-[#fefce8] border border-[#fef08a] dark:bg-amber-500/10 dark:border-amber-500/20 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <AlertTriangle size={16} />
            Missing: {memory.missingItem}
          </div>
          <button className="px-4 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
            Upload Now
          </button>
        </div>
      )}

      {/* Grid Cards */}
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
          <CardHeader icon={PenTool} title="Writing Style" iconClass="bg-orange-100 dark:bg-orange-500/20 text-orange-500" />
          <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.writingStyle}</p>
        </div>

        <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <CardHeader icon={Sparkles} title="Brand Personality" iconClass="bg-amber-100 dark:bg-amber-500/20 text-amber-500" />
          <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.personality}</p>
        </div>

        <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <CardHeader icon={Users} title="Target Audience" iconClass="bg-purple-100 dark:bg-purple-500/20 text-purple-500" />
          <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.targetAudience}</p>
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

        <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <CardHeader icon={MousePointerClick} title="CTA Style" iconClass="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500" />
          <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{memory.ctaStyle}</p>
        </div>

      </div>
    </div>
  );
}
