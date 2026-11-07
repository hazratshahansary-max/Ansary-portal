import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language } from '../types';
import { Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

interface OfflineBannerProps {
  language: Language;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [wasOffline, setWasOffline] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      const timer = setTimeout(() => setWasOffline(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !wasOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      {isOnline && wasOffline ? (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-600/95 backdrop-blur-md px-4 py-3 text-xs font-medium text-white shadow-2xl border border-emerald-400/30">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <p className="font-semibold">{t.pwa.syncedNotice}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-600/95 backdrop-blur-md px-4 py-3 text-xs font-medium text-white shadow-2xl border border-amber-400/30">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
          <div>
            <p className="font-bold">{t.pwa.offlineMode}</p>
            <p className="text-[11px] text-amber-100 opacity-90">
              {language === 'ps' ? 'پخوانۍ لوستل شوې پاڼې لا هم شتون لري.' : 'Previously viewed pages remain available offline.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
