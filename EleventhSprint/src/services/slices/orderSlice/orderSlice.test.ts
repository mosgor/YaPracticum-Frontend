import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('тестирование редьюсера orderSlice', () => {
  describe('тестирование асинхронного POST экшена getOrderByNumber', () => {
    const actions = {
      pending: {
        type: getOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: ['someOrder'] }
      }
    };

    test('тест синхронного экшена getOrderByNumber.pending', () => {
      const nextState = orderSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена getOrderByNumber.rejected', () => {
      const nextState = orderSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена getOrderByNumber.fulfilled', () => {
      const nextState = orderSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.orderByNumberResponse).toBe(
        actions.fulfilled.payload.orders[0]
      );
    });
  });
});
