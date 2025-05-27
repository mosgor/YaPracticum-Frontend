import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('тестирование редьюсера userSlice', () => {
  describe('тестирование асинхронного GET экшена getUser', () => {
    const actions = {
      pending: {
        type: getUser.pending.type,
        payload: null
      },
      rejected: {
        type: getUser.rejected.type,
        payload: null
      },
      fulfilled: {
        type: getUser.fulfilled.type,
        payload: { user: { name: 'someName', email: 'someEmail' } }
      }
    };

    test('тест синхронного экшена getUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена getUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.payload);
    });

    test('тест синхронного экшена getUser.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.userData).toEqual(actions.fulfilled.payload.user);
    });
  });
  describe('тестирование асинхронного GET экшена getOrdersAll', () => {
    const actions = {
      pending: {
        type: getOrdersAll.pending.type,
        payload: null
      },
      rejected: {
        type: getOrdersAll.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: getOrdersAll.fulfilled.type,
        payload: ['order1', 'order2']
      }
    };

    test('тест синхронного экшена getOrdersAll.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена getOrdersAll.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('тест синхронного экшена getOrdersAll.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.userOrders).toEqual(actions.fulfilled.payload);
    });
  });

  describe('тестирование асинхронного POST экшена registerUser', () => {
    const actions = {
      pending: {
        type: registerUser.pending.type,
        payload: null
      },
      rejected: {
        type: registerUser.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: registerUser.fulfilled.type,
        payload: { user: { name: 'someName', email: 'someEmail' } }
      }
    };

    test('тест синхронного экшена registerUser.pending', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена registerUser.rejected', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена registerUser.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.userData).toBe(actions.fulfilled.payload.user);
    });
  });
  describe('тестирование асинхронного POST экшена loginUser', () => {
    const actions = {
      pending: {
        type: loginUser.pending.type,
        payload: null
      },
      rejected: {
        type: loginUser.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: loginUser.fulfilled.type,
        payload: { user: { name: 'someName', email: 'someEmail' } }
      }
    };

    test('тест синхронного экшена loginUser.pending', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.loginUserRequest).toBe(true);
      expect(nextState.isAuthChecked).toBe(true);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена loginUser.rejected', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена loginUser.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.userData).toBe(actions.fulfilled.payload.user);
    });
  });
  describe('тестирование асинхронного PATCH экшена updateUser', () => {
    const actions = {
      pending: {
        type: updateUser.pending.type,
        payload: null
      },
      rejected: {
        type: updateUser.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: updateUser.fulfilled.type,
        payload: { user: { name: 'someName', email: 'someEmail' } }
      }
    };

    test('тест синхронного экшена updateUser.pending', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена updateUser.rejected', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена updateUser.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.response).toBe(actions.fulfilled.payload.user);
    });
  });
  describe('тестирование асинхронного POST экшена logoutUser', () => {
    const actions = {
      pending: {
        type: logoutUser.pending.type,
        payload: null
      },
      rejected: {
        type: logoutUser.rejected.type,
        error: { message: 'Funny mock-error' }
      },
      fulfilled: {
        type: logoutUser.fulfilled.type,
        payload: null
      }
    };

    test('тест синхронного экшена logoutUser.pending', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.isAuthChecked).toBe(true);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена logoutUser.rejected', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена logoutUser.fulfilled', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.userData).toBe(actions.fulfilled.payload);
    });
  });
});
