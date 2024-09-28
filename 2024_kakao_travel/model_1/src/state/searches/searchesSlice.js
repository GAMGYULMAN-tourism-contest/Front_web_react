import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

const initialState = {
  searches: [],
  totalPages: 0,
  currentPage: 1,
  isLast: false,
  getSearchItemsStatus: "", // getSearchItems API 호출 상태
};

// api 비동기 서버 통신 함수 만들고 extrareducer로 정의
export const getSearchItems = createAsyncThunk(
  "searches/getSearchItems",
  // extraReducer에서 전역상태 사용 시 createAsyncThunk의 두번째 인자로 { getState, rejectWithValue } 받기
  async ({ keyword, page, size }, { getState, rejectWithValue }) => {
    // 상태에서 totalPage를 가져오기 (예를 들어 totalPage 상태가 있다고 가정)
    const state = getState();
    const totalPages = state.searches.totalPages; // slice의 상태에서 totalPage 가져오기
    console.log(page, totalPages);
    // 페이지가 totalPages보다 클 경우 요청 중단
    if (totalPages != 0 && page > totalPages) {
      return rejectWithValue("last page");
    }
    let url = "/travels";
    url += "?page=" + page + "&size=" + size;
    if (keyword !== undefined) {
      url += "&keyword=" + keyword;
    }
    try {
      const apiResult = await authInstance.get(url);
      return apiResult.data.result; // item, numOfRows, pageNo, totalcount 있음
    } catch (error) {
      // API 호출에서 오류가 발생하면 rejectWithValue로 처리
      return rejectWithValue(error.response.data);
    }
  }
);

const searchesSlice = createSlice({
  name: "searches", // 이 슬라이스를 구분하는 이름
  initialState, // initialState : initialState 처럼 똑같이 적는 경우 이렇게 쓸 수 있음
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setClearSearches: (state, action) => {
      state.searches = [];
      state.totalPages = 0;
      state.currentPage = 1;
      state.getSearchItemsStatus = ""; // ���기화
    },
  },
  extraReducers: (builder) => {
    // 프로미스 로딩 (pending) 시점
    builder.addCase(getSearchItems.pending, (state) => {
      state.getSearchItemsStatus = "pending";
    });

    // 프로미스 성공 (fulfilled) 시점
    builder.addCase(getSearchItems.fulfilled, (state, action) => {
      // console.log(action.payload);
      // state.searches = action.payload.item;

      // 기존 검색 결과에 새로운 페이지의 아이템을 추가합니다.
      // action.meta.arg.isLoadMore가 true이면 무한 스크롤로 인한 추가 로딩
      if (action.meta.arg.isLoadMore) {
        state.searches = state.searches.concat(action.payload.item);
      } else {
        // 새로운 데이터를 불러올 때 (기존 데이터를 초기화)
        state.currentPage = 1;
        state.searches = action.payload.item;
      }
      // state.searches = [
      //   ...state.searches, // 기존 결과
      //   ...action.payload.item.filter(
      //     // 필터링해서 없는거만 추가
      //     (newItem) => !state.searches.includes(newItem)
      //   ),
      // ];
      state.getSearchItemsStatus = "fulfilled";
      if (!state.searches.isLast) {
        state.totalPages = Math.ceil(
          action.payload.totalCount / action.payload.numOfRows
        ); // totalCount / numOfRows = totalPages => 153 / 10 = 15.3 => 실링으로 16
      }
    });

    // 프로미스 실패 (rejected) 시점
    builder.addCase(getSearchItems.rejected, (state, action) => {
      state.searches = [];
      if (action.payload === "last page") {
        state.isLast = true; // 마지막 페이지에 도달한 경우 isLast를 true로 설정
      } else {
        state.error = action.payload; // 다른 에러가 발생한 경우 에러 메시지 저장
      }

      state.getSearchItemsStatus = "rejected";
      console.error("schedule load fault");
    });
  },
});

export const { setCurrentPage, setClearSearches } = searchesSlice.actions;
export default searchesSlice.reducer; // 리듀서를 통째로 반환해야 emutable한 기능 사용가능
