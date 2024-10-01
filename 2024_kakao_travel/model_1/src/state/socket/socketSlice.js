import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

const initialState = {
  participants: 0,
  members: [],
  user: {},
};

const socketSlice = createSlice({
  name: "socket", // 이 슬라이스를 구분하는 이름
  initialState, // initialState : initialState 처럼 똑같이 적는 경우 이렇게 쓸 수 있음
  reducers: {
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setClearSocketState: (state, action) => {
      state = initialState;
    },
    setUser: (state, action) => {
      console.log("user", action);
      state.user = action.payload;
    },
  },
});

export const { setParticipants, setMembers, setClearSocketState, setUser } =
  socketSlice.actions;
export default socketSlice.reducer; // 리듀서를 통째로 반환해야 emutable한 기능 사용가능
