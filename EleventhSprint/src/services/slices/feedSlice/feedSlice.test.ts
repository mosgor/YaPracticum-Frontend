import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('тестирование редьюсера feedSlice', () => {
  describe('тестирование асинхронного GET экшена getFeeds', () => {
    const actions = {
      pending: {
        type: getFeeds.pending.type,
        payload: null
      },
      rejected: {
        type: getFeeds.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: getFeeds.fulfilled.type,
        payload: { orders: ['order1', 'order2'] }
      }
    };

    test('тест синхронного экшена getFeeds.pending', () => {
      const state = feedSlice(initialState, actions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена getFeeds.rejected', () => {
      const state = feedSlice(initialState, actions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('тест синхронного экшена getFeeds.fulfilled', () => {
      const nextState = feedSlice(initialState, actions.fulfilled);
      expect(nextState.loading).toBe(false);
      expect(nextState.orders).toEqual(actions.fulfilled.payload.orders);
    });
  });
});
