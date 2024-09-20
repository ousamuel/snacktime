// Initial state for the user and secure access
const initialState = {
  user: null,
  secureAccess: false,
  loading: false,
  error: null,
};

// Actions
export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const setSecureAccess = (hasAccess) => ({
  type: "SET_SECURE_ACCESS",
  payload: hasAccess,
});

export const setLoading = (isLoading) => ({
  type: "SET_LOADING",
  payload: isLoading,
});

export const setError = (error) => ({
  type: "SET_ERROR",
  payload: error,
});

// Reducer
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_SECURE_ACCESS":
      return { ...state, secureAccess: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
