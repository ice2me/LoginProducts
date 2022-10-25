import {createSlice} from "@reduxjs/toolkit";
import {authApi} from "../services/authApi";

const initialState = {
    user: {
        email: "",
        name: "",
        created_at: "",
        email_verified_at: "",
        updated_at: "",
    },
    profileInfo: {
        email: "",
        name: "",
        id: "",
        profile_image: ""
    },
    token: "",
    products: []
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: () => initialState,
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setProduct: (state, action) => {
            state.products = action.payload;
        },
        setProfileInfo: (state, action) => {
            state.profileInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.token = action.payload.data;
                state.isLogin = true;
            })

    }
});

const {actions, reducer} = userSlice;
export const {
    logout,
    setToken,
    setUser,
    setProduct,
    setProfileInfo
} = actions;
export default reducer;
