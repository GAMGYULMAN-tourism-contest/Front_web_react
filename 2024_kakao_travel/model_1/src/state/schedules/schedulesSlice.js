import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

// api 비동기 서버 통신 함수 만들고 extrareducer로 정의
export const getSchedules = createAsyncThunk(
  "products/getSchedules"
  // TODO: async api get method
);

const initialState = {
  schedules: [
    [
      {
        day: "1",
        events: [
          {
            scheduleId: "1",
            startTime: "6:00",
            endTime: "9:15",
            title: "Morning Exercise",
          },
          {
            scheduleId: "2",
            startTime: "10:00",
            endTime: "11:00",
            title: "Team Meeting",
          },
        ],
      },
      {
        day: "2",
        events: [
          {
            scheduleId: "3",
            startTime: "8:00",
            endTime: "9:00",
            title: "Breakfast",
          },
          {
            scheduleId: "4",
            startTime: "12:00",
            endTime: "13:00",
            title: "Lunch",
          },
        ],
      },
    ],
  ],
  currentSchedule: null,
  getSchedulesStatus: "", // getSchedules API 호출 상태
};

const schedulesSlice = createSlice({
  name: "schedules", // 이 슬라이스를 구분하는 이름
  initialState, // initialState : initialState 처럼 똑같이 적는 경우 이렇게 쓸 수 있음
  reducers: {
    addDayEvent: (state, action) => {
      console.log(action.payload); // day, start/endtime
      // if -> 겹치는 시간 있으면 불가능하다고 alert , 아니면 추가 진행
    },
  },
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

export const { addDayEvent } = schedulesSlice.actions;
export default schedulesSlice.reducer; // 리듀서를 통째로 반환해야 emutable한 기능 사용가능
