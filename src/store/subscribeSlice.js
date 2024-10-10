import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addSub, removeSub, countSub, getSub } from "../api/subscribe";

export const subscribe = createAsyncThunk(
  "subscribe/subscribe",
  async (data) => {
    const response = await addSub(data);
    return response.data;
  }
);

export const unsubscribe = createAsyncThunk(
  "subscribe/unsubscribe",
  async (subCode) => {
    const response = await removeSub(subCode);
    return response.data;
  }
);

export const subCount = createAsyncThunk(
  "subscribe/subCount",
  async (channelCode) => {
    const response = await countSub(channelCode);
    return response.data;
  }
);

export const fetchSub = createAsyncThunk(
  "subscribe/fetchSub",
  async (channelCode) => {
    const response = await getSub(channelCode);
    return response.data;
  }
);

const subscribeSlice = createSlice({
  name: "subscribe",

  initialState: {
    count: 0,
    isSub: false,
    sub: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    // 비동기적인 애들을 정의하려면 createAsyncThunk와 함께 이게 추가로 필요함
    builder
      .addCase(subscribe.fulfilled, (state) => {
        // fulfilled는 성공했을 시 를 의미
        state.isSub = true;
        state.count += 1; // state.count = state.count + 1;
      })
      .addCase(unsubscribe.fulfilled, (state) => {
        state.isSub = false;
        state.count -= 1;
      })
      .addCase(subCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(fetchSub.fulfilled, (state, action) => {
        if (action.payload === "") {
          state.isSub = false;
          state.sub = null;
        } else {
          state.isSub = true;
          state.sub = action.payload;
        }
      })
      .addCase(fetchSub.rejected, (state) => {
        // 여기서 rejected는 error가 난 경우(fulfilled의 반대)
        state.isSub = false;
        state.sub = null;
      });
  },
});

export default subscribeSlice;
