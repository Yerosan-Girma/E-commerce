import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { toggleTheme } from '../store/slices/uiSlice'

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.ui.theme)
  const dispatch = useDispatch()

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
  }
}