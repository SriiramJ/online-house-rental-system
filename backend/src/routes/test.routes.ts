import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Booking API is working' });
});

router.post('/test-create', (req, res) => {
  console.log('Test booking request received:', req.body);
  res.json({ success: true, message: 'Test booking created', data: req.body });
});

export default router;