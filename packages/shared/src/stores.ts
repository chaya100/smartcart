/*
 * STORE/CHAIN DATA INSIGHTS FROM XML ANALYSIS:
 * 
 * 1. HIERARCHICAL STRUCTURE:
 *    - Chain → SubChain → Store (3-level hierarchy)
 *    - One chain can have multiple sub-chains
 *    - Each sub-chain contains multiple store locations
 * 
 * 2. DATA QUALITY ISSUES FOUND:
 *    - Empty addresses: Some stores have empty <Address /> tags
 *    - Unknown cities: "unknown" used as placeholder
 *    - Invalid zip codes: "0000000" for missing data
 *    - BikoretNo sometimes 0 (missing inspection number?)
 * 
 * 3. STORE IDENTIFICATION:
 *    - ChainId: Unique identifier for the entire chain (like barcode format)
 *    - SubChainId: Identifier within the chain (numeric)
 *    - StoreId: Unique identifier within sub-chain (numeric)
 *    - BikoretNo: Government inspection/license number
 * 
 * 4. NAMING PATTERNS:
 *    - Store names often include: location, street, brand codes
 *    - Format variations: "רחובות C NH ברכל", "אלעד - הריף ברכל טוב @"
 *    - Contains brand indicators: "ברכל", "NH", "C", "@", "BAR"
 * 
 * 5. ADDRESS STANDARDIZATION NEEDS:
 *    - Hebrew addresses with varying formats
 *    - Street numbers sometimes in name, sometimes separate
 *    - Cities in Hebrew require geocoding for map features
 * 
 * 6. UPDATE TRACKING:
 *    - Chain-level last update date and time
 *    - No individual store update tracking in this format
 * 
 * 7. STORE TYPES:
 *    - StoreType field (seen: 1) - unclear what other values mean
 *    - Might indicate: regular store, express, warehouse, etc.
 */

// Raw XML Chain/Store structure - exactly as it comes from the government API
export interface RawXMLChain {
    ChainId: string;
    ChainName: string;
    LastUpdateDate: string;
    LastUpdateTime: string;
    SubChains: {
      SubChain: Array<{
        SubChainId: string;
        SubChainName: string;
        Stores: {
          Store: Array<{
            StoreId: string;
            BikoretNo: string;
            StoreType: string;
            StoreName: string;
            Address: string;
            City: string;
            ZipCode: string;
          }>
        };
      }>
    };
  }
  
  // Normalized chain structure
  export interface Chain {
    // Core identification
    chainId: string;
    chainName: string;
    chainNameHebrew: string;
    
    // Metadata
    lastUpdated: Date;
    isActive: boolean;
    
    // Sub-chains within this chain
    subChains: SubChain[];
    
    // Computed aggregates
    totalStores: number;
    cities: string[];

  }
  
  export interface SubChain {
    // Core identification
    subChainId: string;
    subChainName: string;
    subChainNameHebrew: string;
    parentChainId: string;
    
    // Stores in this sub-chain
    stores: Store[];
    
    // Computed aggregates
    storeCount: number;
    cities: string[];
    
    // Sub-chain characteristics
    brandingStyle: string; // Extracted from naming patterns
  }
  
  // Normalized store structure
  export interface Store {
    // Core identification
    storeId: string;
    chainId: string;
    subChainId: string;
 
    // Basic information
    storeName: string;
    storeNameHebrew: string;
    storeNameCleaned: string; // Without brand codes and formatting
    
    // Location
    address: StoreAddress;
    
    // Operational status
    isActive: boolean;
    lastVerified?: Date;

    // Computed fields for search and filtering
    searchTerms: string[];
    neighborhoodTags: string[];
  }
  
  export interface StoreAddress {
    street?: string;
    streetNumber?: string;
    fullAddress: string; // Raw address from XML
    city: string;
    cityHebrew: string;
    zipCode?: string;
    isValidZipCode: boolean;
    isValidAddress: boolean;
  }
