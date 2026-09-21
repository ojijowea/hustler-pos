import React, { useState } from 'react';
import { Store, TrendingDown, TrendingUp, MessageSquare, ThumbsUp, MapPin, ExternalLink, Tag, ShieldCheck, Share2 } from 'lucide-react';

export const CommunitySokoTab: React.FC = () => {
  const [likes, setLikes] = useState<{ [key: number]: number }>({ 1: 12, 2: 8 });
  const [userLiked, setUserLiked] = useState<{ [key: number]: boolean }>({});

  const handleLike = (id: number) => {
    setUserLiked(prev => {
      const isLiked = !prev[id];
      setLikes(l => ({ ...l, [id]: isLiked ? (l[id] || 0) + 1 : (l[id] || 0) - 1 }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleOrderSupplier = (supplierName: string, item: string) => {
    const message = `Niaje, nataka ${item}, Brian from MyDukazPOS`;
    const url = `https://wa.me/254712345678?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const trendingPrices = [
    { item: 'Nyanya (Tomatoes)', price: 'KES 50 / kg', change: '-10% from last week', trend: 'down', desc: 'Cheap at Eldoret Wholesale Market' },
    { item: 'Viazi (Potatoes)', price: 'KES 60 / kg', change: 'Stable', trend: 'stable', desc: 'Cheptiret Agro Direct' },
    { item: 'Parachichi (Avocado)', price: 'KES 20 / pc', change: '-15% Cheap now', trend: 'down', desc: 'Sokoni Season' }
  ];

  const supplierDeals = [
    { name: 'Cheptiret Agro Supplies', items: 'Potatoes, Onions & Carrots', phone: '0712345678', badge: 'Verified Supplier', location: 'Cheptiret Eldoret' },
    { name: 'Kapsoya Wholesale Fruits', items: 'Ripe Bananas & Avocados', phone: '0722334455', badge: 'Fast Delivery', location: 'Kapsoya Market' }
  ];

  const communityPosts = [
    {
      id: 1,
      author: 'Agent Brian (AG-ELD-001)',
      time: '10 mins ago',
      content: 'Tomatoes cheap at Eldoret Wholesale Market today KES 45! Stocked up #SokoDeals 🍅🔥',
      likes: likes[1],
      comments: 3
    },
    {
      id: 2,
      author: 'Mama Achi',
      time: '1 hour ago',
      content: 'Wapi naeza pata cabbage cheap leo pande za Kapsoya? Inbox me au reply hapa!',
      likes: likes[2],
      comments: 5
    }
  ];

  return (
    <div className="space-y-4 my-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between border border-emerald-600">
        <div>
          <h3 className="text-xl font-black tracking-tight text-yellow-300 flex items-center gap-1.5">
            <Store size={22} /> COMMUNITY SOKO TAB
          </h3>
          <p className="text-xs text-emerald-200 font-bold">Facebook + Jumia kwa Mama Mboga • Live Eldoret Feed</p>
        </div>
        <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
          Live Market
        </span>
      </div>

      {/* 1. TRENDING STOCK PRICES (TOP GREEN CARD) */}
      <div className="bg-emerald-900 text-white rounded-3xl p-4 shadow-xl border border-emerald-700 space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
          <span className="text-xs font-black uppercase text-yellow-300 tracking-wider flex items-center gap-1">
            <Tag size={14} /> Trending Stock Prices (Eldoret Soko):
          </span>
          <span className="text-[10px] text-emerald-300 font-bold">Updated Today 6am</span>
        </div>

        <div className="space-y-2">
          {trendingPrices.map((p, idx) => (
            <div key={idx} className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <div className="font-black text-sm text-white">{p.item}</div>
                <div className="text-[10px] text-emerald-300 font-bold">{p.desc}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-yellow-300">{p.price}</div>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                  <TrendingDown size={10} /> {p.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BEST DEALS FROM SUPPLIERS (BLUE & ORANGE CARDS) */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide px-1 flex items-center gap-1">
          <ShieldCheck size={14} className="text-emerald-600" /> Best Deals From Verified Suppliers:
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {supplierDeals.map((sup, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-lg border border-blue-700/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white">{sup.name}</span>
                  <span className="bg-yellow-400 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full uppercase">
                    {sup.badge}
                  </span>
                </div>
                <p className="text-xs text-blue-200 font-bold mt-0.5">{sup.items}</p>
                <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin size={10} className="text-emerald-400" /> {sup.location}
                </div>
              </div>

              {/* WhatsApp Supplier Order Button */}
              <button
                onClick={() => handleOrderSupplier(sup.name, sup.items)}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center gap-1 shadow transition-transform active:scale-95"
              >
                <MessageSquare size={14} className="text-yellow-300" />
                <span>WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. COMMUNITY POSTS (LIKE FACEBOOK FEED) */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h4 className="font-black text-base text-gray-900 flex items-center gap-1.5">
            <Share2 size={16} className="text-emerald-600" /> Community Posts & Deals
          </h4>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Eldoret Mamas
          </span>
        </div>

        <div className="space-y-3">
          {communityPosts.map(post => (
            <div key={post.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-gray-900">{post.author}</span>
                <span className="text-[10px] text-gray-400 font-medium">{post.time}</span>
              </div>

              <p className="text-xs text-gray-800 font-bold leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-3 pt-1 border-t border-gray-200 text-xs">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 font-bold ${
                    userLiked[post.id] ? 'text-emerald-600 font-black' : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  <ThumbsUp size={14} /> {post.likes} Likes
                </button>

                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <MessageSquare size={14} /> {post.comments} Comments
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MAP AT BOTTOM (ELDORET MARKET PINS) */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl border border-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
            <MapPin size={14} /> Live Market Pins (Eldoret):
          </span>
          <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            Offline Map Cache
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
          <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
            <div className="font-black text-yellow-300">Eldoret Market</div>
            <div className="text-[9px] text-gray-400">Tomatoes KES 50</div>
          </div>
          <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
            <div className="font-black text-yellow-300">Cheptiret</div>
            <div className="text-[9px] text-gray-400">Potatoes KES 60</div>
          </div>
          <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
            <div className="font-black text-yellow-300">Kapsoya</div>
            <div className="text-[9px] text-gray-400">Avocados KES 20</div>
          </div>
        </div>
      </div>

    </div>
  );
};
