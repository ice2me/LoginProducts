import { createSlice } from "@reduxjs/toolkit";
import { getDefaultLanguage } from "utils/language";
import { authApi } from "../services/authApi";
import { restaurantApi } from "../services/restaurantApi";
import { defaultSorting } from "../../utils/helpers/getSorting";

/* REFRESH TOKEN ON CLIENT */
// const minutesToMs = min => min * 60 * 1000;
// const notExpireUntilSet = Date.now() + minutesToMs(60*24)

const initialState = {
  user: {
    name: "",
    email: "",
    restaurants: [{
      name_en: "",
      name_it: "",
      name_es: "",
      name_ar: ""
    }],
    restaurantsList: [{
      name: "",
      name_en: "",
      name_it: "",
      name_es: "",
      name_ar: "",
      master_name_en: "",
      master_name_it: "",
      master_name_es: "",
      master_name_ar: ""
    }],
    allow_mobile_login: false,
    phone_number: "en",
    isNeedUpdate: false,
    deliveries: []
  },
  usersList: [],
  token: {
    refresh: null,
    access: null
  },
  isNewUser: false,
  isLogin: false,
  menu: null,
  restaurant: null,
  restaurantMasterList: [{
    name: "",
    name_en: "",
    name_it: "",
    name_es: "",
    name_ar: ""
  }],
  restaurantMasterListPages: {
    totalPages: null,
    currentPage: null
  },
  /* REFRESH TOKEN ON CLIENT */
  // expiresAt: null,
  defaultCountryCode: "SA",
  landingLanguage: getDefaultLanguage(),
  languageCode: getDefaultLanguage(),
  updateName: null,
  isNeedSaveRestaurant: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
    updateDraggedBranches: (state, action) => {
      const { restaurant, branch } = action.payload;
      const index = state.restaurantMasterList.findIndex((branches) => branches.id === restaurant.id);
      state.restaurantMasterList[index] = {
        ...restaurant,
        branches: branch
      };
      state.restaurantMasterList[index].branches = state.restaurantMasterList[index].branches.sort(defaultSorting);
    },
    setRestaurant: (state, action) => {
      state.restaurant = action.payload?.id ? action.payload?.id : state.user.restaurants[0].id;
      state.user.isNeedUpdate = action.payload?.isNeedUpdate;
      if (action.payload?.isNeedUpdate) {
        state.user.restaurantsList = state.user.restaurantsList.filter(
          (t) => t.id !== state.restaurant
        );
      } else {
        state.user.restaurants = state.user.restaurantsList.filter(
          (t) => t.id === state.restaurant);
        state.user.created = state.user.restaurantsList.find(
          (t) => t.id === state.restaurant).created;
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      /* REFRESH TOKEN ON CLIENT default for an hour */
      // state.expiresAt = Date.now() + minutesToMs(60)
    },
    setEditedNumber: (state, action) => {
      state.user.phone_number = action.payload;
    },
    setLandingLanguage: (state, action) => {
      state.landingLanguage = action.payload;
    },
    resetRestaurantsList: (state, action) => {
      state.user = {
        ...state.user,
        restaurants: [],
        restaurantsList: [],
        restaurantMasterList: []
      };
      state.restaurant = null;
    },
    setUpdateName: (state, action) => {
      state.updateName = action.payload;
    },
    setIsNeedSaveRestaurant: (state, action) => {
      state.isNeedSaveRestaurant = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.data;
        /* REFRESH TOKEN ON CLIENT */
        // state.expiresAt = Date.now() + minutesToMs(30)
        state.isLogin = true;
      })
      .addMatcher(
        authApi.endpoints.getPhoneToken.matchFulfilled,
        (state, action) => {
          state.token = action.payload.data;
          /* REFRESH TOKEN ON CLIENT */
          // state.expiresAt = Date.now() + minutesToMs(30)
          state.isLogin = true;
        }
      )
      .addMatcher(
        authApi.endpoints.loginGoogle.matchFulfilled,
        (state, action) => {
          state.token = action.payload.data;
        }
      )
      .addMatcher(
        authApi.endpoints.registerUser.matchFulfilled,
        (state, action) => {
          state.token = action.payload.data;
          /* REFRESH TOKEN ON CLIENT */
          // state.expiresAt = Date.now() + minutesToMs(30)
        }
      )
      .addMatcher(
        authApi.endpoints.registerGoogle.matchFulfilled,
        (state, action) => {
          state.token = action.payload.data;
        }
      )
      .addMatcher(
        authApi.endpoints.registerRestaurant.matchFulfilled,
        (state, action) => {
          state.isNewUser = true;
        }
      )
      .addMatcher(
        restaurantApi.endpoints.masterListRestaurants.matchFulfilled,
        (state, action) => {
          const currentPage = action.payload.data.current_page;
          if (currentPage === 1) {
            state.restaurantMasterList = action.payload.data.data;
          } else {
            state.restaurantMasterList = [
              ...state.restaurantMasterList,
              ...action.payload.data.data
            ];
          }
          state.restaurantMasterListPages = {
            ...state.restaurantMasterListPages,
            totalPages: action.payload.data.total_pages,
            currentPage: action.payload.data.current_page
          };
        }
      )
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        console.log("rejected:", action);
      })
      .addMatcher(
        restaurantApi.endpoints.updateRestaurantInfo.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          const actionPayload = action.payload.data;
          const index = state.user.restaurantsList.findIndex(
            ({ id }) => id === actionPayload.id
          );
          state.user.restaurantsList[index] = actionPayload;
          state.user.restaurants = state.user.restaurantsList.filter(
            (t) => t.id === actionPayload.id
          );
        }
      )
      .addMatcher(
        restaurantApi.endpoints.deleteRestaurantInfoImage.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          const actionPayload = action.payload.data;
          const index = state.user.restaurantsList.findIndex(
            ({ id }) => id === actionPayload.id
          );
          state.user.restaurantsList[index] = actionPayload;
          state.user.restaurants = state.user.restaurantsList.filter(
            (t) => t.id === actionPayload.id
          );
        }
      )
      .addMatcher(
        restaurantApi.endpoints.addRestaurantInfoImage.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          const actionPayload = action.payload.data;
          const index = state.user.restaurantsList.findIndex(
            ({ id }) => id === actionPayload.id
          );
          state.user.restaurantsList[index] = actionPayload;
          state.user.restaurants = state.user.restaurantsList.filter(
            (t) => t.id === actionPayload.id
          );
        }
      )
      .addMatcher(
        restaurantApi.endpoints.deleteRestaurantInfoBackground.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          const actionPayload = action.payload.data;
          const index = state.user.restaurantsList.findIndex(
            ({ id }) => id === actionPayload.id
          );
          state.user.restaurantsList[index] = actionPayload;
          state.user.restaurants = state.user.restaurantsList.filter(
            (t) => t.id === actionPayload.id
          );
        }
      )
      .addMatcher(
        restaurantApi.endpoints.addRestaurantInfoBackground.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          const actionPayload = action.payload.data;
          const index = state.user.restaurantsList.findIndex(
            ({ id }) => id === actionPayload.id
          );
          state.user.restaurantsList[index] = actionPayload;
          state.user.restaurants = state.user.restaurantsList.filter(
            (t) => t.id === actionPayload.id
          );
        }
      )
      .addMatcher(
        authApi.endpoints.fetchUser.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          // if (state.isNewUser) {
          //   state.isNewUser = false;
          // }
          state.user = action.payload.data;
          state.user.restaurantsList = [...action.payload.data.restaurants];
          if (action.payload.data.restaurants.length === 1) {
            state.restaurant = action.payload.data.restaurants[0].id;
          }
          state.languageCode = action.payload.data.language_code;
        }
      )
      .addMatcher(
        authApi.endpoints.updateUserData.matchFulfilled,
        (state, action) => {
          state.languageCode = action.payload.data.language_code;
        }
      )
      .addMatcher(
        restaurantApi.endpoints.updateRestaurantLanguageInfo.matchFulfilled,
        (state, action) => {
          const currentValue = state.user.restaurants[0];
          state.user.restaurants[0] = {
            ...currentValue,
            ...action.payload.data
          };
        }
      )
      .addMatcher(
        restaurantApi.endpoints.updateDomain.matchFulfilled,
        (state, action) => {
          // refactoring  replace logic from slice
          state.user.restaurants[0].domains = action.payload.data;
          const index = state.user.restaurantsList.findIndex(
            (r) => r.id === state.restaurant
          );
          state.user.restaurantsList[index].domains = action.payload.data;
        }
      )
      .addMatcher(
        authApi.endpoints.getManageUser.matchFulfilled,
        (state, action) => {
          state.usersList = action.payload.data;
        }
      )
      .addMatcher(
        authApi.endpoints.putAddManageUser.matchFulfilled,
        (state, action) => {
          state.usersList = action.payload.data;
        }
      )
      .addMatcher(
        authApi.endpoints.putEditManageUser.matchFulfilled,
        (state, action) => {
          const index = state.usersList.findIndex(
            ({ id }) => id === action.payload.data.id
          );
          state.usersList[index] = action.payload.data;
        }
      )
      .addMatcher(
        authApi.endpoints.deleteManageUser.matchFulfilled,
        (state, action) => {
          const idToRemove = action.payload.data.deleted;
          state.usersList = state.usersList.filter(
            (modifierItem) => modifierItem.id !== idToRemove
          );
        }
      )
      .addMatcher(
        restaurantApi.endpoints.getRestaurants.matchFulfilled,
        (state, action) => {
          state.user.restaurantsList = [...action.payload.data.results];
        }
      )
      .addMatcher(
        restaurantApi.endpoints.getRestaurantDetails.matchFulfilled,
        (state, action) => {
          state.user.restaurants = [action.payload.data];
          if (state.user.is_service) {
            state.user.restaurantsList = [action.payload.data];
            state.restaurantMasterList = [action.payload.data];
            state.user.created = action.payload.data.created;
          }
        }
      )
      .addMatcher(
        restaurantApi.endpoints.getDeliveryList.matchFulfilled,
        (state, action) => {
          state.user.deliveries = [...action.payload.data];
        }
      );
  }
});

const { actions, reducer } = userSlice;
export const {
  logout,
  setToken,
  setUpdateName,
  setRestaurant,
  setEditedNumber,
  setLandingLanguage,
  setIsNeedSaveRestaurant,
  resetRestaurantsList,
  updateDraggedBranches
} = actions;
export default reducer;
