import React from 'react';
import { Sparkles, TrendingUp, DollarSign, Wallet, ArrowDownRight, Award } from 'lucide-react';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

export const FaidaHalisiDashboard: React.FC = () => {
  // Query today's sales and expenses
  const sales = useLiveQuery(() => db.sales.toArray());
  const expenses = useLiveQuery(() => db.expenses.toArray());

  // Filter for today
  const todayStr = new Date().toISOString().split('T')[0];

  const todaySales = sales?.filter(s => s.createdAt.startsWith(todayStr)) || [];
  const todayExpenses = expenses?.filter(e => e.createdAt.startsWith(todayStr)) || [];

  const totalMauzoToday = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalStockCostUsed = todaySales.reduce((sum, s) => sum + s.costBasis, 0);
  const totalMatumiziToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // TRUE FAIDA HALISI = Total Mauzo - Stock Cost - Matumizi
  const faidaHalisiToday = totalMauzoToday - totalStockCostUsed - totalMatumiziToday;
  const grossProfit = totalMauzoToday - totalStockCostUsed;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden my-4">
      
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-yellow-400 text-emerald-950 rounded-2xl shadow font-black">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              FAIDA HALISI <span className="text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-extrabold uppercase">Siku Ya Leo</span>
            </h3>
            <p className="text-xs text-emerald-200 font-medium">Mauzo minus Stock Cost minus Matumizi</p>
          </div>
        </div>
      </div>

      {/* Main Big Number */}
      <div className="bg-emerald-950/90 border border-emerald-600/50 rounded-2xl p-4 my-3 text-center relative z-10 shadow-inner">
        <div className="text-xs text-emerald-300 font-black uppercase tracking-widest mb-1">
          Pesa Halisi Mfukoni (Faida Halisi):
        </div>
        <div className={`text-4xl font-black ${faidaHalisiToday >= 0 ? 'text-yellow-300' : 'text-red-400'}`}>
          KES {faidaHalisiToday.toLocaleString()}
        </div>
        <div className="mt-1 text-[11px] text-emerald-200 font-bold">
          {faidaHalisiToday >= 0
            ? '🎉 Hongera Mama! Hizi ni pesa zakwako safi baada ya kulipia kila kitu.'
            : '⚠️ Tahadhari: Matumizi na gharama zimezidi mauzo ya leo.'}
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        
        {/* Mauzo Total */}
        <div className="bg-emerald-800/60 border border-emerald-700/50 p-2.5 rounded-xl text-center">
          <div className="text-[10px] text-emerald-200 font-bold uppercase flex items-center justify-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" /> Uliuza
          </div>
          <div className="text-sm font-black text-white mt-1">
            KES {totalMauzoToday.toLocaleString()}
          </div>
        </div>

        {/* Stock Cost */}
        <div className="bg-emerald-800/60 border border-emerald-700/50 p-2.5 rounded-xl text-center">
          <div className="text-[10px] text-emerald-200 font-bold uppercase flex items-center justify-center gap-1">
            <Wallet size={12} className="text-yellow-300" /> Stock Cost
          </div>
          <div className="text-sm font-black text-yellow-200 mt-1">
            KES {totalStockCostUsed.toLocaleString()}
          </div>
        </div>

        {/* Matumizi Overhead */}
        <div className="bg-amber-900/40 border border-amber-700/40 p-2.5 rounded-xl text-center">
          <div className="text-[10px] text-amber-200 font-bold uppercase flex items-center justify-center gap-1">
            <ArrowDownRight size={12} className="text-amber-400" /> Matumizi
          </div>
          <div className="text-sm font-black text-amber-300 mt-1">
            KES {totalMatumiziToday.toLocaleString()}
          </div>
        </div>

      </div>

      {/* Breakdown Formula */}
      <div className="mt-3 text-[11px] text-emerald-200/90 font-medium bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/40 flex items-center justify-between">
        <span>Gharama ya Stock: KES {totalStockCostUsed}</span>
        <span>+ Matumizi (Fare/Rent/Lunch): KES {totalMatumiziToday}</span>
      </div>

    </div>
  );
};
