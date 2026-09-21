import React, { useState } from 'react';
import { X, Receipt, Bus, Home, Utensils, Smartphone, PlusCircle, CheckCircle } from 'lucide-react';
import { db } from '../db/schema';

interface MatumiziModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatumiziModal: React.FC<MatumiziModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<'Sokoni Fare' | 'Kibanda Rent' | 'Chakula / Chai' | 'Airtime / Other'>('Sokoni Fare');
  const [amount, setAmount] = useState<number | ''>(100);
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { name: 'Sokoni Fare', icon: Bus, defaultVal: 100, desc: 'Matatu / Boda fare ya sokoni' },
    { name: 'Kibanda Rent', icon: Home, defaultVal: 50, desc: 'Kodi ya kibanda ya siku/wiki' },
    { name: 'Chakula / Chai', icon: Utensils, defaultVal: 150, desc: 'Chai na lunch ya mchana' },
    { name: 'Airtime / Other', icon: Smartphone, defaultVal: 50, desc: 'Kredit, mfuko, maji, taa' }
  ] as const;

  const handleSelectCategory = (cat: typeof categories[number]) => {
    setCategory(cat.name);
    setAmount(cat.defaultVal);
  };

  const handleSaveExpense = async () => {
    const validAmt = Number(amount) || 0;
    if (validAmt <= 0) return;

    await db.expenses.add({
      category,
      amount: validAmt,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString()
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="bg-amber-600 text-white px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Receipt size={24} className="text-yellow-300" />
            <h2 className="text-xl font-black uppercase tracking-wider">MATUMIZI YA SIKU</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle size={64} className="text-amber-500 animate-bounce" />
            <h3 className="text-2xl font-black text-gray-800">Matumizi Yamehifadhiwa!</h3>
            <p className="text-amber-800 font-bold">
              KES {amount} - {category}
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            
            <p className="text-xs text-amber-900 font-medium bg-amber-50 border border-amber-200 p-3 rounded-xl">
              💡 <strong>Usidanganyike!</strong> Fare, Rent, na Lunch ni matumizi yanayoondoa faida yako. Yaweke hapa kuona Faida Halisi.
            </p>

            {/* 4 Stupid Simple Icons */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComp size={24} className={isSelected ? 'text-yellow-200' : 'text-amber-600'} />
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        KES {cat.defaultVal}
                      </span>
                    </div>
                    <div>
                      <div className="font-black text-sm leading-tight">{cat.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-gray-500'}`}>
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Input Amount Stepper */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">
                Kiasi Ulichotumia (KES):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAmount(Math.max(10, (Number(amount) || 0) - 50))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-2xl rounded-xl flex items-center justify-center active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="flex-1 bg-white border-2 border-amber-500 rounded-xl p-3 text-center font-black text-2xl text-amber-950 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAmount((Number(amount) || 0) + 50)}
                  className="w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white font-black text-2xl rounded-xl flex items-center justify-center active:scale-95 shadow"
                >
                  +
                </button>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Maelezo Kidogo (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Fare ya Boda Eldoret, Soda ya lunch..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium text-sm focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSaveExpense}
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-black py-4 rounded-2xl text-xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <PlusCircle size={24} />
              <span>HIFADHI MATUMIZI</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
