import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

const flattenUserData = (userData) => {
  if (!userData) return null
  const { access_token, refresh_token, user: nestedUser, ...rest } = userData

  // Si viene con estructura anidada, extraer el usuario
  if (nestedUser) return nestedUser

  const { access_token: _, refresh_token: __, ...userOnly } = rest
  return Object.keys(userOnly).length > 0 ? { ...rest } : userData
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario de sessionStorage al iniciar
  useEffect(() => {
    const storedUser = sessionStorage.getItem('outfitlab-user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('outfitlab-user')
      }
    }
    setIsLoading(false)
  }, [])

  // Escuchar evento de refresh de token desde el interceptor
  useEffect(() => {
    const handleTokenRefresh = (event) => {
      const { user: updatedUser } = event.detail
      const userData = flattenUserData({ user: updatedUser })
      setUser(userData)
      sessionStorage.setItem('outfitlab-user', JSON.stringify(userData))
    }

    const handleAuthLogout = () => {
      setUser(null)
      sessionStorage.removeItem('outfitlab-user')
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')

      window.location.href = '/login'
    }

    window.addEventListener('tokenRefreshed', handleTokenRefresh)
    window.addEventListener('authLogout', handleAuthLogout)

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh)
      window.removeEventListener('authLogout', handleAuthLogout)
    }
  }, [])

  const login = (userData) => {
    const { access_token, refresh_token } = userData
    const userDataOnly = flattenUserData(userData)

    setUser(userDataOnly)

    sessionStorage.setItem('access_token', access_token)
    sessionStorage.setItem('refresh_token', refresh_token)
    sessionStorage.setItem('outfitlab-user', JSON.stringify(userDataOnly))
  }

  const logout = (navigate) => {
    setUser(null)

    sessionStorage.removeItem('outfitlab-user')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')

    navigate('/')
  }

  const updateUser = (updates) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...updates
    }
    setUser(updatedUser)

    sessionStorage.setItem('outfitlab-user', JSON.stringify(updatedUser))
  }

  const refreshAuth = (tokenData) => {
    const { access_token, refresh_token, user: updatedUser } = tokenData
    const userDataOnly = flattenUserData({ user: updatedUser })

    setUser(userDataOnly)

    sessionStorage.setItem('access_token', access_token)
    sessionStorage.setItem('refresh_token', refresh_token)
    sessionStorage.setItem('outfitlab-user', JSON.stringify(userDataOnly))
  }

  const updateUserSubscription = (subscriptionData) => {
    updateUser({ subscription: subscriptionData })
  }

  const isAdmin = user?.role === 'ADMIN'
  const isBrand = user?.role === 'BRAND'
  const isUser = user?.role === 'USER'

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    updateUserSubscription,
    refreshAuth,
    isAdmin,
    isBrand,
    isUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
