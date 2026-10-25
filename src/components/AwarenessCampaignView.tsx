import React, { useState } from 'react';
import { AwarenessCampaignMedia } from '../types/index.ts';
import {
  Share2,
  Download,
  CheckCircle2,
  BookOpen,
  Check,
  Heart,
} from 'lucide-react';

interface AwarenessCampaignViewProps {
  campaigns: AwarenessCampaignMedia[];
}

export const AwarenessCampaignView: React.FC<AwarenessCampaignViewProps> = ({ campaigns }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['ALL', 'Infographic', 'Donor Guide', 'Myths vs Facts', 'Social Poster'];

  const filteredCampaigns = campaigns.filter((c) =>
    selectedCategory === 'ALL' ? true : c.category === selectedCategory
  );

  const handleShare = async (camp: AwarenessCampaignMedia) => {
    const shareText = `[Blood Donation Awareness] ${camp.title}\n\n${camp.summary}\n\nKey Takeaways:\n${camp.keyTakeaways.map((k) => `• ${k}`).join('\n')}\n\nShared via LifeLink`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: camp.title,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
        setCopiedId(camp.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedId(camp.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownload = (camp: AwarenessCampaignMedia) => {
    // Generates a clean text/graphic educational summary file
    const content = `${camp.title}\n${'='.repeat(camp.title.length)}\n\nCategory: ${camp.category}\n\nSummary:\n${camp.summary}\n\nClinical Guidelines:\n${camp.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nPublished by LifeLink Awareness Initiative.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifelink_${camp.category.toLowerCase().replace(/\s+/g, '_')}_guide.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-rose-600 tracking-wider uppercase mb-1">
            Educational Graphics & Guidelines
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Blood Donation Awareness Hub
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Clear, evidence-backed medical guides, myths vs facts infographics, and shareable awareness
            materials for voluntary donor education.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
          <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
          <span>1 Pint Can Save Up to 3 Lives</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'ALL' ? 'All Topics' : cat}
          </button>
        ))}
      </div>

      {/* Clean Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Graphic Banner */}
              <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-rose-950 text-white p-5 relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-md">
                    {camp.category}
                  </span>
                  <span className="text-xs text-rose-200 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Clinical Guide</span>
                  </span>
                </div>

                <div className="relative z-10 mt-5">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {camp.title}
                  </h3>
                </div>

                {/* Subtle graphic background motif */}
                <div className="absolute right-2 -bottom-6 opacity-10 pointer-events-none">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3.5">
                <p className="text-xs text-slate-600 leading-relaxed">{camp.summary}</p>

                {/* Key Points */}
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    Essential Clinical Points:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {camp.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => handleDownload(camp)}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Guide</span>
              </button>

              <button
                onClick={() => handleShare(camp)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copiedId === camp.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Material</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
