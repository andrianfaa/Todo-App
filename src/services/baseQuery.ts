import {
  BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "app";
import { logout } from "features/auth";
import { ReactNotyf } from "utils";

const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1`;

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
  const { data } = result as { data: HttpResponse<any> };

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    return result;
  }

  if (result.error?.status === "FETCH_ERROR") {
    ReactNotyf.error("Fetch error: Please check your internet connection.");
    return result;
  }

  return result;
};

export default baseQueryWithLogout;
