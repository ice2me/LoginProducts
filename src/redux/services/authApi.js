import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./reAuth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({email, password}) => ({
                url: `/auth/login?email=${email}&password=${password}`,
                method: "POST"
            })
        }),
        userInfo: builder.mutation({
            query: () => ({
                url: `/auth/user-profile`,
                method: "GET"
            })
        }),
        productList: builder.mutation({
            query: (page) => ({
                url: `/products?page=${page}`,
                method: "GET"
            })
        }),
        sortProducts: builder.mutation({
            query: (param) => ({
                url: `products?${param}`,
                method: "GET"
            })
        }),
    })
});

export const {
    useLoginMutation,
    useUserInfoMutation,
    useProductListMutation,
    useSortProductsMutation,
} = authApi;
