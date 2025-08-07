"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { High5Logo } from "@/components/high5-logo"
import { Loader2, Eye, EyeOff, User } from "lucide-react"
import { usePatientAuth } from "@/components/patient-auth-context"
import { useToast } from "@/hooks/use-toast"
// import { useLanguage } from "@/contexts/language-context"
// import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image";

export function PatientLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = usePatientAuth()
  const { toast } = useToast()
  // const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      toast({
        title: ("login.success"),
        description: ("login.welcome"),
      })
    } else {
      toast({
        title: ("login.failed"),
        description: ("login.invalid_credentials"),
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-green-950 p-4">
      {/* Header with controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/*<LanguageSelector />*/}
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <Image src="/high5-logo.png" alt="HIGH5 Logo" width={80} height={80} className="rounded-2xl" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            HIGH5
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            {("login as a patient")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/80 dark:bg-gray-900/80 border-white/20 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{("password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={("enter your password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/80 dark:bg-gray-900/80 border-white/20 pr-10 h-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-6 text-lg font-medium h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {("login.signing_in")}
                </>
              ) : (
                <>
                  <User className="h-5 w-5 mr-2" />
                  {("patient.login.button")}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">{("login.demo_credentials")}:</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Email: patient@demo.com
              <br />
              {("login.password")}: patient123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
