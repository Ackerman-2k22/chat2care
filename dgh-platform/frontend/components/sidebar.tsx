"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface UserData {
  firstName: string
  lastName: string
  email?: string
  department: string
  avatarUrl?: string
}

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  currentUser: UserData
}

const MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "feedback", label: "Patient Feedback", icon: MessageSquare },
]

export function Sidebar({ activeTab, onTabChange, onLogout, currentUser }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleCollapse = () => setCollapsed(!collapsed)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    closeMobileMenu()
  }
  const router = useRouter()

  const handleLogout = () => {
    closeMobileMenu()
    onLogout()           // logout côté Supabase ou autre
    router.push("/professional/login")  // redirection
  }

  const userInitial = currentUser?.firstName?.[0]?.toUpperCase() ||
      currentUser?.lastName?.[0]?.toUpperCase() ||
      "U"

  const userName = `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Utilisateur'
  const userDepartment = currentUser?.department || 'Département inconnu'

  return (
      <>
        {/* Mobile Menu Button */}
        {!isMobileMenuOpen && (
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="fixed top-4 left-4 z-50 lg:hidden rounded-full w-10 h-10 p-0 bg-background border-2 shadow-lg"
                aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
        )}

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={closeMobileMenu}
                aria-hidden="true"
            />
        )}

        {/* Sidebar */}
        <aside
            className={`
          ${collapsed ? "w-20" : "w-80"} 
          fixed lg:relative h-[100svh] bg-card border-r border-border transition-all duration-300 z-40
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
            aria-label="Sidebar"
        >
          {/* Header */}
          <header className="p-4 lg:p-6 border-b border-border flex-shrink-0 relative">
            <div className="flex justify-center">
              <div className="relative flex-shrink-0">
                <Image
                    src="/logo.png"
                    alt="HIGH5 Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                    priority
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full animate-pulse-glow" />
              </div>
            </div>

            {/* Mobile Close Button */}
            {isMobileMenuOpen && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={closeMobileMenu}
                    className="absolute top-4 right-4 z-50 lg:hidden rounded-full w-10 h-10 p-0 bg-background border-2 shadow-lg"
                    aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </Button>
            )}
          </header>

          {/* Doctor Profile */}
          <section className="p-4 lg:p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 lg:w-12 lg:h-12 ring-2 ring-primary-500 ring-offset-2 ring-offset-background flex-shrink-0">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback className="bg-primary-500 text-white text-sm lg:text-base">
                  {userInitial}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                  <div className="animate-fade-in min-w-0">
                    <h3 className="font-semibold text-sm lg:text-base truncate" title={userName}>
                      {userName}
                    </h3>
                    <p
                        className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1 truncate"
                        title={userDepartment}
                    >
                      <Stethoscope className="w-3 h-3 flex-shrink-0" />
                      {userDepartment}
                    </p>
                  </div>
              )}
            </div>
          </section>

          {/* Navigation */}
          <nav className="flex-1 p-3 lg:p-4 overflow-y-auto min-h-0" aria-label="Main navigation">
            <ul className="space-y-2">
              {MENU_ITEMS.map((item, index) => (
                  <li key={item.id}>
                    <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={`w-full justify-start gap-3 h-10 lg:h-12 transition-all duration-200 animate-fade-in text-sm lg:text-base ${
                            activeTab === item.id
                                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                                : "hover:bg-accent hover:scale-105"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleTabChange(item.id)}
                        aria-current={activeTab === item.id ? "page" : undefined}
                    >
                      <item.icon
                          className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${activeTab === item.id ? "text-white" : ""}`}
                          aria-hidden="true"
                      />
                      {!collapsed && (
                          <span className="animate-slide-in truncate">
                      {item.label}
                    </span>
                      )}
                    </Button>
                  </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <footer className="py-2 px-3 lg:p-4 border-t border-border space-y-1 lg:space-y-2 flex-shrink-0">
            <div className="flex gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex-1 gap-2 text-xs lg:text-sm h-8 lg:h-10"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                    <Sun className="w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                    <Moon className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
                {(!collapsed || isMobileMenuOpen) && (theme === "dark" ? "Light" : "Dark")}
              </Button>

              {(!collapsed || isMobileMenuOpen) && (
                  <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent text-xs lg:text-sm h-8 lg:h-10"
                      onClick={() => handleTabChange("settings")}
                      aria-label="Settings"
                  >
                    <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
                    Settings
                  </Button>
              )}
            </div>

            <Button
                variant="destructive"
                className="w-full gap-2 text-xs lg:text-sm h-8 lg:h-10"
                size="sm"
                onClick={handleLogout}
                aria-label="Sign out"
            >
              <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
              {(!collapsed || isMobileMenuOpen) && "Sign Out"}
            </Button>
          </footer>

          {/* Collapse Toggle - Desktop only */}
          <Button
              variant="outline"
              size="sm"
              className="absolute -right-3 top-20 rounded-full w-6 h-6 p-0 bg-background border-2 hidden lg:flex"
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
                <ChevronRight className="w-3 h-3" />
            ) : (
                <ChevronLeft className="w-3 h-3" />
            )}
          </Button>
        </aside>
      </>
  )
}