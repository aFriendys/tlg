import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appSlice from './appSlice'
import userSlice from './userSlice'

const reducer = combineReducers({
  [appSlice.name]: appSlice.reducer,
  [userSlice.name]: userSlice.reducer
})

export const store = configureStore({
  reducer
})
