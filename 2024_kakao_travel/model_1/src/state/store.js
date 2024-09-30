import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session"; // 세션 스토리지 사용
import schedulesReducer from "./schedules/schedulesSlice";
import searchesReducer from "./searches/searchesSlice";
import socketSlice from "./socket/socketSlice";
import { combineReducers } from "redux";

// persist 설정
const persistConfig = {
  key: "root",
  storage: sessionStorage,
  blacklist: ["searches", "socket"], // searches 리듀서를 영속성 저장에서 제외
};

const rootReducer = combineReducers({
  schedules: schedulesReducer,
  searches: searchesReducer,
  socketSlice: socketSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
