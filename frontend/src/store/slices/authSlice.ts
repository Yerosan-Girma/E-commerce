import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthUser {
  _id?: string
  name: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
}

interface AuthState {
  user: AuthUser | null
  token: string | null
}

function isValidJwt(token: string | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part.length > 0)
}

// Restore user from localStorage to survive page refreshes
function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function loadStoredToken(): string | null {
  const token = localStorage.getItem('token')
  if (!isValidJwt(token)) {
    if (token) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return null
  }
  return token
}

const storedToken = loadStoredToken()
const storedUser = storedToken ? loadStoredUser() : null

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },

    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer