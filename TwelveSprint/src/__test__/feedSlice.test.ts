import feedSlice from '../services/slices/feedSlice/feedSlice';
import {
  getFeeds,
  initialState as feedInit
} from '../services/slices/feedSlice/feedSlice';
import { describe, test, expect } from '@jest/globals';

describe('Reducer: feedSlice', () => {
  const act = {
    pending: { type: getFeeds.pending.type, payload: null },
    rejected: { type: getFeeds.rejected.type, error: { message: 'oops' } },
    fulfilled: {
      type: getFeeds.fulfilled.type,
      payload: { orders: ['x', 'y'] }
    }
  };

  test('GET pending устанавливает loading', () => {
    const s = feedSlice(feedInit, act.pending);
    expect(s.loading).toBe(true); // мы начали загрузку
    expect(s.error).toBeNull();
  });

  test('GET rejected обрабатывает ошибку', () => {
    const s = feedSlice(feedInit, act.rejected);
    expect(s.loading).toBe(false);
    expect(s.error).toBe('oops');
  });

  test('GET fulfilled сохраняет orders', () => {
    const s = feedSlice(feedInit, act.fulfilled);
    expect(s.loading).toBe(false);
    expect(s.orders).toEqual(['x', 'y']);
  });
});
