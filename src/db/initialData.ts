import { InventoryItem, SaleRecord, ExpenseRecord, Customer } from '../types';

export const PRELOADED_ITEMS: Omit<InventoryItem, 'id'>[] = [
  // Mama Mboga (Vegetables & Fruits)
  { name: 'Nyanya (Tomatoes)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 15, costPrice: 50, sellingPrice: 80, lastUpdated: new Date().toISOString() },
  { name: 'Vitunguu (Onions)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 20, costPrice: 65, sellingPrice: 100, lastUpdated: new Date().toISOString() },
  { name: 'Sukuma Wiki', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.2, quantity: 40, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Hoho (Green Peppers)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 8, costPrice: 70, sellingPrice: 110, lastUpdated: new Date().toISOString() },
  { name: 'Dania (Coriander)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Fungu', unitConversionKg: 0.1, quantity: 30, costPrice: 5, sellingPrice: 10, lastUpdated: new Date().toISOString() },
  { name: 'Ndizi Ivivu (Ripe Bananas)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 50, costPrice: 5, sellingPrice: 10, lastUpdated: new Date().toISOString() },
  { name: 'Parachichi (Avocados)', category: 'Matunda', businessProfile: 'Mama Mboga', unit: 'Piece', quantity: 25, costPrice: 15, sellingPrice: 30, lastUpdated: new Date().toISOString() },
  { name: 'Carrots', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Kilo', quantity: 12, costPrice: 40, sellingPrice: 70, lastUpdated: new Date().toISOString() },
  { name: 'Viazi Mviringo (Potatoes)', category: 'Mboga', businessProfile: 'Mama Mboga', unit: 'Gunia', unitConversionKg: 50, quantity: 2, costPrice: 2200, sellingPrice: 3500, lastUpdated: new Date().toISOString() },

  // Duka (Retail Shop)
  { name: 'Sukari 1kg (Sugar)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 24, costPrice: 140, sellingPrice: 170, lastUpdated: new Date().toISOString() },
  { name: 'Unga wa Semea 2kg (Jogoo)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 12, costPrice: 125, sellingPrice: 155, lastUpdated: new Date().toISOString() },
  { name: 'Maziwa 500ml (Fresha)', category: 'Duka', businessProfile: 'Duka', unit: 'Packet', quantity: 30, costPrice: 50, sellingPrice: 65, lastUpdated: new Date().toISOString() },

  // Chips Kibanda
  { name: 'Chips Portion (Normal)', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Portion', quantity: 30, costPrice: 40, sellingPrice: 100, lastUpdated: new Date().toISOString() },
  { name: 'Smokie 1 Piece', category: 'Chips', businessProfile: 'Chips Kibanda', unit: 'Piece', quantity: 40, costPrice: 20, sellingPrice: 35, lastUpdated: new Date().toISOString() },

  // Kinyozi & Executive Salon
  { name: 'Kinyozi Cut - Men / Adults', category: 'Kinyozi', businessProfile: 'Kinyozi', unit: 'Head', quantity: 100, costPrice: 20, sellingPrice: 200, lastUpdated: new Date().toISOString() },
  { name: 'Beard Trim / Shave (Ndevu)', category: 'Kinyozi', businessProfile: 'Kinyozi', unit: 'Head', quantity: 100, costPrice: 10, sellingPrice: 100, lastUpdated: new Date().toISOString() },

  // Butchery
  { name: 'Nyama ya Ng\'ombe (Beef 1kg)', category: 'Butchery', businessProfile: 'Butchery', unit: 'Kilo', quantity: 20, costPrice: 450, sellingPrice: 600, lastUpdated: new Date().toISOString() }
];

export const PRELOADED_SALES: Omit<SaleRecord, 'id'>[] = [
  {
    itemName: 'Nyanya (Tomatoes)',
    quantitySold: 10,
    unit: 'Kilo',
    totalAmount: 800,
    costBasis: 500,
    faida: 300,
    paymentType: 'CASH',
    createdAt: new Date().toISOString()
  },
  {
    itemName: 'Vitunguu (Onions)',
    quantitySold: 5,
    unit: 'Kilo',
    totalAmount: 500,
    costBasis: 325,
    faida: 175,
    paymentType: 'CASH',
    createdAt: new Date().toISOString()
  },
  {
    itemName: 'Sukuma Wiki',
    quantitySold: 16,
    unit: 'Fungu',
    totalAmount: 500,
    costBasis: 240,
    faida: 260,
    paymentType: 'CASH',
    createdAt: new Date().toISOString()
  }
];

export const PRELOADED_EXPENSES: Omit<ExpenseRecord, 'id'>[] = [
  { category: 'Sokoni Fare', amount: 100, note: 'Boda na Matatu ya Eldoret Wholesale', createdAt: new Date().toISOString() },
  { category: 'Kibanda Rent', amount: 50, note: 'Kodi ya kibanda ya siku', createdAt: new Date().toISOString() },
  { category: 'Chakula / Chai', amount: 150, note: 'Chai na mandazi ya mchana', createdAt: new Date().toISOString() }
];

export const PRELOADED_CUSTOMERS: Omit<Customer, 'id'>[] = [
  {
    name: 'Mama Brian',
    phoneNumber: '0712345678',
    totalDeni: 200,
    dueDate: 'Jumamosi',
    duePeriod: 'Jumamosi',
    historyCount: 3,
    paymentScore: 'ALWAYS_PAYS_LATE',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Mama Achi',
    phoneNumber: '0722334455',
    totalDeni: 450,
    dueDate: 'Kesho',
    duePeriod: 'Kesho',
    historyCount: 5,
    paymentScore: 'GOOD',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Njoro Wa Boda',
    phoneNumber: '0733445566',
    totalDeni: 150,
    dueDate: 'Leo Jioni',
    duePeriod: 'Leo Jioni',
    historyCount: 2,
    paymentScore: 'NEW',
    createdAt: new Date().toISOString()
  }
];
