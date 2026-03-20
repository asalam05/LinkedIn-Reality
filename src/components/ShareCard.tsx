import { forwardRef } from 'react';
import { Quote, ArrowDown } from 'lucide-react';

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
      className="w-[450px] h-[560px] bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative font-sans shrink-0 rounded-lg"
      style={{ aspectRatio: '4/5' }}
    >
      {/* App Branding Header (Tightened) */}
      <div className="bg-[#0A66C2] px-6 py-4 flex items-center justify-between text-white shadow-sm z-10 shrink-0">
        <div className="flex flex-col">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1">LinkedIn Reality</span>
          <span className="text-[9px] opacity-60 font-medium leading-none italic">linkedin-reality.pages.dev</span>
        </div>
      </div>

      {/* Main Content Area (Maximized Space) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-2 overflow-hidden">
        
        {/* The Action Cluster (Reduced spacing) */}
        <div className="w-full flex flex-col items-center space-y-3">
          
          {/* Section 1: Input (Edge-to-Edge approach) */}
          <div className="w-full p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1.5">
              {mode === 'toReality' ? 'The LinkedIn Post' : 'The Reality'}
            </span>
            <p className="text-sm text-slate-800 italic font-bold leading-snug line-clamp-3">
              "{originalText}"
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
              "{translation}"
          </p>
          </div>
        </div>
      </div>

      {/* Decorative Brand Marks (More subtle) */}
      <Quote className="absolute top-20 right-4 w-12 h-12 text-[#0A66C2]/5 fill-[#0A66C2]/5 pointer-events-none" />
      <Quote className="absolute bottom-6 left-4 w-10 h-10 text-[#0A66C2]/5 fill-[#0A66C2]/5 rotate-180 pointer-events-none" />
      
      {/* Bottom Subtle Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100/30" />
    </div>
  );
});
