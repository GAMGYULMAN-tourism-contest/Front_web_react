import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

// api 비동기 서버 통신 함수 만들고 extrareducer로 정의
export const getSearchItems = createAsyncThunk(
  "searches/getSearchItems",
  // TODO: async api get method
  async ({ keyword, page, size }) => {
    console.log(keyword, page, size);
    let url = "/travels";
    url += "?page=" + page + "&size=" + size;
    if (keyword !== undefined) {
      url += "&keyword=" + keyword;
    }
    const apiResult = await authInstance.get(url);
    return apiResult.data.result; // item, numOfRows, pageNo, totalcount 있음
  }
);

const initialState = {
  searches: [],
  getSearchItemsStatus: "", // getSearchItems API 호출 상태
};

const searchesSlice = createSlice({
  name: "searches", // 이 슬라이스를 구분하는 이름
  initialState, // initialState : initialState 처럼 똑같이 적는 경우 이렇게 쓸 수 있음
  reducers: {},
  extraReducers: (builder) => {
    // 프로미스 로딩 (pending) 시점
    builder.addCase(getSearchItems.pending, (state) => {
      state.getSearchItemsStatus = "pending";
    });

    // 프로미스 성공 (fulfilled) 시점
    builder.addCase(getSearchItems.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.searches = action.payload.item;
      state.getSearchItemsStatus = "fulfilled";
    });

    // 프로미스 실패 (rejected) 시점
    builder.addCase(getSearchItems.rejected, (state) => {
      state.searches = [];

      state.getSearchItemsStatus = "rejected";
      console.error("schedule load fault");
    });
  },
});

export const {} = searchesSlice.actions;
export default searchesSlice.reducer; // 리듀서를 통째로 반환해야 emutable한 기능 사용가능
