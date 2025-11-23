import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

const flattenUserData = (userData) => {
  if (!userData) return null
  const { access_token, refresh_token, user: nestedUser } = userData

  if (!nestedUser) {
    return userData
  }

  return {
    access_token,
    refresh_token,
    ...nestedUser
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('outfitlab-user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(flattenUserData(parsedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('outfitlab-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    const flattenedUser = flattenUserData(userData)
    setUser(flattenedUser)
    localStorage.setItem('outfitlab-user', JSON.stringify(flattenedUser))
  }

  const logout = (navigate) => {
    setUser(null)
    localStorage.removeItem('outfitlab-user')

    if (navigate) {
      navigate('/')
    }
  }

  const updateUser = (updates) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...updates
    }
    setUser(updatedUser)
    localStorage.setItem('outfitlab-user', JSON.stringify(updatedUser))
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
    isAdmin,
    isBrand,
    isUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
