import React from 'react';
import { Store, Mail, ExternalLink, ShieldCheck, MessageSquare, Award } from 'lucide-react';
import { LanguageMode, TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  lang: LanguageMode;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-slate-900 text-white pt-6 pb-12 px-4 border-t-4 border-emerald-500 rounded-t-3xl mt-8">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 shadow font-black">
              <Store size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight leading-none">
                MyDukaz<span className="text-yellow-400">POS</span>
              </h3>
              <p className="text-[11px] text-emerald-400 font-bold">Micro-Merchant Swahili Ledger</p>
            </div>
          </div>

          {/* Free WhatsApp API Badge */}
          <div className="bg-emerald-950 border border-emerald-500/60 rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow">
            <MessageSquare size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide">
              Free WA API Active
            </span>
          </div>
        </div>

        {/* Contact & Support Email */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <Mail size={16} className="text-yellow-400" />
            <span>Support:</span>
            <a
              href="mailto:info@mydukazpos.com"
              className="text-yellow-400 underline hover:text-yellow-300 font-extrabold"
            >
              info@mydukazpos.com
            </a>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full font-bold">
            24/7 Support
          </span>
        </div>

        {/* Agent Referral Link Card */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-600/60 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-black text-emerald-300 flex items-center gap-1">
              <Award size={12} className="text-yellow-300" /> Agent Referral Link:
            </div>
            <a
              href="http://mydukazpos.com/join/AG-ELD-001"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-white hover:underline flex items-center gap-1 mt-0.5"
            >
              mydukazpos.com/join/AG-ELD-001 <ExternalLink size={10} className="text-yellow-400" />
            </a>
          </div>
          <div className="bg-yellow-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow">
            AG-ELD-001
          </div>
        </div>

        {/* Powered By & Copyright */}
        <div className="text-center pt-2">
          <p className="text-xs font-bold text-gray-400">
            {t.poweredBy} • <a href="mailto:info@mydukazpos.com" className="text-emerald-400 underline">info@mydukazpos.com</a>
          </p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            Offline SQLite / Dexie Engine • Free WhatsApp Cloud API Receipts & Reminders
          </p>
        </div>

      </div>
    </footer>
  );
};
