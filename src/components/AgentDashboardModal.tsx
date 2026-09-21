import React, { useState } from 'react';
import { X, Award, Copy, Share2, DollarSign, Wallet, Users, CheckCircle, Clock, ExternalLink, ArrowDownRight, Smartphone, ShieldCheck } from 'lucide-react';

interface AgentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentDashboardModal: React.FC<AgentDashboardModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  if (!isOpen) return null;

  const agentCode = 'AG-ELD-001';
  const referralLink = `http://mydukazpos.com/join/${agentCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Habari! Jisajili na MyDukazPOS uanze kufuatilia faida halisi ya duka lako na kutuma WhatsApp receipts bure! Tumia link yangu ya agent:\n\n${referralLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleWithdrawMPesa = () => {
    const phone = prompt('Weka namba yako ya M-Pesa kutoa KES 1,250:', '0712345678');
    if (phone) {
      setIsWithdrawing(true);
      setTimeout(() => {
        setIsWithdrawing(false);
        setWithdrawSuccess(true);
        setTimeout(() => setWithdrawSuccess(false), 4000);
      }, 1500);
    }
  };

  const referredMamas = [
    { name: 'Mama Achi', status: 'Active', amountLocked: 'KES 25/mo locked', isPaid: true },
    { name: 'Mama Brian', status: 'Pending', amountLocked: 'Needs 14 days trial', isPaid: false },
    { name: 'Mama Aisha', status: 'Active', amountLocked: 'KES 25/mo locked', isPaid: true },
    { name: 'Mama Njoro', status: 'Active', amountLocked: 'KES 25/mo locked', isPaid: true }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border-2 border-emerald-500">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-yellow-400 p-2 rounded-2xl text-slate-950 font-black shadow">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white">BRIAN LEVEL GOLD</h2>
              <p className="text-xs text-yellow-400 font-extrabold flex items-center gap-1">
                <ShieldCheck size={12} /> Agent Code: {agentCode}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-800 text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* BLUE CARD — MY REFERRAL LINK */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-2xl p-4 space-y-3 shadow-xl border border-blue-400/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-blue-200 tracking-wider">
                🔗 My Referral Link:
              </span>
              <span className="bg-blue-950 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-500/50">
                Deep-Link Active
              </span>
            </div>

            <div className="bg-blue-950/90 border border-blue-400/50 rounded-xl p-2.5 font-mono text-xs font-bold text-white break-all">
              {referralLink}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
              >
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
              >
                <Share2 size={14} className="text-yellow-300" />
                <span>Share WhatsApp</span>
              </button>
            </div>
          </div>

          {/* MY STATS (FACEBOOK INSIGHTS STYLE) */}
          <div className="grid grid-cols-3 gap-2">
            
            <div className="bg-slate-900 text-white p-3 rounded-2xl text-center border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-0.5">
                <Users size={12} className="text-emerald-400" /> My Dukaz
              </div>
              <div className="text-xl font-black text-white mt-1">12 Active</div>
              <div className="text-[9px] text-emerald-400 font-bold">His Army</div>
            </div>

            <div className="bg-amber-950/80 text-white p-3 rounded-2xl text-center border border-amber-800/60">
              <div className="text-[10px] text-amber-300 font-bold uppercase flex items-center justify-center gap-0.5">
                <Clock size={12} className="text-amber-400" /> Pending
              </div>
              <div className="text-lg font-black text-amber-300 mt-1">KES 75</div>
              <div className="text-[9px] text-amber-200 font-bold">Follow up</div>
            </div>

            <div className="bg-emerald-950 text-white p-3 rounded-2xl text-center border border-emerald-700">
              <div className="text-[10px] text-emerald-300 font-bold uppercase flex items-center justify-center gap-0.5">
                <Wallet size={12} className="text-yellow-400" /> Earned
              </div>
              <div className="text-lg font-black text-yellow-300 mt-1">KES 1,250</div>
              <div className="text-[9px] text-emerald-400 font-bold">Proof</div>
            </div>

          </div>

          {/* REFERRED MAMAS LIST */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
              <Users size={14} className="text-emerald-600" /> Referred Mamas ({referredMamas.length})
            </h4>

            <div className="divide-y divide-gray-200">
              {referredMamas.map((mama, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-gray-900">{mama.name}</div>
                    <div className="text-[10px] text-gray-500 font-medium">{mama.amountLocked}</div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    mama.isPaid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                  }`}>
                    {mama.isPaid ? '✓ Active (KES 25)' : '⏳ Pending (14 Days)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BIG GREEN M-PESA WITHDRAW BUTTON */}
          <button
            onClick={handleWithdrawMPesa}
            disabled={isWithdrawing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black py-4 px-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95 disabled:opacity-50"
          >
            {withdrawSuccess ? (
              <>
                <CheckCircle size={24} className="text-yellow-300" />
                <span>KES 1,250 SENT TO M-PESA!</span>
              </>
            ) : (
              <>
                <Smartphone size={24} className="text-yellow-300" />
                <span>WITHDRAW KES 1,250 TO M-PESA</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
