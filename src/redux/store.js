import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./services/authApi";
import { restaurantApi } from "./services/restaurantApi";
import languageSlice from "./slices/languageSlice";
import userSlice from "./slices/userSlice";
import categoriesSlice from "./slices/categoriesSlice";
import menusSlice from "./slices/menusSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import foodicsConfigSlice from "./slices/foodicsConfigSlice";
import blogSlice from "./slices/blogSlice";
import { blogApi } from "./services/blogApi";
// middleware
import { requestErrorLogger } from "utils/requestErrorLogger";
const { configureStore } = require("@reduxjs/toolkit");

export const store = configureStore({
  reducer: {
    userStore: persistReducer({ key: "auth", storage }, userSlice),
    languages: persistReducer({ key: "languages", storage }, languageSlice),
    foodicsConfig: foodicsConfigSlice,
    categories: categoriesSlice,
    menus: menusSlice,
    subscription: subscriptionSlice,
    [authApi.reducerPath]: authApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    blog: blogSlice,
    [blogApi.reducerPath]: blogApi.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat([
      authApi.middleware,
      restaurantApi.middleware,
      blogApi.middleware
    ]),
    requestErrorLogger
  ]
});
