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
  // Ultra-Readable Scale for 4:5 Aspect Ratio (Handles Extreme Jargon)
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len < 60) return 'text-[46px] leading-[1.0]';
    if (len < 120) return 'text-[38px] leading-[1.1]';
    if (len < 200) return 'text-[30px] leading-[1.2]';
    if (len < 300) return 'text-[24px] leading-[1.25]';
    return 'text-[19px] leading-[1.3]'; // New "Ultra-Long" Tier
  };

  const getLabel = () => {
    return mode === 'toReality' ? 'The Reality Check' : 'The Corporate Jargon';
  };

  return (
    <div 
      ref={ref} 
      id="capture-card" 
      className="w-full max-w-[450px] aspect-[4/5] bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative font-sans shrink-0 rounded-lg"
    >
      {/* App Branding Header (Beautified) */}
      <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] px-6 py-4 flex items-center justify-between text-white shadow-sm z-10 shrink-0 border-b border-[#0A66C2]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md shadow-inner">
            <Linkedin className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-white/90 drop-shadow-sm">LinkedIn Reality</span>
            <span className="text-[9px] text-emerald-300 font-bold leading-none tracking-widest shadow-emerald-400">linkedin-reality.asifsalam96.com</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Maximized Space) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-10 px-6 pb-6 overflow-hidden">
        
        {/* The Action Cluster (Reduced spacing) */}
        <div className="w-full flex flex-col items-center space-y-3">
          
          {/* Section 1: Input (Edge-to-Edge approach) */}
          <div className="w-full p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1.5">
              {mode === 'toReality' ? 'The LinkedIn Post' : 'The Reality'}
            </span>
            <p className="text-[13px] text-slate-800 italic font-bold leading-relaxed line-clamp-6">
              {originalText}
            </p>
          </div>

          {/* Transition Arrow (Compressed) */}
          <div className="flex flex-col items-center justify-center py-0.5">
            <div className="w-px h-4 bg-gradient-to-b from-slate-200 to-[#0A66C2]" />
            <div className="bg-[#0A66C2] p-1 rounded-full shadow-lg shadow-[#0A66C2]/10 -mt-0.5 transform scale-90">
              <ArrowDown className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Section 2: Output (Dominant Typography - NO CLAMP) */}
          <div className="w-full text-center px-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0A66C2] block mb-2">
              {getLabel()}
            </span>
            <p className={`${getFontSize(translation)} font-[1000] tracking-tighter text-slate-900`}>
              {translation}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Subtle Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100/30" />
    </div>
  );
});
