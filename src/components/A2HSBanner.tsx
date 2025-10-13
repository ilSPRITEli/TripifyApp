'use client';
import { useEffect, useState } from 'react';
import { useA2HS } from '../hooks/useA2HS';

const LS_KEY = 'a2hs_dismissed_v1';

export default function A2HSBanner() {
  const { deferredPrompt, setDeferredPrompt, isStandalone, isIOS } = useA2HS();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(LS_KEY) === '1';
    if (!isStandalone && !dismissed && (deferredPrompt || isIOS)) {
      setOpen(true);
    }
  }, [deferredPrompt, isStandalone, isIOS]);

  if (isStandalone || !open) return null;

  const onInstallClick = async () => {
    if (!deferredPrompt) return; // for ios (ไม่มี prompt)
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
    setOpen(false);
  };

  const onClose = () => {
    localStorage.setItem(LS_KEY, '1'); // ไม่กวนซ้ำ
    setOpen(false);
  };

  return (
    <div
      className="fixed left-4 right-4 bottom-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl"
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img src="/icons/icon-192.png" alt="" width={28} height={28} style={{ borderRadius: 6 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Install Tripify</div>
          {!isIOS ? (
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              Add Tripify to your Home Screen for a full-app experience.
            </div>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              iOS: Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
            </div>
          )}
        </div>

        {!isIOS ? (
          <button
            onClick={onInstallClick}
            className="bg-primary text-white border-none py-2 px-3 rounded-lg font-semibold"
          >
            Add
          </button>
        ) : (
          <button
            onClick={onClose}
            className="bg-transparent text-white border border-white/25 py-2 px-2.5 rounded-lg font-semibold"
          >
            Got it
          </button>
        )}
      </div>

      {/* iOS */}
      {isIOS && (
        <div className="mt-2 text-xs opacity-80">
          <span className="font-normal">
            • Open in Safari → tap the <span className="font-bold">Share</span> button →
          </span>
          <span style={{ fontWeight: 700 }}> Add to Home Screen</span>
        </div>
      )}

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-1.5 right-2 bg-transparent border-none text-white text-lg opacity-60"
      >
        ×
      </button>
    </div>
  );
}
