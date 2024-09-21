import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cartReducer";
import userReducer from "./reducers/userReducer";

// Function to load state from localStorage
const loadState = () => {
  try {
    if (typeof window === "undefined") {
      return undefined; // We're on the server, no access to localStorage
    }
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined; // No saved state
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
    if (typeof window === "undefined") {
      return; // Don't try to save state on the server
    }
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
const preloadedState = typeof window !== "undefined" ? loadState() : undefined;

// Create the store
export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState, // Preload with localStorage state if we're on the client
  });

  // Subscribe to the store and save state to localStorage when it changes (only on the client)
  if (typeof window !== "undefined") {
    store.subscribe(() => {
      saveState(store.getState());
    });
  }

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
