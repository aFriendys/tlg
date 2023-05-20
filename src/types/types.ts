import { type PayloadAction, type CaseReducer } from '@reduxjs/toolkit'
import { type RPCError } from 'telegram/errors'

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

export type TStartClientResult = [boolean, (RPCError | any)]
