// BannerSlice.js replicates the timestamp-based caching strategy used in ProductSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Thunk to compare bannerMeta/lastUpdated with local storage and fetch banners if newer
export const checkAndFetchBanners = createAsyncThunk(
  "banners/checkAndFetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const metaRef = doc(db, "bannerMeta", "lastUpdated");
      
      // 1) Get Firestore timestamp
      const metaSnap = await getDoc(metaRef);
      const firestoreTimestamp = metaSnap.exists()
        ? metaSnap.data().lastUpdated?.toMillis()
        : 0;
      
      // 2) Get local cached timestamp
      const localTimestampStr = await AsyncStorage.getItem("banners_lastUpdated");
      const localTimestamp = localTimestampStr ? parseInt(localTimestampStr, 10) : 0;

      // 3) If Firestore has newer data, fetch banners from homeBannerSlider
      if (firestoreTimestamp > localTimestamp) {
        console.log("🔁 Fetching banner data from Firestore...");
        const querySnapshot = await getDocs(collection(db, "homeBannerSlider"));
        let bannersFetched = [];
        querySnapshot.forEach((doc) => {
          bannersFetched.push({ id: doc.id, ...doc.data() });
        });

        // 4) Save banner data + updated timestamp locally
        await AsyncStorage.setItem("banners", JSON.stringify(bannersFetched));
        await AsyncStorage.setItem("banners_lastUpdated", firestoreTimestamp.toString());

        return bannersFetched;
      } else {
        // 5) Use cached data
        console.log("✅ Using cached banners...");
        const cachedBanners = await AsyncStorage.getItem("banners");
        return cachedBanners ? JSON.parse(cachedBanners) : [];
      }
    } catch (error) {
      console.error("❌ Error in checkAndFetchBanners:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const BannerSlice = createSlice({
  name: "banners",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAndFetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAndFetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(checkAndFetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default BannerSlice.reducer;
