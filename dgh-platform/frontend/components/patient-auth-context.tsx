"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface PatientUser {
  patient_id: string
  first_name: string
  last_name: string
  phone_number: string
  preferred_language: "en" | "fr" | "duala" | "bassa" | "ewondo"
  email?: string
}

interface PatientAuthContextType {
  patient: PatientUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined)

// Mock patient data
const mockPatients: PatientUser[] = [
  {
    patient_id: "PAT001",
    first_name: "Jean",
    last_name: "Dupont",
    phone_number: "+237123456789",
    preferred_language: "fr",
    email: "patient@demo.com",
  },
  {
    patient_id: "PAT002",
    first_name: "Mary",
    last_name: "Johnson",
    phone_number: "+237987654321",
    preferred_language: "en",
    email: "mary@demo.com",
  },
]

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<PatientUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if patient is already logged in
    const savedPatient = localStorage.getItem("patient")
    if (savedPatient) {
      setPatient(JSON.parse(savedPatient))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "patient@demo.com" && password === "patient123") {
      const foundPatient = mockPatients.find((p) => p.email === email)
      if (foundPatient) {
        setPatient(foundPatient)
        localStorage.setItem("patient", JSON.stringify(foundPatient))
        setIsLoading(false)
        return true
      }
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setPatient(null)
    localStorage.removeItem("patient")
  }

  return (
    <PatientAuthContext.Provider
      value={{
        patient,
        login,
        logout,
        isAuthenticated: !!patient,
        isLoading,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  )
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext)
  if (context === undefined) {
    throw new Error("usePatientAuth must be used within a PatientAuthProvider")
  }
  return context
}
