import React, { useState } from 'react';
import { BookOpen, Send, CheckCircle2, User, Phone, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import { Customer } from '../types';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

interface DeniBookProps {
  onOpenNewDeniModal: () => void;
}

export const DeniBook: React.FC<DeniBookProps> = ({ onOpenNewDeniModal }) => {
  const customers = useLiveQuery(() => 
    db.customers.filter(c => c.totalDeni > 0).toArray()
  );
  const wabaSettings = useLiveQuery(() => db.wabaSettings.toArray());
  const isWabaConfigured = wabaSettings && wabaSettings.length > 0 && !!wabaSettings[0].wabaId;

  const [activeTab, setActiveTab] = useState<'OLDEST' | 'BIGGEST'>('BIGGEST');
  const [payingCustomerId, setPayingCustomerId] = useState<number | null>(null);
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
    setPayingCustomerId(null);
  };

  // Send WhatsApp or SMS Debt Reminder
  const handleSendReminder = (customer: Customer) => {
    const message = `Habari ${customer.name}, kumbukumbu ya deni yako ya KES ${customer.totalDeni.toLocaleString()} ya duka kwa Mama Mboga. Tafadhali lipa leo kwa M-Pesa. Asante sana!`;

    if (customer.phoneNumber) {
      // Clean up phone number for WhatsApp web / app link (e.g., 0712345678 -> 254712345678)
      let cleanPhone = customer.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '254' + cleanPhone.substring(1);
      }
      
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Fallback: copy message to clipboard or alert
      navigator.clipboard.writeText(message);
      alert(`Ujumbe wa Kumbukumbu Umenakiliwa:\n\n"${message}"`);
    }

    if (customer.id) {
      setSentReminderId(customer.id);
      setTimeout(() => setSentReminderId(null), 3000);
    }
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
            <p className="text-xs text-red-600 font-bold">Watu Wanaodai Duka</p>
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
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center justify-between mb-4">
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
                  <div className="w-10 h-10 bg-red-100 text-red-700 rounded-2xl font-black text-lg flex items-center justify-center">
                    {cust.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-900 flex items-center gap-1.5">
                      {cust.name}
                      {cust.paymentScore === 'ALWAYS_PAYS_LATE' && (
                        <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <AlertTriangle size={10} /> Chelewa Chelewa
                        </span>
                      )}
                    </h4>
                    <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                      {cust.phoneNumber ? (
                        <span className="flex items-center gap-1 font-medium">
                          <Phone size={12} className="text-emerald-600" /> {cust.phoneNumber}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">Bila Simu</span>
                      )}
                      <span className="flex items-center gap-1 text-red-600 font-bold">
                        <Clock size={12} /> Lipa: {cust.dueDate || 'Hivi Karibuni'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-red-600">
                    KES {cust.totalDeni.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {cust.historyCount}x Mara za Deni
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                {/* Auto WhatsApp / SMS Reminder */}
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
                      <span>Tuma SMS / WhatsApp</span>
                    </>
                  )}
                </button>

                {/* Clear / Lipa Deni Button */}
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
