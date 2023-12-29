import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name:'auth',
    initialState:{
        authenticated: false,
        premium: false,
    },
    reducers:{
        loginHandler:(state)=>{
            state.authenticated = true
        },
        logoutHandler:(state)=>{
            state.authenticated=false;
            state.premium=false;
        },
        premiumHandler:(state,action)=>{
            state.premium = action.payload;
        }
    }
})
export const {loginHandler,logoutHandler,premiumHandler} = authSlice.actions;
export default authSlice.reducer;