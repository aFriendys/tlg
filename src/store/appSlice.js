import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { telegramClient } from '../api'

export const setUsers = createAsyncThunk('appSlice/setUsers', async (query) => {
  const users = []

  const channels = query.trim().split(' ').filter(query => query.startsWith('https://t.me/')).map(query => query.replace('https://t.me/', ''))
  users.push(...query.trim().split(' ').filter(query => !query.startsWith('https://t.me/') && !query.startsWith('+') && isNaN(Number(query))))
  for (const channel of channels) {
    users.push(...await telegramClient.getChannelParticipants(channel))
  }
  return users
})

const appSlice = createSlice({
  name: 'app',
  initialState: {
    message: '',
    query: '',
    users: [],
    usersDone: [],
    usersError: [],
    inProgress: true
  },
  reducers: {
    setInProgress: (state, { payload }) => {
      state.inProgress = payload
    },
    setMessage: (state, { payload }) => {
      state.message = payload
    },
    setQuery: (state, { payload }) => {
      state.query = payload
    },
    shiftUser: (state) => {
      const newUsers = [...state.users]
      newUsers.shift()
      state.users = newUsers
    },
    pushUsersDone: (state, { payload }) => {
      const newUsers = [...state.usersDone]
      newUsers.push(payload)
      state.usersDone = newUsers
    },
    pushUsersError: (state, { payload }) => {
      const newUsers = [...state.usersError]
      newUsers.push(payload)
      state.usersError = newUsers
    },
    resetUsersDone: state => {
      state.usersDone = []
      state.usersError = []
    }

  },
  extraReducers: {
    [setUsers.pending]: (state) => {
      state.inProgress = true
    },
    [setUsers.fulfilled]: (state, { payload }) => {
      state.query = ''
      state.users = payload
      state.inProgress = false
    }
  }
})

export default appSlice
export const { setMessage, setQuery, shiftUser, pushUsersDone, resetUsersDone, pushUsersError, setInProgress } = appSlice.actions
