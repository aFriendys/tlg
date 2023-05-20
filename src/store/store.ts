import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { appSlice, userSlice } from '.'

const reducer = combineReducers({
  [appSlice.name]: appSlice.reducer,
  [userSlice.name]: userSlice.reducer
})

export const store = configureStore({
  reducer
})

export type IRootState = ReturnType<typeof store.getState>
export type IAppDispatch = typeof store.dispatch
