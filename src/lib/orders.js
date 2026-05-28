import { ordersApi } from './api.js';

const ORDERS_KEY = 'raafort-orders';

/** @deprecated use API — kept for offline fallback */
export function generateOrderId() {
  const n = Date.now().toString(36).toUpperCase().slice(-6);
  return `RAF-${n}`;
}

function cacheOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getCachedOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export async function createOrder(payload) {
  try {
    const { order } = await ordersApi.create(payload);
    const cached = getCachedOrders();
    cacheOrders([order, ...cached].slice(0, 50));
    return order;
  } catch (e) {
    if (import.meta.env.DEV) console.warn('API order failed, using local fallback:', e.message);
    const order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      customer: payload.customer,
      payment: payload.payment,
      items: payload.items,
      subtotal: payload.subtotal,
    };
    cacheOrders([order, ...getCachedOrders()].slice(0, 50));
    return order;
  }
}

export async function fetchOrderById(id) {
  try {
    const { order } = await ordersApi.get(id);
    return order;
  } catch {
    return getCachedOrders().find((o) => o.id === id) ?? null;
  }
}

export function getOrders() {
  return getCachedOrders();
}

export function getOrderById(id) {
  return getCachedOrders().find((o) => o.id === id) ?? null;
}
