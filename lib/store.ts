import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cartReducer";
import userReducer from "./reducers/userReducer";

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined; // Let the reducers initialize the state
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Function to save state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

// Combine reducers into a rootReducer
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

// Load the persisted state from localStorage
const preloadedState = loadState();

// Create the store, preloading the state
export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState, // Preload the store with localStorage data if it exists
  });
  // Subscribe to the store, saving the state to localStorage on changes
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
