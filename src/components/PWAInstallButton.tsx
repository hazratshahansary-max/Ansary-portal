import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface Props {
  language: Language;
  variant?: 'nav' | 'banner' | 'modal';
}

export const PWAInstallButton: React.FC<Props> = ({ language, variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const t = translations[language];

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) setInstallSuccess(true);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Direct instruction fallback for desktop Chrome / browsers without prompt trigger
      setShowIOSModal(true);
    }
  };

  if (variant === 'nav') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
          title={t.pwa.installDesc}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t.actions.installApp}</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative text-left [dir=rtl]:text-right">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 [dir=rtl]:right-auto [dir=rtl]:left-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-[#070D1E] flex items-center justify-center p-2 border border-amber-400/40 shadow-md">
                  <img src="/icon.svg" alt="ANSARY App Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.pwa.installTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ANSARY PWA (Android / iPhone / Desktop)
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {t.pwa.installDesc}
              </p>

              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2 mb-5">
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  {t.pwa.iosInstructions}
                </p>
                <p className="text-slate-700 dark:text-slate-300">{t.pwa.iosStep1}</p>
                <p className="text-slate-700 dark:text-slate-300">{t.pwa.iosStep2}</p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition text-center"
                >
                  {t.actions.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Banner variant for home / hero section
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-[#0B1A30] to-slate-900 border border-blue-800/40 p-5 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-800 to-slate-950 p-2.5 border border-amber-400/40 shadow-lg shrink-0">
            <img src="/icon.svg" alt="ANSARY Icon" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-wide text-white">
                {t.pwa.installTitle}
              </h4>
              <span className="text-[10px] font-semibold text-amber-400 border border-amber-400/30 px-1.5 py-0.5 rounded">
                PWA v1.0
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {t.pwa.installDesc}
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg transition active:scale-95 whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{t.pwa.installBtn}</span>
        </button>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative text-left [dir=rtl]:text-right">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 [dir=rtl]:right-auto [dir=rtl]:left-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t.pwa.installTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {t.pwa.installDesc}
            </p>
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2 mb-4">
              <p className="font-semibold text-amber-600 dark:text-amber-400">
                {t.pwa.iosInstructions}
              </p>
              <p className="text-slate-700 dark:text-slate-300">{t.pwa.iosStep1}</p>
              <p className="text-slate-700 dark:text-slate-300">{t.pwa.iosStep2}</p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {t.actions.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
