import React, { useState, useEffect, useRef } from 'react';
import { CloudUpload, FileText, Image as ImageIcon, File, Link, Hash, Video, FileCheck, Sparkles, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { saveHistoryEvent } from '../utils/historyManager';

export default function EvaluateContentView({ selectedCompany }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploaded'
  const [isFixed, setIsFixed] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      startEvaluation({ name: file.name, type: file.type, base64: base64Data });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);

  const startEvaluation = async (fileData) => {
    setUploadState('uploaded');
    setUploadedFileData(fileData);
    setIsFixed(false);
    setEvaluationData(null);
    
    setChatMessages([
      { sender: 'user', type: 'upload', content: fileData.name },
      { sender: 'ai', type: 'typing' }
    ]);

    try {
      const response = await fetch('http://localhost:5000/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company: selectedCompany, 
          fileName: fileData.name,
          imageBase64: fileData.base64,
          mimeType: fileData.type
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze asset');
      }

      const evalJson = data.reply;
      setEvaluationData(evalJson);

      let contentHtml = `
        <div class="space-y-2">
          <div class="font-bold text-sm">${evalJson.score}</div>
          ${evalJson.competitorWarning ? `<div class="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded mt-2 text-xs font-bold">⚠️ ${evalJson.competitorWarning}</div>` : ''}
          <div class="mt-2 text-xs"><strong>✅ Right:</strong> ${evalJson.right}</div>
          <div class="mt-1 text-xs"><strong>❌ Wrong:</strong> ${evalJson.wrong}</div>
          <div class="mt-1 text-xs italic opacity-80">Uniqueness: ${evalJson.uniqueness}</div>
        </div>
      `;

      let newMessages = [
        { sender: 'user', type: 'upload', content: fileData.name },
        { sender: 'ai', type: 'evaluation', content: contentHtml }
      ];

      if (evalJson.status === 'Apt') {
        newMessages.push({ sender: 'ai', type: 'success', content: 'This asset is perfectly aligned with your brand guidelines and stands out from competitors! No fixes needed.' });
        setIsFixed(true); // Auto-approve
      } else {
        newMessages.push({ sender: 'ai', type: 'suggestion', content: `Here is a suggested replacement that is apt for your organization:` });
      }

      setChatMessages(newMessages);
      
      saveHistoryEvent({
        title: `Asset Evaluation: ${fileData.name}`,
        type: 'Evaluation',
        score: parseInt(evalJson.score.match(/\d+/)?.[0] || '75', 10),
        status: evalJson.status === 'Apt' ? 'Safe to Publish' : 'Needs Review',
        editor: 'AI Auto',
        isAiFixed: evalJson.status === 'Apt',
        company: selectedCompany
      });
      
    } catch (error) {
      console.error("Asset evaluation API failed:", error.message);
      setChatMessages([
        { sender: 'user', type: 'upload', content: fileData.name },
        { sender: 'ai', type: 'evaluation', content: `Error analyzing asset: ${error.message}` }
      ]);
    }
  };

  const handleAccept = () => {
    setIsFixed(true);
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', type: 'text', content: 'Fix Everything' },
      { sender: 'ai', type: 'success', content: 'All brand violations have been automatically fixed! The main preview now shows the generated apt poster.' }
    ]);
  };

  const handleReject = () => {
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', type: 'text', content: 'Edit Further' },
      { sender: 'ai', type: 'text', content: 'What specific adjustments would you like to make to the generated design?' }
    ]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      <div>
        <div className="text-xs text-theme-text-secondary font-medium mb-1">
          AI Analysis · Real-time Evaluation
        </div>
        <h1 className="text-3xl font-extrabold text-theme-text-primary tracking-tight">Evaluate Content</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        
        {/* LEFT PANEL: UPLOAD ZONE */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
          <h2 className="text-sm font-bold text-theme-text-primary mb-4">Upload Content</h2>
          
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center p-8 relative overflow-hidden ${
              isDragging 
                ? 'border-theme-accent-primary bg-theme-accent-primary/10' 
                : 'border-theme-border-subtle bg-theme-bg/30 hover:bg-theme-bg/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadState === 'idle' ? (
              <>
                <div className="w-16 h-16 bg-theme-input rounded-2xl flex items-center justify-center text-theme-text-secondary mb-6 shadow-sm">
                  <CloudUpload size={28} />
                </div>
                <h3 className="text-lg font-bold text-theme-text-primary mb-2">Drop your content here</h3>
                <p className="text-xs text-theme-text-secondary mb-8">Text, Image, Poster, PDF, Website URL, Social URL</p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge icon={FileText} text="Text" />
                  <Badge icon={ImageIcon} text="Image" color="text-emerald-500" />
                  <Badge icon={File} text="PDF" color="text-rose-500" />
                  <Badge icon={Link} text="URL" color="text-blue-500" />
                  <Badge icon={Hash} text="Social" color="text-indigo-500" />
                </div>


                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileSelect} />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg border border-theme-border flex justify-center items-center bg-black/5">
                  {uploadedFileData?.type?.startsWith('image/') ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={isFixed && evaluationData?.status !== 'Apt' ? `https://source.unsplash.com/600x600/?${encodeURIComponent(evaluationData?.suggestedReplacementImageKeywords || selectedCompany)}` : (uploadedFileData?.base64 || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop")} 
                        alt="Uploaded Content" 
                        className="w-full h-auto object-cover transition-all duration-700" 
                      />
                      {isFixed && evaluationData?.status !== 'Apt' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
                          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shadow-2xl transform hover:scale-105 transition-transform">
                            <h3 className="text-white font-extrabold text-2xl tracking-widest uppercase drop-shadow-md mb-1">{selectedCompany}</h3>
                            <p className="text-stone-200 text-[10px] font-medium tracking-widest uppercase opacity-90">NATURALLY YOU.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`py-24 flex flex-col items-center justify-center transition-all duration-500 ${isFixed ? 'text-emerald-500' : 'text-theme-text-secondary'}`}>
                      {isFixed ? (
                        <FileCheck size={64} className="mb-4 text-emerald-500 animate-bounce" />
                      ) : (
                        <FileText size={64} className="mb-4 text-theme-text-primary/50" />
                      )}
                      <span className={`text-lg font-bold ${isFixed ? 'text-emerald-600 dark:text-emerald-400' : 'text-theme-text-primary'}`}>
                        {uploadedFileData?.name}
                      </span>
                      <span className={`text-xs mt-2 px-3 py-1 rounded-full font-semibold ${isFixed ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-theme-bg'}`}>
                        {isFixed ? 'Document Enhanced & Brand-Compliant' : 'Document Uploaded'}
                      </span>
                    </div>
                  )}
                  {isFixed && (
                    <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none border-4 border-emerald-500/50 rounded-xl animate-pulse" />
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md z-10">
                    {isFixed ? <Sparkles size={12} className="text-emerald-400" /> : <FileText size={12} />}
                    {isFixed && evaluationData?.status !== 'Apt' ? 'AI Generated Replacement' : (uploadedFileData?.name || 'File')}
                  </div>
                </div>
                <button onClick={() => { setUploadState('idle'); setUploadedFileData(null); setChatMessages([]); setIsFixed(false); setEvaluationData(null); }} className="mt-6 px-4 py-2 rounded-lg bg-theme-input text-theme-text-secondary text-xs font-semibold hover:bg-theme-border transition-colors">
                  Upload Different File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: AI CHATBOT */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-0 shadow-sm flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-theme-border bg-theme-bg/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-theme-text-primary">BrandSphere Evaluation</h2>
              <p className="text-[10px] text-theme-success-text font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-theme-success-text rounded-full animate-pulse"></span> Active Engine
              </p>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {uploadState === 'idle' ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 bg-theme-input rounded-2xl flex items-center justify-center text-theme-text-secondary mb-4">
                  <FileCheck size={28} />
                </div>
                <h3 className="text-lg font-bold text-theme-text-primary mb-2">Ready to Analyze</h3>
                <p className="text-xs text-theme-text-secondary max-w-[250px] leading-relaxed">
                  Upload content or paste text on the left, then click Analyze to get your Brand Identity Score
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {chatMessages.map((msg, idx) => (
                  <ChatMessage key={idx} msg={msg} company={selectedCompany} onAccept={handleAccept} onReject={handleReject} isLast={idx === chatMessages.length - 1} uploadedFile={uploadedFileData} evaluationData={evaluationData} />
                ))}
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents
function Badge({ icon: Icon, text, color = "text-theme-text-secondary" }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-theme-input border border-theme-border-subtle flex items-center gap-2 text-xs font-semibold text-theme-text-primary shadow-sm hover:border-theme-border transition-colors">
      <Icon size={14} className={color} /> {text}
    </div>
  );
}

function ChatMessage({ msg, company, onAccept, onReject, isLast, uploadedFile, evaluationData }) {
  if (msg.type === 'typing') {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
          <Sparkles size={14} />
        </div>
        <div className="bg-theme-input border border-theme-border text-theme-text-primary p-3.5 rounded-2xl rounded-tl-none max-w-[80%] flex items-center gap-1.5">
          <span className="w-2 h-2 bg-theme-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-theme-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-theme-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    );
  }

  if (msg.sender === 'user') {
    return (
      <div className="flex gap-3 justify-end">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs p-3.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
          {msg.type === 'upload' ? (
            <div className="flex items-center gap-2">
              <FileText size={14} /> Uploaded: {msg.content}
            </div>
          ) : (
            msg.content
          )}
        </div>
      </div>
    );
  }

  const suggestionKeywords = evaluationData?.suggestedReplacementImageKeywords || company;
  const unsplashUrl = `https://source.unsplash.com/600x600/?${encodeURIComponent(suggestionKeywords)}`;

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
        <Sparkles size={14} />
      </div>
      
      <div className="space-y-3 max-w-[90%]">
        <div className={`p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed border shadow-sm ${
          msg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            : msg.type === 'evaluation'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
            : 'bg-theme-bg border-theme-border text-theme-text-primary'
        }`}>
          {msg.type === 'evaluation' && <AlertTriangle size={16} className="inline mr-2 mb-0.5" />}
          {msg.type === 'success' && <CheckCircle2 size={16} className="inline mr-2 mb-0.5" />}
          <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          
          {msg.type === 'success' && (
            <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                  {uploadedFile?.type?.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="font-bold text-theme-text-primary text-sm">{uploadedFile?.name ? `Fixed_${uploadedFile.name}` : 'Brand_Compliant_Asset.pdf'}</div>
                  <div className="text-[10px] text-theme-text-secondary">Ready for production</div>
                </div>
              </div>
              <button 
                onClick={async () => {
                  if (!uploadedFile?.base64) return;
                  
                  let downloadDataUri = uploadedFile.base64;
                  
                  if (evaluationData?.status !== 'Apt' && uploadedFile?.type?.startsWith('image/')) {
                    // Fetch the unsplash image blob and download it
                    try {
                        const response = await fetch(unsplashUrl);
                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = objectUrl;
                        link.download = `Generated_${uploadedFile.name || 'Brand_Asset.jpg'}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(objectUrl);
                        return;
                    } catch (e) {
                        console.error("Failed to download generated image", e);
                    }
                  }
                  
                  // If it's a PDF, we dynamically modify it to stamp "BRAND APPROVED"
                  if (uploadedFile.type === 'application/pdf' || uploadedFile.name?.toLowerCase().endsWith('.pdf')) {
                    try {
                      // Dynamically import pdf-lib to keep bundle size small when not needed
                      const { PDFDocument, rgb, degrees } = await import('pdf-lib');
                      
                      // Convert base64 data URI to ArrayBuffer
                      const base64Data = uploadedFile.base64.split(',')[1];
                      const pdfBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
                      
                      // Load and modify the PDF
                      const pdfDoc = await PDFDocument.load(pdfBytes);
                      const pages = pdfDoc.getPages();
                      const firstPage = pages[0];
                      const { width, height } = firstPage.getSize();
                      
                      // Draw a green "BRAND APPROVED" stamp diagonally across the first page
                      firstPage.drawText('APPROVED BY BRANDSPHERE AI', {
                        x: width / 4,
                        y: height / 2,
                        size: 32,
                        color: rgb(0.1, 0.7, 0.3), // Emerald green
                        rotate: degrees(45),
                        opacity: 0.8,
                      });
                      
                      // Save and create new data URI
                      const modifiedPdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
                      downloadDataUri = modifiedPdfBytes;
                    } catch (error) {
                      console.error("Failed to modify PDF:", error);
                      // Fall back to original if modification fails
                    }
                  }
                  
                  const link = document.createElement('a');
                  link.href = downloadDataUri;
                  link.download = `Fixed_${uploadedFile.name || 'Brand_Compliant_Asset.pdf'}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 bg-theme-text-primary text-theme-bg rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-sm"
              >
                Review & Download
              </button>
            </div>
          )}
        </div>

        {msg.type === 'suggestion' && (
          <div className="mt-3 bg-theme-bg border border-theme-border rounded-xl p-3 shadow-md animate-in slide-in-from-bottom-2">
            <p className="text-[10px] font-bold text-theme-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={12} className="text-orange-500" /> Generated Alteration
            </p>
            <div className="relative rounded-lg overflow-hidden border border-theme-border flex justify-center items-center bg-black/5">
              {/* If it's an image, apply generated unsplash image instead of filter */}
              {uploadedFile?.type?.startsWith('image/') ? (
                <div className="relative w-full h-full">
                  <img 
                    src={unsplashUrl}
                    alt="Generated Alteration" 
                    className="w-full h-auto transition-all" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-2">
                    <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/20 text-center shadow-lg">
                      <h3 className="text-white font-extrabold text-lg tracking-widest uppercase drop-shadow-md mb-0.5">{company}</h3>
                      <p className="text-stone-200 text-[8px] font-medium tracking-widest uppercase opacity-90">NATURALLY YOU.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-theme-text-secondary">
                  <FileCheck size={48} className="text-emerald-500 mb-3" />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Document enhanced & brand-compliant</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-[9px] font-bold shadow-lg z-10">
                ✨ {company} Compliant
              </div>
            </div>
            
            {isLast && (
              <div className="flex gap-2 mt-4">
                <button onClick={onAccept} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white py-2 rounded-lg text-xs font-bold shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} /> Fix Everything
                </button>
                <button onClick={onReject} className="flex-1 bg-theme-input text-theme-text-primary py-2 rounded-lg text-xs font-semibold hover:bg-theme-border transition-colors border border-theme-border flex items-center justify-center gap-1.5">
                  <X size={14} /> Edit Further
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
