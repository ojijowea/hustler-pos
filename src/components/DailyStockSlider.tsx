import React, { useState } from 'react';
import { Sliders, Moon, CheckCircle2 } from 'lucide-react';
import { InventoryItem, BusinessProfile } from '../types';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

interface DailyStockSliderProps {
  selectedProfile: BusinessProfile;
}

export const DailyStockSlider: React.FC<DailyStockSliderProps> = ({ selectedProfile }) => {
  const inventory = useLiveQuery(() => 
    db.inventory.where('businessProfile').equals(selectedProfile).toArray(), 
    [selectedProfile]
  );

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [remainingStock, setRemainingStock] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!inventory || inventory.length === 0) {
    return null;
  }

  const activeItem = selectedItem || inventory[0];
  const currentStock = activeItem ? activeItem.quantity : 0;
  const soldQty = Math.max(0, currentStock - remainingStock);
  const totalSalesVal = soldQty * (activeItem?.sellingPrice || 0);

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setRemainingStock(item.quantity);
  };

  const handleConfirmNightCount = async () => {
    if (!activeItem || activeItem.id === undefined) return;

    if (soldQty > 0) {
      const costBasis = soldQty * activeItem.costPrice;
      const faida = totalSalesVal - costBasis;

      // Record daily sales automatically from night stock measurement
      await db.sales.add({
        itemId: activeItem.id,
        itemName: activeItem.name,
        quantitySold: soldQty,
        unit: activeItem.unit,
        totalAmount: totalSalesVal,
        costBasis: costBasis,
        faida: faida,
        paymentType: 'CASH',
        createdAt: new Date().toISOString()
      });

      // Update remaining stock in inventory
      await db.inventory.update(activeItem.id, {
        quantity: remainingStock,
        lastUpdated: new Date().toISOString()
      });
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-indigo-700/50 my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl text-yellow-300">
            <Moon size={20} />
          </div>
          <div>
            <h3 className="font-black text-base tracking-wide text-white">KUPIMA STOCK (HESABU YA JIONI)</h3>
            <p className="text-xs text-indigo-300 font-medium">Bila Scale • Slide tu kujua uliyo uza leo</p>
          </div>
        </div>
      </div>

      {/* Item Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none mb-3">
        {inventory.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              activeItem.id === item.id
                ? 'bg-yellow-400 text-slate-950 border-yellow-400 shadow-md'
                : 'bg-indigo-950/60 text-indigo-200 border-indigo-700 hover:bg-indigo-800'
            }`}
          >
            {item.name} ({item.quantity} {item.unit})
          </button>
        ))}
      </div>

      {/* Interactive Question Card */}
      <div className="bg-indigo-950/80 border border-indigo-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-black text-indigo-200">
            "{activeItem.name}" zimebaki ngapi?
          </span>
          <span className="text-xs font-bold text-yellow-400">
            Stock ya awali: {currentStock} {activeItem.unit}
          </span>
        </div>

        {/* Range Slider */}
        <div className="py-3">
          <input
            type="range"
            min="0"
            max={Math.max(currentStock, 20)}
            step={activeItem.unit === 'Fungu' ? 0.5 : 1}
            value={remainingStock}
            onChange={(e) => setRemainingStock(parseFloat(e.target.value))}
            className="w-full h-3 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
        </div>

        {/* Math Feedback Banner */}
        <div className="bg-indigo-900/90 rounded-xl p-3 flex items-center justify-between mt-1 border border-indigo-700">
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-300">Umeuza Leo:</div>
            <div className="text-lg font-black text-emerald-400">
              {soldQty} {activeItem.unit}
              <span className="text-xs text-indigo-200 font-normal ml-1">
                (KES {totalSalesVal.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-indigo-300">Zimebaki Kwa Duka:</div>
            <div className="text-lg font-black text-yellow-300">
              {remainingStock} {activeItem.unit}
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmNightCount}
          className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          {isSaved ? (
            <>
              <CheckCircle2 size={18} className="text-emerald-700" />
              <span>HESABU IMEHIFADHIKAN!</span>
            </>
          ) : (
            <>
              <Sliders size={18} />
              <span>THIBITISHA HESABU YA LEO</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
