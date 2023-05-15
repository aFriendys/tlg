import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appSliceReducer from './appSlice'

const reducer = combineReducers({
  appSlice: appSliceReducer
})

export const store = configureStore({
  reducer
})
