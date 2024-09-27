import { createSlice, current } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../api/axiosInstance";

// 비동기 서버 통신 함수
export const getSchedules = createAsyncThunk(
  "schedules/getSchedules",
  async function getMySchedules(scheduleId) {
    const res = await authInstance.get("/schedules/" + scheduleId);
    return res.data.result.dayEvents;
  }
);

// {
//   id: 45,
//   day: 1,
//   date: "2024-09-19",
//   events: [],
// },
// {
//   id: 46,
//   day: 2,
//   date: "2024-09-20",
//   events: [
//     {
//       id: 2,
//       title: "제목입니다.",
//       description: "내용입니다.",
//       startTime: "09:00",
//       endTime: "10:00",
//     },
//   ],
// },

const initialState = {
  schedules: [
    // 사실상 dayEvents
  ],
  currentSchedule: undefined, // 이게 전체 schedule 데이터
  eventDetailOpen: false,
  makeModalOpen: false,
  currentEvent: null,
  getSchedulesStatus: "", // getSchedules API 호출 상태
  socketClient: null,
  firstSchedulePageVisit: false,
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
      const { day, updatedEvent, originDay } = action.payload;
      console.log(day, updateDayEvent, originDay);

      // 원래 이벤트가 속한 날짜에서 제거 (날짜가 변경된 경우만)
      state.schedules.forEach((scheduleDay) => {
        if (scheduleDay.day === originDay) {
          // 원래 날짜에서 이벤트 제거
          const eventIndex = scheduleDay.events.findIndex(
            (event) => event.id === updatedEvent.id
          );

          if (eventIndex > -1) {
            scheduleDay.events.splice(eventIndex, 1);
          }
        }
      });

      // 업데이트된 이벤트를 새로운 날짜에 추가
      const newDayIndex = state.schedules.findIndex((d) => d.day === day);
      if (newDayIndex > -1) {
        // 이벤트가 있는 경우 기존 이벤트를 업데이트
        const existingEventIndex = state.schedules[
          newDayIndex
        ].events.findIndex((event) => event.id === updatedEvent.id);

        if (existingEventIndex > -1) {
          // 기존 이벤트가 있으면 업데이트
          state.schedules[newDayIndex].events[existingEventIndex] =
            updatedEvent;
        } else {
          // 중복 제거를 위해 추가 전 검사
          const isAlreadyPresent = state.schedules[newDayIndex].events.some(
            (event) => event.id === updatedEvent.id
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

    modifyDayEvent: (state, action) => {},
    deleteDayEvent: (state, action) => {
      const { event } = action.payload;
      state.schedules.map((dayEvent) => {
        dayEvent.events = dayEvent.events.filter((e) => e.id !== event.id);
        return dayEvent;
      });
    },
    setCurrentSchedule: (state, action) => {
      state.currentSchedule = action.payload;
    },
    setEventDetailOpen: (state, action) => {
      state.eventDetailOpen = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setMakeModalOpen: (state, action) => {
      state.makeModalOpen = action.payload;
    },
    setSocketClient: (state, action) => {
      state.socketClient = action.payload;
    },
    setFirstSchedulePageVisit: (state, action) => {
      state.firstSchedulePageVisit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSchedules.pending, (state) => {
      state.getSchedulesStatus = "pending";
    });
    builder.addCase(getSchedules.fulfilled, (state, action) => {
      console.log(action.payload);
      state.schedules = action.payload;
      state.getSchedulesStatus = "fulfilled";
    });
    builder.addCase(getSchedules.rejected, (state) => {
      // state.schedules = [];
      state.getSchedulesStatus = "rejected";
      console.error("schedule load fault");
    });
  },
});

export const {
  addDayEvent,
  updateDayEvent,
  modifyDayEvent,
  deleteDayEvent,
  setCurrentSchedule,
  setEventDetailOpen,
  setCurrentEvent,
  setSchedules,
  setMakeModalOpen,
  setSocketClient,
  setFirstSchedulePageVisit,
} = schedulesSlice.actions;
export default schedulesSlice.reducer;
