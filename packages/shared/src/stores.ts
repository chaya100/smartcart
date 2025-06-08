
  // Normalized chain structure
  export interface Chain {
    // Core identification
    chainId: string;
    chainName: string;
    
    // Sub-chains within this chain
    subChains: SubChain[];
  }
  
  export interface SubChain {
    // Core identification
    subChainId: string;
    subChainName: string;
    
    // Stores in this sub-chain
    stores: Store[];
  }
  
  // Normalized store structure
  export interface Store {
    // Core identification
    storeId: string;
    chainId: string;
    subChainId: string;
 
    // Basic information
    storeName: string;
    
    // Location
    address: string;
  }
