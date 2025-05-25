/*
 * PROMOTION DATA INSIGHTS FROM XML ANALYSIS:
 * 
 * 1. PROMOTION STRUCTURE:
 *    - Each promotion has a unique ID and can apply to multiple items
 *    - Promotions have clear start/end dates with specific hours
 *    - Hebrew descriptions contain promotion details and pricing
 * 
 * 2. PROMOTION TYPES FOUND:
 *    - Fixed price discounts: "חרוסת 180 גר -4.9" (specific price)
 *    - Bundle deals: "2 ב5" (2 for 5), "2 ב26" (2 for 26)
 *    - Single item discounts: Regular price reductions
 * 
 * 3. PROMOTION FIELDS ANALYSIS:
 *    - RewardType: Always 1 in samples (unclear what other values mean)
 *    - DiscountType: Always 1 in samples
 *    - DiscountRate: Always 0.00 (actual discount in DiscountedPrice)
 *    - MinQty: Minimum quantity to qualify (1 or 2 in samples)
 *    - MAXQTY: Usually 0 (unlimited?)
 *    - MinNoOfItemOfered: Always 10 (store policy?)
 * 
 * 4. MULTI-ITEM PROMOTIONS:
 *    - Some promotions apply to multiple item codes (up to 5 in samples)
 *    - All items in promotion get same discounted price
 *    - Example: "גבינות שמנת ניו יורק" applies to 4 different item codes
 * 
 * 5. DESCRIPTION PARSING NEEDS:
 *    - Hebrew descriptions contain: product name, quantity, discounted price
 *    - Bundle format: "2 ב26" means "2 for 26 shekels"
 *    - Need parsing to extract discount type and amounts
 * 
 * 6. DATE/TIME HANDLING:
 *    - Separate fields for date and hour (start/end)
 *    - Hours typically 00:00:00 to 23:59:00 for full days
 *    - Update dates show when promotion was last modified
 * 
 * 7. RESTRICTIONS & CONDITIONS:
 *    - AdditionalRestrictions contains various flags
 *    - Club membership requirements (ClubId)
 *    - Coupon requirements (AdditionalIsCoupon)
 *    - Gift items tracking (AdditionalGiftCount, IsGiftItem)
 */

// Raw XML Promotion structure - exactly as it comes from the government API
export interface RawXMLPromotion {
  PromotionId: string;
  PromotionDescription: string;
  PromotionUpdateDate: string;
  PromotionStartDate: string;
  PromotionStartHour: string;
  PromotionEndDate: string;
  PromotionEndHour: string;
  RewardType: string;
  DiscountType: string;
  DiscountRate: string;
  AllowMultipleDiscounts: string;
  MinQty: string;
  MAXQTY: string;
  DiscountedPrice: string;
  DiscountedPricePerMida: string;
  MinNoOfItemOfered: string;
  AdditionalRestrictions: {
    AdditionalIsCoupon: string;
    AdditionalGiftCount: string;
    Clubs: {
      ClubId: string;
    };
    AdditionalIsTotal: string;
    AdditionalIsActive: string;
  };
  PromotionItems: {
    count: string;
    Item: Array<{
      ItemCode: string;
      IsGiftItem: string;
      ItemType: string;
    }> | {
      ItemCode: string;
      IsGiftItem: string;
      ItemType: string;
    }; // Can be single item or array
  };
  Remarks: string;
}

// Normalized and processed promotion structure
export interface Promotion {
  // Core identification
  promotionId: string;
  description: string;
  descriptionHebrew: string;
  
  // Timing
  startDate: Date;
  endDate: Date;
  lastUpdated: Date;
  isActive: boolean;
  
  // Discount details
  promotionType: PromotionType;
  originalPrice?: number; // Need to lookup from item data
  discountedPrice: number;
  discountAmount?: number; // Calculated: originalPrice - discountedPrice
  discountPercentage?: number; // Calculated percentage
  
  // Quantity requirements
  minimumQuantity: number;
  maximumQuantity?: number; // 0 means unlimited
  bundleSize?: number; // For "2 for X" deals
  bundlePrice?: number; // Total price for bundle
  
  
  // Applicable items
  itemCodes: string[];
  itemCount: number;
  
  // Restrictions and conditions
  restrictions: PromotionRestrictions;
  
  // Computed fields
  savingsAmount?: number;
  savingsPercentage?: number;
  pricePerUnit?: number; // For bundle deals
  
  // Additional info
  remarks?: string;
}

export interface PromotionRestrictions {
  requiresCoupon: boolean;
  requiresClubMembership: boolean;
  clubId?: string;
  allowMultipleDiscounts: boolean;
  minimumStoreStock: number; // MinNoOfItemOfered
  hasGiftItems: boolean;
  giftItemCount: number;
  isStoreWidePromotion: boolean;
}

export enum PromotionType {
  // From analysis of description patterns:
  FIXED_PRICE = 'fixed_price',           // "חרוסת 180 גר -4.9"
  BUNDLE_DEAL = 'bundle_deal',           // "2 ב5", "2 ב26"
  PERCENTAGE_OFF = 'percentage_off',     // TBD - not seen in samples
  BUY_X_GET_Y = 'buy_x_get_y',          // TBD - not seen in samples
  VOLUME_DISCOUNT = 'volume_discount',   // TBD - for bulk purchases
  CLEARANCE = 'clearance',               // TBD - end of season
  UNKNOWN = 'unknown'
}
