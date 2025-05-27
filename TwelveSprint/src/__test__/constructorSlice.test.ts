import {
  initialState as defaultCtorState,
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  orderBurger
} from '../services/slices/constructorSlice/constructorSlice';
import constructorSlice from '../services/slices/constructorSlice/constructorSlice';
import { describe, test, expect } from '@jest/globals';

describe('Reducer: constructorSlice checks', () => {
  describe('addIngredient behavior', () => {
    const baseState = {
      constructorItems: { bun: null, ingredients: [] },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('вставка соуса в список ингредиентов', () => {
      // Добавляем соус, проверяем, что в массиве появился объект с любым id
      const sauce = {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: '.../sauce-04.png',
        image_mobile: '.../sauce-04-mobile.png',
        image_large: '.../sauce-04-large.png'
      };
      const next = constructorSlice(baseState, addIngredient(sauce));
      const got = next.constructorItems.ingredients[0];
      expect(got).toEqual({ ...sauce, id: expect.any(String) });
    });

    test('подмена булки при повторном добавлении', () => {
      const initialWithBun = {
        ...baseState,
        constructorItems: {
          bun: {
            _id: '643d69a5c3f7b9001cfa0000',
            name: 'Old Bun',
            type: 'bun',
            proteins: 10,
            fat: 10,
            carbohydrates: 10,
            calories: 100,
            price: 50,
            image: '.../old-bun.png',
            image_mobile: '.../old-bun-mobile.png',
            image_large: '.../old-bun-large.png',
            id: 'oldId'
          },
          ingredients: []
        }
      };

      const newBun = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Fluor Bun R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: '.../bun-01.png',
        image_mobile: '.../bun-01-mobile.png',
        image_large: '.../bun-01-large.png'
      };

      const result = constructorSlice(initialWithBun, addIngredient(newBun));
      expect(result.constructorItems.bun).toMatchObject({
        ...newBun,
        id: expect.any(String)
      });
    });
  });

  describe('removeIngredient check', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [
          {
            id: 'toRemove',
            _id: '643d69a5c3f7b9001cfa0944',
            name: 'Galaxy Sauce',
            type: 'sauce',
            proteins: 42,
            fat: 24,
            carbohydrates: 42,
            calories: 99,
            price: 15,
            image: '.../sauce-03.png',
            image_mobile: '.../sauce-03-mobile.png',
            image_large: '.../sauce-03-large.png'
          }
        ]
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('удаление по id из ingredients', () => {
      const cleaned = constructorSlice(state, removeIngredient('toRemove'));
      expect(cleaned.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('reordering ingredients', () => {
    const mixedState = {
      constructorItems: {
        bun: null,
        ingredients: [
          {
            id: 'a',
            _id: '1',
            name: 'А',
            type: 'main',
            proteins: 0,
            fat: 0,
            carbohydrates: 0,
            calories: 0,
            price: 0,
            image: '',
            image_mobile: '',
            image_large: ''
          },
          {
            id: 'b',
            _id: '2',
            name: 'Б',
            type: 'main',
            proteins: 0,
            fat: 0,
            carbohydrates: 0,
            calories: 0,
            price: 0,
            image: '',
            image_mobile: '',
            image_large: ''
          },
          {
            id: 'c',
            _id: '3',
            name: 'В',
            type: 'main',
            proteins: 0,
            fat: 0,
            carbohydrates: 0,
            calories: 0,
            price: 0,
            image: '',
            image_mobile: '',
            image_large: ''
          }
        ]
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('двигаем элемент вверх на одну позицию', () => {
      const up = constructorSlice(mixedState, moveIngredientUp(2));
      // ожидаем, что 'c' и 'b' поменялись
      expect(up.constructorItems.ingredients.map((i) => i.id)).toEqual([
        'a',
        'c',
        'b'
      ]);
    });

    test('двигаем элемент вниз на одну позицию', () => {
      const down = constructorSlice(mixedState, moveIngredientDown(1));
      // ожидаем, что 'b' и 'c' поменялись
      expect(down.constructorItems.ingredients.map((i) => i.id)).toEqual([
        'a',
        'c',
        'b'
      ]);
    });
  });

  describe('orderBurger async flow', () => {
    const steps = {
      pending: { type: orderBurger.pending.type, payload: null },
      rejected: {
        type: orderBurger.rejected.type,
        error: { message: 'error' }
      },
      fulfilled: {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 404 } }
      }
    };

    test('pending → loading true', () => {
      const s = constructorSlice(defaultCtorState, steps.pending);
      expect(s.loading).toBe(true);
      expect(s.error).toBeNull();
    });

    test('rejected → error записан', () => {
      const s = constructorSlice(defaultCtorState, steps.rejected);
      expect(s.loading).toBe(false);
      expect(s.error).toBe('error');
    });

    test('fulfilled → получаем номер заказа', () => {
      const s = constructorSlice(defaultCtorState, steps.fulfilled);
      expect(s.loading).toBe(false);
      expect(s.orderModalData?.number).toBe(404);
    });
  });
});
