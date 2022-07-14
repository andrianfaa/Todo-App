import {
  BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "app";
import { logout } from "features/auth";

const apiUrl = process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: async (headers, { getState }) => {
    headers.set("accept", "application/json");
    headers.set("x-api-key", process.env.REACT_APP_API_KEY as string);

    const { token } = (getState() as RootState).auth;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithLogout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    logout();
  }

  return result;
};

export default baseQueryWithLogout;
