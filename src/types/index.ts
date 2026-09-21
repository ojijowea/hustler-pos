export type UnitType = 'Kilo' | 'Fungu' | 'Gunia' | 'Rula' | 'Head' | 'Packet' | 'Portion' | 'Piece';

export type BusinessProfile = 'Mama Mboga' | 'Kinyozi' | 'Chips Kibanda' | 'Duka' | 'Butchery';

export interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  businessProfile: BusinessProfile;
  unit: UnitType;
  unitConversionKg?: number; // e.g. 1 fungu = 0.25 kg
  quantity: number; // current stock quantity in main units
  costPrice: number; // cost per main unit
  sellingPrice: number; // selling price per unit
  lastUpdated: string;
}

export interface StockInRecord {
  id?: number;
  itemId?: number;
  itemName: string;
  unit: UnitType;
  unitConversionKg?: number;
  quantityAdded: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
  totalCost: number;
  expectedSales: number;
  expectedFaida: number;
  receiptPhotoUrl?: string; // base64 or R2 image URL
  createdAt: string;
}

export interface SaleRecord {
  id?: number;
  itemId?: number;
  itemName: string;
  quantitySold: number;
  unit: UnitType;
  totalAmount: number;
  costBasis: number;
  faida: number;
  paymentType: 'CASH' | 'DENI';
  customerId?: number;
  customerName?: string;
  createdAt: string;
}

export interface ExpenseRecord {
  id?: number;
  category: 'Sokoni Fare' | 'Kibanda Rent' | 'Chakula / Chai' | 'Airtime / Other';
  amount: number;
  note?: string;
  createdAt: string;
}

export interface Customer {
  id?: number;
  name: string;
  phoneNumber?: string;
  totalDeni: number;
  dueDate: string;
  duePeriod: 'Leo Jioni' | 'Kesho' | 'Jumamosi' | 'Custom';
  historyCount: number;
  paymentScore: 'GOOD' | 'ALWAYS_PAYS_LATE' | 'NEW';
  lastReminderSent?: string;
  createdAt: string;
}

export interface WabaSettings {
  id?: number;
  wabaId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  businessName?: string;
  connectedAt?: string;
}
