import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

// ✅ Async thunk to fetch orders from Firestore for the logged-in user
export const fetchOrdersFromFirestore = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      console.log("Fetching orders for user:", user.uid);

      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      // ✅ Convert Firestore data to a JSON-friendly format and sort by date (newest first)
      const orders = querySnapshot.docs
        .map((doc) => {
          const data = doc.data(); 

          return {
            id: doc.id,
            ...data,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : null,
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ✅ Sort by newest first

      console.log("✅ Orders fetched:", orders);

      return orders;
    } catch (error) {
      console.error("🔥 Error fetching orders:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Create the slice
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersFromFirestore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersFromFirestore.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrdersFromFirestore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
