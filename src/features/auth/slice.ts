import { createSlice } from "@reduxjs/toolkit";
import { SessionStorage } from "utils";

export type InitialState = {
  isAuthenticated: boolean;
  user: {
    uid: string;
  } | null;
  token: string | null;
}

export type AuthPayloadType = {
  uid: string;
  email: string;
  name: string;
}

const initialState: InitialState = {
  isAuthenticated: false,
  user: SessionStorage.get<{ uid: string }>("user") || null,
  token: SessionStorage.get<string>("token") || null,
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
      state.token = null;

      SessionStorage.remove("token");
      SessionStorage.remove("user");
    },
  },
});

export const {
  setAuth,
  setToken,
  logout,
} = authSlice.actions;

export default authSlice;
