import { configureStore } from "@reduxjs/toolkit";
import CartSlice from './CartSlice'
import productSlice from './ProductSlice'
import userReducer from './UserSlice'
import orderReducer from './OrderSlice'
import adminOrdersReducer from './AllOrdersSlice'

export const store = configureStore({
    reducer:{
        cart:CartSlice,
        products:productSlice,
        user:userReducer,
        orders:orderReducer,
        adminOrders:adminOrdersReducer
    }
})

