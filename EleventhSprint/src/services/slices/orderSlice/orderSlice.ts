import { getOrderByNumberApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  orderByNumberResponse: TOrder | null;
  request: boolean;
  responseOrder: null;
  error: string | null;
};

export const initialState: TOrderState = {
  orders: [],
  orderByNumberResponse: null,
  request: false,
  responseOrder: null,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/byNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.request = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.request = false;
        state.orderByNumberResponse = action.payload.orders[0];
      });
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
