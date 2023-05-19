import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: ''
  },
  reducers: {
    setUserName: (state, { payload }) => {
      state.name = payload
    }

  }
})

export default userSlice
export const { setUserName } = userSlice.actions
