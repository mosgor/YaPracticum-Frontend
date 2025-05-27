import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('тестирование редьюсера ingredientSlice', () => {
  describe('тестирование асинхронного GET экшена getIngredients', () => {
    const actions = {
      pending: {
        type: getIngredients.pending.type,
        payload: null
      },
      rejected: {
        type: getIngredients.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: getIngredients.fulfilled.type,
        payload: ['ingr1', 'ingr2']
      }
    };

    test('тест синхронного экшена getIngredients.pending', () => {
      const state = ingredientSlice(initialState, actions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена getIngredients.rejected', () => {
      const state = ingredientSlice(initialState, actions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('тест синхронного экшена getIngredients.fulfilled', () => {
      const nextState = ingredientSlice(initialState, actions.fulfilled);
      expect(nextState.loading).toBe(false);
      expect(nextState.ingredients).toEqual(actions.fulfilled.payload);
    });
  });
});
