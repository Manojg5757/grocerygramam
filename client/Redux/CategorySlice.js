// CategorySlice.js follows a similar pattern to ProductSlice.js and BannerSlice.js,
// implementing timestamp-based caching to fetch Category data from Firestore
// only if there is a newer lastUpdated timestamp than what is stored locally.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Thunk to check timestamp in categoryMeta/lastUpdated and fetch categories if newer
export const checkAndFetchCategories = createAsyncThunk(
  "categories/checkAndFetchCategories",
  async (_, { rejectWithValue }) => {
    const db = getFirestore();
    const metaRef = doc(db, "categoryMeta", "lastUpdated");

    try {
      // 1) Get Firestore lastUpdated timestamp
      const metaSnap = await getDoc(metaRef);
      const firestoreTimestamp = metaSnap.exists()
        ? metaSnap.data().lastUpdated?.toMillis()
        : 0;

      // 2) Get locally cached timestamp
      const localTimestampStr = await AsyncStorage.getItem("categories_lastUpdated");
      const localTimestamp = localTimestampStr ? parseInt(localTimestampStr, 10) : 0;

      // 3) If Firestore has newer data, fetch categories from "categories"
      if (firestoreTimestamp > localTimestamp) {
        console.log("🔁 Fetching category data from Firestore...");
        const querySnapshot = await getDocs(collection(db, "categories"));
        let categoriesFetched = [];
        querySnapshot.forEach((doc) => {
          categoriesFetched.push({ id: doc.id, ...doc.data() });
        });

        // 4) Save categories + updated timestamp locally
        await AsyncStorage.setItem("categories", JSON.stringify(categoriesFetched));
        await AsyncStorage.setItem("categories_lastUpdated", firestoreTimestamp.toString());

        return categoriesFetched;
      } else {
        // 5) Use cached data
        console.log("✅ Using cached categories...");
        const cachedCategories = await AsyncStorage.getItem("categories");
        return cachedCategories ? JSON.parse(cachedCategories) : [];
      }
    } catch (error) {
      console.error("❌ Error in checkAndFetchCategories:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition for categories
const CategorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAndFetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAndFetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(checkAndFetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CategorySlice.reducer;
