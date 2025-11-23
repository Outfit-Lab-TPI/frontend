import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay usuario guardado al iniciar
    const storedUser = localStorage.getItem('outfitlab-user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('outfitlab-user')
      }
    } else {
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)

    const stringifiedData = JSON.stringify(userData);
    localStorage.setItem('outfitlab-user', stringifiedData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('outfitlab-user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
