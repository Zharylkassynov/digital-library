import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  authMe,
  getStoredToken,
  setStoredToken,
} from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!getStoredToken())

  const applyToken = useCallback((next) => {
    setStoredToken(next)
    setToken(next || null)
  }, [])

  const logout = useCallback(() => {
    applyToken(null)
    setUser(null)
  }, [applyToken])

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setUser(null)
      setLoading(false)
      return undefined
    }
    setLoading(true)
    authMe()
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
          applyToken(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token, applyToken])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token && !!user,
      setSession: (nextToken, nextUser) => {
        applyToken(nextToken)
        setUser(nextUser)
      },
      logout,
      refreshUser: () =>
        token
          ? authMe()
              .then(setUser)
              .catch(() => {})
          : Promise.resolve(),
    }),
    [token, user, loading, applyToken, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
