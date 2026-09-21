import React, { useState, useEffect } from 'react';
import { Store, Wifi, WifiOff, MessageSquare, Calendar, Globe } from 'lucide-react';
import { BusinessProfile } from '../types';
import { LanguageMode } from '../i18n/translations';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';

interface HeaderProps {
  selectedProfile: BusinessProfile;
  onSelectProfile: (profile: BusinessProfile) => void;
  onOpenWeeklyReport: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenWatiModal?: () => void;
  lang: LanguageMode;
  onSelectLang: (lang: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedProfile,
  onSelectProfile,
  onOpenWeeklyReport,
  onOpenWhatsAppModal,
  onOpenWatiModal,
  lang,
  onSelectLang
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const wabaSettings = useLiveQuery(() => db.wabaSettings.toArray());
  const isWhatsAppConnected = wabaSettings && wabaSettings.length > 0 && !!wabaSettings[0].wabaId;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo & MyDukazPOS Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-xl text-emerald-950 shadow">
            <Store size={22} className="font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-white">
              MyDukaz<span className="text-yellow-300 font-bold">POS</span>
            </h1>
            <p className="text-[10px] text-emerald-200 font-bold">info@mydukazpos.com</p>
          </div>
        </div>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-1.5">
          
          {/* Language Toggle Pill: EN / SW / SHENG */}
          <div className="bg-emerald-900/90 p-0.5 rounded-xl border border-emerald-500/60 flex items-center gap-0.5">
            {(['SW', 'SHENG', 'EN'] as LanguageMode[]).map((l) => (
              <button
                key={l}
                onClick={() => onSelectLang(l)}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                  lang === l
                    ? 'bg-yellow-400 text-slate-950 shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Sunday Weekly Report Button */}
          <button
            onClick={onOpenWeeklyReport}
            className="bg-emerald-800 hover:bg-emerald-900 text-yellow-300 p-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-600 shadow-sm"
            title="Ripoti ya Wiki (Sunday Report)"
          >
            <Calendar size={16} />
          </button>

          {/* WhatsApp Badge */}
          <button
            onClick={onOpenWhatsAppModal}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm border ${
              isWhatsAppConnected
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-emerald-800/80 text-emerald-200 border-emerald-600'
            }`}
            title="Connect WhatsApp Cloud API"
          >
            <MessageSquare size={16} className={isWhatsAppConnected ? 'text-yellow-300' : ''} />
          </button>

          {/* Online/Offline Badge */}
          <div
            className={`px-2 py-1 rounded-full text-[9px] font-black flex items-center gap-1 ${
              isOnline ? 'bg-emerald-950 text-emerald-300' : 'bg-red-800 text-red-100 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

        </div>
      </div>

      {/* Duka Profile Selector Bar */}
      <div className="bg-emerald-800/90 border-t border-emerald-600/50 px-3 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-md mx-auto flex items-center gap-1.5 text-xs">
          <span className="text-emerald-300 text-[11px] font-medium whitespace-nowrap pl-1">Duka:</span>
          {(['Mama Mboga', 'Duka', 'Chips Kibanda', 'Kinyozi', 'Butchery'] as BusinessProfile[]).map((prof) => (
            <button
              key={prof}
              onClick={() => onSelectProfile(prof)}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                selectedProfile === prof
                  ? 'bg-yellow-400 text-emerald-950 shadow-sm'
                  : 'bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {prof}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
