/*
 * DATA QUALITY INSIGHTS FROM XML ANALYSIS:
 * 
 * 1. FIELD CORRUPTION & INCONSISTENCIES:
 *    - UnitQty: Sometimes valid ("גרם", "ליטר"), sometimes corrupted ("00000")
 *    - UnitOfMeasure: Sometimes valid ("100 גרם"), sometimes corrupted ("0000000000")
 *    - ManufacturerName/ManufactureCountry: Often "לא ידוע" (unknown) - low data quality
 * 
 * 2. UNIT VARIATIONS FOUND:
 *    - "גרם" vs "גר" (gram variations)
 *    - "ליטר" vs "מ'ל" (liter vs milliliter)
 *    - "לק"ג" (per kg) - special unit format
 *    - Corrupted: "00000" and "0000000000"
 * 
 * 3. UNIT OF MEASURE INCONSISTENCIES:
 *    - Standard: "100 גרם", "1 ליטר"
 *    - Corrupted: "0000000000"
 *    - Variations in spacing and formatting
 *    - Sometimes "10 גרם" instead of "100 גרם" (affecting price calculations)
 * 
 * 4. PRICING ANOMALIES:
 *    - UnitOfMeasurePrice calculation sometimes incorrect
 *    - Example: Item with UnitOfMeasure "10 גרם" but UnitOfMeasurePrice calculated as if "100 גרם"
 * 
 * 5. HEBREW TEXT NORMALIZATION NEEDED:
 *    - Product names contain mixed Hebrew/English
 *    - Inconsistent spacing and punctuation
 *    - Brand names in various formats
 *    - Special characters and numbers mixed in names
 * 
 * 6. TIMESTAMP VARIATIONS:
 *    - Different update frequencies per product
 *    - Some items updated daily, others monthly
 *    - Format: "YYYY-MM-DD HH:MM:SS"
 * 
 * 7. QUANTITY PACKAGE INCONSISTENCIES:
 *    - QtyInPackage often "0.0000" even when package quantity exists
 *    - Sometimes contains valid bulk quantities (12.0000, 15.0000)
 * 
 * 8. CATEGORIZATION CHALLENGES:
 *    - No category information in raw data
 *    - Product names need AI parsing for categorization
 *    - Mixed Hebrew/English product descriptions
 *    - Brand names, sizes, and descriptions all mixed in ItemNm
 */

// Raw XML Item structure - exactly as it comes from the government API
export interface RawXMLItem {
  PriceUpdateDate: string;
  ItemCode: string;
  ItemType: string;
  ItemNm: string;
  ManufacturerName: string;
  ManufactureCountry: string;
  ManufacturerItemDescription: string;
  UnitQty: string;
  Quantity: string;
  UnitOfMeasure: string;
  bIsWeighted: string;
  QtyInPackage: string;
  ItemPrice: string;
  UnitOfMeasurePrice: string;
  AllowDiscount: string;
  ItemStatus: string;
}

// Normalized and processed item structure
// NORMALIZATION REQUIREMENTS:
// - Convert string numbers to actual numbers with validation
// - Handle corrupted unit data gracefully
// - Standardize Hebrew text and remove extra spaces
// - Calculate correct unit prices when UnitOfMeasure is corrupted
// - Generate searchable terms from Hebrew product names
// - Classify products into categories using AI/ML
export interface GroceryItem {
  // Core identification

  itemCode: string;
  itemName: string;
  itemNameHebrew: string;
  
  // Pricing information
  price: number;
  unitPrice: number;
  
  // Product details
  manufacturer?: string;
  manufacturerCountry?: string;
  description: string;
  
  // Quantity and measurements
  quantity: number;
  unitQuantity: UnitType;
  unitOfMeasure: string;
  unitOfMeasureNormalized: string;
  isWeighted: boolean;
  quantityInPackage?: number;
  
  // Status and metadata
  itemType: ItemType;
  lastUpdated: Date;
  
  // Store information
  storeChain: StoreChain;
  storeId?: string;
  
  // Computed fields for better searching and categorization
  category?: ProductCategory;
  subcategory?: string;
  tags?: string[];
  searchTerms?: string[];
  
  // Price comparison helpers
  pricePerStandardUnit?: number; // Price per 100g, 1L, etc.
  standardUnit?: StandardUnit;
}

// Enums and types for better type safety
export enum StoreChain {
  YOHANANOF = 'yohananof',
  RAMI_LEVY = 'rami_levy',
  OSHER_AD = 'osher_ad',
  SHUFERSAL = 'shufersal',
  UNKNOWN = 'unknown'
}

export enum ItemType {
  REGULAR = 1,
  WEIGHTED = 2,
  UNKNOWN = 0
}

export enum UnitType {
  GRAM = 'גרם',        // Standard gram unit
  KILOGRAM = 'לק"ג',   // Special "per kg" format found in data
  LITER = 'ליטר',      // Standard liter
  MILLILITER = 'מ\'ל', // Milliliter with apostrophe
  PIECE = 'יח\'',       // Piece/unit
  UNKNOWN = '00000'    // Corrupted data fallback
}

export enum StandardUnit {
  PER_100G = 'per_100g',    // Most common unit for price comparison
  PER_KG = 'per_kg',        // For bulk items
  PER_LITER = 'per_liter',  // For liquids
  PER_100ML = 'per_100ml',  // For small liquid items
  PER_PIECE = 'per_piece'   // For countable items
}

export enum ProductCategory {
  // Categories inferred from product names in the data sample:
  SPICES_SEASONING = 'spices_seasoning',  // אבקת בצל, חוואיג', פפריקה, פלפל שחור
  OILS_VINEGARS = 'oils_vinegars',        // שמן זית
  GRAINS_CEREALS = 'grains_cereals',      // בורגול, אורז יסמין
  MEAT_POULTRY = 'meat_poultry',          // סלמי, נקניקיות
  DAIRY_EGGS = 'dairy_eggs',              // 
  BEVERAGES = 'beverages',                // סירופ אננס, סירופ ענבים
  SNACKS_SWEETS = 'snacks_sweets',        // ג'ליבינס, עוגיות, חלווה, חטיפי פיצה
  BAKING_COOKING = 'baking_cooking',      // סודה לשתייה, נייר אפייה
  ALCOHOL = 'alcohol',                    // יין קריניאנו
  HOUSEHOLD = 'household',                // נייר אפייה
  FROZEN = 'frozen',                      //
  PRODUCE = 'produce',                    //
  BEVERAGES_HOT = 'beverages_hot',        // תה ירוק ויסוצקי
  SPREADS_SAUCES = 'spreads_sauces',      // טחינה
  UNKNOWN = 'unknown'
}

export interface GroceryItemsResponse {
  success: boolean;
  data?: GroceryItem[];
  error?: string;
}

export interface GroceryItemResponse {
  success: boolean;
  data?: GroceryItem;
  error?: string;
}
