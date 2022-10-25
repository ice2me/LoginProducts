import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseUrl } from "utils/makeUrl";
import { logout, setToken } from "../slices/userSlice";
import { RE_AUTH } from "utils/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  headers: {
    "content-type": "application/json"
  },
  prepareHeaders: (headers, { getState }) => {
    const { token, restaurant } = getState().userStore;
    if (token?.access) {
      headers.set("Authorization", `Bearer ${token.access}`);
    }

    if (restaurant) {
      headers.set("Restaurant", restaurant);
    }
    return headers;
  }
});
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const isError = result.error && result.error.status === 401;
  /* REFRESH TOKEN ON CLIENT */
  // const isExpired = Date.now() > api.getState().userStore.expiresAt;
  if (isError && args.url !== "token/") {
    // try to get a new token
    const refresh = api.getState().userStore.token.refresh;
    const refreshResult = await baseQuery(
      { url: RE_AUTH.TOKEN_REFRESH, method: "POST", body: { refresh } },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      // store the new token
      api.dispatch(setToken(refreshResult.data.data));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};
