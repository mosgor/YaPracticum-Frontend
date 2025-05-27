import ingredientSlice from '../services/slices/ingredientSlice/ingredientSlice';
import {
  getIngredients,
  initialState as ingrInit
} from '../services/slices/ingredientSlice/ingredientSlice';
import { describe, test, expect } from '@jest/globals';

describe('Reducer: ingredientSlice', () => {
  const actions = {
    pending: { type: getIngredients.pending.type, payload: null },
    rejected: {
      type: getIngredients.rejected.type,
      error: { message: 'fail' }
    },
    fulfilled: { type: getIngredients.fulfilled.type, payload: ['i1', 'i2'] }
  };

  test('pending → loading true', () => {
    const s = ingredientSlice(ingrInit, actions.pending);
    expect(s.loading).toBe(true);
    expect(s.error).toBeNull();
  });

  test('rejected → ставим error', () => {
    const s = ingredientSlice(ingrInit, actions.rejected);
    expect(s.loading).toBe(false);
    expect(s.error).toBe('fail');
  });

  test('fulfilled → список ингредиентов', () => {
    const s = ingredientSlice(ingrInit, actions.fulfilled);
    expect(s.loading).toBe(false);
    expect(s.ingredients).toEqual(['i1', 'i2']);
  });
});
