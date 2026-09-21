import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Key, CheckCircle, ExternalLink, Share2, ShoppingBag } from 'lucide-react';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { InventoryItem } from '../types';

interface WatiWhatsAppSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: InventoryItem[];
}

export const WatiWhatsAppSettings: React.FC<WatiWhatsAppSettingsProps> = ({ isOpen, onClose, inventory }) => {
  const wabaSettings = useLiveQuery(() => db.wabaSettings.toArray());
  const currentSetting = wabaSettings?.[0];

  const [watiEndpoint, setWatiEndpoint] = useState('');
  const [watiToken, setWatiToken] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isCatalogSharing, setIsCatalogSharing] = useState(false);

  useEffect(() => {
    if (currentSetting) {
      setWatiEndpoint((currentSetting as any).watiEndpoint || 'https://live-server-XXXXX.wati.io');
      setWatiToken((currentSetting as any).watiToken || '');
    }
  }, [currentSetting]);

  if (!isOpen) return null;

  const handleSaveWati = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSetting?.id) {
      await db.wabaSettings.update(currentSetting.id, {
        ...(currentSetting as any),
        watiEndpoint,
        watiToken
      });
    } else {
      await db.wabaSettings.add({
        watiEndpoint,
        watiToken
      } as any);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Generate WhatsApp Catalogue text message formatted for Mamas to share with customers
  const generateCatalogueShareText = () => {
    if (!inventory || inventory.length === 0) return 'Duka letu la Mama Mboga lina bidhaa bora kabisa!';

    let catalogText = `🛍️ *CATALOGUE YA DUKA LA MAMA MBOGA*\n\n`;
    inventory.forEach((item, index) => {
      catalogText += `${index + 1}. *${item.name}* - KES ${item.sellingPrice}/${item.unit} (Stock: ${item.quantity})\n`;
    });
    catalogText += `\n📞 *Weka Order au Uliza Kupitia WhatsApp Hapa!*`;
    return catalogText;
  };

  const handleShareCatalogue = () => {
    setIsCatalogSharing(true);
    const catalogMessage = generateCatalogueShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(catalogMessage)}`;
    window.open(whatsappUrl, '_blank');
    setIsCatalogSharing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border-2 border-emerald-500">
        
        {/* Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={24} className="text-yellow-300" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider">WATI API & WHATSAPP CATALOGUE</h2>
              <p className="text-xs text-emerald-200">Free Business Solution Provider Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-emerald-800 text-white hover:bg-emerald-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* WhatsApp Catalogue Share Banner */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white border border-emerald-600 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-yellow-300" />
              <h3 className="font-black text-sm text-yellow-300">WHATSAPP CATALOGUE (SHARE SHOP)</h3>
            </div>
            <p className="text-xs text-emerald-200">
              Tuma Catalogue ya bidhaa zako zote kwa wateja kupitia WhatsApp kwa touch moja tu!
            </p>

            <button
              onClick={handleShareCatalogue}
              className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
            >
              <Share2 size={16} />
              <span>TUMA CATALOGUE KWA WHATSAPP</span>
            </button>
          </div>

          {/* WATI API Integration Form */}
          <form onSubmit={handleSaveWati} className="space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1">
                <Key size={14} className="text-emerald-600" /> WATI API Credentials (Free Sandbox):
              </h4>
              <a
                href="https://www.wati.io/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-emerald-700 underline font-bold flex items-center gap-0.5"
              >
                WATI Site <ExternalLink size={10} />
              </a>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                WATI API Endpoint URL:
              </label>
              <input
                type="text"
                placeholder="https://live-server-XXXXX.wati.io"
                value={watiEndpoint}
                onChange={(e) => setWatiEndpoint(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                WATI Access Token / Bearer Token:
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1Ni..."
                value={watiToken}
                onChange={(e) => setWatiToken(e.target.value)}
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
                  <span>WATI SETTINGS ZIMEHIFADHIKA!</span>
                </>
              ) : (
                <span>HIFADHI WATI API</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
