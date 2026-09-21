import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Mic, MicOff, CheckCircle, Clock, UserCheck, Calendar } from 'lucide-react';
import { BusinessProfile, UnitType, InventoryItem } from '../types';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

interface UzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProfile: BusinessProfile;
  initialMode?: 'CASH' | 'DENI';
}

export const UzaModal: React.FC<UzaModalProps> = ({
  isOpen,
  onClose,
  selectedProfile,
  initialMode = 'CASH'
}) => {
  const inventory = useLiveQuery(() => 
    db.inventory.where('businessProfile').equals(selectedProfile).toArray(), 
    [selectedProfile]
  );
  const customers = useLiveQuery(() => db.customers.toArray());

  const [paymentType, setPaymentType] = useState<'CASH' | 'DENI'>(initialMode);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);
  const [quantitySold, setQuantitySold] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Deni Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duePeriod, setDuePeriod] = useState<'Leo Jioni' | 'Kesho' | 'Jumamosi' | 'Custom'>('Jumamosi');
  const [isListening, setIsListening] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialMode) setPaymentType(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (inventory && inventory.length > 0 && !selectedItemId) {
      setSelectedItemId(inventory[0].id);
      setTotalAmount(inventory[0].sellingPrice);
    }
  }, [inventory]);

  if (!isOpen) return null;

  const activeItem = inventory?.find(i => i.id === selectedItemId) || inventory?.[0];

  const handleItemChange = (id: number) => {
    setSelectedItemId(id);
    const item = inventory?.find(i => i.id === id);
    if (item) {
      setTotalAmount(quantitySold * item.sellingPrice);
    }
  };

  const handleQtyChange = (qty: number) => {
    const validQty = Math.max(0.1, qty);
    setQuantitySold(validQty);
    if (activeItem) {
      setTotalAmount(validQty * activeItem.sellingPrice);
    }
  };

  // Speech-to-Text for Swahili / Sheng Customer Name
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Sauti browser yako hai-support Speech API. Tafadhali andika jina.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'sw-KE'; // Swahili / Sheng
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCustomerName(transcript);
    };

    recognition.start();
  };

  const handleCompleteSale = async () => {
    if (!activeItem || activeItem.id === undefined) return;

    const costBasis = quantitySold * activeItem.costPrice;
    const faida = totalAmount - costBasis;

    let customerId: number | undefined;

    if (paymentType === 'DENI') {
      const name = customerName.trim() || 'Customer Deni';
      
      // Check if existing customer
      const existing = customers?.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (existing && existing.id) {
        customerId = existing.id;
        await db.customers.update(existing.id, {
          totalDeni: existing.totalDeni + totalAmount,
          historyCount: existing.historyCount + 1,
          dueDate: duePeriod
        });
      } else {
        customerId = await db.customers.add({
          name,
          phoneNumber: phoneNumber.trim() || undefined,
          totalDeni: totalAmount,
          dueDate: duePeriod,
          duePeriod,
          historyCount: 1,
          paymentScore: 'NEW',
          createdAt: new Date().toISOString()
        });
      }
    }

    // Record Sale
    await db.sales.add({
      itemId: activeItem.id,
      itemName: activeItem.name,
      quantitySold,
      unit: activeItem.unit,
      totalAmount,
      costBasis,
      faida,
      paymentType,
      customerId,
      customerName: paymentType === 'DENI' ? customerName : undefined,
      createdAt: new Date().toISOString()
    });

    // Update stock level
    await db.inventory.update(activeItem.id, {
      quantity: Math.max(0, activeItem.quantity - quantitySold),
      lastUpdated: new Date().toISOString()
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
        
        {/* Header */}
        <div className={`px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10 ${
          paymentType === 'DENI' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-yellow-300" />
            <h2 className="text-xl font-black uppercase tracking-wider">
              {paymentType === 'DENI' ? 'WEKA DENI JIPYA' : 'UZA HARAKA (CASH)'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle size={64} className={paymentType === 'DENI' ? 'text-red-500 animate-bounce' : 'text-emerald-500 animate-bounce'} />
            <h3 className="text-2xl font-black text-gray-800">
              {paymentType === 'DENI' ? 'Deni Limesajiliwa!' : 'Mauzo Yamekamilika!'}
            </h3>
            <p className="text-gray-600 font-bold">
              KES {totalAmount.toLocaleString()} - {activeItem?.name}
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            
            {/* Payment Type Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType('CASH')}
                className={`py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 border-2 transition-all ${
                  paymentType === 'CASH'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <span>💵 Lipa Sasa</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('DENI')}
                className={`py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 border-2 transition-all ${
                  paymentType === 'DENI'
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-[1.02] animate-pulse'
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
              >
                <span>📕 DENI</span>
              </button>
            </div>

            {/* Select Item */}
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">
                Chagua Bidhaa:
              </label>
              <select
                value={selectedItemId || ''}
                onChange={(e) => handleItemChange(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-emerald-500 rounded-2xl p-3 text-base font-bold text-gray-800 focus:outline-none"
              >
                {inventory?.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - KES {item.sellingPrice}/{item.unit} (Stock: {item.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Stepper */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-gray-500 uppercase">Kiasi Anachotwaa:</span>
                <div className="text-lg font-black text-gray-900">{activeItem?.unit}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQtyChange(quantitySold - 1)}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-2xl font-black text-gray-800 flex items-center justify-center active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.1"
                  value={quantitySold}
                  onChange={(e) => handleQtyChange(parseFloat(e.target.value) || 1)}
                  className="w-16 text-center font-black text-2xl text-emerald-950 bg-white border border-gray-300 rounded-xl p-1"
                />
                <button
                  type="button"
                  onClick={() => handleQtyChange(quantitySold + 1)}
                  className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-2xl font-black flex items-center justify-center active:scale-95 shadow"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Amount Badge */}
            <div className="bg-emerald-950 text-white rounded-2xl p-4 text-center">
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Jumla Ya Mauzo:</span>
              <div className="text-3xl font-black text-yellow-300">
                KES {totalAmount.toLocaleString()}
              </div>
            </div>

            {/* DENI Customer Form Inputs */}
            {paymentType === 'DENI' && (
              <div className="space-y-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <h4 className="text-xs font-black text-red-800 uppercase tracking-wide flex items-center gap-1">
                  <UserCheck size={16} /> Taarifa Za Mteja Wa Deni
                </h4>

                {/* Voice Input Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Jina La Mteja (Andika au Bonyeza Sauti):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Mama Brian, Njoro, Papaa..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border-2 border-red-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-red-600"
                    />
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      className={`p-3 rounded-xl border font-bold text-white transition-all flex items-center justify-center shrink-0 ${
                        isListening ? 'bg-red-700 animate-bounce' : 'bg-red-600 hover:bg-red-700'
                      }`}
                      title="Ongea Jina la Mteja"
                    >
                      {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Namba ya Simu (Optional - Kwa SMS Reminder):
                  </label>
                  <input
                    type="tel"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-red-200 rounded-xl p-3 font-medium text-gray-900 focus:outline-none"
                  />
                </div>

                {/* Due Date Buttons */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                    <Clock size={14} /> Atalipa Lini?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Leo Jioni', 'Kesho', 'Jumamosi', 'Custom'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setDuePeriod(period)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          duePeriod === period
                            ? 'bg-red-600 text-white border-red-600 shadow'
                            : 'bg-white text-gray-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Complete Sale Button */}
            <button
              onClick={handleCompleteSale}
              className={`w-full py-4 rounded-2xl font-black text-xl text-white shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                paymentType === 'DENI' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <CheckCircle size={24} />
              <span>{paymentType === 'DENI' ? 'HIFADHI DENI' : 'THIBITISHA MAUZO'}</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
