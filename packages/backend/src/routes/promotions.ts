import { Router } from 'express';

const router = Router();

// Get all promotions
router.get('/', (req, res) => {
  res.json({ message: 'Get all promotions' });
});

// Get current promotions
router.get('/current', (req, res) => {
  res.json({ message: 'Get current promotions' });
});

// Get promotions by store
router.get('/store/:storeId', (req, res) => {
  res.json({ message: `Get promotions for store ${req.params.storeId}` });
});

// Get promotions by item
router.get('/item/:itemId', (req, res) => {
  res.json({ message: `Get promotions for item ${req.params.itemId}` });
});

export default router; 