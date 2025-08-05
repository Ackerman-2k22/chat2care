// lib/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios'

// Configuration de l'API
const getApiBaseUrl = () => {
  // En production sur Vercel
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://high5-code2care-sr7p.onrender.com' // Remplacez par votre vraie URL API Django
  }

  // En développement local
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }

  // Fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}


const API_BASE_URL = getApiBaseUrl()

console.log('🔗 API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})
// Intercepteur amélioré pour les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Log d'erreur détaillé
    console.error('🚨 API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })

    // Gestion spécifique des erreurs réseau
    if (!error.response) {
      console.error('🌐 Network error - API might be unreachable')
      error.message = 'Erreur de connexion - Vérifiez que l\'API est accessible'
    }

    return Promise.reject(error)
  }
)

// Intercepteur pour les requêtes (debugging)
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('📤 Request Error:', error)
    return Promise.reject(error)
  }
)

// Test de connectivité
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_BASE_URL)
    const response = await api.get('/health/')
    console.log('✅ API Connection successful:', response.data)
    return { success: true, data: response.data }
  } catch (error: any) {
    console.error('❌ API Connection failed:', error)
    return {
      success: false,
      error: error.message,
      details: {
        url: API_BASE_URL,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    }
  }
}

// Export de la configuration
export { API_BASE_URL }

// ======================
// TYPES
// ======================

export interface DashboardOverview {
  overview: {
    total_units: number
    available_units: number
    expired_units: number
    used_units: number
    utilization_rate: number
    expiring_soon: number
    pending_requests: number
    urgent_requests: number
    today_transfusions: number
  }
  stock_by_blood_type: Array<{
    donor__blood_type: string
    count: number
    total_volume: number
  }>
  stock_evolution: Array<{
    date: string
    stock: number
  }>
  last_updated: string
}

export interface Alert {
  id: string
  type: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  blood_type?: string
  count?: number
  unit_id?: string
  days_left?: number
  request_id?: string
  department?: string
  quantity?: number
}

export interface Donor {
  donor_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'M' | 'F'
  blood_type: string
  phone_number: string
  age: number
}

export interface Patient {
  patient_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  blood_type: string
  patient_history: string
  age: number
}

export interface Site {
  site_id: string
  nom: string
  ville: string
}

export interface BloodUnit {
  unit_id: string
  donor: Donor
  donor_name: string
  donor_blood_type: string
  record: string
  collection_date: string
  volume_ml: number
  hemoglobin_g_dl: number | null
  date_expiration: string
  status: 'Available' | 'Reserved' | 'Expired' | 'Used'
  site_name: string
  is_expired: boolean
  days_until_expiry: number
  blood_type: string
}

export interface BloodRequest {
  request_id: string
  department: string
  department_name: string
  site: string
  site_name: string
  blood_type: string
  quantity: number
  priority: 'Routine' | 'Urgent'
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fulfilled'
  request_date: string
}

export interface ForecastResult {
  blood_type: string
  forecast_period_days: number
  method_used: string
  predictions: Array<{
    date: string
    predicted_demand: number
    confidence: number
  }>
  confidence_intervals?: {
    lower: number[]
    upper: number[]
  }
  model_accuracy: {
    accuracy: string
    samples: number
  }
  model_performance?: any
  enhanced_forecasting_available: boolean
  generated_at: string
}

export interface SystemConfig {
  blood_types: string[]
  unit_statuses: string[]
  request_priorities: string[]
  default_expiry_days: number
  minimum_stock_levels: Record<string, number>
  alert_thresholds: {
    low_stock: number
    expiring_soon_days: number
    critical_stock: number
  }
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

// ======================
// API SERVICE
// ======================

export const apiService = {
  // Health Check
  async healthCheck() {
    const response = await api.get('/health/')
    return response.data
  },

  // Dashboard
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await api.get('/dashboard/overview/')
    return response.data
  },

  async getAlerts(): Promise<{ alerts: Alert[]; count: number; last_updated: string }> {
    const response = await api.get('/dashboard/alerts/')
    return response.data
  },

  async acknowledgeAllAlerts() {
    const response = await api.post('/dashboard/alerts/', { action: 'acknowledge_all' })
    return response.data
  },

  async resolveAlert(alertId: string) {
    const response = await api.patch(`/alerts/${alertId}/action/`, { action: 'resolve' })
    return response.data
  },

