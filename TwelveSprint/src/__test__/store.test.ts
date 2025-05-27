import store, { rootReducer } from '../services/store';

test('rootReducer инициализируется как в хранилище', () => {
  const unknown = rootReducer(undefined, { type: 'NOPE' });
  expect(unknown).toEqual(store.getState());
});
