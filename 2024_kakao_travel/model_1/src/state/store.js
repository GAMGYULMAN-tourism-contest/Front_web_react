import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session"; // 세션 스토리지 사용
import schedulesReducer from "./schedules/schedulesSlice";
import searchesReducer from "./searches/searchesSlice";
import { combineReducers } from "redux";

// persist 설정
const persistConfig = {
  key: "root",
  storage: sessionStorage,
};

const rootReducer = combineReducers({
  schedules: schedulesReducer,
  searches: searchesReducer,
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
