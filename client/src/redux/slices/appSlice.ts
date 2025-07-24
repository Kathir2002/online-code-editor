import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface appSliceState {
  currentUser: {
    username?: string;
    picture?: string;
    email?: string;
    savedCodes?: string[];
    profileUrl?: string,
    isFromGithub?: boolean,      
    repoName?: string,
    repoOwner?: string,
  };
  isLoggedIn: boolean;
}

const initialState: appSliceState = {
  currentUser: {},
  isLoggedIn: false,
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
      state.isLoggedIn = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { updateCurrentUser, updateIsLoggedin } = appSlice.actions;
