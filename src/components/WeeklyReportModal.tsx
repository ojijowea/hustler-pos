import React, { useState } from 'react';
import { X, Calendar, Award, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ isOpen, onClose }) => {
  const sales = useLiveQuery(() => db.sales.toArray());
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const customers = useLiveQuery(() => db.customers.filter(c => c.totalDeni > 0).toArray());

  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen) return null;

  // Aggregate weekly figures (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklySales = sales?.filter(s => new Date(s.createdAt) >= sevenDaysAgo) || [];
  const weeklyExpenses = expenses?.filter(e => new Date(e.createdAt) >= sevenDaysAgo) || [];

  const mauzoWiki = weeklySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const stockCostWiki = weeklySales.reduce((sum, s) => sum + s.costBasis, 0);
  const matumiziWiki = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const faidaHalisiWiki = mauzoWiki - stockCostWiki - matumiziWiki;

  const deniNjeWiki = customers?.reduce((sum: number, c) => sum + c.totalDeni, 0) || 0;
  const debtorsCount = customers?.length || 0;

  const handlePayWeeklySubscription = () => {
    // STK Push or M-Pesa prompt simulation
    const phone = prompt('Andika namba yako ya M-Pesa kulipa KES 140 ya wiki:', '0712345678');
    if (phone) {
      alert(`STK Push imetumwa kwa ${phone}. Tafadhali weka PIN ya M-Pesa kulipa KES 140.`);
      setIsPaid(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border-2 border-emerald-500">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={24} className="text-yellow-300" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider">RIPOTI YA WIKI (SUNDAY)</h2>
              <p className="text-xs text-emerald-200">Kipindi: Siku 7 Zilizopita</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-emerald-900 text-emerald-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-3 flex items-center gap-3">
            <Award size={36} className="text-yellow-600 shrink-0" />
            <div className="text-xs text-yellow-950 font-medium">
              <strong className="font-black text-yellow-900">Hongera kwa Kazi Nzuri Wiki Hii!</strong>
              <br />Hapa kuna muhtasari wa biashara yako kabla ya kuanza wiki mpya.
            </div>
          </div>

          {/* Detailed Summary Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-slate-800 pb-2">
              MUHTASARI WA WIKI HII:
            </div>

            <div className="flex justify-between items-center text-sm font-bold border-b border-slate-800/60 pb-2">
              <span className="text-gray-300">Mauzo Total (Sales):</span>
              <span className="text-white text-base">KES {mauzoWiki.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold border-b border-slate-800/60 pb-2">
              <span className="text-gray-300">Matumizi ya Overhead:</span>
              <span className="text-amber-400">KES {matumiziWiki.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold border-b border-slate-800/60 pb-2">
              <span className="text-gray-300">Madeni Nje (Uncollected):</span>
              <span className="text-red-400">KES {deniNjeWiki.toLocaleString()} ({debtorsCount} watu)</span>
            </div>

            {/* FAIDA HALISI highlight */}
            <div className="bg-emerald-950 border border-emerald-500/50 rounded-xl p-3 flex justify-between items-center mt-2">
              <div>
                <div className="text-[10px] text-emerald-300 font-black uppercase">FAIDA HALISI YA WIKI:</div>
                <div className="text-2xl font-black text-yellow-300">
                  KES {faidaHalisiWiki.toLocaleString()}
                </div>
              </div>
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
          </div>

          {/* 140 Subscription Trigger */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center space-y-3">
            <div className="text-xs font-black text-emerald-950 uppercase tracking-wide">
              Ada Ya App Ya Wiki (App Subscription)
            </div>
            <p className="text-xs text-gray-700 font-medium">
              Umeingiza <strong className="text-emerald-700">KES {faidaHalisiWiki.toLocaleString()}</strong> faida halisi wiki hii! Lipa 140 bob kuendelea kutumia POS.
            </p>

            {isPaid ? (
              <div className="bg-emerald-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                <span>UMELIPA KES 140! WIKI IMESAJILIWA.</span>
              </div>
            ) : (
              <button
                onClick={handlePayWeeklySubscription}
                className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-slate-950 font-black py-3.5 px-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <CreditCard size={22} />
                <span>LIPA 140 YA WIKI</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
