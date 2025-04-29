import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// ✅ Fetch All Orders for Admin
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const ordersRef = collection(db, "orders");
      const usersRef = collection(db, "users");

      const [ordersSnapshot, usersSnapshot] = await Promise.all([
        getDocs(ordersRef),
        getDocs(usersRef),
      ]);

      // Convert users data into an object { userId: userName }
      const usersMap = {};
      usersSnapshot.forEach((doc) => {
        usersMap[doc.id] = doc.data().name || "Unknown User";
      });

      // Convert orders data
      const orders = ordersSnapshot.docs.map((doc) => {
        const data = doc.data();

        // If createdAt is a string, convert it to Date object
        let createdAt = null;
        if (data.createdAt) {
          // If createdAt is a string, convert it to Date object
          createdAt = new Date(data.createdAt).toISOString();
        }

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt, // Safely handle the createdAt field
          userName: usersMap[data.userId] || "Unknown User", // Attach user name
        };
      });

      console.log("✅ All Orders fetched:", orders);
      return orders;
    } catch (error) {
      console.error("🔥 Error fetching orders:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminOrdersSlice.reducer;
