import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {apiBaseUrl} from "../../utils/makeUrl";
import {logout, setToken} from "../slices/userSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  headers: {
    "content-type": "application/json"
  },
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().userStore;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const isError = result.error && result.error.status === 401;

  if (isError && args.url !== "token/") {
    const refresh = api.getState().userStore.token.refresh;
    const refreshResult = await baseQuery(
      { url: "auth/refresh/", method: "POST", body: { refresh } },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setToken(refreshResult.data.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};
