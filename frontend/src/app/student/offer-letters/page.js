"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { useNotifications } from "@/context/NotificationContext";
import SkeletonCard from "@/components/SkeletonCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentOfferLetters() {
  const { fetchNotifications } = useNotifications();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // Selected offer for preview
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState(null);

  const loadOffers = async () => {
    try {
      const data = await apiService.offerLetters.getMy();
      setOffers(data);
    } catch (err) {
      console.error("Failed to load offers:", err);
      setError("Failed to load offer letters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    if (previewUrl) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [previewUrl]);

  const handleStatusUpdate = async (id, status) => {
    if (status === "Rejected" && !confirm("Are you sure you want to reject this placement offer? This action is irreversible.")) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      await apiService.offerLetters.updateStatus(id, status);
      if (status === "Accepted") {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000); // 5s confetti
      }
      await loadOffers();
      await fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update offer status.");
    } finally {
      setActionLoading(false);
    }
  };

  const getFullPdfUrl = (url) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "") : "";
    return `${backendUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-5">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-64 bg-slate-800 rounded mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Confetti Animation Layer */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
          {/* Confetti particles */}
          {Array.from({ length: 40 }).map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 2;
            const randomColor = ["bg-blue-400", "bg-indigo-400", "bg-emerald-400", "bg-purple-400", "bg-amber-400"][i % 5];
            
            return (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-sm ${randomColor} animate-bounce`}
                style={{
                  left: `${randomX}%`,
                  top: `-10px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `fall ${3 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${randomDelay}s`,
                }}
              />
            );
          })}
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl px-8 py-5 text-center shadow-2xl flex flex-col items-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Congratulations! 🎉</h2>
            <p className="text-xs text-slate-400 mt-1">You have accepted the offer. The placement coordinator has been notified.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl font-bold text-slate-100">Offer Letters</h2>
        <p className="text-xs text-slate-400 mt-1">Review received placements packages and submit acceptances</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {offers.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center max-w-xl mx-auto flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-200">No offer letters uploaded</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
            Once you clear final interviews, the placement department will upload your formal offer letters here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 flex flex-col justify-between hover:border-slate-800 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{offer.job?.title}</h4>
                    <p className="text-2xs text-slate-400 font-semibold mt-0.5">{offer.company?.companyName}</p>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    offer.status === "Accepted" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    offer.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {offer.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900">
                    <p className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Salary Package</p>
                    <p className="text-sm font-extrabold text-blue-400 mt-1">{offer.salary} LPA</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900">
                    <p className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Joining Date</p>
                    <p className="text-sm font-extrabold text-indigo-400 mt-1">
                      {new Date(offer.joiningDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => setPreviewUrl(getFullPdfUrl(offer.pdfUrl))}
                  className="rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-slate-100 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {offer.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(offer._id, "Rejected")}
                        disabled={actionLoading}
                        className="rounded-xl border border-red-900/30 hover:border-red-900/60 bg-red-950/10 hover:bg-red-950/20 px-3 py-2.5 text-xs font-bold text-red-400 cursor-pointer min-h-[44px] inline-flex items-center justify-center"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(offer._id, "Accepted")}
                        disabled={actionLoading}
                        className="rounded-xl bg-green-600 hover:bg-green-500 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-500/20 cursor-pointer min-h-[44px] inline-flex items-center justify-center"
                      >
                        Accept
                      </button>
                    </>
                  )}
                  {offer.status !== "Pending" && (
                    <a
                      href={getFullPdfUrl(offer.pdfUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Preview Dialog Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[80vh] md:h-[85vh] rounded-2xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Offer Letter PDF Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 p-1.5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Frame */}
            <div className="flex-1 bg-slate-950 p-2">
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-xl border border-slate-900 bg-slate-900"
                title="Offer Letter PDF"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fall {
          0% {
            top: -10px;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            top: 105vh;
            transform: translateX(100px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
