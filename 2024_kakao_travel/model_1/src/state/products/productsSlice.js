import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

// api 비동기 서버 통신 함수 만들고 extrareducer로 정의
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ cursor, sort, keyword, category, minPrice, maxPrice }) => {
    console.log(cursor, sort, keyword, category, minPrice, maxPrice);
    const pageSize = 12;
    let url = `/buyer/product/list?`;

    // 조건부로 URL 파라미터 추가
    if (sort == null) {
      url += `&sort=FAVORITE`;
    }
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    if (category) {
      category.map((id) => {
        url += `&categoryIds=${id}`;
      });
      console.log(url);
    }
    if (minPrice) {
      url += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
      url += `&maxPrice=${maxPrice}`;
    }
    url += `&pageSize=${pageSize}`;
    console.log(url);

    const response = await authInstance.get(url);
    // const response = await authInstance.get(
    //   `/api/products/list?pageSize=${pageSize}`
    // );
    console.log(response.data);
    return response.data.result; // 응답의 데이터를 반환 -> extraReducer의 action.payload
  }
);

const calculateTotalProductsCount = (items) => {
  return items.reduce((acc) => acc + 1, 0);
};

const initialState = {
  products: [], // product 객체의 배열
  nextCursor: null,
  isLast: false,
  // selectedCategories: [], // condition box에서, [id, id, id, ...]
  // searchKeyword: null, // condition box에서, "keyword"
  // minPrice: null, // condition box에서, "minPrice"
  // maxPrice: null, // condition box에서, "maxPrice"
  filteredProducts: [], // product 검색 결과 배열 // 안씀
  isFiltered: false, // 한 번이라도 검색되면 true // 안씀
  totalCount: 0, // 안 씀
  getProductsStatus: "", // getProducts API 호출 상태
};

const productsSlice = createSlice({
  name: "products", // 이 슬라이스를 구분하는 이름
  initialState, // initialState : initialState 처럼 똑같이 적는 경우 이렇게 쓸 수 있음
  reducers: {
    getTotalProductsCount: (state) => {
      // reduce : 배열을 순회하며 acc를 증감시켜서 반환하는 메소드
      const total = calculateTotalProductsCount(state.products);
      state.totalCount = total;
    },

    sortProducts: (state, action) => {
      state.products = state.products.sort((a, b) => {
        switch (action.payload) {
          case "price":
            return a.price - b.price; // 가격 낮은 순
          case "favoriteCount":
            return b.favoriteCount - a.favoriteCount; // 추천수 높은 순
          case "deadline":
            return new Date(b.deadline) - new Date(a.deadline); // 데드라인이 많이 남은 순
          default:
            return 0; // 기본적으로 정렬하지 않음
        }
      });
    },

    searchKeywordProducts: (state, action) => {
      const filteredProducts = state.products.filter((product) =>
        product.productName.toLowerCase().includes(action.payload.toLowerCase())
      );
      state.filteredProducts = filteredProducts;
      state.isFiltered = true;
    },
  },
  extraReducers: (builder) => {
    // 프로미스 로딩 (pending) 시점
    builder.addCase(getProducts.pending, (state) => {
      state.getProductsStatus = "pending";
    });

    // 프로미스 성공 (fulfilled) 시점
    builder.addCase(getProducts.fulfilled, (state, action) => {
      console.log(action.payload);
      // action.payload.productsList.map((item) => {
      //   console.log(item);
      //   state.products.push(item);
      // });
      // state.products = action.payload.productsList;

      // action.meta.arg.isLoadMore가 true이면 무한 스크롤로 인한 추가 로딩
      if (action.meta.arg.isLoadMore) {
        state.products = state.products.concat(action.payload.productsList);
      } else {
        // 새로운 데이터를 불러올 때 (기존 데이터를 초기화)
        state.products = action.payload.productsList;
      }
      state.nextCursor = action.payload.nextCursor;
      state.isLast = action.payload.isLast;

      state.getProductsStatus = "fulfilled";
    });

    // 프로미스 실패 (rejected) 시점
    builder.addCase(getProducts.rejected, (state) => {
      state.products = [];

      state.getProductsStatus = "rejected";
      console.error("상품들을 불러오는 데 실패하였습니다");
    });
  },
});

export const { getTotalProductsCount, sortProducts, searchKeywordProducts } =
  productsSlice.actions;
export default productsSlice.reducer; // 리듀서를 통째로 반환해야 emutable한 기능 사용가능
