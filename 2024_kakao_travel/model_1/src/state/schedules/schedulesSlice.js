import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 비동기 서버 통신 함수
export const getSchedules = createAsyncThunk(
  "schedules/getSchedules"
  // TODO: async api get method
);

const initialState = {
  schedules: [
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
  currentSchedule: null,
  getSchedulesStatus: "", // getSchedules API 호출 상태
};

const schedulesSlice = createSlice({
  name: "schedules", // state.schedules (key)
  initialState,
  reducers: {
    addDayEvent: (state, action) => {
      const { day, newEvent } = action.payload;

      const dayIndex = state.schedules.findIndex((d) => d.day === day);
      if (dayIndex > -1) {
        // Check for overlapping times
        const hasOverlap = state.schedules[dayIndex].events.some((event) => {
          return (
            (newEvent.startTime >= event.startTime &&
              newEvent.startTime < event.endTime) ||
            (newEvent.endTime > event.startTime &&
              newEvent.endTime <= event.endTime)
          );
        });

        if (!hasOverlap) {
          state.schedules[dayIndex].events.push(newEvent);
        } else {
          alert("Event times overlap with an existing event.");
        }
      }
    },
    updateDayEvent: (state, action) => {
      const { day, updatedEvent } = action.payload;

      // 현재 이벤트가 속한 날짜를 찾아 제거, 만약 날짜가 변경된 경우만 제거
      state.schedules.forEach((scheduleDay) => {
        if (String(scheduleDay.day) !== String(day)) {
          // 현재 날짜와 다른 날짜에서 제거
          const eventIndex = scheduleDay.events.findIndex(
            (event) => event.scheduleId === updatedEvent.scheduleId
          );

          // 이벤트가 있는 경우 제거
          if (eventIndex > -1) {
            scheduleDay.events.splice(eventIndex, 1);
          }
        }
      });

      // 업데이트된 이벤트를 새로운 날짜에 추가
      const newDayIndex = state.schedules.findIndex(
        (d) => String(d.day) === String(day)
      );
      if (newDayIndex > -1) {
        // 이벤트가 있는 경우 기존 이벤트를 업데이트
        const existingEventIndex = state.schedules[
          newDayIndex
        ].events.findIndex(
          (event) => event.scheduleId === updatedEvent.scheduleId
        );

        if (existingEventIndex > -1) {
          // 기존 이벤트가 있으면 업데이트
          state.schedules[newDayIndex].events[existingEventIndex] =
            updatedEvent;
        } else {
          // 중복 제거를 위해 추가 전 검사
          const isAlreadyPresent = state.schedules[newDayIndex].events.some(
            (event) => event.scheduleId === updatedEvent.scheduleId
          );

          if (!isAlreadyPresent) {
            // 이벤트가 없으면 새로 추가
            state.schedules[newDayIndex].events.push(updatedEvent);
          }
        }
      } else {
        // 해당 날짜가 없을 경우 새로 추가 (예외 처리)
        state.schedules.push({ day, events: [updatedEvent] });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSchedules.pending, (state) => {
      state.getSchedulesStatus = "pending";
    });
    builder.addCase(getSchedules.fulfilled, (state, action) => {
      console.log(action.payload);
      state.getSchedulesStatus = "fulfilled";
    });
    builder.addCase(getSchedules.rejected, (state) => {
      // state.schedules = [];
      state.getSchedulesStatus = "rejected";
      console.error("schedule load fault");
    });
  },
});

export const { addDayEvent, updateDayEvent } = schedulesSlice.actions;
export default schedulesSlice.reducer;
