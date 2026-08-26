import React, { useState } from 'react';
import { Image as ImageIcon, CheckCircle, ZoomIn, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface EvidenceViewerProps {
  originalImage?: string;
  resolutionImage?: string;
  citizenVerified?: boolean;
  verificationComment?: string;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  originalImage,
  resolutionImage,
  citizenVerified,
  verificationComment,
}) => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-civic-400" />
          <span>Visual Photographic Evidence</span>
        </h4>
        {citizenVerified && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Citizen Verified</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Citizen Image */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col">
          <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span className="uppercase tracking-wider">Citizen Site Photo</span>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              Original Submission
            </span>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group">
            {originalImage ? (
              <>
                <img
                  src={originalImage}
                  alt="Original Citizen Report Evidence"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <button
                  onClick={() => setSelectedImg(originalImage)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-xs"
                >
                  <ZoomIn className="w-4 h-4" /> Full View
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-600">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs font-medium">No initial photo attached</span>
              </div>
            )}
          </div>
        </div>

        {/* Resolution Proof Image */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col">
          <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span className="uppercase tracking-wider">Field Resolution Proof</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              After Remediation
            </span>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group">
            {resolutionImage ? (
              <>
                <img
                  src={resolutionImage}
                  alt="Resolution Proof"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <button
                  onClick={() => setSelectedImg(resolutionImage)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-xs"
                >
                  <ZoomIn className="w-4 h-4" /> Full View
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-600">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs font-medium">Resolution proof pending</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Citizen Feedback / Verification Comment */}
      {verificationComment && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Citizen Verification Feedback</span>
          </div>
          <p className="text-xs text-slate-300 italic">"{verificationComment}"</p>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            onClick={() => setSelectedImg(null)}
            className="absolute top-4 right-4 p-2 text-white bg-slate-800 rounded-full hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImg}
            alt="Expanded Evidence"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
