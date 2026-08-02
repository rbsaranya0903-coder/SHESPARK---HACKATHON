import React, { useState, useEffect } from 'react';
import { Search, Sparkles, RefreshCcw, Download, DownloadCloud, FileText } from 'lucide-react';
import { getHistory } from '../utils/historyManager';

export default function HistoryView({ selectedCompany }) {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const allHistory = getHistory();
    // Use the mock history for demo purposes, filtering by company if selected.
    let filtered = allHistory.filter(log => !selectedCompany || log.company === selectedCompany);
    
    if (searchTerm) {
      filtered = filtered.filter(log => log.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (activeFilter !== 'All') {
      filtered = filtered.filter(log => log.status === activeFilter);
    }
    
    setHistoryLogs(filtered);
  }, [selectedCompany, searchTerm, activeFilter]);

  const handleExportAll = () => {
    if (historyLogs.length === 0) return;

    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Content,Type,Score,Status,Editor,Date,AI Fixed\n";

    // CSV Rows
    historyLogs.forEach(log => {
      // Escape quotes and commas in title
      const safeTitle = `"${log.title.replace(/"/g, '""')}"`;
      const date = new Date(log.timestamp).toLocaleDateString('en-US');
      const row = `${safeTitle},${log.type},${log.score}%,${log.status},${log.editor},${date},${log.isAiFixed ? 'Yes' : 'No'}`;
      csvContent += row + "\n";
    });

    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedCompany || 'Brand'}_Evaluation_History.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-indigo-500';
    return 'text-amber-500';
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Safe to Publish': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Needs Review': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'High Risk': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default: return 'bg-theme-input text-theme-text-secondary';
    }
  };

  const getEditorAvatarColor = (editor) => {
    if (editor === 'AI Auto') return 'bg-indigo-600';
    if (editor.startsWith('J')) return 'bg-purple-600';
    if (editor.startsWith('M')) return 'bg-blue-600';
    if (editor.startsWith('L')) return 'bg-rose-600';
    return 'bg-theme-text-secondary';
  };

  const filters = ['All', 'Safe to Publish', 'Needs Review', 'High Risk'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Evaluation History</h1>
        
        <button 
          onClick={handleExportAll}
          disabled={historyLogs.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <DownloadCloud size={14} /> Export All
        </button>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-theme-text-secondary" />
            </div>
            <input 
              type="text" 
              placeholder="Search content..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-theme-input border border-theme-border-subtle rounded-xl text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent-primary transition-colors placeholder:text-theme-text-secondary/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  activeFilter === filter 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' 
                    : 'bg-transparent border-theme-border-subtle text-theme-text-secondary hover:border-theme-border'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-theme-text-secondary font-medium whitespace-nowrap">
          {historyLogs.length} results
        </div>
      </div>

      {/* Table */}
      <div className="bg-theme-card border border-theme-border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-theme-border-subtle bg-theme-bg/30">
              <th className="py-4 pl-6 pr-4 w-12"><input type="checkbox" className="rounded border-theme-border bg-theme-input accent-indigo-500" /></th>
              <th className="py-4 px-4 text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Content</th>
              <th className="py-4 px-4 text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Type</th>
              <th className="py-4 px-4 text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Score</th>
              <th className="py-4 px-4 text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Editor</th>
              <th className="py-4 pr-6 pl-4 text-xs font-bold text-theme-text-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {historyLogs.map((log) => (
              <tr key={log.id} className="border-b border-theme-border-subtle hover:bg-theme-bg/50 transition-colors group">
                <td className="py-4 pl-6 pr-4">
                  <input type="checkbox" className="rounded border-theme-border bg-theme-input accent-indigo-500" />
                </td>
                
                <td className="py-4 px-4">
                  <div className="font-bold text-sm text-theme-text-primary mb-1">{log.title}</div>
                  <div className="flex items-center gap-2 text-xs text-theme-text-secondary">
                    {formatDate(log.timestamp)}
                    {log.isAiFixed && (
                      <span className="flex items-center gap-1 text-orange-500 font-semibold ml-1">
                        <Sparkles size={10} /> AI Fixed
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-theme-input border border-theme-border-subtle rounded-full text-xs text-theme-text-secondary font-medium">
                    {log.type}
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  <span className={`text-sm font-bold ${getScoreColor(log.score)}`}>
                    {log.score}%
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${getEditorAvatarColor(log.editor)}`}>
                      {log.editor === 'AI Auto' ? 'AA' : log.editor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs font-medium text-theme-text-secondary">{log.editor}</span>
                  </div>
                </td>
                
                <td className="py-4 pr-6 pl-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 border border-theme-border hover:border-theme-border-subtle rounded-lg text-xs font-semibold text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                      Report
                    </button>
                    <button className="p-1.5 border border-theme-border hover:border-theme-border-subtle rounded-lg text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                      <RefreshCcw size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {historyLogs.length === 0 && (
              <tr>
                <td colSpan="7" className="py-12 text-center text-theme-text-secondary">
                  <FileText size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No results found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
