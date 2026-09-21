import React, { useState } from 'react';
import { PlusCircle, ShoppingBag, BookOpen, Receipt, Package, Sparkles, TrendingUp, Wallet, Award, CheckSquare, ShieldCheck, Zap } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OngezaStockModal } from './components/OngezaStockModal';
import { UzaModal } from './components/UzaModal';
import { DailyStockSlider } from './components/DailyStockSlider';
import { DeniBook } from './components/DeniBook';
import { MatumiziModal } from './components/MatumiziModal';
import { FaidaHalisiDashboard } from './components/FaidaHalisiDashboard';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { MetaWhatsAppSignup } from './components/MetaWhatsAppSignup';
import { WatiWhatsAppSettings } from './components/WatiWhatsAppSettings';
import { AgentDashboardModal } from './components/AgentDashboardModal';
import { CommunitySokoTab } from './components/CommunitySokoTab';
import { Fast60sOnboardingModal } from './components/Fast60sOnboardingModal';
import { AgentChecklistModal } from './components/AgentChecklistModal';
import { BusinessProfile } from './types';
import { LanguageMode, TRANSLATIONS } from './i18n/translations';
import { db } from './db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

export function App() {
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile>('Mama Mboga');
  const [lang, setLang] = useState<LanguageMode>('SW');
  const [merchantName, setMerchantName] = useState('Mama Aisha');
  const [activeTab, setActiveTab] = useState<'HOME' | 'SOKO'>('HOME');
  const t = TRANSLATIONS[lang];

  // Modals state
  const [is60sOnboardingOpen, setIs60sOnboardingOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isOngezaStockOpen, setIsOngezaStockOpen] = useState(false);
  const [isUzaOpen, setIsUzaOpen] = useState(false);
  const [uzaInitialMode, setUzaInitialMode] = useState<'CASH' | 'DENI'>('CASH');
  const [isMatumiziOpen, setIsMatumiziOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isWatiModalOpen, setIsWatiModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  // Live Inventory & Metrics Query
  const inventory = useLiveQuery(() => 
    db.inventory.where('businessProfile').equals(selectedProfile).toArray(),
    [selectedProfile]
  );
  const sales = useLiveQuery(() => db.sales.toArray());
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const customers = useLiveQuery(() => db.customers.filter(c => c.totalDeni > 0).toArray());

  // Metrics for Facebook Story Cards
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales?.filter(s => s.createdAt.startsWith(todayStr)) || [];
  const todayExpenses = expenses?.filter(e => e.createdAt.startsWith(todayStr)) || [];

  const totalMauzoToday = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalStockCostUsed = todaySales.reduce((sum, s) => sum + s.costBasis, 0);
  const totalMatumiziToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const faidaHalisiToday = totalMauzoToday - totalStockCostUsed - totalMatumiziToday;
  const totalDeniOutside = customers?.reduce((sum, c) => sum + c.totalDeni, 0) || 0;

  const openUzaModal = (mode: 'CASH' | 'DENI') => {
    setUzaInitialMode(mode);
    setIsUzaOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12 text-gray-900 font-sans">
      
      {/* Top Bar Header */}
      <Header
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        onOpenWeeklyReport={() => setIsWeeklyReportOpen(true)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onOpenWatiModal={() => setIsWatiModalOpen(true)}
        onOpenSokoTab={() => setActiveTab(activeTab === 'HOME' ? 'SOKO' : 'HOME')}
        onOpenChecklistModal={() => setIsChecklistOpen(true)}
        lang={lang}
        onSelectLang={setLang}
        activeTab={activeTab}
      />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        
        {/* GREEN BADGE: INAFANYA BILA BUNDLES */}
        <div className="bg-emerald-950 text-emerald-300 border border-emerald-500/60 rounded-2xl p-2.5 flex items-center justify-between text-xs font-black shadow-inner">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-yellow-300" />
            Inafanya Bila Bundles (Offline Mode Active)
          </span>
          <button
            onClick={() => setIs60sOnboardingOpen(true)}
            className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"
          >
            <Zap size={12} /> 60s Onboard
          </button>
        </div>

        {/* TAB SWITCHER: HOME VS COMMUNITY SOKO */}
        <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
              activeTab === 'HOME'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            🏠 Duka Feed (Pos)
          </button>

          <button
            onClick={() => setActiveTab('SOKO')}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1 ${
              activeTab === 'SOKO'
                ? 'bg-yellow-400 text-slate-950 shadow-md'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            🛒 Community Soko (Screen 6)
          </button>
        </div>

        {/* SCREEN 6: COMMUNITY SOKO TAB */}
        {activeTab === 'SOKO' ? (
          <CommunitySokoTab />
        ) : (
          <>
            {/* FACEBOOK-SIMPLE PERSONAL GREETING FEED CARD */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-3xl shadow-md flex items-center justify-between">
              <div onClick={() => setIs60sOnboardingOpen(true)} className="cursor-pointer" title="60-Second Onboarding">
                <h2 className="text-2xl font-black tracking-tight">{t.greeting.replace('Mama Aisha', merchantName)}</h2>
                <p className="text-xs text-emerald-100 font-bold">Tap hapa kuanzisha 60s Zero-Typing Onboarding!</p>
              </div>
              
              {/* Agent Badge Quick Launcher */}
              <button
                onClick={() => setIsAgentModalOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3 py-2 rounded-2xl text-xs font-black flex items-center gap-1 shadow-lg transition-transform active:scale-95"
                title="Agent Portal (AG-ELD-001)"
              >
                <Award size={16} />
                <span>AG-ELD-001</span>
              </button>
            </div>

            {/* FACEBOOK STORY CARDS (SWIPEABLE SUMMARY) */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* Sales Today Story */}
              <div className="bg-emerald-900 text-white p-3 rounded-2xl shadow-sm border border-emerald-700 flex flex-col justify-between min-h-[90px]">
                <div className="text-[10px] text-emerald-300 font-black uppercase flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-400" /> {t.salesToday}
                </div>
                <div className="text-base font-black text-white">
                  KES {totalMauzoToday.toLocaleString()}
                </div>
              </div>

              {/* True Profit Story */}
              <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-sm border border-slate-700 flex flex-col justify-between min-h-[90px]">
                <div className="text-[10px] text-yellow-400 font-black uppercase flex items-center gap-1">
                  <Sparkles size={12} className="text-yellow-400" /> {t.profitToday}
                </div>
                <div className="text-base font-black text-yellow-300">
                  KES {faidaHalisiToday.toLocaleString()}
                </div>
              </div>

              {/* Deni Outside Story */}
              <div className="bg-red-900 text-white p-3 rounded-2xl shadow-sm border border-red-700 flex flex-col justify-between min-h-[90px]">
                <div className="text-[10px] text-red-200 font-black uppercase flex items-center gap-1">
                  <Wallet size={12} className="text-red-300" /> {t.deniOutside}
                </div>
                <div className="text-base font-black text-red-100">
                  KES {totalDeniOutside.toLocaleString()}
                </div>
              </div>

            </div>

            {/* 4 BIG BUTTONS BOTTOM (FACEBOOK LIKE/COMMENT STYLE) */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* 1. ONGEZA STOCK */}
              <button
                onClick={() => setIsOngezaStockOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white p-4 rounded-3xl shadow-lg border border-emerald-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[105px]"
              >
                <div className="p-2 bg-emerald-500/80 rounded-2xl text-yellow-300">
                  <PlusCircle size={26} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">{t.ongezaStockSub}</div>
                  <div className="text-lg font-black text-white leading-tight">{t.ongezaStockBtn}</div>
                </div>
              </button>

              {/* 2. UZA HARAKA */}
              <button
                onClick={() => openUzaModal('CASH')}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-4 rounded-3xl shadow-lg border border-blue-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[105px]"
              >
                <div className="p-2 bg-blue-500/80 rounded-2xl text-yellow-300">
                  <ShoppingBag size={26} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">{t.uzaHarakaSub}</div>
                  <div className="text-lg font-black text-white leading-tight">{t.uzaHarakaBtn}</div>
                </div>
              </button>

              {/* 3. DENI BOOK (UNMISSABLE RED BUTTON) */}
              <button
                onClick={() => openUzaModal('DENI')}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white p-4 rounded-3xl shadow-xl border border-red-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[105px] relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-yellow-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  Money Maker
                </div>
                <div className="p-2 bg-red-500/80 rounded-2xl text-white">
                  <BookOpen size={26} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-red-200 uppercase tracking-wider">{t.deniSub}</div>
                  <div className="text-xl font-black text-white leading-tight">{t.deniBtn}</div>
                </div>
              </button>

              {/* 4. MATUMIZI */}
              <button
                onClick={() => setIsMatumiziOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white p-4 rounded-3xl shadow-lg border border-amber-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[105px]"
              >
                <div className="p-2 bg-amber-500/80 rounded-2xl text-yellow-200">
                  <Receipt size={26} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">{t.matumiziSub}</div>
                  <div className="text-lg font-black text-white leading-tight">{t.matumiziBtn}</div>
                </div>
              </button>

            </div>

            {/* REAL-TIME FAIDA HALISI DASHBOARD */}
            <FaidaHalisiDashboard />

            {/* NIGHT STOCK MEASUREMENT SLIDER */}
            <DailyStockSlider selectedProfile={selectedProfile} />

            {/* DENI BOOK LIST */}
            <DeniBook onOpenNewDeniModal={() => openUzaModal('DENI')} lang={lang} />

            {/* INVENTORY STOCK TABLE */}
            <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 my-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Package size={20} />
                  </div>
                  <h3 className="font-black text-lg text-gray-900">
                    Stock Iliyo Duka ({selectedProfile})
                  </h3>
                </div>
                <button
                  onClick={() => setIsOngezaStockOpen(true)}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  + Ongeza
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {inventory?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        Kununua: KES {item.costPrice} • Kuuza: KES {item.sellingPrice}/{item.unit}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        item.quantity <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.quantity} {item.unit}
                      </span>
                      <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                        Thamani: KES {(item.quantity * item.sellingPrice).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </main>

      {/* MYDUKAZPOS OFFICIAL FOOTER */}
      <Footer lang={lang} onOpenAgentModal={() => setIsAgentModalOpen(true)} />

      {/* MODALS */}
      <Fast60sOnboardingModal
        isOpen={is60sOnboardingOpen}
        onComplete={(name) => {
          setMerchantName(name);
          setIs60sOnboardingOpen(false);
        }}
      />

      <AgentChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      <OngezaStockModal
        isOpen={isOngezaStockOpen}
        onClose={() => setIsOngezaStockOpen(false)}
        selectedProfile={selectedProfile}
      />

      <UzaModal
        isOpen={isUzaOpen}
        onClose={() => setIsUzaOpen(false)}
        selectedProfile={selectedProfile}
        initialMode={uzaInitialMode}
      />

      <MatumiziModal
        isOpen={isMatumiziOpen}
        onClose={() => setIsMatumiziOpen(false)}
      />

      <WeeklyReportModal
        isOpen={isWeeklyReportOpen}
        onClose={() => setIsWeeklyReportOpen(false)}
      />

      <MetaWhatsAppSignup
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      <WatiWhatsAppSettings
        isOpen={isWatiModalOpen}
        onClose={() => setIsWatiModalOpen(false)}
        inventory={inventory}
      />

      <AgentDashboardModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

    </div>
  );
}
export default App;
