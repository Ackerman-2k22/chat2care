"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Professional } from "@/types/medical"

interface AuthContextType {
  professional: Professional | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté
    const savedProfessional = localStorage.getItem("professional")
    if (savedProfessional) {
      setProfessional(JSON.parse(savedProfessional))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://high5-gateway.onrender.com/api/v1/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username,  // Changé de email à username
          password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Échec de la connexion")
      }

      const data = await response.json()

      // Formatage des données du professionnel
      const professionalData: Professional = {
        professional_id: data.user.id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        date_of_birth: data.user.date_of_birth,
        gender: data.user.gender,
        specialization: data.user.specialization,
        department_id: data.user.department_id,
        email: data.user.email,
        phone: data.user.phone,
        username: data.user.username,  // Ajout du username
        access_token: data.access,
        refresh_token: data.refresh
      }

      setProfessional(professionalData)
      localStorage.setItem("professional", JSON.stringify(professionalData))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setProfessional(null)
    localStorage.removeItem("professional")
    // Option: Appeler l'endpoint de déconnexion si disponible
  }

  return (
      <AuthContext.Provider
          value={{
            professional,
            login,
            logout,
            isAuthenticated: !!professional,
            isLoading,
            error
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider")
  }
  return context
}