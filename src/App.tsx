import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Coffee, 
  Briefcase, 
  Smile, 
  Copy, 
  Check,
  RefreshCw,
  Quote,
  Terminal,
  Linkedin,
  AlertCircle,
  Hash,
  Eye,
  Activity
} from 'lucide-react';
import { translateText, TranslationMode, Tone, TranslationResult } from './services/aiService';

const TONES: { value: Tone; label: string; icon: React.ReactNode }[] = [
  { value: 'brutallyHonest', label: 'Brutally Honest', icon: <ShieldAlert className="w-4 h-4" /> },
  { value: 'sarcastic', label: 'Sarcastic', icon: <Zap className="w-4 h-4" /> },
  { value: 'hustleCulture', label: 'Hustle Culture', icon: <Coffee className="w-4 h-4" /> },
  { value: 'corporateOverlord', label: 'Corporate Overlord', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'passiveAggressive', label: 'Passive Aggressive', icon: <Smile className="w-4 h-4" /> },
];

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [mode, setMode] = useState<TranslationMode>('toReality');
  const [tone, setTone] = useState<Tone>('sarcastic');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visitors, setVisitors] = useState<number | null>(null);
  const [totalChecks, setTotalChecks] = useState<number | null>(null);

  useEffect(() => {
    // Increment visitor count on load
    fetch('https://api.counterapi.dev/v1/linkedin-reality-asalam/visitors/up')
      .then(res => res.json())
      .then(data => setVisitors(data.count))
      .catch(() => {});

    // Get current checks count
    fetch('https://api.counterapi.dev/v1/linkedin-reality-asalam/checks')
      .then(res => res.json())
      .then(data => setTotalChecks(data.count))
      .catch(() => {});
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    const translationResult = await translateText(inputText, mode, tone);
    setResult(translationResult);
    
    // Increment global checks counter
    fetch('https://api.counterapi.dev/v1/linkedin-reality-asalam/checks/up')
      .then(res => res.json())
      .then(data => setTotalChecks(data.count))
      .catch(() => {});
      
    setIsLoading(false);
  };

  const toggleMode = () => {
    const newMode = mode === 'toReality' ? 'toLinkedIn' : 'toReality';
    setMode(newMode);
    if (newMode === 'toReality') {
      setTone('brutallyHonest');
    }
    if (result) {
      setInputText(result.translation);
      setResult(null);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0A66C2]/10 selection:text-[#0A66C2] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0A66C2]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0A66C2]/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative flex flex-col h-screen">
        {/* Minimal Header */}
        <header className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-slate-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center shadow-lg shadow-[#0A66C2]/20">
              <ArrowRightLeft className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-tight uppercase">
              LinkedIn <span className="text-[#0A66C2]">Reality</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 mr-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                <Eye className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 tabular-nums">
                  {visitors ? visitors.toLocaleString() : '...'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                <Activity className="w-3 h-3 text-[#0A66C2]" />
                <span className="text-[10px] font-bold text-slate-600 tabular-nums">
                  {totalChecks ? totalChecks.toLocaleString() : '...'}
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span>No Synergy</span>
              <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
              <span>Pure Reality</span>
            </div>
            <a 
              href="https://www.linkedin.com/in/asifsalam96" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-[#0A66C2] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Input Pane */}
          <div className="flex-1 flex flex-col p-6 lg:p-12 border-r border-slate-200 overflow-y-auto custom-scrollbar bg-white">
            <div className="max-w-xl w-full mx-auto space-y-8">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {mode === 'toReality' ? 'LinkedIn Post' : 'The Reality'}
                  </h2>
                  <p className="text-slate-500 text-xs font-medium">
                    {mode === 'toReality' ? 'Paste the LinkedIn post to de-fluff.' : 'Enter the simple truth to corporate-ify.'}
                  </p>
                </div>
                <button 
                  onClick={toggleMode}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
                >
                  <RefreshCw className="w-3 h-3 text-[#0A66C2] group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Switch</span>
                </button>
              </div>

              <div className="relative group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'toReality' ? "Paste the cringey LinkedIn post here..." : "I fixed a bug in 5 minutes."}
                  className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all placeholder:text-slate-300"
                />
                <div className="absolute top-4 right-4 text-slate-200 group-hover:text-slate-400 transition-colors">
                  <Terminal className="w-4 h-4" />
                </div>
              </div>

              {mode === 'toLinkedIn' && (
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">Corporate Persona</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                          tone === t.value 
                            ? 'bg-[#0A66C2] border-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/10' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {t.icon}
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleTranslate}
                disabled={isLoading || !inputText.trim()}
                className="relative w-full py-4 bg-[#0A66C2] hover:bg-[#004182] disabled:bg-slate-100 disabled:text-slate-300 rounded-2xl font-bold text-sm shadow-xl shadow-[#0A66C2]/20 transition-all flex items-center justify-center gap-2 overflow-hidden group text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="uppercase tracking-widest">{mode === 'toReality' ? 'Run Reality Check' : 'Generate Masterpiece'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Pane */}
          <div className="flex-1 bg-slate-50 p-6 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="max-w-lg w-full relative z-10">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="relative p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col space-y-6">
                      <Quote className="absolute -top-4 -left-4 w-10 h-10 text-[#0A66C2] fill-[#0A66C2]/5 shrink-0" />
                      
                      <div className="overflow-y-auto custom-scrollbar pr-2 max-h-[40vh]">
                        <p className="text-lg md:text-xl font-medium leading-relaxed tracking-tight text-slate-800 text-center italic">
                          {result.translation}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Powered by</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                            result.provider === 'gemini' 
                              ? 'bg-blue-50 text-[#0A66C2]' 
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {result.provider}
                          </span>
                        </div>
                        {result.cringeScore > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cringe Score</span>
                            <span className="text-[10px] font-bold text-slate-900">{result.cringeScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border border-slate-200 text-slate-500 hover:text-[#0A66C2] shadow-sm"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy Result'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group shadow-sm">
                      <Sparkles className="w-8 h-8 text-slate-200 group-hover:text-[#0A66C2] transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Input</h3>
                      <p className="text-[11px] text-slate-300 max-w-[200px] font-medium">
                        {isLoading ? 'Processing...' : 'Paste the corporate fluff to see the truth.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}} />
    </div>
  );
}
