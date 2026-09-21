import React, { useState } from 'react';
import { X, Camera, PlusCircle, CheckCircle, Calculator, PackageCheck } from 'lucide-react';
import { InventoryItem, UnitType, BusinessProfile } from '../types';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

interface OngezaStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProfile: BusinessProfile;
}

export const OngezaStockModal: React.FC<OngezaStockModalProps> = ({
  isOpen,
  onClose,
  selectedProfile
}) => {
  const items = useLiveQuery(() => 
    db.inventory.where('businessProfile').equals(selectedProfile).toArray(), 
    [selectedProfile]
  );

  const [selectedItemId, setSelectedItemId] = useState<number | 'NEW'>('NEW');
  const [customItemName, setCustomItemName] = useState('');
  const [unit, setUnit] = useState<UnitType>('Kilo');
  const [funguKgRatio, setFunguKgRatio] = useState<number>(0.25);
  
  const [quantityAdded, setQuantityAdded] = useState<number | ''>(10);
  const [costPerUnit, setCostPerUnit] = useState<number | ''>(50);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<number | ''>(80);
  
  const [receiptPhoto, setReceiptPhoto] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Auto-fill defaults when selecting an existing item
  const handleSelectItem = (idStr: string) => {
    if (idStr === 'NEW') {
      setSelectedItemId('NEW');
      setCustomItemName('');
    } else {
      const id = Number(idStr);
      setSelectedItemId(id);
      const found = items?.find(i => i.id === id);
      if (found) {
        setUnit(found.unit);
        setCostPerUnit(found.costPrice);
        setSellingPricePerUnit(found.sellingPrice);
        if (found.unitConversionKg) {
          setFunguKgRatio(found.unitConversionKg);
        }
      }
    }
  };

  // Math computations
  const qty = Number(quantityAdded) || 0;
  const cost = Number(costPerUnit) || 0;
  const sellPrice = Number(sellingPricePerUnit) || 0;

  const totalCost = qty * cost;
  const expectedSales = qty * sellPrice;
  const expectedFaida = expectedSales - totalCost;

  // Handle Receipt photo capture
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStock = async () => {
    let itemName = customItemName.trim();
    let itemId: number | undefined;

    if (selectedItemId !== 'NEW') {
      const found = items?.find(i => i.id === selectedItemId);
      if (found) {
        itemName = found.name;
        itemId = found.id;
        // Update stock level and prices in inventory
        await db.inventory.update(found.id!, {
          quantity: found.quantity + qty,
          costPrice: cost,
          sellingPrice: sellPrice,
          unit: unit,
          unitConversionKg: unit === 'Fungu' ? funguKgRatio : undefined,
          lastUpdated: new Date().toISOString()
        });
      }
    } else {
      if (!itemName) itemName = 'Kitu Kipya';
      // Create new inventory item
      itemId = await db.inventory.add({
        name: itemName,
        category: 'Jumla',
        businessProfile: selectedProfile,
        unit: unit,
        unitConversionKg: unit === 'Fungu' ? funguKgRatio : undefined,
        quantity: qty,
        costPrice: cost,
        sellingPrice: sellPrice,
        lastUpdated: new Date().toISOString()
      });
    }

    // Save StockIn Record
    await db.stockIn.add({
      itemId,
      itemName,
      unit,
      unitConversionKg: unit === 'Fungu' ? funguKgRatio : undefined,
      quantityAdded: qty,
      costPerUnit: cost,
      sellingPricePerUnit: sellPrice,
      totalCost,
      expectedSales,
      expectedFaida,
      receiptPhotoUrl: receiptPhoto || undefined,
      createdAt: new Date().toISOString()
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="bg-emerald-600 text-white px-5 py-4 rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <PlusCircle size={24} className="text-yellow-300" />
            <h2 className="text-xl font-black tracking-wide">ONGEZA STOCK</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle size={64} className="text-emerald-500 animate-bounce" />
            <h3 className="text-2xl font-black text-gray-800">Stock Imeongezwa!</h3>
            <p className="text-emerald-700 font-bold">
              +{qty} {unit} za {selectedItemId === 'NEW' ? customItemName || 'Kitu' : items?.find(i => i.id === selectedItemId)?.name}
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            
            {/* Step 1: Chagua Bidhaa */}
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wide mb-1.5">
                1. Chagua Au Andika Bidhaa
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => handleSelectItem(e.target.value)}
                className="w-full bg-gray-50 border-2 border-emerald-500 rounded-2xl p-3 text-base font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="NEW">+ Ongeza Bidhaa Mpya...</option>
                {items?.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} {item.unit} stock iliyo)
                  </option>
                ))}
              </select>

              {selectedItemId === 'NEW' && (
                <input
                  type="text"
                  placeholder="Jina la bidhaa (e.g. Nyanya, Kitunguu...)"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="mt-2 w-full bg-emerald-50/50 border border-emerald-300 rounded-xl p-3 text-base font-medium focus:outline-none focus:border-emerald-600"
                />
              )}
            </div>

            {/* Step 2: Unauza vipi? (Unit Selector) */}
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wide mb-1.5">
                2. Unauza Vipi? (Vipimo)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Kilo', 'Fungu', 'Gunia', 'Piece', 'Rula', 'Head', 'Packet', 'Portion'] as UnitType[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all border ${
                      unit === u
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              {unit === 'Fungu' && (
                <div className="mt-2 bg-yellow-50 border border-yellow-300 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-yellow-900">1 Fungu ni Kilo ngapi?</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.05"
                      value={funguKgRatio}
                      onChange={(e) => setFunguKgRatio(parseFloat(e.target.value) || 0.25)}
                      className="w-16 bg-white border border-yellow-400 rounded-lg p-1 text-center font-black text-gray-800"
                    />
                    <span className="font-bold text-yellow-900">kg</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Maswali 3 Tu */}
            <div className="space-y-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Calculator size={14} /> Maswali 3 Tu Ya Hesabu
              </h3>

              {/* Ulinunua Ngapi */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-bold text-gray-800">Ulinunua Ngapi?</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={quantityAdded}
                    onChange={(e) => setQuantityAdded(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-24 bg-white border-2 border-emerald-400 rounded-xl p-2.5 text-right font-black text-lg text-emerald-950 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-600 w-12">{unit}</span>
                </div>
              </div>

              {/* Bei ya Kununua */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-bold text-gray-800">Bei ya Kununua (Total au kwa {unit})?</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">KES</span>
                  <input
                    type="number"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-24 bg-white border-2 border-emerald-400 rounded-xl p-2.5 text-right font-black text-lg text-emerald-950 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-600 w-12">/{unit}</span>
                </div>
              </div>

              {/* Utauza Ngapi */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-bold text-gray-800">Utauza Ngapi kwa {unit}?</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-500">KES</span>
                  <input
                    type="number"
                    value={sellingPricePerUnit}
                    onChange={(e) => setSellingPricePerUnit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-24 bg-white border-2 border-emerald-400 rounded-xl p-2.5 text-right font-black text-lg text-emerald-950 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-gray-600 w-12">/{unit}</span>
                </div>
              </div>
            </div>

            {/* Realtime Computed Math Preview */}
            <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-inner">
              <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">
                Hesabu Ya Stock Hii:
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-800/80 p-2 rounded-xl">
                  <div className="text-[10px] text-emerald-200">Gharama Total</div>
                  <div className="text-sm font-black text-yellow-300">KES {totalCost.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-800/80 p-2 rounded-xl">
                  <div className="text-[10px] text-emerald-200">Mauzo Tarajiwa</div>
                  <div className="text-sm font-black text-white">KES {expectedSales.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-800/80 p-2 rounded-xl">
                  <div className="text-[10px] text-emerald-200">Faida Tarajiwa</div>
                  <div className="text-sm font-black text-emerald-400">+KES {expectedFaida.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Receipt Photo Upload ("Picha ya Risiti") */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>Picha ya Risiti (Pro Storage)</span>
                {receiptPhoto && <span className="text-emerald-600 text-xs font-bold">✓ Picha Imetwaliwa</span>}
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="receipt-photo-input"
                />
                <label
                  htmlFor="receipt-photo-input"
                  className="w-full bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Camera size={20} className="text-emerald-700" />
                  <span className="text-xs font-bold text-gray-700">
                    {receiptPhoto ? 'Badilisha Picha ya Risiti' : 'Piga Picha ya Risiti ya Sokoni'}
                  </span>
                </label>
              </div>

              {receiptPhoto && (
                <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500 shadow">
                  <img src={receiptPhoto} alt="Risiti" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setReceiptPhoto(null)}
                    className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSaveStock}
              disabled={qty <= 0 || cost < 0}
              className="w-full btn-primary text-lg py-4 shadow-xl disabled:opacity-50"
            >
              <PackageCheck size={24} />
              <span>HIFADHI STOCK</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
