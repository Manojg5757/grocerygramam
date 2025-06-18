import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Thunk to check timestamp in cateringMeta/lastUpdated and fetch catering if newer
export const checkAndFetchCatering = createAsyncThunk(
  "catering/checkAndFetchCatering",
  async (_, { rejectWithValue }) => {
    const db = getFirestore();
    const metaRef = doc(db, "cateringMeta", "lastUpdated");

    try {
      // 1) Get Firestore lastUpdated timestamp
      const metaSnap = await getDoc(metaRef);
      const firestoreTimestamp = metaSnap.exists()
        ? metaSnap.data().lastUpdated?.toMillis()
        : 0;

      // 2) Get locally cached timestamp
      const localTimestampStr = await AsyncStorage.getItem("catering_lastUpdated");
      const localTimestamp = localTimestampStr ? parseInt(localTimestampStr, 10) : 0;

      // 3) If Firestore has newer data, fetch catering from "catering"
      if (firestoreTimestamp > localTimestamp) {
        console.log("🔁 Fetching catering data from Firestore...");
        const querySnapshot = await getDocs(collection(db, "catering"));
        let cateringFetched = [];
        querySnapshot.forEach((doc) => {
          cateringFetched.push({ id: doc.id, ...doc.data() });
        });

        // 4) Save catering + updated timestamp locally
        await AsyncStorage.setItem("catering", JSON.stringify(cateringFetched));
        await AsyncStorage.setItem("catering_lastUpdated", firestoreTimestamp.toString());

        return cateringFetched;
      } else {
        // 5) Use cached data
        console.log("✅ Using cached catering...");
        const cachedCatering = await AsyncStorage.getItem("catering");
        return cachedCatering ? JSON.parse(cachedCatering) : [];
      }
    } catch (error) {
      console.error("❌ Error in checkAndFetchCatering:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition for catering
const CateringSlice = createSlice({
  name: "catering",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAndFetchCatering.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAndFetchCatering.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(checkAndFetchCatering.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CateringSlice.reducer;
