import React, { useState } from 'react';
import { X, CheckSquare, Square, Award, ShieldCheck } from 'lucide-react';

interface AgentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentChecklistModal: React.FC<AgentChecklistModalProps> = ({ isOpen, onClose }) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});

  if (!isOpen) return null;

  const checklist = [
    { id: 1, text: 'Install via my link (mydukazpos.com/join/AG-ELD-001)?' },
    { id: 2, text: 'Jina la Mama via Voice Mic (0 typing)?' },
    { id: 3, text: 'Weka 1 Stock pekee leo (e.g. 5kg Nyanya)?' },
    { id: 4, text: 'Weka 1 Deni she knows (e.g. Mama Brian 200)?' },
    { id: 5, text: 'Do 1 Sale live with her (Tap UZA → Lipa Sasa)?' },
    { id: 6, text: 'Show Free WhatsApp receipt to her customer?' },
    { id: 7, text: 'Tell her 3 days FREE, 20 bob per day after?' }
  ];

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={24} className="text-yellow-400" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white">AGENT CHECKLIST (LAMINATED)</h2>
              <p className="text-xs text-yellow-300 font-bold">Agent Brian • AG-ELD-001</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-800 text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between">
            <div className="text-xs font-bold text-emerald-950">
              Hatua Zilizokamilika: <strong className="text-emerald-700 text-sm font-black">{totalChecked} / 7</strong>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
              totalChecked === 7 ? 'bg-emerald-600 text-white' : 'bg-yellow-400 text-slate-950'
            }`}>
              {totalChecked === 7 ? '✓ Mama Pro Ready!' : 'In Progress'}
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map(item => {
              const isChecked = !!checkedItems[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare size={22} className="text-emerald-600 shrink-0" />
                  ) : (
                    <Square size={22} className="text-gray-400 shrink-0" />
                  )}
                  <span className="text-xs leading-snug">{item.text}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-sm"
          >
            HIFADHI CHECKLIST
          </button>

        </div>
      </div>
    </div>
  );
};
