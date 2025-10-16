'use client';

import { useEffect, useState } from 'react';

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export function useA2HS() {
  const [deferredPrompt, setDeferredPrompt] = useState<BIPEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // ติดตั้งแล้ว? (Chrome/Android + Desktop PWA)
    const media = window.matchMedia('(display-mode: standalone)');

    const updateStandalone = () => {
      const nav = window.navigator as Navigator & { standalone?: boolean };
      setIsStandalone(media.matches || nav.standalone === true);
    };

    updateStandalone();
    media.addEventListener?.('change', updateStandalone);

    // iOS detection (Safari)
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));

    // ดัก beforeinstallprompt (Android/Chrome)
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', onBIP);

    // ถ้าติดตั้งเสร็จจะยิง event นี้
    const onInstalled = () => setDeferredPrompt(null);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      media.removeEventListener?.('change', updateStandalone);
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  return { deferredPrompt, setDeferredPrompt, isStandalone, isIOS };
}
