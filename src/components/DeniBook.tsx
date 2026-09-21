import React, { useState } from 'react';
import { BookOpen, Send, CheckCircle2, Phone, Clock, AlertTriangle, MessageSquare, Zap } from 'lucide-react';
import { Customer } from '../types';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { LanguageMode, TRANSLATIONS } from '../i18n/translations';

interface DeniBookProps {
  onOpenNewDeniModal: () => void;
  lang?: LanguageMode;
}

export const DeniBook: React.FC<DeniBookProps> = ({ onOpenNewDeniModal, lang = 'SW' }) => {
  const t = TRANSLATIONS[lang];
  const customers = useLiveQuery(() => 
    db.customers.filter(c => c.totalDeni > 0).toArray()
  );

  const [activeTab, setActiveTab] = useState<'OLDEST' | 'BIGGEST'>('BIGGEST');
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [bulkSentSuccess, setBulkSentSuccess] = useState(false);
  const [sentReminderId, setSentReminderId] = useState<number | null>(null);

  // Sort debtors: Biggest first or Oldest first
  const sortedCustomers = React.useMemo(() => {
    if (!customers) return [];
    return [...customers].sort((a, b) => {
      if (activeTab === 'BIGGEST') {
        return b.totalDeni - a.totalDeni;
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
  }, [customers, activeTab]);

  const totalDeniNje = customers?.reduce((sum: number, c: Customer) => sum + c.totalDeni, 0) || 0;

  // Clear or Pay Debt
  const handleClearDebt = async (customer: Customer) => {
    if (!customer.id) return;
    await db.customers.update(customer.id, {
      totalDeni: 0,
      paymentScore: customer.paymentScore === 'NEW' ? 'GOOD' : customer.paymentScore
    });
  };

  // Single Debt Reminder
  const handleSendReminder = (customer: Customer) => {
    const message = `Habari ${customer.name}, kumbukumbu ya deni yako ya KES ${customer.totalDeni.toLocaleString()} kwa duka la Mama Mboga. Tafadhali lipa leo kwa M-Pesa. Asante! — Powered by MyDukazPOS`;

    if (customer.phoneNumber) {
      let cleanPhone = customer.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '254' + cleanPhone.substring(1);
      
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      navigator.clipboard.writeText(message);
      alert(`Ujumbe Umenakiliwa:\n\n"${message}"`);
    }

    if (customer.id) {
      setSentReminderId(customer.id);
      setTimeout(() => setSentReminderId(null), 3000);
    }
  };

  // ONE BLUE BUTTON: Bulk WhatsApp Debt Chasing to ALL Debtors at once!
  const handleBulkDebtChasing = async () => {
    if (!customers || customers.length === 0) return;
    setIsBulkSending(true);

    // Call Cloudflare Worker WhatsApp Cloud API Bulk endpoint
    for (const cust of customers) {
      if (cust.phoneNumber) {
        try {
          await fetch('/api/whatsapp/send-reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: cust.name,
              phoneNumber: cust.phoneNumber,
              amount: cust.totalDeni,
              duePeriod: cust.dueDate || 'Leo'
            })
          });
        } catch (err) {
          console.error('WhatsApp API bulk error:', err);
        }
      }
    }

    setIsBulkSending(false);
    setBulkSentSuccess(true);
    setTimeout(() => setBulkSentSuccess(false), 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-red-100 my-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-3 bg-red-600 text-white rounded-2xl shadow-md">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-black text-xl text-gray-900 leading-tight">KITABU CHA MADENI</h3>
            <p className="text-xs text-red-600 font-bold">{t.deniOutside}</p>
          </div>
        </div>

        {/* Big Red DENI Button */}
        <button
          onClick={onOpenNewDeniModal}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black px-4 py-2.5 rounded-2xl text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
        >
          <span>+ WEKA DENI</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black text-red-700 uppercase tracking-wider">Jumla ya Madeni Nje:</div>
          <div className="text-2xl font-black text-red-700">
            KES {totalDeniNje.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-gray-500">Idadi ya Watu:</div>
          <div className="text-lg font-black text-gray-800">{customers?.length || 0} Madeni</div>
        </div>
      </div>

      {/* ONE BLUE BUTTON: BULK DEBT CHASING */}
      {customers && customers.length > 0 && (
        <button
          onClick={handleBulkDebtChasing}
          disabled={isBulkSending}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {bulkSentSuccess ? (
            <>
              <CheckCircle2 size={20} className="text-yellow-300" />
              <span>{t.bulkDebtSuccess}</span>
            </>
          ) : (
            <>
              <Zap size={20} className="text-yellow-300" />
              <span>{t.chaseAllDebts}</span>
            </>
          )}
        </button>
      )}

      {/* Sorting Tabs */}
      <div className="flex items-center gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('BIGGEST')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'BIGGEST'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Anayedai Zaid (Kubwa)
        </button>
        <button
          onClick={() => setActiveTab('OLDEST')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'OLDEST'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          La Zamani Zaidi (Kongwe)
        </button>
      </div>

      {/* Customers List */}
      {sortedCustomers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
          <p className="font-bold text-gray-700">Hakuna Mteja Anayekudai Sasa!</p>
          <p className="text-xs text-gray-500">Maden yote yamelipwa vizuri.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white border-2 border-red-100 hover:border-red-300 rounded-2xl p-4 shadow-sm transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl font-black text-xl flex items-center justify-center border border-red-300">
                    {cust.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-900 flex items-center gap-1.5">
                      {cust.name}
                    </h4>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      {cust.phoneNumber ? (
                        <span className="flex items-center gap-1 font-medium">
                          <Phone size={12} className="text-emerald-600" /> {cust.phoneNumber}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">Bila Simu</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-red-600">
                    KES {cust.totalDeni.toLocaleString()}
                  </div>
                  {/* Status Badges: Green "Due Saturday" vs Red "2 days late" */}
                  <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full mt-1 ${
                    cust.paymentScore === 'ALWAYS_PAYS_LATE'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {cust.paymentScore === 'ALWAYS_PAYS_LATE' ? '🚨 2 Days Late' : `✓ ${t.dueSaturday}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleSendReminder(cust)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
                >
                  {sentReminderId === cust.id ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Ujumbe Umetumwa!</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={14} className="text-yellow-300" />
                      <span>Free WhatsApp SMS</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleClearDebt(cust)}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold py-2 px-3 rounded-xl text-xs transition-colors"
                >
                  Lipa Deni
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
