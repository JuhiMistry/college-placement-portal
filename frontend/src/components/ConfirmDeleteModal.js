import { useEffect } from "react";

export default function ConfirmDeleteModal({ isOpen, title, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-scaleUp">
        <div className="mb-4 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-3">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-100">{title || "Confirm Delete"}</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {message || "Are you sure you want to perform this action? This operation is permanent."}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 select-none rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs py-3 min-h-[44px] flex items-center justify-center transition-all outline-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 select-none rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-3 min-h-[44px] flex items-center justify-center transition-all outline-none cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
