import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { telegramClient } from '../api'

export const setUsers = createAsyncThunk('appSlice/setUsers', async (query) => {
  const users = []

  const channels = query.trim().split(' ').filter(query => query.endsWith(':channel')).map(query => query.replace(':channel', ''))
  users.push(...query.trim().split(' ').filter(query => !query.endsWith(':channel')))
  for (const channel of channels) {
    users.push(...await telegramClient.getChannelParticipants(channel))
  }
  return users
})

const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    message: '',
    query: '',
    users: [],
    usersDone: [1, 2, 3],
    usersIsFetching: false
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload
    },
    setQuery: (state, action) => {
      state.query = action.payload
    },
    shiftUser: (state) => {
      const newUsers = [...state.users]
      newUsers.shift()
      state.users = newUsers
    },
    pushUsersDone: (state, action) => {
      const newUsers = [...state.usersDone]
      newUsers.push(action.payload)
      state.usersDone = newUsers
    },
    resetUsersDone: state => {
      state.usersDone = []
    }

  },
  extraReducers: {
    [setUsers.pending]: (state) => {
      state.usersIsFetching = true
    },
    [setUsers.fulfilled]: (state, action) => {
      state.query = ''
      state.users = action.payload
      state.usersIsFetching = false
    }
  }
})

export default appSlice.reducer
export const { setMessage, setQuery, shiftUser, pushUsersDone, resetUsersDone } = appSlice.actions
