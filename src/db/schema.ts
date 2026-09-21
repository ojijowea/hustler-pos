import Dexie, { Table } from 'dexie';
import { InventoryItem, StockInRecord, SaleRecord, ExpenseRecord, Customer, WabaSettings } from '../types';
import { PRELOADED_ITEMS, PRELOADED_SALES, PRELOADED_EXPENSES, PRELOADED_CUSTOMERS } from './initialData';

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
    const invCount = await this.inventory.count();
    if (invCount === 0) {
      await this.inventory.bulkAdd(PRELOADED_ITEMS);
    }

    const salesCount = await this.sales.count();
    if (salesCount === 0) {
      await this.sales.bulkAdd(PRELOADED_SALES);
    }

    const expCount = await this.expenses.count();
    if (expCount === 0) {
      await this.expenses.bulkAdd(PRELOADED_EXPENSES);
    }

    const custCount = await this.customers.count();
    if (custCount === 0) {
      await this.customers.bulkAdd(PRELOADED_CUSTOMERS);
    }
  }
}

export const db = new HustlerDatabase();

// Seed database on launch
db.seedIfEmpty().catch(err => console.error('Error seeding DB:', err));
