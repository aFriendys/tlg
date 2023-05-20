import { type PayloadAction, type CaseReducer } from '@reduxjs/toolkit'

export type MapReducerPayloads<State, ReducerPayloadMap> = {
  [K in keyof ReducerPayloadMap]: CaseReducer<State, PayloadAction<ReducerPayloadMap[K]>>
}

export interface IUser {
  name: string
}

export interface IApp {
  message: string
  query: string
  users: string[]
  usersDone: string[]
  usersError: string[]
  inProgress: boolean
}
