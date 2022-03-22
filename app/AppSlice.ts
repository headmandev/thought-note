import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from '@reduxjs/toolkit'

import type { AppState } from './store'
import { Descendant } from 'slate'
import { HYDRATE } from 'next-redux-wrapper'
import { initialValue } from './initialValue'
import { createNote, fetchNote, saveNote } from './api'

export const getDataAsync = createAsyncThunk(
  'editor/getData',
  async (uuid: string) => fetchNote(uuid)
)

export const saveDataAsync = createAsyncThunk(
  'editor/saveData',
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState() as AppState
    if (!state.editor.id) return
    const response = await saveNote(state.editor.id, state.editor.data)
    return response.id
  }
)

export const createNoteAsync = createAsyncThunk(
  'editor/createNote',
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState() as AppState
    return createNote(state.editor.data)
  }
)

export interface EditorState {
  id: string | null
  dark: boolean
  isLoading: boolean
  isSaving: boolean
  data: Descendant[]
}

const initialState: EditorState = {
  id: null,
  dark: false,
  isLoading: true,
  isSaving: false,
  data: initialValue(),
}

export const localStorageThemeKey = 'app_is_dark'
export const defaultTitle = 'Thought Note'

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setIsDark: (state, v: PayloadAction<boolean>) => {
      state.dark = v.payload
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_is_dark', String(v.payload))
      }
    },
    updateData: (state, v: PayloadAction<Descendant[]>) => {
      state.data = v.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDataAsync.pending, (state) => {
        state.isSaving = true
      })
      .addCase(saveDataAsync.fulfilled, (state) => {
        state.isSaving = false
      })
      .addCase(createNoteAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createNoteAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.id = action.payload.id
        state.data = action.payload.data
      })
      .addCase(getDataAsync.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDataAsync.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.error) return
        state.id = action.payload.id
        state.data = action.payload.data
      })
      .addCase(HYDRATE, (state, action: AnyAction) => {
        return {
          ...state,
          ...action.payload.editor,
        }
      })
  },
})

export const { setIsDark, updateData } = editorSlice.actions

export const selectIsDark = (state: AppState) => state.editor.dark
export const selectData = (state: AppState) => state.editor.data

export const selectTitle = (state: AppState) => {
  let result = ''
  if (state.editor.id) {
    const data: Descendant[] = state.editor.data
    const firstP = data.find((e) => 'children' in e)
    if (firstP && 'children' in firstP) {
      result = firstP.children.reduce((agg, title) => {
        if ('text' in title) return agg + title.text
        return agg
      }, result)
    }
  }

  return result || defaultTitle
}
export const selectId = (state: AppState) => state.editor.id
// export const selectIsLoading = (state: AppState) => state.editor.isLoading

export default editorSlice.reducer
