import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./reAuth";
import { AUTH_API } from "utils/constants";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.TOKEN,
        method: "POST",
        body: credentials
      })
    }),
    loginPhoneNumber: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.PHONE_SEND,
        method: "POST",
        body: credentials
      })
    }),
    getPhoneToken: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.TOKEN_PHONE,
        method: "POST",
        body: credentials
      })
    }),
    verifyPhoneNumber: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.PHONE_VERIFY,
        method: "POST",
        body: credentials
      })
    }),
    updateUserData: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.ME,
        method: "PATCH",
        body: credentials
      })
    }),
    loginGoogle: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.TOKEN_GOOGLE,
        method: "POST",
        body: credentials
      })
    }),
    fetchUser: builder.mutation({
      query: () => ({ url: AUTH_API.ME, method: "GET" })
    }),
    airtableSignup: builder.mutation({
      query: (body) => ({
        url: AUTH_API.AIRTABLE_SIGNUP,
        method: "POST",
        body
      })
    }),
    airtableUpdate: builder.mutation({
      query: (body) => ({
        url: AUTH_API.AIRTABLE_SIGNUP,
        method: "PATCH",
        body
      })
    }),
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.SIGNUP,
        method: "POST",
        body: credentials
      })
    }),
    registerGoogle: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.SIGNUP_GOOGLE,
        method: "POST",
        body: credentials
      })
    }),
    registerRestaurant: builder.mutation({
      query: (credentials) => ({
        url: AUTH_API.RESTAURANT,
        method: "POST",
        body: credentials
      })
    }),
    getCountries: builder.query({
      query: () => ({ url: AUTH_API.COUNTRIES, method: "GET" })
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: AUTH_API.PASSWORD_RESET,
        method: "POST",
        body
      })
    }),
    // todo ManageUser************START****>>>>>>>>>>>>>>>>>
    getManageUser: builder.mutation({
      query: () => ({ url: AUTH_API.RESTAURANT_USERS, method: "GET" })
    }),
    putAddManageUser: builder.mutation({
      query: (body) => ({
        url: AUTH_API.RESTAURANT_USERS,
        method: "PUT",
        body
      })
    }),
    putEditManageUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `${AUTH_API.RESTAURANT_USERS}${id}/`,
        method: "PUT",
        body
      })
    }),
    deleteManageUser: builder.mutation({
      query: (id) => ({
        url: `${AUTH_API.RESTAURANT_USERS}${id}/`,
        method: "DELETE"
      })
    }),
    postResetManageUser: builder.mutation({
      query: (id) => ({
        url: `${AUTH_API.RESTAURANT_USERS}${id}/reset_password/`,
        method: "POST"
      })
    }),
    resetConfirmPassword: builder.mutation({
      query: (body) => ({
        url: `${AUTH_API.PASSWORD_RESET_CONFIRM}${body.uid}/${body.token}/`,
        method: "POST",
        body
      })
    })
    // todo ManageUser***********END*****>>>>>>>>>>>>>>>>>
  })
});

export const {
  useLoginMutation,
  useLoginPhoneNumberMutation,
  useGetPhoneTokenMutation,
  useVerifyPhoneNumberMutation,
  useUpdateUserDataMutation,
  useLoginGoogleMutation,
  useGetCountriesQuery,
  useAirtableSignupMutation,
  useAirtableUpdateMutation,
  useRegisterUserMutation,
  useRegisterGoogleMutation,
  useRegisterRestaurantMutation,
  useFetchUserMutation,
  useResetPasswordMutation,
  useGetManageUserMutation,
  usePutAddManageUserMutation,
  usePutEditManageUserMutation,
  useDeleteManageUserMutation,
  usePostResetManageUserMutation,
  useResetConfirmPasswordMutation
} = authApi;
