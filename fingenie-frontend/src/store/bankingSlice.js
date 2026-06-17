import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
    account: null,
    transactions: [],
    loading: false,
    error: null,
};
 
const bankingSlice = createSlice({
    name: 'banking',
    initialState,
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload;
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});
 
export const {
    setAccount, setTransactions,
    setLoading, setError, clearError
} = bankingSlice.actions;
export default bankingSlice.reducer;