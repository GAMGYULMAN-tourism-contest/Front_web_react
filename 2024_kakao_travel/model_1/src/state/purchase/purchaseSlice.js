import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

const initialState = {
  selectedProduct: {},
  getProductDetailsStatus: "", // getProductDetails API 호출 상태
  selectedOptions: [], // 현재 선택한 상품 옵션 배열, 선택된 옵션과 그 때의 수량, 가격만 저장
  totalPrice: 0,
  purchaseFormData: {
    name: "",
    phoneNumber: "",
    pickupOption: "ONLINE",
    address: "",
    detailAddress: "",
    isAgree: false,
  },
  purchaseLastInfo: {},
};

export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  async ({ productId, userType }) => {
    console.log(productId, userType);
    // const response = await getProductDetailsTest(`/api/products/${productId}`);
    const viewType = "DETAIL";
    let response;
    if (userType == "seller") {
      response = await authInstance.get(
        `/seller/myPage/${productId}?viewType=${viewType}`
      );
    } else {
      response = await authInstance.get(
        `/buyer/product/${productId}?viewType=${viewType}`
      );
    }

    // const response = await authInstance.get(
    //   `/api/products/${productId}?viewType=${viewType}`
    // );
    console.log(response.data);
    return response.data.result; // extraReducer의 action.payload
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    createSelectedOptionSet: (state, action) => {
      state.selectedOptions = [
        ...state.selectedOptions,
        {
          optionId: action.payload.optionId,
          valueIds: action.payload.valueIds,
          values: action.payload.values,
          amount: 1,
          price: action.payload.price,
        },
      ];
    },

    increaseSelectedOptionSet: (state, action) => {
      const targetOption = state.selectedOptions.find(
        (option) => option.optionId === action.payload.optionId
      );
      if (targetOption) {
        targetOption.amount++;
      }
    },

    decreaseSelectedOptionSet: (state, action) => {
      const targetOption = state.selectedOptions.find(
        (option) => option.optionId === action.payload.optionId
      );
      if (targetOption && targetOption.amount > 1) {
        targetOption.amount--;
      } else if (targetOption && targetOption.amount == 1) {
        state.selectedOptions = state.selectedOptions.filter(
          (option) => option.optionId !== action.payload.optionId
        );
      }
    },

    removeSelectedOptionSet: (state, action) => {
      // state.selectedOptions.forEach((option) => {
      //   console.log("Option as JSON:", JSON.stringify(option));
      // });
      // console.log("Removing option with name:", action.payload);

      state.selectedOptions = state.selectedOptions.filter(
        (option) => option.optionId != action.payload
      );
    },

    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },

    setPurchaseFormData: (state, action) => {
      state.purchaseFormData = { ...state.purchaseFormData, ...action.payload }; // 객체 병합, 동일 내용은 (뒤로) 덮어쓰기
    },

    setPurchaseLastInfo: (state, action) => {
      state.purchaseLastInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductDetails.pending, (state, action) => {
      state.selectedProduct = {};
      state.selectedOptions = [];
      state.getProductDetailsStatus = "pending";
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.selectedProduct = action.payload;
      state.getProductDetailsStatus = "fulfilled";
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      console.error("상품 상세정보를 불러오는 데 실패하였습니다");
    });
  },
});

export const {
  setSelectedProduct,
  createSelectedOptionSet,
  increaseSelectedOptionSet,
  decreaseSelectedOptionSet,
  removeSelectedOptionSet,
  setTotalPrice,
  setPurchaseFormData,
  setPurchaseLastInfo,
} = purchaseSlice.actions;
export default purchaseSlice.reducer;
