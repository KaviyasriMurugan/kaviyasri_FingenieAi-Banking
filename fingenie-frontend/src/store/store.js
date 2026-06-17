import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bankingReducer from './bankingSlice';
 
const store = configureStore({
    reducer: {
        auth: authReducer,
        banking: bankingReducer,
    },
});
 
export default store;