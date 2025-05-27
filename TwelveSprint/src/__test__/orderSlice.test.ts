import orderSlice from '../services/slices/orderSlice/orderSlice';
import {
  getOrderByNumber,
  initialState as orderInit
} from '../services/slices/orderSlice/orderSlice';
import { describe, test, expect } from '@jest/globals';

describe('Reducer: orderSlice', () => {
  const act = {
    pending: { type: getOrderByNumber.pending.type, payload: null },
    rejected: {
      type: getOrderByNumber.rejected.type,
      error: { message: 'err' }
    },
    fulfilled: {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: ['Z'] }
    }
  };

  test('pending → request true', () => {
    const s = orderSlice(orderInit, act.pending);
    expect(s.request).toBe(true);
  });

  test('rejected → error & request false', () => {
    const s = orderSlice(orderInit, act.rejected);
    expect(s.request).toBe(false);
    expect(s.error).toBe('err');
  });

  test('fulfilled → сохраняем orderByNumberResponse', () => {
    const s = orderSlice(orderInit, act.fulfilled);
    expect(s.request).toBe(false);
    expect(s.orderByNumberResponse).toBe('Z');
  });
});
