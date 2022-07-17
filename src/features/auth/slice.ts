import { createSlice } from "@reduxjs/toolkit";
import { LocalStorage, SessionStorage } from "utils";

export type AuthPayloadType = {
  email: string;
  name: string;
}

export type InitialState = {
  isAuthenticated: boolean;
  user: AuthPayloadType | null;
  token: string;
}

const initialState: InitialState = {
  isAuthenticated: false,
  user: SessionStorage.get<{ name: string, email: string }>("user") || null,
  token: SessionStorage.get<string>("token") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state: InitialState, { payload }: { payload: AuthPayloadType }) => ({
      ...state,
      isAuthenticated: true,
      user: payload,
    }),

    setToken: (state: InitialState, { payload }: { payload: string }) => ({
      ...state,
      token: payload,
    }),

    logout: (state: InitialState) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = "";

      SessionStorage.clear();
      LocalStorage.clear();
    },
  },
});

export const {
  setAuth,
  setToken,
  logout,
} = authSlice.actions;

export default authSlice;
