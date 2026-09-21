import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Shield, CheckCircle, ExternalLink, RefreshCw, Key, Cloud } from 'lucide-react';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

interface MetaWhatsAppSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetaWhatsAppSignup: React.FC<MetaWhatsAppSignupProps> = ({ isOpen, onClose }) => {
  const wabaSettings = useLiveQuery(() => db.wabaSettings.toArray());
  const currentSetting = wabaSettings?.[0];

  const [wabaId, setWabaId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentSetting) {
      setWabaId(currentSetting.wabaId || '');
      setPhoneNumberId(currentSetting.phoneNumberId || '');
      setAccessToken(currentSetting.accessToken || '');
    }
  }, [currentSetting]);

  if (!isOpen) return null;

  // Initialize Meta Facebook SDK Embedded Signup trigger
  const launchMetaEmbeddedSignup = () => {
    setIsLoading(true);

    // Check if Meta FB SDK is loaded
    if (typeof (window as any).FB !== 'undefined') {
      (window as any).FB.login(
        (response: any) => {
          if (response.authResponse) {
            const code = response.authResponse.code;
            console.log('Received Meta authorization code:', code);
            
            // Send auth code to Cloudflare Worker backend API to exchange for token
            fetch('/api/whatsapp/embedded-signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code })
            })
              .then(res => res.json())
              .then(data => {
                if (data.waba_id && data.phone_number_id) {
                  saveSettings(data.waba_id, data.phone_number_id, data.access_token);
                } else {
                  alert('Auth Code Exchanged! WABA ID: ' + (data.waba_id || 'Pending Meta Review'));
                }
              })
              .catch(err => console.error('Cloudflare Worker exchange error:', err))
              .finally(() => setIsLoading(false));
          } else {
            setIsLoading(false);
          }
        },
        {
          config_id: 'WHATSAPP_EMBEDDED_SIGNUP_CONFIG_ID', // Replace with Meta App config_id
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            setup: {
              // Pre-fill business info for Kenya
              business: { name: 'Mama Mboga POS', country: 'KE' }
            }
          }
        }
      );
    } else {
      setIsLoading(false);
      alert('Meta Facebook SDK Inapakia... Au unaweza kuweka WABA ID & Phone Number ID mwenyewe hapa chini!');
    }
  };

  const saveSettings = async (wId: string, pId: string, token: string) => {
    if (currentSetting?.id) {
      await db.wabaSettings.update(currentSetting.id, {
        wabaId: wId,
        phoneNumberId: pId,
        accessToken: token,
        connectedAt: new Date().toISOString()
      });
    } else {
      await db.wabaSettings.add({
        wabaId: wId,
        phoneNumberId: pId,
        accessToken: token,
        connectedAt: new Date().toISOString()
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(wabaId, phoneNumberId, accessToken);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border-2 border-emerald-500">
        
        {/* Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={24} className="text-yellow-300" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider">META WHATSAPP EMBEDDED SIGNUP</h2>
              <p className="text-xs text-emerald-200">Cloudflare Worker + Meta Cloud API</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-emerald-800 text-white hover:bg-emerald-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center gap-3">
            <Cloud size={32} className="text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-950 font-medium">
              <strong className="font-black text-emerald-900">Cloudflare & Meta Cloud API Linked!</strong>
              <br />Inakuwezesha kutuma SMS na WhatsApp za kukumbusha madeni moja kwa moja kutoka kwa app.
            </div>
          </div>

          {/* Embedded Signup Trigger Button */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center space-y-3">
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Njia ya Haraka (Meta Official Embedded Signup):
            </div>
            <p className="text-xs text-gray-300">
              Bonyeza hapa chini kuunganisha Akaunti yako ya Facebook Business & WhatsApp Business Number:
            </p>

            <button
              onClick={launchMetaEmbeddedSignup}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin text-yellow-300" />
              ) : (
                <ExternalLink size={18} className="text-yellow-300" />
              )}
              <span>LOG IN WITH META (EMBEDDED SIGNUP)</span>
            </button>
          </div>

          {/* Manual Credentials Input Form */}
          <form onSubmit={handleManualSave} className="space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1">
              <Key size={14} className="text-emerald-600" /> Au Weka Credentials za Cloud API Mwenyewe:
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                WhatsApp Business Account ID (WABA ID):
              </label>
              <input
                type="text"
                placeholder="e.g. 100982347293847"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Phone Number ID:
              </label>
              <input
                type="text"
                placeholder="e.g. 102938475610293"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                System User Access Token (Permanent Token):
              </label>
              <input
                type="password"
                placeholder="EAA..."
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {isSaved ? (
                <>
                  <CheckCircle size={16} className="text-yellow-300" />
                  <span>CREDENTIALS ZIMEHIFADHIKA!</span>
                </>
              ) : (
                <span>HIFADHI METADATA</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
