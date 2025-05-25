import { Router } from 'express';

const router = Router();

// Get all supermarkets
router.get('/', (req, res) => {
  res.json({ message: 'Get all supermarkets' });
});

// Get supermarket by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get supermarket ${req.params.id}` });
});

// Get nearby supermarkets
router.get('/nearby', (req, res) => {
  const { lat, lng, radius } = req.query;
  res.json({ 
    message: 'Get nearby supermarkets',
    params: { lat, lng, radius }
  });
});

export default router; 