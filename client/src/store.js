import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './slice/modalSlice'
import userSlice from './slice/userSlice'
import editorSlice from './slice/editorSlice'

export const store = configureStore({
  reducer: {
    user:userSlice,
    modal:modalSlice,
    editor:editorSlice,
  },
})

