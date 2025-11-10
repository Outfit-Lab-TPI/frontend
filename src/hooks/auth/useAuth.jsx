import { useContext } from 'react'
import { AuthProvider } from '../../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthProvider)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
