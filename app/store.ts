import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import {createWrapper} from 'next-redux-wrapper';

import editorReducer from './AppSlice'

export function makeStore() {
  return configureStore({
    reducer: { editor: editorReducer }
  })
}


export type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore['getState']>


export const wrapper = createWrapper<AppStore>(makeStore);

export type AppDispatch = AppStore['dispatch']

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>
