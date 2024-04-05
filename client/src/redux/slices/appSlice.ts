import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface appSliceState {
  currentUser: {
    username?: string;
    picture?: string;
    email: string;
    savedCode: string[];
  };
  isLoggedin: boolean;
}

const initialState: appSliceState = {
  currentUser: {
    username: "",
    email: "",
    savedCode: [],
    picture: "",
  },
  isLoggedin: false,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    updateCurrentUser: (
      state,
      action: PayloadAction<appSliceState["currentUser"]>
    ) => {
      state.currentUser = action.payload;
    },
    updateIsLoggedin: (state, action: PayloadAction<boolean>) => {
      state.isLoggedin = action.payload;
    },
  },
});

export default appSlice.reducer;

export const { updateCurrentUser, updateIsLoggedin } = appSlice.actions;
