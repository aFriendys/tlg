import { createSlice } from '@reduxjs/toolkit'
import { type IUser, type MapReducerPayloads } from 'types'

type IUserReducers = MapReducerPayloads<IUser, {
  setUserName: string
}>

const initialState: IUser = {
  name: ''
}

export const userSlice = createSlice<IUser, IUserReducers>({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, { payload }) => {
      state.name = payload
    }

  }
})

export default userSlice
export const { setUserName } = userSlice.actions
