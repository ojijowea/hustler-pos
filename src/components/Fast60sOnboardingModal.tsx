import React, { useState } from 'react';
import { Mic, MicOff, CheckCircle2, ArrowRight, Sparkles, Volume2, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { db } from '../db/schema';
import { sendMamaWelcomeWhatsApp, sendAgentNotificationWhatsApp } from '../utils/whatsappTemplates';

interface Fast60sOnboardingModalProps {
  isOpen: boolean;
  onComplete: (name: string) => void;
}

export const Fast60sOnboardingModal: React.FC<Fast60sOnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [voiceName, setVoiceName] = useState('Mama Achi');
  const [isListening, setIsListening] = useState(false);

  // Step 2: 1 Stock Only
  const [stockKg, setStockKg] = useState(5);

  // Step 3: 1 Deni Only
  const [deniName, setDeniName] = useState('Mama Brian');
  const [deniAmount, setDeniAmount] = useState(200);

  // Step 4: Fake Live Sale
  const [fakeSaleDone, setFakeSaleDone] = useState(false);

  if (!isOpen) return null;

  // Voice Recognition for Swahili Name Input
  const startVoiceNameInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech API hai-support kwa browser hii. Tumia jina hapa chini.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'sw-KE';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceName(transcript);
    };
    recognition.start();
  };

  const handleStep1Complete = () => {
    if (!voiceName.trim()) return;
    setStep(2);
  };

  const handleStep2Complete = async () => {
    // Add 1 Stock Only
    await db.inventory.add({
      name: 'Nyanya (Tomatoes)',
      category: 'Mboga',
      businessProfile: 'Mama Mboga',
      unit: 'Kilo',
      quantity: stockKg,
      costPrice: 50,
      sellingPrice: 80,
      lastUpdated: new Date().toISOString()
    });
    setStep(3);
  };

  const handleStep3Complete = async () => {
    // Add 1 Deni She Knows
    await db.customers.add({
      name: deniName,
      phoneNumber: '0712345678',
      totalDeni: deniAmount,
      dueDate: 'Kesho',
      duePeriod: 'Kesho',
      historyCount: 1,
      paymentScore: 'NEW',
      createdAt: new Date().toISOString()
    });
    setStep(4);
  };

  const handleFakeLiveSale = async () => {
    // 1 Live Sale Dopamine Hit
    await db.sales.add({
      itemName: 'Nyanya (Tomatoes)',
      quantitySold: 1.25,
      unit: 'Kilo',
      totalAmount: 100,
      costBasis: 62.5,
      faida: 37.5,
      paymentType: 'CASH',
      createdAt: new Date().toISOString()
    });
    setFakeSaleDone(true);
    setTimeout(() => {
      setStep(5);
    }, 1200);
  };

  const handleFinish60sOnboarding = async () => {
    // Send automated WhatsApp welcome & Agent notification
    const agentWaUrl = sendAgentNotificationWhatsApp(voiceName);
    console.log('Sending agent notification:', agentWaUrl);

    onComplete(voiceName);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500">
        
        {/* Onboarding Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Zap size={20} className="text-yellow-300 animate-bounce" />
            <h2 className="text-lg font-black tracking-tight text-white uppercase">
              60-SECOND ONBOARDING (ZERO TYPING)
            </h2>
          </div>
          <p className="text-xs text-emerald-200 font-bold">
            Step {step} of 5 • Fast Eldoret Soko Setup
          </p>
        </div>

        <div className="p-6 space-y-4">
          
          {/* STEP 1: VOICE NAME INPUT (10-20s) */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h3 className="font-black text-xl text-gray-900 mb-1 font-sans">"Jina yako ni nani mama?"</h3>
                <p className="text-xs text-emerald-800 font-bold">Bonyeza Mic uongee jina lako. Hakuna ku-type!</p>
              </div>

              {/* Big Mic Button */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={startVoiceNameInput}
                  className={`w-24 h-24 mx-auto rounded-full text-white font-black text-2xl flex items-center justify-center shadow-2xl transition-all ${
                    isListening ? 'bg-red-600 animate-ping' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-2xl p-3">
                <label className="block text-xs text-gray-500 font-bold mb-1">Jina lililotambuliwa na sauti:</label>
                <input
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full text-center font-black text-xl text-emerald-950 bg-white border border-emerald-400 rounded-xl p-2"
                />
              </div>

              <button
                onClick={handleStep1Complete}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <span>ENDELEA HATUA YA 2</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: ADD 1 STOCK TODAY (20-35s) */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-300">
                <h3 className="font-black text-lg text-gray-900">"Leo uko na nini kwa meza?"</h3>
                <p className="text-xs text-yellow-900 font-bold">Weka stock 1 pekee (e.g. Nyanya). Slide kilo zake!</p>
              </div>

              {/* Item Card */}
              <div className="bg-emerald-900 text-white rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg text-yellow-300">🍅 Nyanya (Tomatoes)</span>
                  <span className="text-xs font-bold text-emerald-300">KES 80/kg</span>
                </div>

                {/* Volume Range Slider */}
                <div className="py-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={stockKg}
                    onChange={(e) => setStockKg(Number(e.target.value))}
                    className="w-full h-3 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-bold border-t border-emerald-800 pt-2">
                  <span>Stock: <strong className="text-yellow-300 text-base">{stockKg} kg</strong></span>
                  <span>Mauzo Tarajiwa: <strong className="text-emerald-400 text-base">KES {stockKg * 80}</strong></span>
                </div>
              </div>

              <button
                onClick={handleStep2Complete}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <span>HIFADHI STOCK (1 ITEM)</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 3: ADD 1 DENI SHE KNOWS (35-50s) */}
          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-300">
                <h3 className="font-black text-lg text-red-900">"Nani anakudai leo?"</h3>
                <p className="text-xs text-red-700 font-bold">Weka deni 1 tu anayokudai sasa hivi!</p>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-2xl p-4 space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jina la Anayedai:</label>
                  <input
                    type="text"
                    value={deniName}
                    onChange={(e) => setDeniName(e.target.value)}
                    className="w-full bg-gray-50 border border-red-300 rounded-xl p-2.5 font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kiasi Anachodai (KES):</label>
                  <input
                    type="number"
                    value={deniAmount}
                    onChange={(e) => setDeniAmount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-red-300 rounded-xl p-2.5 font-black text-lg text-red-600"
                  />
                </div>
              </div>

              <div className="bg-red-950 text-white rounded-xl p-3 text-xs font-bold flex items-center justify-between">
                <span>Deni Nje Imehifadhiwa:</span>
                <span className="text-red-400 text-base font-black">KES {deniAmount}</span>
              </div>

              <button
                onClick={handleStep3Complete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <span>HIFADHI DENI HII</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 4: INSTANT LIVE SALE DOPAMINE (50-60s) */}
          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300">
                <h3 className="font-black text-lg text-emerald-950">Jaribu Uza Moja Live!</h3>
                <p className="text-xs text-emerald-800 font-bold">Bonyeza button uone jinsi faida inasonga haraka!</p>
              </div>

              {fakeSaleDone ? (
                <div className="bg-emerald-600 text-white p-6 rounded-2xl space-y-2 animate-bounce">
                  <CheckCircle2 size={48} className="mx-auto text-yellow-300" />
                  <h4 className="text-2xl font-black">UZA LEO: KES 100!</h4>
                  <p className="text-sm font-bold text-emerald-200">Faida Halisi: +KES 37.50!</p>
                </div>
              ) : (
                <button
                  onClick={handleFakeLiveSale}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl text-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  <ShoppingBag size={32} className="text-yellow-300" />
                  <span>UZA KES 100 (LIVE SALE)</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 5: 3-DAY FREE TRIAL ACTIVATED */}
          {step === 5 && (
            <div className="space-y-4 text-center">
              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-5 space-y-3 shadow-xl">
                <Sparkles size={48} className="mx-auto text-yellow-300 animate-spin" />
                <h3 className="text-2xl font-black text-yellow-300">3 DAYS FREE TRIAL ACTIVE!</h3>
                <p className="text-xs text-emerald-200 font-bold leading-relaxed">
                  Hongera <strong>{voiceName}</strong>! App yako ipo tayari. Bure kwa siku 3 kabla ya 20 bob per day.
                </p>

                <div className="bg-emerald-950 border border-emerald-600 rounded-xl p-2.5 text-xs text-emerald-300 font-bold">
                  ✓ Inafanya Bila Bundles (Offline Mode Active)
                </div>
              </div>

              <button
                onClick={handleFinish60sOnboarding}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black py-4 rounded-2xl text-lg shadow-xl"
              >
                FUNGUA DUKA LEO (START SELLING)
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
