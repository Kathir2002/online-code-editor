import { configureStore } from "@reduxjs/toolkit";
import compilerSlice from "./slices/compilerSlice";
import appSlice from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    compilerSlice: compilerSlice,
    appSlice: appSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
