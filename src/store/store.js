import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { dmApi } from "./dmApi";
import { thunk } from "redux-thunk";
import globalSlice from "./globalSlice";
import { sliceNames } from "@/helpers/constants";

const rootReducer = combineReducers({
  [sliceNames.GLOBAL]: globalSlice,
  [dmApi.reducerPath]: dmApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dmApi.middleware),
});

export default store;
