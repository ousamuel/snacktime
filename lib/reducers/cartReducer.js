// Initial state of the cart
const initialState = {
  cartItems: [],
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';

// Reducer function
export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      // Check if item already exists in the cart
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        // If item exists, update its quantity
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        // If item doesn't exist, add it to the cart
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }

    case REMOVE_FROM_CART:
      // Remove item by filtering it out of the cart
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case UPDATE_CART_ITEM:
      // Update the quantity of an existing cart item
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };

    default:
      return state;  // Return unchanged state if no relevant actions are found
  }
}

// Action creators for dispatching actions

export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (id) => ({
  type: REMOVE_FROM_CART,
  payload: id,
});

export const updateCartItem = (id, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { id, quantity },
});
