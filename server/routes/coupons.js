import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateCouponCode } from '../lib/coupons.js';

const router = Router();

router.post(
  '/validate',
  asyncHandler(async (req, res) => {
    const { code, subtotal } = req.body ?? {};
    const orderSubtotal = Number(subtotal);
    if (!code?.trim()) {
      return res.status(400).json({ error: 'Coupon code is required.' });
    }
    if (!Number.isFinite(orderSubtotal) || orderSubtotal <= 0) {
      return res.status(400).json({ error: 'Order subtotal is required.' });
    }
    const result = await validateCouponCode(code, orderSubtotal);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json({
      code: result.coupon.code,
      discountType: result.coupon.discountType,
      discountValue: result.coupon.discountValue,
      discountAmount: result.discountAmount,
      total: result.total,
    });
  }),
);

export default router;
