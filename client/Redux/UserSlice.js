import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCart, setCart } from "./CartSlice";

// ✅ Fetch user data from Firestore and store in AsyncStorage
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const user = auth.currentUser;
      console.log(user);
      if (!user) throw new Error("User not logged in");

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        let userData = userDoc.data();

        // Convert Firestore Timestamp to string
        if (userData.createdAt instanceof Timestamp) {
          userData.createdAt = userData.createdAt.toDate().toISOString();
        }

        // Set cart state in Redux
        // dispatch(setCart(userData.cart || []));

        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        console.log("✅ Fetched & saved user data:", userData);
        return userData;
      } else {
        throw new Error("❌ User document not found in Firestore");
      }
    } catch (error) {
      console.log("🔥 fetchUserData Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Load user data from AsyncStorage
export const loadUserDataFromStorage = createAsyncThunk(
  "user/loadUserDataFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null) {
        console.log("✅ Loaded user data from storage:", JSON.parse(userData));
        return JSON.parse(userData);
      } else {
        return null;
      }
    } catch (error) {
      console.log("🔥 loadUserDataFromStorage Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch from Firestore
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load from AsyncStorage
      .addCase(loadUserDataFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserDataFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(loadUserDataFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = UserSlice.actions;

// ✅ Custom thunk to logout and clear AsyncStorage
export const logoutAndClearUserData = () => async (dispatch) => {
  await AsyncStorage.removeItem('userData');
  dispatch(logoutUser());
  dispatch(clearCart())
};

export default UserSlice.reducer;
