import { forwardRef } from 'react';
import { ArrowDown, Linkedin } from 'lucide-react';

interface ShareCardProps {
  translation: string;
  originalText: string;
  cringeScore: number;
  mode: 'toReality' | 'toLinkedIn';
  provider: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ 
  translation, 
  originalText,
  mode
}, ref) => {
  // Ultra-Readable Scale for 4:5 Aspect Ratio
  const getTypography = (text: string) => {
    const len = text.length;
    if (len < 60) return 'text-[44px] leading-[1.05] font-[1000] tracking-tight';
    if (len < 120) return 'text-[36px] leading-[1.1] font-[1000] tracking-tight';
    if (len < 200) return 'text-[28px] leading-[1.2] font-[900] tracking-tight';
    if (len < 300) return 'text-[22px] leading-[1.25] font-[800] tracking-tight';
    if (len < 400) return 'text-[18px] leading-[1.3] font-bold tracking-normal';
    if (len < 550) return 'text-[15px] leading-[1.4] font-bold tracking-normal';
    if (len < 750) return 'text-[13px] leading-[1.4] font-semibold tracking-normal';
    return 'text-[11px] leading-[1.5] font-medium tracking-normal';
  };

  const getLabel = () => {
    return mode === 'toReality' ? 'The Reality Check' : 'The Corporate Jargon';
  };

  return (
    <div 
      ref={ref} 
      id="capture-card" 
      className="w-[450px] aspect-[4/5] bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative font-sans shrink-0 rounded-lg"
    >
      {/* App Branding Header (Stronger) */}
      <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] px-6 py-5 flex items-center justify-center text-white shadow-sm z-10 shrink-0 border-b border-[#0A66C2]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md shadow-inner">
            <Linkedin className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
          <span className="text-[18px] font-black uppercase tracking-[0.15em] leading-none text-white/95 drop-shadow-sm mt-0.5">LinkedIn Reality</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6 px-6 pb-4 overflow-hidden">
        
        {/* The Action Cluster */}
        <div className="w-full flex flex-col items-center space-y-4">
          
          {/* Section 1: Input */}
          <div className="w-full p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">
              {mode === 'toReality' ? 'The LinkedIn Post' : 'The Reality'}
            </span>
            <p className="text-[15px] text-slate-800 italic font-bold leading-relaxed line-clamp-6">
              {originalText}
            </p>
          </div>

          {/* Transition Arrow */}
          <div className="flex flex-col items-center justify-center py-0.5">
            <div className="w-px h-5 bg-gradient-to-b from-slate-200 to-[#0A66C2]" />
            <div className="bg-[#0A66C2] p-1.5 rounded-full shadow-lg shadow-[#0A66C2]/10 -mt-0.5 transform scale-90">
              <ArrowDown className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Section 2: Output */}
          <div className="w-full text-center px-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0A66C2] block mb-2">
              {getLabel()}
            </span>
            <p className={`${getTypography(translation)} text-slate-900 line-clamp-[16]`}>
              {translation}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full bg-slate-50 border-t border-slate-100 py-3 text-center z-10 shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wide">
          Create yours at <span className="text-slate-600 font-bold">linkedin-reality.asifsalam96.com</span>
        </span>
      </div>
    </div>
  );
});