  // Blood Units
  async getBloodUnits(params?: {
    blood_type?: string
    status?: string
    expiring_days?: number
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<BloodUnit>> {
    const response = await api.get('/inventory/units/', { params })
    return response.data
  },

  // Inventory Analytics
  async getInventoryAnalytics(period: number = 30) {
    const response = await api.get('/analytics/inventory/', {
      params: { period }
    })
    return response.data
  },

  // Donors
  async getDonors(params?: {
    search?: string
    blood_type?: string
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<Donor>> {
    const response = await api.get('/donors/', { params })
    return response.data
  },

  async createDonor(donor: Omit<Donor, 'age'>): Promise<Donor> {
    const response = await api.post('/donors/', donor)
    return response.data
  },

  async updateDonor(donorId: string, donor: Partial<Donor>): Promise<Donor> {
    const response = await api.patch(`/donors/${donorId}/`, donor)
    return response.data
  },

  async deleteDonor(donorId: string): Promise<void> {
    await api.delete(`/donors/${donorId}/`)
  },

  // Patients
  async getPatients(params?: {
    search?: string
    blood_type?: string
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<Patient>> {
    const response = await api.get('/patients/', { params })
    return response.data
  },

  async createPatient(patient: Omit<Patient, 'age'>): Promise<Patient> {
    const response = await api.post('/patients/', patient)
    return response.data
  },

  async updatePatient(patientId: string, patient: Partial<Patient>): Promise<Patient> {
    const response = await api.patch(`/patients/${patientId}/`, patient)
    return response.data
  },

  async deletePatient(patientId: string): Promise<void> {
    await api.delete(`/patients/${patientId}/`)
  },

  // Sites
  async getSites(params?: {
    search?: string
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<Site>> {
    const response = await api.get('/sites/', { params })
    return response.data
  },

  async createSite(site: Site): Promise<Site> {
    const response = await api.post('/sites/', site)
    return response.data
  },

  async updateSite(siteId: string, site: Partial<Site>): Promise<Site> {
    const response = await api.patch(`/sites/${siteId}/`, site)
    return response.data
  },

  async deleteSite(siteId: string): Promise<void> {
    await api.delete(`/sites/${siteId}/`)
  },

  // Blood Requests
  async getBloodRequests(params?: {
    status?: string
    priority?: string
    blood_type?: string
    department?: string
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<BloodRequest>> {
    const response = await api.get('/requests/', { params })
    return response.data
  },

  async createBloodRequest(request: Omit<BloodRequest, 'department_name' | 'site_name'>): Promise<BloodRequest> {
    const response = await api.post('/requests/', request)
    return response.data
  },

  // Forecasting
  async getDemandForecast(params?: {
    blood_type?: string
    days?: number
    method?: string
    lightweight?: boolean
  }): Promise<ForecastResult> {
    const response = await api.get('/forecasting/demand/', { params })
    return response.data
  },

  async getOptimizationRecommendations() {
    const response = await api.get('/forecasting/recommendations/')
    return response.data
  },

  // System Configuration
  async getSystemConfig(): Promise<SystemConfig> {
    const response = await api.get('/config/system/')
    return response.data
  },

  async getBloodCompatibility() {
    const response = await api.get('/config/compatibility/')
    return response.data
  },

  // Data Import
  async importCSVData(file: File) {
    const formData = new FormData()
    formData.append('csv_file', file)

    const response = await api.post('/data/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Reports Export
  async exportReport(params: {
    type: 'inventory' | 'consumption' | 'waste' | 'donors'
    format: 'csv'
  }) {
    const response = await api.get('/reports/export/', {
      params,
      responseType: 'blob'
    })

    // Créer un lien de téléchargement
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${params.type}_report_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return response
  },
}

// ======================
// ERROR HANDLING
// ======================

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Erreur de réponse du serveur
    const status = error.response.status
    const data = error.response.data

    if (status === 400) {
      if (data.error) return data.error
      if (data.message) return data.message
      return 'Données invalides'
    }

    if (status === 401) return 'Non autorisé'
    if (status === 403) return 'Accès interdit'
    if (status === 404) return 'Ressource non trouvée'
    if (status === 422) {
      if (data.detail && Array.isArray(data.detail)) {
        return data.detail.map((d: any) => d.msg).join(', ')
      }
      return 'Erreur de validation'
    }
    if (status === 500) return 'Erreur interne du serveur'

    return `Erreur ${status}: ${data.error || data.message || 'Erreur inconnue'}`
  }

  if (error.request) {
    // Erreur de réseau
    return 'Erreur de connexion au serveur'
  }

  return error.message || 'Erreur inconnue'
}

// ======================
// UTILITY FUNCTIONS
// ======================

export const formatBloodType = (bloodType: string): string => {
  return bloodType || 'N/A'
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('fr-FR')
}

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Available':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'Reserved':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Used':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    case 'Expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'Pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'Fulfilled':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
  }
}

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'Routine':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
  }
}

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'warning':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
  }
}

// ======================
// VALIDATION HELPERS
// ======================

export const validateBloodType = (bloodType: string): boolean => {
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  return validTypes.includes(bloodType)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Format camerounais : +237XXXXXXXXX ou XXXXXXXXX
  const phoneRegex = /^(\+237)?[6-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// ======================
// CACHE HELPERS
// ======================

export const getCacheKey = (endpoint: string, params?: Record<string, any>): string => {
  if (!params) return endpoint

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {} as Record<string, any>)

  return `${endpoint}?${new URLSearchParams(sortedParams).toString()}`
}

// ======================
// WEBSOCKET HELPERS (pour les mises à jour temps réel)
// ======================

export const createWebSocketConnection = (endpoint: string, onMessage?: (data: any) => void) => {
  const wsUrl = API_BASE_URL.replace('http', 'ws') + endpoint
  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log('WebSocket connected to', endpoint)
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage?.(data)
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log('WebSocket disconnected from', endpoint)
  }

  return ws
}

export default apiService