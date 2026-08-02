import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, ChevronRight, Zap, Target, Building2, Palette, MessageSquare, Globe, Users, ShieldAlert, UploadCloud, ChevronLeft, Plus, Cpu, ChevronDown } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const INDUSTRIES = [
  "Technology & Software (SaaS)",
  "E-Commerce & Retail",
  "Healthcare & Biotechnology",
  "Financial Services & Fintech",
  "Media, Advertising & Entertainment",
  "Consumer Packaged Goods (FMCG)",
  "Education & EdTech",
  "Real Estate & Construction",
  "Automotive & Transportation",
  "Professional Services & Consulting",
  "Fashion, Beauty & Lifestyle",
  "Travel, Gaming & Hospitality",
  "Energy & Clean Tech",
  "Other"
];

const STEPS = [
  { id: 1, title: 'Company Profile', desc: 'Tell us about your organization', icon: <Building2 size={18} /> },
  { id: 2, title: 'Brand Identity', desc: 'Upload your brand assets', icon: <Palette size={18} /> },
  { id: 3, title: 'Brand Voice', desc: 'Define your communication style', icon: <MessageSquare size={18} /> },
  { id: 4, title: 'Target Audience', desc: 'Who are your customers?', icon: <Users size={18} /> },
  { id: 5, title: 'Digital Presence', desc: 'Connect your channels', icon: <Globe size={18} /> },
  { id: 6, title: 'Competitors', desc: 'Monitor your competition', icon: <ShieldAlert size={18} /> }
];

