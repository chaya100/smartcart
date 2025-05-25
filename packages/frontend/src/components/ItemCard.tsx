import React from 'react';
import { GroceryItem } from '@smartcart/shared';

interface ItemCardProps {
  item: GroceryItem;
  onClick?: (item: GroceryItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    <div 
      className="item-card"
      onClick={() => onClick?.(item)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        backgroundColor: '#f9f9f9',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = '#f9f9f9';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.itemName}</h3>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Hebrew Name:</strong> {item.itemNameHebrew}
      </p>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Price:</strong> ₪{item.price.toFixed(2)}
      </p>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Unit Price:</strong> ₪{item.unitPrice.toFixed(2)} / {item.unitOfMeasure}
      </p>
      {item.manufacturer && (
        <p style={{ margin: '4px 0', color: '#666' }}>
          <strong>Manufacturer:</strong> {item.manufacturer}
          {item.manufacturerCountry && ` (${item.manufacturerCountry})`}
        </p>
      )}
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Store:</strong> {item.storeChain}
      </p>
      {item.category && (
        <p style={{ margin: '4px 0', color: '#666' }}>
          <strong>Category:</strong> {item.category}
          {item.subcategory && ` - ${item.subcategory}`}
        </p>
      )}
      <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>
        Item Code: {item.itemCode}
      </p>
    </div>
  );
};

export default ItemCard;