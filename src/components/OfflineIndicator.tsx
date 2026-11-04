import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { WifiOff, CheckCircle2 } from 'lucide-react';

interface Props {
  language: Language;
}

export const OfflineIndicator: React.FC<Props> = ({ language }) => {
  const { isOnline, wasOffline } = useOnlineStatus();
  const t = translations[language];

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-xl bg-amber-600/95 backdrop-blur-md px-4 py-3 text-xs font-medium text-white shadow-2xl border border-amber-400/30 animate-in slide-in-from-bottom duration-300">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
        <div className="flex-1">
          <p className="font-semibold">{t.pwa.offlineMode}</p>
        </div>
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-xl bg-emerald-600/95 backdrop-blur-md px-4 py-3 text-xs font-medium text-white shadow-2xl border border-emerald-400/30 animate-in slide-in-from-bottom duration-300">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
        <p className="font-semibold">{t.pwa.syncedNotice}</p>
      </div>
    );
  }

  return null;
};
