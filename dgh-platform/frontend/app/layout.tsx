import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '../contexts/auth-context'
import { PatientAuthProvider } from "@/components/patient-auth-context"
import { LanguageProvider } from '@/contexts/language-context'


export const inter = Inter({ subsets: ["latin"] })

const metadata: Metadata = {
    title: "HIGH5 medical platform",
    description: "Modern medical platform for professionals and patients",
    generator: ''
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        // app/layout.tsx
        <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
        <body className={`${inter.className} overflow-x-hidden w-full max-w-full`}>
        <PatientAuthProvider>
            <AuthProvider>
                <LanguageProvider>

                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
                    <div className="w-full max-w-full overflow-x-hidden">{children}</div>
                </ThemeProvider>
                </LanguageProvider>

            </AuthProvider>
        </PatientAuthProvider>
        </body>
        </html>
    )
}