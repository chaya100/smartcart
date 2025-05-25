import { Router } from 'express';
import { ItemsResponse, GroceryItem, ItemType, UnitType, StoreChain } from '@smartcart/shared';
import { databaseService } from '../services/database';

const router = Router();

// Fallback mock data (used if database is not available)
const mockItems: GroceryItem[] = [
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

// Determine if we should use database or mock data
const useDatabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
    let items: GroceryItem[];
    
    if (useDatabase) {
      items = await databaseService.getAllItems();
    } else {
      console.log('Using mock data - database not configured');
      items = mockItems;
    }

    const response: ItemsResponse = {
      success: true,
      data: items
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching items:', error);
    
    // Fallback to mock data if database fails
    const response: ItemsResponse = {
      success: true,
      data: mockItems
    };
    res.json(response);
  }
});

export default router;