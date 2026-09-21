import React, { useState } from 'react';
import { PlusCircle, ShoppingBag, BookOpen, Receipt, Package, RefreshCw, Layers } from 'lucide-react';
import { Header } from './components/Header';
import { OngezaStockModal } from './components/OngezaStockModal';
import { UzaModal } from './components/UzaModal';
import { DailyStockSlider } from './components/DailyStockSlider';
import { DeniBook } from './components/DeniBook';
import { MatumiziModal } from './components/MatumiziModal';
import { FaidaHalisiDashboard } from './components/FaidaHalisiDashboard';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { MetaWhatsAppSignup } from './components/MetaWhatsAppSignup';
import { WatiWhatsAppSettings } from './components/WatiWhatsAppSettings';
import { BusinessProfile } from './types';
import { db } from './db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

export function App() {
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile>('Mama Mboga');
  
  // Modals state
  const [isOngezaStockOpen, setIsOngezaStockOpen] = useState(false);
  const [isUzaOpen, setIsUzaOpen] = useState(false);
  const [uzaInitialMode, setUzaInitialMode] = useState<'CASH' | 'DENI'>('CASH');
  const [isMatumiziOpen, setIsMatumiziOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isWatiModalOpen, setIsWatiModalOpen] = useState(false);

  // Live Inventory Query
  const inventory = useLiveQuery(() => 
    db.inventory.where('businessProfile').equals(selectedProfile).toArray(),
    [selectedProfile]
  );

  const openUzaModal = (mode: 'CASH' | 'DENI') => {
    setUzaInitialMode(mode);
    setIsUzaOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24 text-gray-900 font-sans">
      
      {/* Top Bar Header */}
      <Header
        selectedProfile={selectedProfile}
        onSelectProfile={setSelectedProfile}
        onOpenWeeklyReport={() => setIsWeeklyReportOpen(true)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onOpenWatiModal={() => setIsWatiModalOpen(true)}
      />

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        
        {/* BIG ACTION BUTTONS GRID */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* 1. ONGEZA STOCK */}
          <button
            onClick={() => setIsOngezaStockOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white p-4 rounded-3xl shadow-lg border border-emerald-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[110px]"
          >
            <div className="p-2 bg-emerald-500/80 rounded-2xl text-yellow-300">
              <PlusCircle size={28} />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Kunua Stock</div>
              <div className="text-xl font-black text-white leading-tight">+ ONGEZA STOCK</div>
            </div>
          </button>

          {/* 2. UZA HARAKA */}
          <button
            onClick={() => openUzaModal('CASH')}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-4 rounded-3xl shadow-lg border border-blue-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[110px]"
          >
            <div className="p-2 bg-blue-500/80 rounded-2xl text-yellow-300">
              <ShoppingBag size={28} />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">Lipa Sasa</div>
              <div className="text-xl font-black text-white leading-tight">UZA HARAKA</div>
            </div>
          </button>

          {/* 3. DENI BOOK (UNMISSABLE RED BUTTON) */}
          <button
            onClick={() => openUzaModal('DENI')}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white p-4 rounded-3xl shadow-xl border border-red-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[110px] relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Important!
            </div>
            <div className="p-2 bg-red-500/80 rounded-2xl text-white">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="text-xs font-bold text-red-200 uppercase tracking-wider">Kukopesha</div>
              <div className="text-2xl font-black text-white leading-tight tracking-wide">📕 DENI</div>
            </div>
          </button>

          {/* 4. MATUMIZI */}
          <button
            onClick={() => setIsMatumiziOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white p-4 rounded-3xl shadow-lg border border-amber-500 transition-transform active:scale-95 flex flex-col items-start justify-between min-h-[110px]"
          >
            <div className="p-2 bg-amber-500/80 rounded-2xl text-yellow-200">
              <Receipt size={28} />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wider">Fare, Rent, Chai</div>
              <div className="text-xl font-black text-white leading-tight">MATUMIZI</div>
            </div>
          </button>

        </div>

        {/* REAL-TIME FAIDA HALISI DASHBOARD */}
        <FaidaHalisiDashboard />

        {/* NIGHT STOCK MEASUREMENT SLIDER ("Nyanya zimebaki ngapi?") */}
        <DailyStockSlider selectedProfile={selectedProfile} />

        {/* DENI BOOK LIST */}
        <DeniBook onOpenNewDeniModal={() => openUzaModal('DENI')} />

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

      </main>

      {/* MODALS */}
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

    </div>
  );
}
export default App;
