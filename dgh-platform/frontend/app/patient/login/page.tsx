"use client"

import { PatientLoginForm } from "@/components/patient-login-form"
import { usePatientAuth } from "@/components/patient-auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PatientLoginPage() {
  const { isAuthenticated } = usePatientAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <PatientLoginForm />
}
