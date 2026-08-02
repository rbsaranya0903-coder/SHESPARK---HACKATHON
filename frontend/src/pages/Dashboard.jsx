import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Shield, PieChart, Image as ImageIcon, Loader2, ChevronRight, LogOut, 
  Search, Bell, Sun, Moon, Download, Activity, Target, Sparkles, Layers,
  Compass, History, FileText, Settings, ChevronDown, CheckCircle2, AlertTriangle, TrendingUp, Plus,
  MessageSquare, Send, X, Upload, ArrowRight, Radio
} from 'lucide-react';
import BrandDNAView from '../components/BrandDNAView';
import BrandMemoryView from '../components/BrandMemoryView';
import EvaluateContentView from '../components/EvaluateContentView';
import CompetitorIntelView from '../components/CompetitorIntelView';
import OpportunityRadarView from '../components/OpportunityRadarView';
import HistoryView from '../components/HistoryView';
import ReportsView from '../components/ReportsView';

const API_URL = 'http://localhost:5000/api';

// Dynamic company dataset & metrics generator based on brand name and timeframe
function getCompanyMetrics(companyName, timeframe) {
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const baseHealth = 74 + (Math.abs(hash) % 20); // 74 to 94
  const baseRecall = 68 + (Math.abs(hash >> 2) % 24);
  const baseDrift = 4 + (Math.abs(hash >> 3) % 14);
  const baseApproval = 89 + (Math.abs(hash >> 4) % 10);
  const baseOpp = 62 + (Math.abs(hash >> 5) % 28);

  const tfMultiplier = timeframe === '1M' ? 1.02 : timeframe === '3M' ? 0.97 : timeframe === '6M' ? 1.0 : 1.04;

  const health = Math.min(99, Math.round(baseHealth * tfMultiplier));
  const recall = Math.min(99, Math.round(baseRecall * tfMultiplier));
  const drift = Math.max(2, Math.round(baseDrift / tfMultiplier));
  const approval = Math.min(99, Math.round(baseApproval * tfMultiplier));
  const opp = Math.min(99, Math.round(baseOpp * tfMultiplier));

  // Dynamic timeline curve points
  const p1 = Math.max(50, health - 13);
  const p2 = Math.max(55, health - 7);
  const p3 = Math.max(50, health - 15);
  const p4 = Math.max(60, health - 6);
  const p5 = Math.max(65, health - 3);
  const p6 = health;

  const points = [p1, p2, p3, p4, p5, p6];

  const y1 = Math.round(100 - (p1 - 50) * 1.7);
  const y2 = Math.round(100 - (p2 - 50) * 1.7);
  const y3 = Math.round(100 - (p3 - 50) * 1.7);
  const y4 = Math.round(100 - (p4 - 50) * 1.7);
  const y5 = Math.round(100 - (p5 - 50) * 1.7);
  const y6 = Math.round(100 - (p6 - 50) * 1.7);

  const svgPath = `M 0,${y1} C 60,${y2} 120,${y3} 180,${y4} C 240,${y5} 270,${Math.round((y5+y6)/2)} 300,${y6} L 300,100 L 0,100 Z`;
  const strokePath = `M 0,${y1} C 60,${y2} 120,${y3} 180,${y4} C 240,${y5} 270,${Math.round((y5+y6)/2)} 300,${y6}`;

  // Dynamic 6-axis Radar coordinates
  const rVoice = Math.min(25, 10 + (Math.abs(hash) % 16));
  const rVisual = Math.min(86, 68 + (Math.abs(hash >> 1) % 18));
  const rMsg = Math.min(86, 65 + (Math.abs(hash >> 2) % 18));
  const rSEO = Math.min(88, 72 + (Math.abs(hash >> 3) % 16));
  const rSocial = Math.min(75, 55 + (Math.abs(hash >> 4) % 20));
  const rTrust = Math.min(32, 15 + (Math.abs(hash >> 5) % 18));

  const radarPoints = `50,${rVoice} 78,${rVisual} 80,68 50,${rSEO} 22,65 20,35`;

  // Dynamic evaluation scores
  const eval1 = Math.min(99, health + 7);
  const eval2 = Math.max(65, health - 9);
  const eval3 = Math.min(95, health + 1);
  const eval4 = Math.max(55, health - 25);

  const labels = timeframe === '1M' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] : 
                 timeframe === '3M' ? ['May', 'Jun', 'Jul'] : 
                 timeframe === '1Y' ? ['Q1', 'Q2', 'Q3', 'Q4'] : 
                 ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  return {
    metrics: { health, recall, drift, approval, opp },
    evaluations: [
      { name: 'Q4 Product Launch Ad', type: 'Advertisement · 2h ago', score: `${eval1}%`, status: 'Safe to Publish', statusColor: 'emerald' },
      { name: 'Instagram Story Series', type: 'Social Media · 5h ago', score: `${eval2}%`, status: 'Needs Review', statusColor: 'amber' },
      { name: 'Email Newsletter Oct', type: 'Email · 1d ago', score: `${eval3}%`, status: 'Safe to Publish', statusColor: 'emerald' },
      { name: 'Website Hero Copy', type: 'Website · 2d ago', score: `${eval4}%`, status: 'High Risk', statusColor: 'rose' }
    ],
    points,
    svgPath,
    strokePath,
    radarPoints,
    labels
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [activeTab, setActiveTab] = useState('command-center');
  const [timeframe, setTimeframe] = useState('6M');
  const [selectedCompany, setSelectedCompany] = useState('Acme Corporation');
  const [userCompanies, setUserCompanies] = useState(['Acme Corporation', 'Cyberdyne Systems', 'Stark Industries']);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [competitorName, setCompetitorName] = useState('Nike');
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // AI Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hi! I'm BrandSphere AI. I understand your complete brand identity and can help you evaluate content, generate campaigns, analyze competitors, and answer any brand strategy questions. How can I help today?"
    }
  ]);
  const chatBottomRef = useRef(null);

  const [companyUrl, setCompanyUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [companyDna, setCompanyDna] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Fetch logged in user's saved onboarding profile
    axios.get(`${API_URL}/onboarding/${user.id}`).then(res => {
      if (res.data.profile && res.data.profile.company_name) {
        const savedName = res.data.profile.company_name;
        setSelectedCompany(savedName);
        setUserCompanies(prev => Array.from(new Set([savedName, ...prev])));
      }
    }).catch(() => {});
  }, [user?.id, navigate]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAnalyzeCompany = async (e) => {
    e.preventDefault();
    if (!companyUrl) return;

    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/brand/analyze`, {
        url: companyUrl,
        type: 'company'
      });
      
      setProjectId(response.data.project_id);
      setCompanyDna(response.data.brand_dna);
      const newName = response.data.brand_dna.brand_name || 'Extracted Brand';
      setSelectedCompany(newName);
      setUserCompanies(prev => Array.from(new Set([newName, ...prev])));
      setActiveTab('brand-memory');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to analyze website.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const newMessages = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(newMessages);
    if (!textToSend) setChatInput('');

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: query,
        company: selectedCompany
      });
      setChatMessages([...newMessages, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error("Chatbot API failed:", error.message);
      setChatMessages([...newMessages, { sender: 'ai', text: `Sorry, I encountered an error: ${error.response?.data?.error || error.message}` }]);
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('command-center-report');
    if (!element) return;
    
    // Add a temporary class to fix some styling issues during PDF generation if needed,
    // though html2pdf is usually robust.
    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `${selectedCompany.replace(/\s+/g, '-').toLowerCase()}-brand-report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0604' : '#faf8f5' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    window.html2pdf().set(opt).from(element).save();
  };

  // DYNAMIC COMPUTATION OF ALL DASHBOARD METRICS & CHARTS BASED ON SELECTED BRAND + TIMEFRAME
  const currentDataset = getCompanyMetrics(selectedCompany, timeframe);
  const metrics = currentDataset.metrics;
  const evaluations = currentDataset.evaluations;

  return (
    <div className="flex h-screen bg-theme-bg text-theme-text-primary font-sans overflow-hidden relative selection:bg-orange-500/30">
      
      {/* Ambient background blur circles */}
      <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-amber-900/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d9770608_1px,transparent_1px),linear-gradient(to_bottom,#d9770608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-theme-bg/80 backdrop-blur-2xl border-r border-theme-border-subtle flex flex-col justify-between relative z-10 shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 flex items-center gap-3 border-b border-theme-border-subtle cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center rounded-xl font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-100 to-orange-400 uppercase tracking-widest text-sm drop-shadow-sm">BrandSphere</div>
              <div className="text-[9px] text-theme-accent-primary tracking-[0.2em] font-mono">BRAND INTELLIGENCE</div>
            </div>
          </div>

          {/* Interactive Logged In Company Dropdown Pill */}
          <div className="px-4 py-4 border-b border-theme-border-subtle relative">
            <button 
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="w-full bg-theme-card border border-theme-border hover:border-theme-accent-primary/40 p-3 rounded-xl flex items-center justify-between transition-colors group shadow-sm"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-theme-accent-primary font-bold text-xs flex items-center justify-center border border-theme-accent-primary/30">
                  {selectedCompany[0] || 'A'}
                </div>
                <span className="text-xs font-semibold text-theme-text-primary truncate">{selectedCompany}</span>
              </div>
              <ChevronDown size={14} className={`text-theme-text-secondary group-hover:text-theme-accent-primary transition-transform duration-300 ${isCompanyDropdownOpen ? 'rotate-180 text-theme-accent-primary' : ''}`} />
            </button>

            {/* Interactive Dropdown Menu */}
            {isCompanyDropdownOpen && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-theme-bg border border-theme-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 p-2 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] font-mono text-theme-text-secondary px-3 py-1 uppercase tracking-wider">
                  Active Brands ({userCompanies.length})
                </div>
                {userCompanies.map(comp => (
                  <button
                    key={comp}
                    onClick={() => {
                      setSelectedCompany(comp);
                      setIsCompanyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCompany === comp
                        ? 'bg-orange-500/15 text-orange-300 font-semibold'
                        : 'text-theme-text-primary hover:hover:bg-theme-input hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center text-[10px] font-bold ${selectedCompany === comp ? 'text-theme-accent-primary' : 'text-theme-text-secondary'}`}>
                        {comp[0]}
                      </div>
                      <span className="truncate">{comp}</span>
                    </div>
                    {selectedCompany === comp && <CheckCircle2 size={13} className="text-theme-accent-primary shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-theme-border-subtle pt-1 mt-1">
                  <button 
                    onClick={() => navigate('/onboarding')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-theme-accent-primary hover:bg-orange-500/10 flex items-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> Add New Brand Twin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            <SidebarItem icon={<Activity size={16} />} label="Command Center" active={activeTab === 'command-center'} onClick={() => setActiveTab('command-center')} />
            <SidebarItem icon={<Shield size={16} />} label="Brand Memory" active={activeTab === 'brand-memory'} onClick={() => setActiveTab('brand-memory')} />
            <SidebarItem icon={<Sparkles size={16} />} label="Evaluate Content" active={activeTab === 'evaluate'} onClick={() => setActiveTab('evaluate')} />

            <SidebarItem icon={<PieChart size={16} />} label="Competitor Intel" active={activeTab === 'competitors'} onClick={() => setActiveTab('competitors')} />
            <SidebarItem icon={<Compass size={16} />} label="Opportunity Radar" active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
            <SidebarItem icon={<History size={16} />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            <SidebarItem icon={<FileText size={16} />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-theme-border-subtle space-y-3">
          <div className="bg-theme-card border border-theme-border p-3.5 rounded-xl">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-theme-text-primary">Brand Health</span>
              <span className="font-mono text-theme-accent-primary font-bold">{metrics.health}%</span>
            </div>
            <div className="w-full h-1.5 bg-theme-border rounded-full overflow-hidden border border-theme-border-subtle">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                style={{ width: `${metrics.health}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button className="text-theme-text-secondary hover:text-theme-text-primary text-xs font-medium flex items-center gap-2">
              <Settings size={14} /> Settings
            </button>
            <button onClick={handleLogout} className="text-theme-text-secondary hover:text-theme-danger-text text-xs font-medium flex items-center gap-1.5">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-theme-border-subtle flex items-center justify-between px-8 bg-theme-bg/60 backdrop-blur-md">
          <div className="relative w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-text-secondary" />
            <input 
              type="text" 
              placeholder="Search anything... [⌘K]"
              className="w-full bg-theme-card border border-theme-border rounded-xl py-2 pl-10 pr-4 text-xs text-theme-text-primary placeholder-stone-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-theme-success-text/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-theme-success-text text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-theme-success-text animate-pulse"></span>
              Safe to Publish
            </div>

            <button onClick={toggleTheme} className="w-8 h-8 rounded-xl bg-theme-input border border-theme-border text-theme-text-secondary hover:text-theme-text-primary flex items-center justify-center transition-colors">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className="w-8 h-8 rounded-xl bg-theme-card border border-theme-border text-theme-text-secondary hover:text-theme-text-primary flex items-center justify-center transition-colors relative"
              >
                <Bell size={15} />
                <span className="w-2 h-2 bg-theme-accent-primary rounded-full absolute top-1.5 right-1.5 animate-pulse"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-theme-card border border-theme-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-theme-border-subtle bg-theme-bg/50">
                    <h4 className="text-xs font-bold text-theme-text-primary">Notifications</h4>
                  </div>
                  <div className="p-3 text-xs text-theme-text-secondary">
                    <div className="flex gap-2 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-accent-primary mt-1 shrink-0"></div>
                      <p>Your brand health score dropped by 4%.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform"
              >
                {user?.email?.[0]?.toUpperCase() || 'R'}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-theme-card border border-theme-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-theme-border-subtle bg-theme-bg/50">
                    <p className="text-xs text-theme-text-secondary uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="font-semibold text-theme-text-primary text-sm truncate">{user?.email || 'user@example.com'}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-theme-accent-primary/10 border border-theme-accent-primary/20 text-theme-accent-primary text-xs font-medium">
                      <Target size={12} />
                      {user?.designation || 'Brand Strategist'}
                    </div>
                  </div>
                  <div className="p-2">
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-theme-danger-text hover:bg-theme-danger-bg transition-colors text-xs font-medium flex items-center gap-2">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 pb-24">
          
          {error && (
            <div className="bg-theme-danger-bg border border-theme-danger-border text-theme-danger-text px-4 py-3 rounded-lg text-sm font-mono flex items-center gap-2 max-w-5xl mx-auto">
              <span className="w-2 h-2 bg-theme-danger-text rounded-full animate-pulse"></span> {error}
            </div>
          )}

          {activeTab === 'brand-memory' && <BrandMemoryView selectedCompany={selectedCompany} />}

          {activeTab === 'evaluate' && <EvaluateContentView selectedCompany={selectedCompany} />}

          {activeTab === 'competitors' && (
            <CompetitorIntelView 
              selectedCompany={selectedCompany} 
              onTriggerAction={(actionText) => {
                setIsChatOpen(true);
                handleSendMessage(actionText);
              }}
            />
          )}

          {activeTab === 'radar' && (
            <OpportunityRadarView 
              selectedCompany={selectedCompany} 
              onTriggerAction={(actionText) => {
                setIsChatOpen(true);
                handleSendMessage(actionText);
              }}
            />
          )}

          {activeTab === 'history' && <HistoryView selectedCompany={selectedCompany} />}
          
          {activeTab === 'reports' && <ReportsView selectedCompany={selectedCompany} />}

          {activeTab === 'command-center' && (
            <div id="command-center-report" className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
              
              {/* Header Title & Actions Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-theme-text-secondary font-mono mb-1">
                    Friday, August 1 · <span className="text-theme-accent-primary font-bold">{selectedCompany}</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Brand Command Center</h1>
                </div>

                <div className="flex items-center gap-3" data-html2canvas-ignore>
                  <button onClick={handleExportPDF} className="px-4 py-2.5 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-input text-theme-text-primary text-xs font-semibold flex items-center gap-2 transition-colors">
                    <Download size={15} /> Export Report
                  </button>
                  <button 
                    onClick={() => setActiveTab('evaluate')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-[#0a0604] font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform"
                  >
                    <Zap size={15} /> Evaluate Content
                  </button>
                </div>
              </div>

              {/* DYNAMIC 5 KPI METRICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard 
                  icon={<Shield className="text-theme-accent-primary" size={18} />}
                  label="Brand Health Score"
                  value={`${metrics.health}%`}
                  change="+3.2%"
                  tag="Excellent"
                  tagColor="emerald"
                  sparkline="M 0,20 Q 15,10 30,22 T 60,12 T 90,5"
                  sparklineColor="#f97316"
                />

                <MetricCard 
                  icon={<Target className="text-theme-accent-secondary" size={18} />}
                  label="Brand Recall Probability"
                  value={`${metrics.recall}%`}
                  change="+1.8%"
                  tag="Strong"
                  tagColor="amber"
                  sparkline="M 0,22 Q 20,15 40,25 T 70,18 T 90,8"
                  sparklineColor="#f59e0b"
                />

                <MetricCard 
                  icon={<AlertTriangle className="text-theme-accent-secondary" size={18} />}
                  label="Brand Drift Risk"
                  value={`${metrics.drift}%`}
                  change="-4.1%"
                  tag="Low Risk"
                  tagColor="amber"
                  sparkline="M 0,8 Q 25,18 50,12 T 75,22 T 90,25"
                  sparklineColor="#eab308"
                />

                <MetricCard 
                  icon={<CheckCircle2 className="text-theme-success-text" size={18} />}
                  label="AI Approval Rate"
                  value={`${metrics.approval}%`}
                  change="+2.3%"
                  tag="Excellent"
                  tagColor="emerald"
                  sparkline="M 0,25 Q 20,18 40,20 T 70,10 T 90,5"
                  sparklineColor="#10b981"
                />

                <MetricCard 
                  icon={<Sparkles className="text-theme-danger-text" size={18} />}
                  label="Opportunity Score"
                  value={`${metrics.opp}/100`}
                  change="+8"
                  tag="3 New Gaps"
                  tagColor="rose"
                  sparkline="M 0,22 Q 25,12 50,20 T 75,8 T 90,4"
                  sparklineColor="#f43f5e"
                />
              </div>

              {/* DYNAMIC MAIN CHARTS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel (2 Columns): Brand Health Timeline Area Chart */}
                <div className="lg:col-span-2 bg-theme-bg/80 backdrop-blur-md border border-theme-border rounded-2xl p-6 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-theme-text-primary">Brand Health Timeline</h3>
                      <p className="text-xs text-theme-text-secondary font-mono">6-month trend analysis for {selectedCompany}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-theme-card p-1 rounded-xl border border-theme-border">
                      {['1M', '3M', '6M', '1Y'].map(tf => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                            timeframe === tf
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-[#0a0604] shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                              : 'text-theme-text-secondary hover:text-theme-text-primary'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative h-64 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      

                      <line x1="0" y1="20" x2="300" y2="20" stroke="var(--border-color)" strokeDasharray="3 3" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="var(--border-color)" strokeDasharray="3 3" strokeWidth="0.5" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="var(--border-color)" strokeDasharray="3 3" strokeWidth="0.5" />

                      <path d={currentDataset.svgPath} fill="var(--chart-fill)" className="transition-all duration-700 ease-in-out" />
                      <path d={currentDataset.strokePath} fill="none" stroke="var(--chart-line)" strokeWidth="2.5" className="transition-all duration-700 ease-in-out" />

                      {currentDataset.points.map((pt, idx) => {
                        const stepX = 300 / (currentDataset.points.length - 1);
                        const posX = idx * stepX;
                        const posY = Math.round(100 - (pt - 50) * 1.7);
                        return (
                          <circle 
                            key={idx} 
                            cx={posX} 
                            cy={posY} 
                            r="4" 
                            className="fill-orange-400 stroke-[#0a0604] stroke-2 hover:r-6 transition-all duration-300"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-theme-text-secondary mt-4 px-1">
                    {currentDataset.labels.map(lbl => (
                      <span key={lbl}>{lbl}</span>
                    ))}
                  </div>
                </div>

                {/* Right Panel (1 Column): Competitor Radar Chart */}
                <div className="bg-theme-bg/80 backdrop-blur-md border border-theme-border rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-theme-text-primary">Competitor Radar</h3>
                        <p className="text-xs text-theme-text-secondary font-mono">{selectedCompany} vs. {competitorName}</p>
                      </div>
                      <select 
                        value={competitorName}
                        onChange={e => setCompetitorName(e.target.value)}
                        className="bg-theme-card border border-theme-border text-theme-text-primary text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                      >
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                        <option value="Puma">Puma</option>
                      </select>
                    </div>

                    <div className="relative w-48 h-48 mx-auto my-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="var(--border-color)" strokeWidth="0.5" />
                        <polygon points="50,25 72,37 72,62 50,75 28,62 28,37" fill="none" stroke="var(--border-color)" strokeWidth="0.5" />
                        <polygon points="50,38 61,44 61,56 50,62 39,56 39,44" fill="none" stroke="var(--border-color)" strokeWidth="0.5" />

                        <line x1="50" y1="50" x2="50" y2="10" stroke="var(--border-color)" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="85" y2="30" stroke="var(--border-color)" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="85" y2="70" stroke="var(--border-color)" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="50" y2="90" stroke="var(--border-color)" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="15" y2="70" stroke="var(--border-color)" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="15" y2="30" stroke="var(--border-color)" strokeWidth="0.5" />

                        <polygon 
                          points={currentDataset.radarPoints} 
                          fill="var(--radar-your-brand)" 
                          stroke="var(--chart-line)" 
                          strokeWidth="1.5"
                          className="transition-all duration-500"
                        />

                        <polygon 
                          points="50,22 70,38 72,60 50,75 28,60 30,40" 
                          fill="var(--radar-comp)" 
                          stroke="var(--radar-comp-stroke)" 
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="transition-all duration-500"
                        />
                      </svg>

                      <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-theme-text-secondary uppercase">Voice</span>
                      <span className="absolute top-6 right-0 text-[9px] font-mono text-theme-text-secondary uppercase">Visual</span>
                      <span className="absolute bottom-6 right-0 text-[9px] font-mono text-theme-text-secondary uppercase">Messaging</span>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-theme-text-secondary uppercase">SEO</span>
                      <span className="absolute bottom-6 left-0 text-[9px] font-mono text-theme-text-secondary uppercase">Social</span>
                      <span className="absolute top-6 left-0 text-[9px] font-mono text-theme-text-secondary uppercase">Trust</span>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-6 text-xs font-mono pt-4 border-t border-theme-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span className="text-theme-text-primary truncate max-w-[100px]">{selectedCompany}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-theme-danger-text"></span>
                      <span className="text-theme-text-secondary">{competitorName}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 5. 3-PANEL GRID: RECENT EVALUATIONS | COMPETITOR ALERTS | QUICK ACTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Panel 1: Recent Evaluations */}
                <div className="bg-theme-bg/80 backdrop-blur-md border border-theme-border rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-theme-text-primary">Recent Evaluations</h3>
                      <button className="text-xs text-theme-accent-primary hover:text-orange-300 font-mono flex items-center gap-1">
                        View all <ArrowRight size={12} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {evaluations.map((item, idx) => (
                        <div key={idx} className="p-3 bg-theme-card rounded-xl border border-theme-border-subtle flex items-center justify-between hover:border-theme-accent-primary/30 transition-colors">
                          <div>
                            <div className="text-xs font-semibold text-theme-text-primary">{item.name}</div>
                            <div className="text-[10px] text-theme-text-secondary font-mono mt-0.5">{item.type}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold font-mono text-theme-text-primary">{item.score}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium ${
                              item.statusColor === 'emerald' ? 'bg-theme-success-bg text-theme-success-text border border-theme-success-border' :
                              item.statusColor === 'rose' ? 'bg-theme-danger-bg text-theme-danger-text border border-theme-danger-border' :
                              'bg-amber-500/10 text-theme-accent-secondary border border-amber-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel 2: Competitor Alerts */}
                <div className="bg-theme-bg/80 backdrop-blur-md border border-theme-border rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-theme-text-primary">Competitor Alerts</h3>
                      <Radio size={14} className="text-theme-accent-primary animate-pulse" />
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-theme-card rounded-xl border border-theme-border-subtle">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-theme-accent-primary">{competitorName}</span>
                          <span className="text-[9px] text-theme-text-secondary font-mono">1h ago</span>
                        </div>
                        <p className="text-xs text-theme-text-primary">Launched sustainability campaign</p>
                      </div>

                      <div className="p-3 bg-theme-card rounded-xl border border-theme-border-subtle">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-theme-accent-secondary">Adidas</span>
                          <span className="text-[9px] text-theme-text-secondary font-mono">4h ago</span>
                        </div>
                        <p className="text-xs text-theme-text-primary">New product line announcement</p>
                      </div>

                      <div className="p-3 bg-theme-card rounded-xl border border-theme-border-subtle">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-theme-text-secondary">Puma</span>
                          <span className="text-[9px] text-theme-text-secondary font-mono">1d ago</span>
                        </div>
                        <p className="text-xs text-theme-text-primary">Partnered with influencer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Quick Actions */}
                <div className="bg-theme-bg/80 backdrop-blur-md border border-theme-border rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-theme-text-primary mb-4">Quick Actions</h3>

                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('evaluate')}
                        className="w-full p-3 bg-theme-card hover:bg-orange-500/10 rounded-xl border border-theme-border-subtle hover:border-theme-accent-primary/40 text-left transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-theme-accent-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-theme-text-primary">Upload Content</div>
                          <div className="text-[10px] text-theme-text-secondary">Evaluate new content</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('campaigns')}
                        className="w-full p-3 bg-theme-card hover:bg-amber-500/10 rounded-xl border border-theme-border-subtle hover:border-amber-500/40 text-left transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-theme-accent-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-theme-text-primary">Generate Campaign</div>
                          <div className="text-[10px] text-theme-text-secondary">AI-powered campaign</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('competitors')}
                        className="w-full p-3 bg-theme-card hover:bg-theme-danger-text/10 rounded-xl border border-theme-border-subtle hover:border-rose-500/40 text-left transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-theme-danger-text/10 text-theme-danger-text flex items-center justify-center group-hover:scale-110 transition-transform">
                          <PieChart size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-theme-text-primary">Analyze Competitors</div>
                          <div className="text-[10px] text-theme-text-secondary">Competitor insights</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('brand-memory')}
                        className="w-full p-3 bg-theme-card hover:bg-theme-success-text/10 rounded-xl border border-theme-border-subtle hover:border-emerald-500/40 text-left transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-theme-success-text/10 text-theme-success-text flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Shield size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-theme-text-primary">Update Brand Memory</div>
                          <div className="text-[10px] text-theme-text-secondary">Refine your brand twin</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* 6. ASK BRANDSPHERE INLINE BAR */}
              <div className="bg-gradient-to-r from-orange-900/20 via-black/60 to-amber-900/20 border border-theme-accent-primary/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-theme-text-primary flex items-center gap-2">
                        Ask BrandSphere
                        <span className="text-[10px] text-theme-text-secondary font-normal">— Your AI brand strategist (always on)</span>
                      </div>
                      <div className="text-[10px] text-theme-success-text font-mono flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-success-text animate-pulse"></span> Online
                      </div>
                    </div>
                  </div>

                  {/* Prompt Pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Why did my score drop?',
                      'Generate a Q4 campaign',
                      'What are competitors doing?',
                      'Suggest next month strategy'
                    ].map(pill => (
                      <button
                        key={pill}
                        onClick={() => {
                          setIsChatOpen(true);
                          handleSendMessage(pill);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card hover:bg-orange-500/10 hover:border-theme-accent-primary/40 text-theme-text-primary text-xs transition-all"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inline Input Box */}
                <div className="flex gap-3 relative z-10">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        setIsChatOpen(true);
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask anything about your brand..."
                    className="flex-1 bg-theme-input px-5 py-3.5 rounded-xl border border-theme-border focus:border-orange-500 outline-none text-theme-text-primary text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-theme-text-secondary opacity-70"
                  />
                  <button
                    onClick={() => {
                      setIsChatOpen(true);
                      handleSendMessage();
                    }}
                    className="bg-gradient-to-r from-orange-400 to-amber-500 text-[#0a0604] font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2 border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                  >
                    <Send size={14} /> Ask AI
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'brand-memory' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
              {!companyDna ? (
                <div className="text-center mt-32 text-theme-text-secondary opacity-70 flex flex-col items-center">
                  <div className="w-24 h-24 border border-dashed border-theme-border rounded-full flex items-center justify-center mb-6 bg-theme-input/50">
                    <Shield size={32} className="text-stone-700" />
                  </div>
                  <p className="font-mono uppercase tracking-widest text-sm">NO BRAND DNA FOUND IN CURRENT SESSION</p>
                  <button onClick={() => setActiveTab('command-center')} className="mt-6 text-theme-accent-primary hover:text-theme-accent-primary uppercase tracking-widest text-xs font-bold border-b border-theme-accent-primary/30 hover:border-orange-400 pb-1 transition-all">
                    Initialize scan from Command Center
                  </button>
                </div>
              ) : (
                <BrandDNAView dna={companyDna} />
              )}
            </div>
          )}
          
          {activeTab !== 'command-center' && activeTab !== 'brand-memory' && (
            <div className="text-theme-text-secondary opacity-70 text-center mt-32 font-mono uppercase tracking-widest text-sm">
              Module [{activeTab}] - Active and operational.
            </div>
          )}
        </div>
      </main>

      {/* 7. FLOATING AI BRAND STRATEGIST CHATBOT MODAL */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-110 transition-transform cursor-pointer border-2 border-orange-300/40 group"
          title="Ask BrandSphere AI"
        >
          <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="w-3 h-3 bg-theme-success-text rounded-full absolute top-0 right-0 border-2 border-[#0a0604]"></span>
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-32px)] bg-theme-bg border border-theme-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
          
          {/* Chatbot Header */}
          <div className="p-4 bg-gradient-to-r from-orange-900/40 to-amber-900/30 border-b border-theme-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-theme-accent-primary border border-theme-accent-primary/30 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="font-bold text-theme-text-primary text-sm">BrandSphere AI</div>
                <div className="text-[10px] text-theme-success-text font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-theme-success-text rounded-full animate-pulse"></span> Online · Knows {selectedCompany}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-theme-text-secondary hover:text-white p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Window */}
          <div className="p-4 space-y-3 h-80 overflow-y-auto bg-theme-card text-xs">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-theme-accent-primary border border-theme-accent-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={13} />
                  </div>
                )}

                <div 
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-[#0a0604] font-semibold rounded-br-none shadow-md'
                      : 'bg-theme-border/80 border border-theme-border text-theme-text-primary rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Pills inside Chatbot */}
          <div className="p-2.5 border-t border-theme-border-subtle bg-theme-input flex flex-wrap gap-1.5">
            {[
              'Why did my score drop?',
              'Generate a campaign',
              'What are competitors doing?',
              'Improve my CTA'
            ].map(pill => (
              <button
                key={pill}
                onClick={() => handleSendMessage(pill)}
                className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-card hover:bg-orange-500/10 text-theme-text-secondary hover:text-orange-300 text-[10px] transition-all"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="p-3 border-t border-theme-border bg-theme-bg flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about your brand..."
              className="flex-1 bg-theme-input px-3.5 py-2.5 rounded-xl border border-theme-border focus:border-orange-500 outline-none text-theme-text-primary text-xs placeholder:text-theme-text-secondary opacity-70"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-gradient-to-r from-orange-400 to-amber-500 text-[#0a0604] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
        active 
          ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-theme-text-primary border border-theme-accent-primary/30 shadow-[inset_3px_0_0_rgba(249,115,22,1)]' 
          : 'text-theme-text-secondary hover:hover:bg-theme-input hover:text-theme-text-primary border border-transparent'
      }`}
    >
      <span className={`${active ? 'text-theme-accent-primary' : 'text-theme-text-secondary'}`}>{icon}</span>
      {label}
    </button>
  );
}

function MetricCard({ icon, label, value, change, tag, tagColor, sparkline, sparklineColor }) {
  return (
    <div className="bg-theme-bg/80 backdrop-blur-md border border-theme-border rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-theme-accent-primary/40 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-theme-card border border-theme-border flex items-center justify-center">
          {icon}
        </div>
        <div className="w-16 h-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 90 30">
            <path 
              d={sparkline} 
              fill="none" 
              stroke={sparklineColor} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div>
        <div className="text-2xl font-extrabold text-theme-text-primary font-mono tracking-tight mb-1">{value}</div>
        <div className="text-[11px] text-theme-text-secondary truncate mb-2">{label}</div>

        <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-theme-border-subtle">
          <span className="text-theme-success-text font-bold">{change}</span>
          <span className={`px-2 py-0.5 rounded-full ${
            tagColor === 'emerald' ? 'bg-theme-success-bg text-theme-success-text border border-theme-success-border' :
            tagColor === 'rose' ? 'bg-theme-danger-bg text-theme-danger-text border border-theme-danger-border' :
            'bg-amber-500/10 text-theme-accent-secondary border border-amber-500/20'
          }`}>
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}
