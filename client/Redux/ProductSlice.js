import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    collection,
    getDocs,
    getFirestore,
    doc,
    getDoc
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Thunk to check timestamp and fetch products if needed
export const checkAndFetchProducts = createAsyncThunk(
    "products/checkAndFetchProducts",
    async (_, { rejectWithValue }) => {
        const db = getFirestore();
        const metaRef = doc(db, "productMeta", "lastUpdated");

        try {
            // Get last updated timestamp from Firestore
            const metaSnap = await getDoc(metaRef);
            const firestoreTimestamp = metaSnap.exists()
                ? metaSnap.data().lastUpdated?.toMillis()
                : 0;

            // Get locally saved timestamp
            const localTimestampStr = await AsyncStorage.getItem("products_lastUpdated");
            const localTimestamp = localTimestampStr ? parseInt(localTimestampStr) : 0;

            // If Firestore has newer data
            if (firestoreTimestamp > localTimestamp) {
                console.log("🔁 Fetching new products...");

                const querySnapshot = await getDocs(collection(db, "products"));
                let products = [];
                querySnapshot.forEach((doc) => {
                    products.push({ id: doc.id, ...doc.data() });
                });

                // Save to AsyncStorage
                await AsyncStorage.setItem("products", JSON.stringify(products));
                await AsyncStorage.setItem("products_lastUpdated", firestoreTimestamp.toString());

                return products;
            } else {
                // Use cached data
                console.log("✅ Using cached products...");
                const cachedProducts = await AsyncStorage.getItem("products");
                return cachedProducts ? JSON.parse(cachedProducts) : [];
            }
        } catch (error) {
            console.error("❌ Error in checkAndFetchProducts:", error);
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Product slice
const productSlice = createSlice({
    name: "product",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProducts: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAndFetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAndFetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(checkAndFetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
