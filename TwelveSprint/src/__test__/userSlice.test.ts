import userSlice from '../services/slices/userSlice/userSlice';
import {
  initialState as userInit,
  getUser,
  getOrdersAll,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from '../services/slices/userSlice/userSlice';
import { describe, test, expect } from '@jest/globals';

describe('Reducer: userSlice flows', () => {
  const apply = (action: any) => userSlice(userInit, action);

  describe('getUser flow', () => {
    test('pending → запрос не активен, ошибка сброшена', () => {
      const s = apply({ type: getUser.pending.type, payload: null });
      expect(s.request).toBe(false);
      expect(s.error).toBeNull();
    });

    test('rejected → устанавливаем error', () => {
      const s = apply({ type: getUser.rejected.type, payload: null });
      expect(s.request).toBe(false);
      expect(s.error).toBeNull();
    });

    test('fulfilled → сохраняем userData', () => {
      const payload = { user: { name: 'John', email: 'john@example.com' } };
      const s = apply({ type: getUser.fulfilled.type, payload });
      expect(s.request).toBe(false);
      expect(s.userData).toEqual(payload.user);
    });
  });

  describe('getOrdersAll flow', () => {
    test('pending → включаем загрузку заказов', () => {
      const s = apply({ type: getOrdersAll.pending.type, payload: null });
      expect(s.request).toBe(true);
      expect(s.error).toBeNull();
    });

    test('rejected → сохраняем ошибку', () => {
      const err = { message: 'no orders' };
      const s = apply({ type: getOrdersAll.rejected.type, error: err });
      expect(s.request).toBe(false);
      expect(s.error).toBe(err.message);
    });

    test('fulfilled → получаем список userOrders', () => {
      const list = ['orderA', 'orderB'];
      const s = apply({ type: getOrdersAll.fulfilled.type, payload: list });
      expect(s.request).toBe(false);
      expect(s.userOrders).toEqual(list);
    });
  });

  describe('registerUser flow', () => {
    test('pending → регистрация в процессе', () => {
      const s = apply({ type: registerUser.pending.type, payload: null });
      expect(s.request).toBe(true);
      expect(s.error).toBeNull();
    });

    test('rejected → регистрация упала', () => {
      const err = { message: 'reg fail' };
      const s = apply({ type: registerUser.rejected.type, error: err });
      expect(s.request).toBe(false);
      expect(s.error).toBe(err.message);
    });

    test('fulfilled → записываем userData', () => {
      const payload = { user: { name: 'Alice', email: 'alice@ex.com' } };
      const s = apply({ type: registerUser.fulfilled.type, payload });
      expect(s.request).toBe(false);
      expect(s.userData).toEqual(payload.user);
    });
  });

  describe('loginUser flow', () => {
    test('pending → начинаем логин, сбрасываем флаги', () => {
      const s = apply({ type: loginUser.pending.type, payload: null });
      expect(s.loginUserRequest).toBe(true);
      expect(s.isAuthChecked).toBe(true);
      expect(s.isAuthenticated).toBe(false);
    });

    test('rejected → логин неуспешен, сбрасываем запрос', () => {
      const err = { message: 'bad creds' };
      const s = apply({ type: loginUser.rejected.type, error: err });
      expect(s.loginUserRequest).toBe(false);
      expect(s.isAuthChecked).toBe(false);
      expect(s.isAuthenticated).toBe(false);
      expect(s.error).toBe(err.message);
    });

    test('fulfilled → логин успешен, ставим isAuthenticated', () => {
      const payload = { user: { name: 'Bob', email: 'bob@ex.com' } };
      const s = apply({ type: loginUser.fulfilled.type, payload });
      expect(s.loginUserRequest).toBe(false);
      expect(s.isAuthChecked).toBe(false);
      expect(s.isAuthenticated).toBe(true);
      expect(s.userData).toEqual(payload.user);
    });
  });

  describe('updateUser flow', () => {
    test('pending → обновление в процессе', () => {
      const s = apply({ type: updateUser.pending.type, payload: null });
      expect(s.request).toBe(true);
      expect(s.error).toBeNull();
    });

    test('rejected → обновление не удалось', () => {
      const err = { message: 'upd fail' };
      const s = apply({ type: updateUser.rejected.type, error: err });
      expect(s.request).toBe(false);
      expect(s.error).toBe(err.message);
    });

    test('fulfilled → сохраняем response', () => {
      const payload = { user: { name: 'Carol', email: 'carol@ex.com' } };
      const s = apply({ type: updateUser.fulfilled.type, payload });
      expect(s.request).toBe(false);
      expect(s.response).toEqual(payload.user);
    });
  });

  describe('logoutUser flow', () => {
    test('pending → процесс выхода, флаги авторизации', () => {
      const s = apply({ type: logoutUser.pending.type, payload: null });
      expect(s.request).toBe(true);
      expect(s.isAuthChecked).toBe(true);
      expect(s.isAuthenticated).toBe(true);
    });

    test('rejected → выход не состоялся', () => {
      const err = { message: 'logout err' };
      const s = apply({ type: logoutUser.rejected.type, error: err });
      expect(s.request).toBe(false);
      expect(s.isAuthChecked).toBe(false);
      expect(s.isAuthenticated).toBe(true);
      expect(s.error).toBe(err.message);
    });

    test('fulfilled → успешно вышли, чистим данные', () => {
      const s = apply({ type: logoutUser.fulfilled.type, payload: null });
      expect(s.request).toBe(false);
      expect(s.isAuthChecked).toBe(false);
      expect(s.isAuthenticated).toBe(false);
      expect(s.userData).toBeNull();
    });
  });
});
