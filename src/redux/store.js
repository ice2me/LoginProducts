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
import userSlice from "./slices/userSlice";
// middleware
const { configureStore } = require("@reduxjs/toolkit");

export const store = configureStore({
  reducer: {
    userStore: persistReducer({ key: "auth", storage }, userSlice),
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat([
      authApi.middleware,
    ]),
  ]
});
