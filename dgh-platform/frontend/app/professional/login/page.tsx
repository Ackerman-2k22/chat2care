"use client"

import { Login } from "@/components/login"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    const handleLogin = (userData: any) => {
        console.log("User logged in:", userData)

        // Ici, tu peux aussi stocker l'utilisateur dans un contexte global ou localStorage si besoin

        // Rediriger vers le tableau de bord
        router.push("/professional/dashboard")
    }

    return <Login onLogin={handleLogin} />
}
