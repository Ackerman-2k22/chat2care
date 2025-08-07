// "use client"
//
// import { useState } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { Dashboard } from "@/components/dashboard"
// import { Patients } from "@/components/patients"
// import { Appointments } from "@/components/appointments"
// import { Prescriptions } from "@/components/prescriptions"
// import { PatientFeedback } from "@/components/patient-feedback"
// import { Login } from "@/components/login"
// import { Settings } from "@/components/settings"
//
// // Define a User type for consistency
// interface User {
//   firstName: string
//   lastName: string
//   email: string
//   phone: string
//   address: string
//   department: string
//   bio: string
//   matricule: string
//   gender: string
//   dateOfBirth: string
//   emergencyContact: string
//   avatarUrl?: string
// }
//
// export default function Home() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [activeTab, setActiveTab] = useState("dashboard")
//   // Default user data for demonstration, will be updated on login
//   const [currentUser, setCurrentUser] = useState<User>({
//     firstName: "Sarah",
//     lastName: "Johnson",
//     email: "sarah.johnson@medadmin.com",
//     phone: "+1 (555) 123-4567",
//     address: "123 Medical Center Dr, Suite 400, City, State 12345",
//     department: "Cardiology",
//     bio: "Experienced cardiologist with a passion for patient care and a focus on preventive medicine.",
//     matricule: "MJ001",
//     gender: "Female",
//     dateOfBirth: "1980-05-15",
//     emergencyContact: "John Johnson (Husband) - +1 (555) 987-6543",
//   })
//
//   const handleLogin = (userData: User) => {
//     setCurrentUser(userData)
//     setIsLoggedIn(true)
//   }
//
//   const handleLogout = () => {
//     setIsLoggedIn(false)
//     setActiveTab("dashboard")
//     // Reset user data to default or empty on logout if needed
//     setCurrentUser({
//       firstName: "Sarah",
//       lastName: "Johnson",
//       email: "sarah.johnson@medadmin.com",
//       phone: "+1 (555) 123-4567",
//       address: "123 Medical Center Dr, Suite 400, City, State 12345",
//       department: "Cardiology",
//       bio: "Experienced cardiologist with a passion for patient care and a focus on preventive medicine.",
//       matricule: "MJ001",
//       gender: "Female",
//       dateOfBirth: "1980-05-15",
//       emergencyContact: "John Johnson (Husband) - +1 (555) 987-6543",
//     })
//   }
//
//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return <Dashboard />
//       case "patients":
//         return <Patients />
//       case "appointments":
//         return <Appointments />
//       case "prescriptions":
//         return <Prescriptions />
//       case "feedback":
//         return <PatientFeedback />
//       case "settings":
//         return <Settings user={currentUser} onUserUpdate={setCurrentUser} />
//       default:
//         return <Dashboard />
//     }
//   }
//
//   if (!isLoggedIn) {
//     return <Login onLogin={handleLogin} />
//   }
//
//   return (
//     <div className="flex h-screen bg-background overflow-hidden w-full max-w-full">
//       <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} currentUser={currentUser} />
//       <main className="flex-1 overflow-auto w-full max-w-full">
//         <div className="lg:hidden h-16 w-full"></div> {/* Spacer for mobile menu button */}
//         <div className="w-full max-w-full overflow-x-hidden">{renderContent()}</div>
//       </main>
//     </div>
//   )
// }
"use client"
import { useAuth } from "@/contexts/auth-context"
import { usePatientAuth } from "@/components/patient-auth-context"
import { Dashboard } from "@/components/dashboard"
import { PatientHomePage } from "@/components/patient-home-page"
import { WelcomePage } from "@/components/welcome-page"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated: isAdminAuth, isLoading: isAdminLoading } = useAuth()
  const { isAuthenticated: isPatientAuth, isLoading: isPatientLoading } = usePatientAuth()

  if (isAdminLoading || isPatientLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 dark:from-gray-950 dark:to-blue-950">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    )
  }

  // If admin is authenticated, show admin dashboard
  if (isAdminAuth) {
    return <Dashboard />
  }

  // If patient is authenticated, show patient interface
  if (isPatientAuth) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-950 dark:via-blue-950 dark:to-green-950">
          <PatientHomePage />
        </div>
    )
  }

  // If no one is authenticated, show welcome page with choice
  return <WelcomePage />
}
