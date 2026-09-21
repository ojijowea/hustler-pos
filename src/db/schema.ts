import Dexie, { Table } from 'dexie';
import { InventoryItem, StockInRecord, SaleRecord, ExpenseRecord, Customer, WabaSettings } from '../types';
import { PRELOADED_ITEMS } from './initialData';

export class HustlerDatabase extends Dexie {
  inventory!: Table<InventoryItem>;
  stockIn!: Table<StockInRecord>;
  sales!: Table<SaleRecord>;
  expenses!: Table<ExpenseRecord>;
  customers!: Table<Customer>;
  wabaSettings!: Table<WabaSettings>;

  constructor() {
    super('HustlerPOSDatabase');
    
    this.version(1).stores({
      inventory: '++id, name, category, businessProfile, unit',
      stockIn: '++id, itemName, unit, createdAt',
      sales: '++id, itemName, paymentType, customerId, createdAt',
      expenses: '++id, category, createdAt',
      customers: '++id, name, totalDeni, dueDate, paymentScore',
      wabaSettings: '++id, wabaId, phoneNumberId'
    });
  }

  async seedIfEmpty() {
    const count = await this.inventory.count();
    if (count === 0) {
      await this.inventory.bulkAdd(PRELOADED_ITEMS);
      console.log('Seeded 50 default inventory items.');
    }
  }
}

export const db = new HustlerDatabase();

// Seed database on launch
db.seedIfEmpty().catch(err => console.error('Error seeding DB:', err));
