import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Zap } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (!isLogin) {
        navigate('/onboarding');
      } else {
        const profileRes = await axios.get(`${API_URL}/onboarding/${res.data.user.id}`);
        if (profileRes.data.profile && profileRes.data.profile.onboarding_step === 6) {
           navigate('/dashboard');
        } else {
           navigate('/onboarding');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0604] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden selection:bg-orange-500/30">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-orange-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d977060a_1px,transparent_1px),linear-gradient(to_bottom,#d977060a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-4 mb-8 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center rounded-xl font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-500">
            <Zap size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-100 to-orange-400 uppercase tracking-widest text-center drop-shadow-sm">
            BrandSphere
          </h2>
        </div>
        <h2 className="mt-2 text-center text-sm font-mono text-orange-500 uppercase tracking-widest">
          {isLogin ? 'Authenticate Identity' : 'Initialize New Entity'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0a0604]/60 backdrop-blur-2xl py-10 px-4 shadow-[0_0_50px_rgba(249,115,22,0.05)] sm:rounded-2xl sm:px-10 border border-orange-900/30 relative overflow-hidden group/form">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover/form:opacity-100 transition-opacity duration-700"></div>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-lg text-sm font-mono flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> {error}
              </div>
            )}
            
            <div className="group">
              <label className="block text-xs font-mono text-orange-500/80 mb-2 uppercase tracking-widest group-focus-within:text-orange-400 transition-colors">
                Communication Vector (Email)
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-5 py-4 border border-orange-900/40 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-black/40 text-stone-200 sm:text-lg transition-all"
                  placeholder="agent@domain.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-mono text-orange-500/80 mb-2 uppercase tracking-widest group-focus-within:text-orange-400 transition-colors">
                Security Key (Password)
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-5 py-4 border border-orange-900/40 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-black/40 text-stone-200 sm:text-lg transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold uppercase tracking-widest text-[#0a0604] bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0604] focus:ring-orange-500 disabled:opacity-50 overflow-hidden group/btn transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
              >
                <span className="relative z-10 transition-colors duration-500">
                  {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE LINK' : 'CREATE ENTITY')}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-orange-900/20" />
              </div>
              <div className="relative flex justify-center text-xs font-mono">
                <span className="px-4 bg-[#0a0604]/80 text-stone-600">
                  OR BYPASS VIA
                </span>
              </div>
            </div>
            
            <div className="mt-6">
               <button
                  type="button"
                  className="w-full flex justify-center py-4 px-4 border border-orange-900/30 rounded-xl shadow-sm text-sm font-bold uppercase tracking-widest text-stone-300 bg-black/40 hover:bg-orange-900/10 focus:outline-none transition-colors"
                  onClick={() => alert('SSO not implemented yet')}
                >
                  <span className="mr-2 text-orange-500">G</span> GOOGLE NETWORK
                </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs font-mono">
             <button onClick={() => setIsLogin(!isLogin)} className="text-stone-500 hover:text-orange-400 uppercase tracking-widest transition-colors">
                {isLogin ? "Unregistered? Establish Entity" : "Registered? Establish Link"}
             </button>
          </div>
        </div>
        
        <div className="text-center mt-8 text-[10px] font-mono text-stone-700 tracking-[0.2em]">
          v1.0.4-beta // SECURE PROTOCOL // HACKATHON BUILD
        </div>
      </div>
    </div>
  );
}
