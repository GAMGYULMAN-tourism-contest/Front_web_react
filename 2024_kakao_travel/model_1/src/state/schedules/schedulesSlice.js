import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

// api 비동기 서버 통신 함수 만들고 extrareducer로 정의
export const getSchedules = createAsyncThunk(
  "products/getSchedules"
  // TODO: async api get method
);

const initialState = {
  schedules: [],
  
  getSchedulesStatus: "", // getSchedules API 호출 상태
};

const schedulesSlice = createSlice({
  name: "schedules", // 이 슬라이스를 구분하는 이름
  initialState, // initialState : initialState 처럼 똑같이 적는 경우 이렇게 쓸 수 있음
  reducers: {},
  extraReducers: (builder) => {
    // 프로미스 로딩 (pending) 시점
    builder.addCase(getSchedules.pending, (state) => {
      state.getSchedulesStatus = "pending";
    });

    // 프로미스 성공 (fulfilled) 시점
    builder.addCase(getSchedules.fulfilled, (state, action) => {
      console.log(action.payload);
      state.getSchedulesStatus = "fulfilled";
    });

    // 프로미스 실패 (rejected) 시점
    builder.addCase(getSchedules.rejected, (state) => {
      state.products = [];

      state.getSchedulesStatus = "rejected";
      console.error("schedule load fault");
    });
  },
});

// export const {} = schedulesSlice.actions;
export default schedulesSlice.reducer; // 리듀서를 통째로 반환해야 emutable한 기능 사용가능
