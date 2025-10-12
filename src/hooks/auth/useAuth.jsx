import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay usuario en localStorage al inicializar
    const storedUser = localStorage.getItem('outfitlab-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('outfitlab-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('outfitlab-user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('outfitlab-user')
  }

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData }
    setUser(newUserData)
    localStorage.setItem('outfitlab-user', JSON.stringify(newUserData))
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}