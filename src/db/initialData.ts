import { InventoryItem } from '../types';

export const PRELOADED_ITEMS: Omit<InventoryItem, 'id'>[] = [
  // Mama Mboga (Vegetables & Fruits)
  { name: 'Nyanya (Tomatoes)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 15, costPrice: 50, sellingPrice: 80, lastUpdated: new Date().toISOString() },
  { name: 'Vitunguu (Onions)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 20, costPrice: 65, sellingPrice: 100, lastUpdated: new Date().toISOString() },
  { name: 'Sukuma Wiki', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.2, quantity: 40, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Hoho (Green Peppers)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 8, costPrice: 70, sellingPrice: 110, lastUpdated: new Date().toISOString() },
  { name: 'Dania (Coriander)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.1, quantity: 30, costPrice: 5, sellingPrice: 10, lastUpdated: new Date().toISOString() },
  { name: 'Ndizi Ivivu (Ripe Bananas)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 50, costPrice: 5, sellingPrice: 10, lastUpdated: new Date().toISOString() },
  { name: 'Ndizi Kawaida (Raw Bananas)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 60, costPrice: 6, sellingPrice: 12, lastUpdated: new Date().toISOString() },
  { name: 'Parachichi (Avocados)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 25, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Carrots', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 12, costPrice: 40, sellingPrice: 70, lastUpdated: new Date().toISOString() },
  { name: 'Viazi Tamu (Sweet Potatoes)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 25, costPrice: 45, sellingPrice: 80, lastUpdated: new Date().toISOString() },
  { name: 'Viazi Mviringo (Irish Potatoes)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Gunia', unitConversionKg: 50, quantity: 2, costPrice: 2200, sellingPrice: 3500, lastUpdated: new Date().toISOString() },
  { name: 'Managu / Nigrum', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.25, quantity: 20, costPrice: 20, sellingPrice: 40, lastUpdated: new Date().toISOString() },
  { name: 'Terere (Amaranth)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.25, quantity: 20, costPrice: 20, sellingPrice: 40, lastUpdated: new Date().toISOString() },
  { name: 'Mchicha', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.2, quantity: 25, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Cabbage', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 15, costPrice: 30, sellingPrice: 60, lastUpdated: new Date().toISOString() },
  { name: 'Maembe (Mangoes)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 30, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Limau (Lemons)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 40, costPrice: 3, sellingPrice: 10, lastUpdated: new Date().toISOString() },
  { name: 'Tikiti (Watermelon)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 5, costPrice: 150, sellingPrice: 250, lastUpdated: new Date().toISOString() },

  // Duka (Retail Shop)
  { name: 'Sukari 1kg (Sugar)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 24, costPrice: 140, sellingPrice: 170, lastUpdated: new Date().toISOString() },
  { name: 'Unga wa Semea 2kg (Jogoo/Pembe)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 12, costPrice: 125, sellingPrice: 155, lastUpdated: new Date().toISOString() },
  { name: 'Unga wa Ngano 2kg (Exe/Taifa)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 12, costPrice: 150, sellingPrice: 185, lastUpdated: new Date().toISOString() },
  { name: 'Mafuta ya Kupika 1L (Salit/Fresh Fri)', category: 'Duka', businessProfile: 'Duka', unit: 'Piece', quantity: 10, costPrice: 220, sellingPrice: 260, lastUpdated: new Date().toISOString() },
  { name: 'Maziwa 500ml (Fresha/KCC)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 30, costPrice: 50, sellingPrice: 65, lastUpdated: new Date().toISOString() },
  { name: 'Chai majani 100g (Ketepa)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 20, costPrice: 35, sellingPrice: 50, lastUpdated: new Date().toISOString() },
  { name: 'Chumvi 500g (Kensalt)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 40, costPrice: 15, sellingPrice: 25, lastUpdated: new Date().toISOString() },
  { name: 'Sabuni ya Kipande (Omo/Sunlight)', category: 'Duka', businessProfile: 'Duka', unit: 'Piece', quantity: 15, costPrice: 110, sellingPrice: 140, lastUpdated: new Date().toISOString() },
  { name: 'Sabuni ya Unga 500g (Ariel)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 10, costPrice: 130, sellingPrice: 165, lastUpdated: new Date().toISOString() },
  { name: 'Matchbox (Kibiriti)', category: 'Duka', businessProfile: 'Duka', unit: 'Piece', quantity: 50, costPrice: 3, sellingPrice: 10, lastUpdated: new Date().toISOString() },
  { name: 'Tissue Paper (Hanis/Flora)', category: 'Duka', businessProfile: 'Duka', unit: 'Piece', quantity: 30, costPrice: 20, sellingPrice: 35, lastUpdated: new Date().toISOString() },
  { name: 'Baking Powder', category: 'Duka', businessProfile: 'Duka', unit: 'Piece', quantity: 15, costPrice: 40, sellingPrice: 60, lastUpdated: new Date().toISOString() },
  { name: 'Royco Mchuzi Mix', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 50, costPrice: 5, sellingPrice: 10, lastUpdated: new Date().toISOString() },

  // Chips Kibanda
  { name: 'Chips Portion (Normal)', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Portion', quantity: 30, costPrice: 40, sellingPrice: 100, lastUpdated: new Date().toISOString() },
  { name: 'Chips Large Portion', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Portion', quantity: 20, costPrice: 60, sellingPrice: 150, lastUpdated: new Date().toISOString() },
  { name: 'Smokie 1 Piece', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Piece', quantity: 40, costPrice: 20, sellingPrice: 35, lastUpdated: new Date().toISOString() },
  { name: 'Sausage 1 Piece', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Piece', quantity: 30, costPrice: 25, sellingPrice: 50, lastUpdated: new Date().toISOString() },
  { name: 'Mayai Yaliyochemshwa (Boiled Egg)', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Piece', quantity: 30, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Kachumbari Portion', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Portion', quantity: 50, costPrice: 5, sellingPrice: 20, lastUpdated: new Date().toISOString() },
  { name: 'Soda 300ml Glass', category: 'Vinywaji', businessProfile: 'Chips Kibanda', unit: 'Piece', quantity: 24, costPrice: 35, sellingPrice: 50, lastUpdated: new Date().toISOString() },

  // Kinyozi & Executive Salon
  { name: 'Kinyozi Cut - Men / Adults', category: 'Kinyozi', businessProfile: 'Kinyozi', unit: 'Head', quantity: 100, costPrice: 20, sellingPrice: 200, lastUpdated: new Date().toISOString() },
  { name: 'Kinyozi Cut - Kids / Watoto', category: 'Kinyozi', businessProfile: 'Kinyozi', unit: 'Head', quantity: 100, costPrice: 15, sellingPrice: 100, lastUpdated: new Date().toISOString() },
  { name: 'Beard Trim / Shave (Ndevu)', category: 'Kinyozi', businessProfile: 'Kinyozi', unit: 'Head', quantity: 100, costPrice: 10, sellingPrice: 100, lastUpdated: new Date().toISOString() },
  { name: 'Dreadlock Maintenance / Retwist', category: 'Salon', businessProfile: 'Kinyozi', unit: 'Head', quantity: 50, costPrice: 100, sellingPrice: 800, lastUpdated: new Date().toISOString() },
  { name: 'Hair Wash & Conditioning', category: 'Salon', businessProfile: 'Kinyozi', unit: 'Head', quantity: 100, costPrice: 30, sellingPrice: 150, lastUpdated: new Date().toISOString() },
  { name: 'Dyeing / Hair Color', category: 'Salon', businessProfile: 'Kinyozi', unit: 'Head', quantity: 50, costPrice: 100, sellingPrice: 400, lastUpdated: new Date().toISOString() },

  // Butchery
  { name: 'Nyama ya Ng\'ombe (Beef 1kg)', category: 'Butchery', businessProfile: 'Butchery', unit: 'Kilo', quantity: 20, costPrice: 450, sellingPrice: 600, lastUpdated: new Date().toISOString() },
  { name: 'Nyama ya Mbuzi (Goat 1kg)', category: 'Butchery', businessProfile: 'Butchery', unit: 'Kilo', quantity: 15, costPrice: 520, sellingPrice: 700, lastUpdated: new Date().toISOString() },
  { name: 'Matumbo (Tripe 1kg)', category: 'Butchery', businessProfile: 'Butchery', unit: 'Kilo', quantity: 15, costPrice: 220, sellingPrice: 350, lastUpdated: new Date().toISOString() },
  { name: 'Kuku ya Kienyeji Full', category: 'Butchery', businessProfile: 'Butchery', unit: 'Piece', quantity: 8, costPrice: 750, sellingPrice: 1100, lastUpdated: new Date().toISOString() },
  { name: 'Kuku Broiler Full', category: 'Butchery', businessProfile: 'Butchery', unit: 'Piece', quantity: 12, costPrice: 420, sellingPrice: 650, lastUpdated: new Date().toISOString() },
  { name: 'Supu Bowl', category: 'Butchery', businessProfile: 'Butchery', unit: 'Portion', quantity: 30, costPrice: 20, sellingPrice: 70, lastUpdated: new Date().toISOString() }
];
