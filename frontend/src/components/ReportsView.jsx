import React, { useState } from 'react';
import axios from 'axios';
import { getHistory } from '../utils/historyManager';
import { FileText, Loader2, Download, TrendingUp, AlertTriangle, Lightbulb, Activity, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ReportsView({ selectedCompany }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    if (!selectedCompany) {
      setError("Please select a brand from the dropdown first.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const historyLogs = getHistory().filter(log => log.company === selectedCompany).slice(0, 5); // Send the top 5 recent history logs
      
      const response = await axios.post(`${API_URL}/ai/generate-report`, {
        company: selectedCompany,
        historyLogs
      });
      
      setReport(response.data);
    } catch (err) {
      console.error("Report generation failed:", err);
      setError(err.response?.data?.error || err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    // A classic, robust hackathon method for exporting clean PDFs without dependencies.
    // We add a class to the body to hide everything except the report during printing.
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #ai-generated-report, #ai-generated-report * { visibility: visible; }
        #ai-generated-report { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; box-shadow: none; border: none; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-theme-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-theme-input border border-theme-border text-theme-text-secondary text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <FileText size={12} /> Executive Summary
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">AI Generated Reports</h1>
          <p className="text-sm text-theme-text-secondary mt-1">Generate comprehensive executive summaries for <span className="font-bold text-theme-accent-primary">{selectedCompany || 'your brand'}</span></p>
        </div>

        <div className="flex items-center gap-3">
          {report && (
            <button 
              onClick={handleExportPDF}
              className="px-4 py-2 bg-theme-input border border-theme-border hover:border-theme-border-subtle rounded-xl text-xs font-semibold text-theme-text-primary transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download size={14} /> Export PDF
            </button>
          )}
          <button 
            onClick={generateReport}
            disabled={loading}
            className="px-4 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />} 
            {loading ? 'Analyzing Data...' : 'Generate AI Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-theme-danger-bg border border-theme-danger-border rounded-xl text-theme-danger-text text-sm flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!report && !loading && !error && (
        <div className="h-64 flex flex-col items-center justify-center text-theme-text-secondary border border-theme-border border-dashed rounded-2xl bg-theme-card/50">
          <FileText size={32} className="mb-4 opacity-50" />
          <p className="text-sm font-semibold text-theme-text-primary">No Report Generated Yet</p>
          <p className="text-xs opacity-70 mt-1 max-w-sm text-center">Click "Generate AI Report" to have the AI scan your brand history and generate a comprehensive executive summary.</p>
        </div>
      )}

      {loading && (
        <div className="h-96 flex flex-col items-center justify-center border border-theme-border-subtle rounded-2xl bg-theme-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-accent-primary/5 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
          <Loader2 size={48} className="text-theme-accent-primary animate-spin mb-6" />
          <h3 className="text-lg font-bold text-theme-text-primary mb-2">Synthesizing Executive Report</h3>
          <p className="text-sm text-theme-text-secondary max-w-md text-center">
            The AI is analyzing your brand history, reviewing market opportunities, and calculating brand health metrics.
          </p>
        </div>
      )}

      {report && !loading && (
        <div id="ai-generated-report" className="space-y-6 text-black bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200">
          
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedCompany}</h2>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Executive Intelligence Summary</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Generated On</div>
              <div className="font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <h3 className="font-bold text-gray-900">Brand Health Score</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-gray-900">{report.brandHealthScore}</span>
                <span className="text-gray-500 mb-1 font-medium">/ 100</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">Based on recent AI evaluations and market alignment.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-3">Executive Summary</h3>
               <p className="text-gray-700 leading-relaxed text-sm">
                 {report.executiveSummary}
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Threats */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-rose-500" />
                <h3 className="font-bold text-gray-900 text-lg">Top Threats</h3>
              </div>
              <div className="space-y-4">
                {report.topThreats.map((threat, idx) => (
                  <div key={idx} className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                    <h4 className="font-bold text-gray-900 mb-1 pl-2">{threat.title}</h4>
                    <p className="text-sm text-gray-600 pl-2 leading-relaxed">{threat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Opportunities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="font-bold text-gray-900 text-lg">Immediate Opportunities</h3>
              </div>
              <div className="space-y-4">
                {report.immediateOpportunities.map((opp, idx) => (
                  <div key={idx} className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                    <h4 className="font-bold text-gray-900 mb-1 pl-2">{opp.title}</h4>
                    <p className="text-sm text-gray-600 pl-2 leading-relaxed">{opp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Recommendation */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className="text-indigo-600" />
              <h3 className="font-bold text-indigo-900 text-lg">Strategic Recommendation (Next 30 Days)</h3>
            </div>
            <p className="text-indigo-800 leading-relaxed font-medium">
              {report.strategicRecommendation}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
