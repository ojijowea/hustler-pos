import React, { useState } from 'react';
import { Store, Phone, ShieldCheck, CheckCircle2, ArrowRight, MessageSquare, Award, Sparkles } from 'lucide-react';
import { BusinessProfile } from '../types';
import { db } from '../db/schema';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (merchantName: string, phone: string, dukaName: string, profile: BusinessProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phone, setPhone] = useState('0712345678');
  const [otp, setOtp] = useState('');
  const [merchantName, setMerchantName] = useState('Mama Aisha');
  const [dukaName, setDukaName] = useState('Mama Aisha Mboga Duka');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>('Mama Mboga');
  const [agentCode, setAgentCode] = useState('AG-ELD-001');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert('Tafadhali weka namba halisi ya M-Pesa!');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
      setOtp('4829'); // Auto-fill test OTP for seamless onboarding experience
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp !== '4829') {
      alert('OTP code sio sahihi! Jaribu 4829');
      return;
    }
    setStep(3);
  };

  const handleFinishSetup = async () => {
    // Save onboarding metadata to DB settings
    await db.wabaSettings.add({
      businessName: dukaName,
      connectedAt: new Date().toISOString()
    } as any);

    onComplete(merchantName, phone, dukaName, businessProfile);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
        
        {/* Onboarding Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 text-center space-y-1">
          <div className="w-12 h-12 bg-yellow-400 text-slate-950 font-black rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Store size={26} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            KARIBU MYDUKAZ<span className="text-yellow-300">POS</span>
          </h2>
          <p className="text-xs text-emerald-200 font-bold">
            Hatua {step} ya 3 • Kuwa Namba 1 Sokoni!
          </p>
        </div>

        <div className="p-6 space-y-5">
          
          {/* STEP 1: Phone Number Entry */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-black text-lg text-gray-900">Ingiza Namba Yako Ya Simu</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Tutatumia namba hii kukutumia OTP na kuthibitisha akaunti yako ya M-Pesa.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Phone size={14} className="text-emerald-600" /> Namba ya M-Pesa / WhatsApp:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full bg-gray-50 border-2 border-emerald-500 rounded-2xl p-3 text-lg font-black text-gray-900 focus:outline-none"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-xs text-yellow-900 font-bold flex items-center gap-2">
                <ShieldCheck size={20} className="text-yellow-700 shrink-0" />
                <span>Bure kabisa! Hakuna malipo yoyote wakati wa onboarding.</span>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isVerifying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black py-4 rounded-2xl text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>{isVerifying ? 'Inatuma WhatsApp OTP...' : 'TUMA WHATSAPP OTP'}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: WhatsApp OTP Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-black text-lg text-gray-900">Weka Code Ya Siri (OTP)</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Ujumbe wa OTP umetumwa kwa WhatsApp ya <strong className="text-gray-900">{phone}</strong>.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-center">
                <span className="text-xs font-bold text-emerald-900">
                  💬 Direct OTP Code: <strong className="text-emerald-700 text-sm font-mono">4829</strong>
                </span>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4829"
                  className="w-full text-center tracking-widest font-mono text-3xl font-black text-emerald-950 bg-gray-50 border-2 border-emerald-500 rounded-2xl p-3 focus:outline-none"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black py-4 rounded-2xl text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>THIBITISHA OTP</span>
                <CheckCircle2 size={20} />
              </button>
            </div>
          )}

          {/* STEP 3: Duka Setup & Profile Selector */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-black text-lg text-gray-900">Taarifa Za Duka Yako</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Andika jina la mteja wako anavyokujua sokoni!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jina Lako:</label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jina La Duka / Kibanda:</label>
                <input
                  type="text"
                  value={dukaName}
                  onChange={(e) => setDukaName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Aina ya Biashara:</label>
                <select
                  value={businessProfile}
                  onChange={(e) => setBusinessProfile(e.target.value as BusinessProfile)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Mama Mboga">Mama Mboga (Mboga & Matunda)</option>
                  <option value="Duka">Duka la Rejareja (Retail Shop)</option>
                  <option value="Chips Kibanda">Chips Kibanda / Fast Food</option>
                  <option value="Kinyozi">Kinyozi / Executive Salon</option>
                  <option value="Butchery">Butchery / Nyama</option>
                </select>
              </div>

              {/* Agent referral pre-fill */}
              <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300 flex items-center gap-1">
                  <Award size={14} className="text-yellow-400" /> Agent referral link:
                </span>
                <span className="font-mono font-black text-yellow-300 bg-slate-800 px-2 py-0.5 rounded-md">
                  {agentCode}
                </span>
              </div>

              <button
                onClick={handleFinishSetup}
                className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-slate-950 font-black py-4 rounded-2xl text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Sparkles size={22} />
                <span>ANZISHA DUKA (FREE TRIAL)</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
