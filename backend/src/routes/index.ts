import { Router } from 'express';
import authRoutes from './auth.routes';
import paymentRoutes from './payment.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'PayZen API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;