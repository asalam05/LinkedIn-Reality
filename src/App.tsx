import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  Copy, 
  RefreshCw,
  Terminal,
  Share2,
  ChevronRight,
  Search,
  Users,
  Linkedin,
  Zap,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { translateText, TranslationMode, Tone, TranslationResult } from './services/aiService';
import { ShareCard } from './components/ShareCard';

function App() {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<TranslationMode>('toReality');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopyingImage, setIsCopyingImage] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [savePreviewUrl, setSavePreviewUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [visitors, setVisitors] = useState<number | null>(null);
  const [totalChecks, setTotalChecks] = useState<number | null>(null);

  const fetchStats = async () => {
    try {
      const vRes = await fetch('/api/counter/visitors');
      const vData = await vRes.json();
      setVisitors(vData.count);
    } catch (e) { console.error('Visitors fetch failed'); }
    
    try {
      const cRes = await fetch('/api/counter/checks');
      const cData = await cRes.json();
      setTotalChecks(cData.count);
    } catch (e) { console.error('Checks fetch failed'); }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [result]);

  useEffect(() => {
    fetchStats();
    fetch('/api/counter/visitors/up').catch(() => {});
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResult(null);
    setImageCopied(false);
    try {
      const translation = await translateText(inputText, mode, 'hilarious' as Tone);
      setResult(translation);
      fetch('/api/counter/checks/up').catch(() => {});
      setTotalChecks(prev => (prev || 0) + 1);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyImageToClipboard = async () => {
    if (!cardRef.current || isCopyingImage) return;
    setIsCopyingImage(true);
    try {
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      if (!blob) throw new Error('Blob is null');
      
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 5000);
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      setIsCopyingImage(false);
    }
  };

  const handleNativeShare = async () => {
    if (!cardRef.current || isCopyingImage) return;
    setIsCopyingImage(true);
    try {
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      if (!blob) throw new Error('Blob is null');
      const file = new File([blob], 'linkedin-reality.png', { type: 'image/png' });
      
      const shareText = mode === 'toReality' 
        ? 'Just decoded the corporate fluff! 😂 Generate your own at https://linkedin-reality.asifsalam96.com #LinkedInReality #CorporateJargon'
        : 'Just recoded my reality into corporate LinkedIn gold! ✨ Generate your own at https://linkedin-reality.asifsalam96.com #LinkedInReality #CorporateJargon';

      const shareData: ShareData = { 
        files: [file], 
        title: 'LinkedIn Reality Check',
        text: shareText
      };

      // Workaround for apps like LinkedIn that ignore the ShareData text property:
      // We automatically copy the caption to the user's clipboard so they can just "Paste" it!
      try {
        await navigator.clipboard.writeText(shareText);
      } catch (err) {
        console.warn('Could not copy text to clipboard automatically', err);
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        copyImageToClipboard();
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setIsCopyingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0A66C2]/10 overflow-x-hidden">
      {/* Upper Banner */}
      <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center justify-center px-2 py-1 bg-slate-100/80 border border-slate-200/60 rounded-md">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">v1.0.1</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {totalChecks?.toLocaleString() || '---'} Checks
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 h-full">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {visitors?.toLocaleString() || '---'} Visitors
              </span>
            </div>
          </div>

          <a 
            href="https://www.linkedin.com/in/asifsalam96/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-900 hover:bg-black rounded-full transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-white">Follow Developer</span>
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#0A66C2] transition-colors">
              <Linkedin className="w-3 h-3 text-white" />
            </div>
          </a>
        </div>
      </nav>

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#0A66C2]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 pb-12">
        <header className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm mb-4"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#0A66C2]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">LinkedIn Reality Check</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-4xl md:text-5xl font-[1000] tracking-tighter text-slate-900 leading-[1.05] mb-4 text-balance px-4">
             {mode === 'toReality' ? (
                <>DECODE THE <br className="block sm:hidden" /><span className="text-[#0A66C2] italic leading-tight">BRUTAL TRUTH.</span></>
              ) : (
                <>WRITE YOUR <br className="block sm:hidden" /><span className="text-emerald-500 italic leading-tight">BEST POST.</span></>
              )}
          </h1>
          <p className="text-[13px] sm:text-[15px] md:text-base text-slate-400 font-medium max-w-[280px] sm:max-w-lg mx-auto leading-relaxed text-balance">
            {mode === 'toReality' 
              ? "Paste any post. See what they're actually saying." 
              : "Turn your wins into polished LinkedIn gold."}
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Console Column */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-2xl shadow-slate-200/50">
              {/* Mode Switcher */}
              <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-6">
                <button
                  onClick={() => { setMode('toReality'); setInputText(''); setResult(null); }}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                    mode === 'toReality' ? 'bg-white text-[#0A66C2] shadow-sm ring-1 ring-slate-100' : 'text-slate-400 opacity-60'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Unmask Truth</span>
                </button>
                <button
                  onClick={() => { setMode('toLinkedIn'); setInputText(''); setResult(null); }}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                    mode === 'toLinkedIn' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 opacity-60'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Jargonizer</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {mode === 'toReality' ? <ShieldAlert className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                    {mode === 'toReality' ? '1. Paste Post Below' : '1. State Your Achievement'}
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={mode === 'toReality' ? "Paste that cringe post here..." : "e.g. 'I fixed a bug on the login page.'"}
                    className="w-full h-40 bg-slate-50/50 border-2 border-slate-50 focus:border-[#0A66C2] focus:bg-white rounded-[24px] p-5 text-sm md:text-base font-medium transition-all shadow-inner resize-none placeholder:text-slate-300"
                  />

                  {/* Examples Section */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Try an Example:</span>
                    <div className="flex flex-wrap gap-2">
                       {(mode === 'toReality' ? [
                        { label: "Layoffs", text: "We've made the difficult decision to optimize our workforce for long-term scalability." },
                        { label: "Synergy", text: "Leveraging cross-functional synergies to redefine our core mission architecture." },
                      ] : [
                        { label: "Hired", text: "I just got hired at a tech startup." },
                        { label: "Bug Fix", text: "I fixed the broken checkout button." },
                      ]).map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => setInputText(ex.text)}
                          className={`px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold transition-all ${
                            mode === 'toReality' ? 'hover:border-[#0A66C2] hover:text-[#0A66C2]' : 'hover:border-emerald-500 hover:text-emerald-500'
                          }`}
                        >
                          {ex.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className={`w-full py-4 flex items-center justify-center gap-4 rounded-[20px] text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] disabled:opacity-30 ${
                    mode === 'toReality' ? 'bg-slate-900 border-b-4 border-slate-950 hover:bg-black' : 'bg-emerald-600 border-b-4 border-emerald-800 hover:bg-emerald-700'
                  }`}
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : mode === 'toReality' ? 'Decode Truth' : 'Recode for LinkedIn'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-1" />

          {/* Result Column */}
          <div className="lg:col-span-12 xl:col-span-6 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-full flex justify-center h-[370px] min-[375px]:h-[430px] min-[400px]:h-[500px] sm:h-[510px] md:h-[562px] xl:h-[562px] mb-2 md:mb-8">
                    <div className="scale-[0.65] min-[375px]:scale-[0.76] min-[400px]:scale-[0.88] sm:scale-[0.9] md:scale-100 origin-top">
                      <ShareCard 
                        ref={cardRef}
                        translation={result.translation}
                        originalText={inputText}
                        cringeScore={result.cringeScore}
                        mode={mode}
                        provider={result.provider}
                      />
                    </div>
                  </div>

                  <div ref={resultRef} className="w-full flex flex-col items-center gap-6 pt-6">
                    <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 w-full sm:w-auto">
                      <button
                        onClick={copyImageToClipboard}
                        disabled={isCopyingImage}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-[#0A66C2] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#004182] transition-all active:scale-95 shadow-lg shadow-[#0A66C2]/20"
                      >
                        {isCopyingImage ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Copy className="w-4 h-4" />}
                        Copy for LinkedIn
                      </button>
                      <button
                        onClick={handleNativeShare}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Card
                      </button>
                    </div>

                    <AnimatePresence>
                      {imageCopied && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black tracking-widest uppercase flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Ready to Paste (Cmd+V)
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-sm mx-auto mt-4 md:mt-12"
                >
                  <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-slate-200/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A66C2] to-emerald-400" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 mb-6 flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-[#0A66C2]" />
                       How It Works
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-black text-[10px]">1</div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Choose Your Vibe</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Pick <strong className="text-[#0A66C2]">Unmask Truth</strong> to decode cringe corporate posts, or <strong className="text-emerald-600">Jargonizer</strong> to rewrite your boring day into a viral LinkedIn essay.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-black text-[10px]">2</div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Let AI Cook</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tap one of the examples or paste your own text. Our AI generates the translation instantly.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-black text-[10px]">3</div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Share the Roast</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Copy your custom card as a beautiful high-res image to share directly to your feed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {savePreviewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md" onClick={() => setSavePreviewUrl(null)}>
            <div className="bg-white p-6 rounded-[32px] max-w-sm w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black">Save Image</h3>
              <img src={savePreviewUrl} className="w-full rounded-2xl shadow-xl" />
              <button onClick={() => setSavePreviewUrl(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest">Close</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
