import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export type LoginResponse = {
  token: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type SignUpRequest = LoginRequest & {
  name: string;
  projectUrl: string;
}

export const sessionService = createApi({
  reducerPath: "session",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<HttpResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation<HttpResponse<null>, SignUpRequest>({
      query: (body) => ({
        url: "/user/signup",
        method: "POST",
        body,
      }),
    }),

    // Verify email
    verify: builder.query<HttpResponse<null>, { token: string, email: string }>({
      query: ({ token, email }) => ({
        url: `/user/verify-email?t=${token}&e=${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyQuery,
} = sessionService;