const ANALYSIS_ITEMS = [
  { id: 1, label: 'Analyzing brand guidelines', threshold: 20 },
  { id: 2, label: 'Processing visual identity', threshold: 40 },
  { id: 3, label: 'Training brand voice model', threshold: 60 },
  { id: 4, label: 'Building competitor profiles', threshold: 80 },
  { id: 5, label: 'Calibrating health scoring', threshold: 100 }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAnalyzingTwin, setIsAnalyzingTwin] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const logoInputRef = useRef(null);
  const marketingAssetsRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const [formData, setFormData] = useState({
    company_name: '',
    industry: 'Technology & Software (SaaS)',
    mission: '',
    vision: '',
    logo_filename: '',
    colors: {
      primary: '#4f46e5',
      secondary: '#8b5cf6',
      accent: '#10b981',
      neutral: '#9ca3af'
    },
    typography: 'Inter — Primary',
    selected_voices: ['Professional'],
    brand_usp: '',
    words_to_use: '',
    words_to_avoid: '',
    primary_audience: '',
    age_range: '',
    location: '',
    income_level: '',
    audience_industry: 'Technology & Software (SaaS)',
    pain_points: '',
    website_url: '',
    instagram: '',
    linkedin: '',
    marketing_asset_filename: '',
    social_links: { twitter: '', linkedin: '', instagram: '' },
    competitors: ['', '']
  });

  useEffect(() => {
    if (!user) navigate('/login');
    // Fetch existing progress
    axios.get(`${API_URL}/onboarding/${user?.id}`).then(res => {
      if (res.data.profile) {
        const p = res.data.profile;
        // Always start at step 1 for review, even if they have saved progress
        setCurrentStep(1);
        setFormData(prev => ({
          ...prev,
          company_name: p.company_name || '',
          industry: p.industry || 'Technology & Software (SaaS)',
          mission: p.mission || '',
          vision: p.vision || '',
          target_audience: p.target_audience || '',
          website_url: p.website_url || '',
          social_links: p.social_links ? JSON.parse(p.social_links) : { twitter: '', linkedin: '', instagram: '' },
          competitors: p.competitors ? JSON.parse(p.competitors) : ['', '']
        }));
      }
    }).catch(() => {});
  }, [user, navigate]);

  // Handle Analysis progress timer
  useEffect(() => {
    let interval = null;
    if (isAnalyzingTwin) {
      interval = setInterval(() => {
        setProgressPercent(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate('/dashboard');
            }, 800);
            return 100;
          }
          return prev + 1;
        });
      }, 45); // ~4.5 sec total duration
    } else {
      setProgressPercent(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzingTwin, navigate]);

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    
    if (currentStep === 6) {
      // Save data and start Digital Twin Analysis Screen
      setLoading(true);
      try {
        await axios.post(`${API_URL}/onboarding/${user.id}/step`, { step: 6, data: formData });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsAnalyzingTwin(true);
      }
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/onboarding/${user.id}/step`, { step: currentStep + 1, data: formData });
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateColor = (colorKey, hex) => {
    setFormData(prev => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: hex }
    }));
  };

  const toggleVoiceTrait = (trait) => {
    setFormData(prev => {
      const exists = prev.selected_voices.includes(trait);
      if (exists) {
        return { ...prev, selected_voices: prev.selected_voices.filter(t => t !== trait) };
      } else {
        return { ...prev, selected_voices: [...prev.selected_voices, trait] };
      }
    });
  };

  const updateSocial = (key, value) => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [key]: value }
    }));
  };

  const updateCompetitor = (index, value) => {
    const updated = [...formData.competitors];
    updated[index] = value;
    setFormData(prev => ({ ...prev, competitors: updated }));
  };

  const addCompetitorField = () => {
    setFormData(prev => ({
      ...prev,
      competitors: [...prev.competitors, '']
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo_filename: file.name }));
    }
  };

  const handleMarketingAssetChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, marketing_asset_filename: file.name }));
    }
  };

  // RENDER ANALYSIS SCREEN IF TRIGGERED
  if (isAnalyzingTwin) {
    const strokeDashoffset = 283 - (283 * progressPercent) / 100;

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0604] text-stone-800 dark:text-stone-300 font-sans flex flex-col justify-between overflow-hidden relative selection:bg-orange-500/30">
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-orange-500/10 to-amber-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d977060a_1px,transparent_1px),linear-gradient(to_bottom,#d977060a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Top Navbar Header */}
        <header className="relative z-10 py-6 border-b border-stone-200 dark:border-orange-900/20 bg-white dark:bg-black/40 backdrop-blur-md flex justify-center items-center">
          <div className="flex items-center gap-2 text-stone-800 dark:text-stone-300 font-medium text-sm hover:text-stone-900 dark:text-white cursor-pointer transition-colors bg-white/[0.02] border border-stone-200 dark:border-orange-900/30 px-4 py-2 rounded-xl">
            <span>BrandSphere AI SaaS Application</span>
            <ChevronDown size={16} className="text-orange-400" />
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-4 p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-orange-500 transition-colors shadow-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Main Analysis Container */}
        <main className="relative z-10 max-w-xl mx-auto w-full px-6 py-12 text-center my-auto">
          
          {/* Circular Progress Gauge */}
          <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-stone-900"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-orange-500 transition-all duration-300 ease-out"
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.6))' }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <Cpu size={24} className="text-orange-400 mb-1 animate-pulse" />
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">{progressPercent}%</span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-3 tracking-tight">
            Building Your Brand Digital Twin
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm lg:text-base font-light mb-10 max-w-md mx-auto leading-relaxed">
            Our AI is analyzing your brand identity, learning your voice, and creating a comprehensive digital model of your brand.
          </p>

          {/* Step Checklist Items */}
          <div className="space-y-3.5 text-left">
            {ANALYSIS_ITEMS.map((item) => {
              const isDone = progressPercent >= item.threshold;
              const isInProgress = progressPercent < item.threshold && progressPercent >= (item.threshold - 20);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-500 flex items-center gap-3.5 ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : isInProgress
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                      : 'bg-stone-50 dark:bg-black/30 border-stone-200 dark:border-orange-900/20 text-stone-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-black'
                        : isInProgress
                        ? 'bg-orange-500 text-black animate-pulse'
                        : 'bg-stone-100 dark:bg-stone-900 border border-stone-800 text-stone-700'
                    }`}
                  >
                    {isDone ? <Check size={14} /> : item.id}
                  </div>
                  <span className={`text-sm font-medium ${isDone ? 'text-emerald-300' : isInProgress ? 'text-orange-200' : 'text-stone-500'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center text-xs font-mono text-stone-700 border-t border-stone-200 dark:border-orange-900/20">
          POWERED BY BRANDSPHERE NEURAL ENGINE v1.0.4
        </footer>
      </div>
    );
  }

  // STANDARD ONBOARDING WIZARD RENDER
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0604] text-stone-800 dark:text-stone-300 font-sans flex overflow-hidden relative selection:bg-orange-500/30">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-900/20 blur-[140px] rounded-full pointer-events-none"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d977060a_1px,transparent_1px),linear-gradient(to_bottom,#d977060a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Left Sidebar Wizard Nav - Glassmorphic Elegant Orange */}
      <div className="w-80 lg:w-96 relative z-10 bg-stone-50 dark:bg-[#0a0604]/70 backdrop-blur-2xl border-r border-stone-200 dark:border-orange-900/20 p-8 lg:p-10 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center rounded-xl font-bold text-stone-900 dark:text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Zap size={20} className="text-stone-900 dark:text-white" />
            </div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-100 to-orange-400 text-xl tracking-wider uppercase">
              BrandSphere AI
            </span>
          </div>

          <div className="text-[11px] font-mono text-orange-500/80 uppercase tracking-[0.2em] mb-6 font-bold">
            SETUP PROGRESS
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-orange-500/30 before:via-orange-900/20 before:to-transparent">
            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              return (
                <div 
                  key={step.id} 
                  onClick={() => setCurrentStep(step.id)}
                  className={`relative flex items-start gap-4 cursor-pointer group transition-all`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs z-10 shrink-0 transition-all duration-500 ${
                    isCompleted ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
                    isCurrent ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-[#0a0604] shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-110 border-2 border-orange-200/50' : 'bg-stone-50 dark:bg-[#0a0604] border border-stone-300 dark:border-orange-900/40 text-stone-600 group-hover:border-orange-500/40'
                  }`}>
                    {isCompleted ? <Check size={16} /> : step.id}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className={`font-bold text-sm transition-colors duration-300 ${isCurrent ? 'text-orange-400' : isCompleted ? 'text-stone-800 dark:text-stone-200' : 'text-stone-500'}`}>
                      {step.title}
                    </div>
                    <div className={`text-xs mt-0.5 transition-colors duration-300 font-light ${isCurrent || isCompleted ? 'text-stone-600 dark:text-stone-400' : 'text-stone-700'}`}>{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar footer */}
        <div className="pt-8 border-t border-stone-200 dark:border-orange-900/20">
          <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-2">
            <span>Step {currentStep} of 6</span>
            <span className="text-orange-400 font-bold">{Math.round((currentStep / 6) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-900 rounded-full overflow-hidden border border-stone-200 dark:border-orange-900/20">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <form onSubmit={handleNext} className="flex-1 p-8 lg:p-14 overflow-y-auto relative z-10 flex flex-col justify-between">
        <div className="max-w-2xl mx-auto w-full my-auto">
          
          <div className="text-xs font-mono text-orange-500/90 font-bold uppercase tracking-widest mb-2">
            STEP {currentStep} OF 6
          </div>

          {/* Step 1: Company Profile */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">Company Profile</h1>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-base font-light">Tell us about your organization</p>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Company Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.company_name} 
                    onChange={e => updateForm('company_name', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="Acme Corporation" 
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Industry Sector
                  </label>
                  <select 
                    value={formData.industry} 
                    onChange={e => updateForm('industry', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind} className="bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Mission Statement
                  </label>
                  <textarea 
                    value={formData.mission} 
                    onChange={e => updateForm('mission', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base h-28 resize-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="What is your company's mission?" 
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Vision Statement
                  </label>
                  <textarea 
                    value={formData.vision} 
                    onChange={e => updateForm('vision', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base h-28 resize-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="Where do you see your brand in 5 years?" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Brand Identity */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">Brand Identity</h1>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-base font-light">Upload your brand assets</p>
              
              <div className="space-y-8">
                
                {/* Brand Logo Upload Container */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-3">
                    Brand Logo
                  </label>
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    onChange={handleLogoChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 dark:border-orange-900/40 rounded-2xl p-8 text-center bg-stone-50 dark:bg-black/30 hover:border-orange-500/60 transition-all cursor-pointer group shadow-[inset_0_2px_15px_rgba(0,0,0,0.4)]"
                  >
                    <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                      <UploadCloud size={28} />
                    </div>
                    <p className="text-base text-stone-800 dark:text-stone-200 font-semibold mb-1">
                      {formData.logo_filename ? `Uploaded: ${formData.logo_filename}` : 'Drop your logo here'}
                    </p>
                    <p className="text-xs text-stone-500 mb-5">SVG, PNG, JPG up to 10MB</p>
                    <button 
                      type="button"
                      className="bg-stone-100 dark:bg-stone-900 hover:bg-stone-800 border border-stone-200 dark:border-orange-900/30 text-stone-800 dark:text-stone-200 px-6 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors"
                    >
                      Browse files
                    </button>
                  </div>
                </div>

                {/* Brand Colors */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-4">
                    Brand Colors
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Primary Color */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-white/10" style={{ backgroundColor: formData.colors.primary }}>
                        <input 
                          type="color" 
                          value={formData.colors.primary} 
                          onChange={e => updateColor('primary', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                        />
                      </div>
                      <span className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-2">Primary</span>
                    </div>

                    {/* Secondary Color */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-white/10" style={{ backgroundColor: formData.colors.secondary }}>
                        <input 
                          type="color" 
                          value={formData.colors.secondary} 
                          onChange={e => updateColor('secondary', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                        />
                      </div>
                      <span className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-2">Secondary</span>
                    </div>

                    {/* Accent Color */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-white/10" style={{ backgroundColor: formData.colors.accent }}>
                        <input 
                          type="color" 
                          value={formData.colors.accent} 
                          onChange={e => updateColor('accent', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                        />
                      </div>
                      <span className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-2">Accent</span>
                    </div>

                    {/* Neutral Color */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-white/10" style={{ backgroundColor: formData.colors.neutral }}>
                        <input 
                          type="color" 
                          value={formData.colors.neutral} 
                          onChange={e => updateColor('neutral', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                        />
                      </div>
                      <span className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-2">Neutral</span>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-3">
                    Typography
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => updateForm('typography', 'Inter — Primary')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.typography === 'Inter — Primary'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.15)] font-semibold'
                          : 'border-stone-200 dark:border-orange-900/30 bg-white dark:bg-black/40 text-stone-600 dark:text-stone-400 hover:border-orange-500/30'
                      }`}
                    >
                      <span className="text-sm">Inter — Primary</span>
                    </div>

                    <div 
                      onClick={() => updateForm('typography', 'Playfair — Display')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.typography === 'Playfair — Display'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.15)] font-semibold'
                          : 'border-stone-200 dark:border-orange-900/30 bg-white dark:bg-black/40 text-stone-600 dark:text-stone-400 hover:border-orange-500/30'
                      }`}
                    >
                      <span className="text-sm font-serif">Playfair — Display</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Step 3: Brand Voice */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">Brand Voice</h1>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-base font-light">Define your communication style</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-3">
                    Brand Voice
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Professional', 'Friendly', 'Authoritative', 'Inspirational', 'Playful', 'Premium'].map((trait) => {
                      const isSelected = formData.selected_voices.includes(trait);
                      return (
                        <div
                          key={trait}
                          onClick={() => toggleVoiceTrait(trait)}
                          className={`py-3.5 px-4 rounded-xl border text-center cursor-pointer transition-all text-sm font-medium ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/15 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)] font-semibold'
                              : 'border-stone-200 dark:border-orange-900/30 bg-white dark:bg-black/40 text-stone-600 dark:text-stone-400 hover:border-orange-500/40 hover:text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {trait}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Brand USP
                  </label>
                  <textarea 
                    value={formData.brand_usp} 
                    onChange={e => updateForm('brand_usp', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base h-28 resize-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="What makes your brand unique?" 
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Words to Always Use
                  </label>
                  <input 
                    type="text" 
                    value={formData.words_to_use} 
                    onChange={e => updateForm('words_to_use', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="e.g., innovative, trusted, seamless" 
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Words to Avoid
                  </label>
                  <input 
                    type="text" 
                    value={formData.words_to_avoid} 
                    onChange={e => updateForm('words_to_avoid', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="e.g., cheap, complicated, boring" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Target Audience */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">Target Audience</h1>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-base font-light">Who are your customers?</p>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Primary Audience
                  </label>
                  <input 
                    type="text" 
                    value={formData.primary_audience} 
                    onChange={e => updateForm('primary_audience', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="e.g., B2B tech decision makers, 35-55" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-3">
                    Audience Demographics
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1.5">Age Range</label>
                      <input 
                        type="text" 
                        value={formData.age_range} 
                        onChange={e => updateForm('age_range', e.target.value)} 
                        placeholder="Enter age range" 
                        className="w-full bg-white dark:bg-black/40 px-4 py-3 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 outline-none text-stone-800 dark:text-stone-200 text-sm placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1.5">Location</label>
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={e => updateForm('location', e.target.value)} 
                        placeholder="Enter location" 
                        className="w-full bg-white dark:bg-black/40 px-4 py-3 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 outline-none text-stone-800 dark:text-stone-200 text-sm placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1.5">Income Level</label>
                      <input 
                        type="text" 
                        value={formData.income_level} 
                        onChange={e => updateForm('income_level', e.target.value)} 
                        placeholder="Enter income level" 
                        className="w-full bg-white dark:bg-black/40 px-4 py-3 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 outline-none text-stone-800 dark:text-stone-200 text-sm placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1.5">Industry Sector</label>
                      <select 
                        value={formData.audience_industry} 
                        onChange={e => updateForm('audience_industry', e.target.value)} 
                        className="w-full bg-white dark:bg-black/40 px-4 py-3 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 outline-none text-stone-800 dark:text-stone-200 text-sm cursor-pointer"
                      >
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind} className="bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Customer Pain Points
                  </label>
                  <textarea 
                    value={formData.pain_points} 
                    onChange={e => updateForm('pain_points', e.target.value)} 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base h-28 resize-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    placeholder="What problems do your customers face?" 
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 5: Digital Presence */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">Digital Presence</h1>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-base font-light">Connect your channels</p>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Website URL
                  </label>
                  <input 
                    type="url" 
                    value={formData.website_url} 
                    onChange={e => updateForm('website_url', e.target.value)} 
                    placeholder="https://yourcompany.com" 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    Instagram
                  </label>
                  <input 
                    type="text" 
                    value={formData.social_links?.instagram || ''} 
                    onChange={e => updateSocial('instagram', e.target.value)} 
                    placeholder="@yourhandle" 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                    LinkedIn
                  </label>
                  <input 
                    type="text" 
                    value={formData.social_links?.linkedin || ''} 
                    onChange={e => updateSocial('linkedin', e.target.value)} 
                    placeholder="linkedin.com/company/yourcompany" 
                    className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-3">
                    Upload Marketing Assets
                  </label>
                  <input 
                    type="file" 
                    ref={marketingAssetsRef} 
                    onChange={handleMarketingAssetChange} 
                    className="hidden" 
                  />
                  <div 
                    onClick={() => marketingAssetsRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 dark:border-orange-900/40 rounded-2xl p-8 text-center bg-stone-50 dark:bg-black/30 hover:border-orange-500/60 transition-all cursor-pointer group shadow-[inset_0_2px_15px_rgba(0,0,0,0.4)]"
                  >
                    <p className="text-base text-stone-800 dark:text-stone-300 font-semibold mb-1">
                      {formData.marketing_asset_filename ? `Uploaded: ${formData.marketing_asset_filename}` : 'Upload past ads, campaigns, PDFs'}
                    </p>
                    <p className="text-xs text-stone-500">Helps AI learn your brand style</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Competitors */}
          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">Competitors</h1>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-base font-light">Monitor your competition</p>
              
              {/* Info Box Callout */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 mb-8 text-left backdrop-blur-md">
                <h4 className="text-sm font-semibold text-orange-400 mb-1.5">Why add competitors?</h4>
                <p className="text-xs text-stone-800 dark:text-stone-300 leading-relaxed font-light">
                  BrandSphere AI monitors your competitors' content, campaigns, and brand strategies to help you find opportunities and differentiate your brand.
                </p>
              </div>

              <div className="space-y-6">
                {formData.competitors.map((comp, idx) => (
                  <div key={idx} className="group">
                    <label className="block text-sm font-semibold text-stone-800 dark:text-stone-300 mb-2 group-focus-within:text-orange-400 transition-colors">
                      Competitor {idx + 1}
                    </label>
                    <input 
                      type="text" 
                      value={comp} 
                      onChange={e => updateCompetitor(idx, e.target.value)} 
                      placeholder="Company name or website" 
                      className="w-full bg-white dark:bg-black/40 px-4 py-3.5 rounded-xl border border-stone-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-stone-800 dark:text-stone-200 text-base transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-stone-400 dark:placeholder:text-stone-700" 
                    />
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={addCompetitorField}
                  className="w-full border border-dashed border-stone-300 dark:border-orange-900/40 hover:border-orange-500/50 rounded-xl p-4 text-center text-stone-600 dark:text-stone-400 hover:text-orange-300 transition-colors text-sm font-medium flex items-center justify-center gap-2 bg-black/20"
                >
                  <Plus size={16} /> Add another competitor
                </button>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-12 flex justify-between items-center border-t border-stone-200 dark:border-orange-900/20 pt-6">
            <button 
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || loading}
              className="px-6 py-2.5 rounded-xl border border-stone-200 dark:border-orange-900/30 bg-white dark:bg-black/40 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:text-stone-200 font-medium text-sm transition-all disabled:opacity-0 flex items-center gap-1.5"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="relative group bg-gradient-to-r from-orange-400 to-orange-600 text-[#0a0604] px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-50 border border-orange-400/50 flex items-center gap-2"
            >
              <span>{loading ? 'Saving...' : currentStep === 6 ? '🚀 Build My Brand Twin' : 'Continue'}</span>
              {!loading && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
