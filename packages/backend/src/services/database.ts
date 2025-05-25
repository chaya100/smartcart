import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GroceryItem, ItemType, StoreChain, UnitType } from '@smartcart/shared';

export class DatabaseService {
  private readonly tableName = 'grocery_items';
  private supabase: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    if (!this.supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration. Please check your environment variables.');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    return this.supabase;
  }

  canInitialize(): boolean {
    return this.getClient() !== null;
  }

  async getAllItems(): Promise<GroceryItem[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Database error fetching items:', error);
        throw new Error('Failed to fetch items from database');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllItems:', error);
      throw error;
    }
  }

  async getItemById(id: string): Promise<GroceryItem | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Item not found
        }
        console.error('Database error fetching item:', error);
        throw new Error('Failed to fetch item from database');
      }

      return data;
    } catch (error) {
      console.error('Error in getItemById:', error);
      throw error;
    }
  }

  async createItem(item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error('Database error creating item:', error);
        throw new Error('Failed to create item in database');
      }

      return data;
    } catch (error) {
      console.error('Error in createItem:', error);
      throw error;
    }
  }

  // Initialize database with sample data if empty
  async initializeSampleData(): Promise<void> {
    try {
      const items = await this.getAllItems();
      
      if (items.length === 0) {
        console.log('Initializing database with sample data...');
        
        const sampleItems: GroceryItem[] = [
          {
            itemCode: '1',
            itemName: 'Laptop',
            itemNameHebrew: 'מחשב נייד',
            price: 1200,
            unitPrice: 1200,
            description: 'High-performance laptop',
            quantity: 1,
            unitQuantity: UnitType.PIECE,
            unitOfMeasure: 'unit',
            unitOfMeasureNormalized: 'unit',
            isWeighted: false,
            itemType: ItemType.REGULAR,
            lastUpdated: new Date(),
            storeChain: StoreChain.UNKNOWN,
            manufacturer: 'TechCorp',
            manufacturerCountry: 'USA'
          },
          {
            itemCode: '2',
            itemName: 'Coffee Beans',
            itemNameHebrew: 'פולי קפה',
            price: 25,
            unitPrice: 25,
            description: 'Premium coffee beans',
            quantity: 1,
            unitQuantity: UnitType.KILOGRAM,
            unitOfMeasure: 'kg',
            unitOfMeasureNormalized: 'kg',
            isWeighted: true,
            itemType: ItemType.WEIGHTED,
            lastUpdated: new Date(),
            storeChain: StoreChain.UNKNOWN,
            manufacturer: 'CoffeeCo',
            manufacturerCountry: 'Brazil'
          }
        ];

        for (const item of sampleItems) {
          await this.createItem(item);
        }
        
        console.log('Sample data initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize sample data:', error);
      // Don't throw the error, just log it
    }
  }
}

export const databaseService = new DatabaseService();