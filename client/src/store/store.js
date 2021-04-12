import {configureStore,getDefaultMiddleware} from "@reduxjs/toolkit"
import {adoptionReducer} from "./adoptionSlice"

export const store = configureStore({
    reducer:{
        adoptionReducer
    },
    middleware:getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    })
})