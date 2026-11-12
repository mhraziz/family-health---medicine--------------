import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallButtonProps {
  lang?: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang = 'en' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // If running inside standalone PWA display mode, don't show install button
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 text-emerald-400 text-xs font-bold border border-emerald-800">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Installed PWA</span>
        <span className="sm:hidden">PWA</span>
      </div>
    );
  }

  // Label translations
  const label =
    lang === 'ur'
      ? 'ایپ انسٹال کریں'
      : lang === 'sd'
      ? 'ايپ انسٽال ڪريو'
      : 'Install App';

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowAndroidGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer border border-emerald-600"
        title="Install Sehat Sathi on your device for 100% offline access"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{label}</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-2 border-slate-300 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black">
                  {lang === 'ur' ? 'آئی فون پر انسٹال کریں' : 'Install on iPhone / iPad'}
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </span>
                <p>
                  Safari براؤزر میں نیچے <strong>Share</strong> (شیئر) بٹن دبائیں۔
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </span>
                <p>
                  نیچے سکرول کر کے <strong>Add to Home Screen</strong> (ہوم سکرین پر شامل کریں) منتخب کریں۔
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </span>
                <p>
                  اب ایپ 100% آف لائن بغیر انٹرنیٹ کے ہوم سکرین سے چلے گی۔
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              ٹھیک ہے (Done)
            </button>
          </div>
        </div>
      )}

      {/* Android/Chrome Manual Guide if browser blocked automated prompt */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-2 border-slate-300 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black">
                  {lang === 'ur' ? 'ہوم سکرین پر شامل کریں' : 'Install Sehat Sathi App'}
                </h3>
              </div>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm font-semibold text-slate-700">
              <p>
                براؤزر کے مینو (تین نقطوں <strong>⋮</strong>) پر کلک کریں اور <strong>"Install app"</strong> یا <strong>"Add to Home screen"</strong> منتخب کریں۔
              </p>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                ✅ سروس ورکر تمام فائلیں، دوائیں اور بی پی ریکارڈ فون میں کیش کر چکا ہے۔
              </div>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              ٹھیک ہے (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
