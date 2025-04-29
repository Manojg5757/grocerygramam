import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebase";
import { collection, addDoc, doc } from "firebase/firestore";

// ✅ Load Cart from AsyncStorage
export const loadCartFromStorage = createAsyncThunk(
  "cart/loadCart",
  async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      return cart ? JSON.parse(cart) : []; // Return parsed cart or empty array
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  }
);

// ✅ Save Cart to AsyncStorage
const saveCartToStorage = async (cart) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

// ✅ Add Order to Firestore in a Subcollection
export const addOrderToFirestore = createAsyncThunk(
  "cart/addOrderToFirestore",
  async (orderData, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      console.log("Adding order for user:", user.uid);

      const ordersRef = collection(db, "orders");
      const orderDocRef = await addDoc(ordersRef, {
        ...orderData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Order added with ID:", orderDocRef.id);
      return orderData;
    } catch (error) {
      console.log("🔥 Error adding order:", error.message);
      return rejectWithValue(error.message);
    }
  }
);



const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const item = state.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state); // ✅ Save to AsyncStorage
    },
    removeFromCart: (state, action) => {
      const updatedCart = state.filter((item) => item.id !== action.payload.id);
      saveCartToStorage(updatedCart); // ✅ Save to AsyncStorage
      return updatedCart;
    },
    increaseQuantity: (state, action) => {
      state.forEach((item) => {
        if (item.id === action.payload.id) item.quantity += 1;
      });
      saveCartToStorage(state); // ✅ Save to AsyncStorage
    },
    decreaseQuantity: (state, action) => {
      const updatedCart = state
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0);

      saveCartToStorage(updatedCart); // ✅ Save to AsyncStorage
      return updatedCart;
    },
    setCart: (state, action) => {
      saveCartToStorage(action.payload); // ✅ Save to AsyncStorage
      return action.payload;
    },
    clearCart: (state) => {
      saveCartToStorage([]);
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadCartFromStorage.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(addOrderToFirestore.fulfilled, (state, action) => {
      // Optionally, handle state change after order is added
      return state; // This is just a placeholder; you can modify this as needed
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
