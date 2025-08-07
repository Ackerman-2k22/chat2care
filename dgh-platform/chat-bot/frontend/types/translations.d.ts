declare module "*.json" {
  const value: any
  export default value
}

// Types pour les traductions
export interface TranslationMessages {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    close: string
    confirm: string
    back: string
    next: string
    previous: string
    search: string
    clear: string
    download: string
    upload: string
    send: string
    language: string
  }
  auth: {
    login: string
    logout: string
    email: string
    password: string
    loginButton: string
    loginError: string
    loginSuccess: string
    welcome: string
  }
  chat: {
    newMessage: string
    typeMessage: string
    sendMessage: string
    voiceInput: string
    stopVoice: string
    startVoice: string
    voiceNotSupported: string
    attachments: string
    fileUpload: string
    suggestions: string
    healthBreakfast: string
    sleepQuality: string
    backPain: string
    stressManagement: string
    balancedDiet: string
    meditationBenefits: string
    syncing: string
    syncError: string
    syncSuccess: string
    retry: string
    noMessages: string
    thinking: string
    messageError: string
  }
  conversations: {
    title: string
    newConversation: string
    renameConversation: string
    deleteConversation: string
    deleteConfirm: string
    noConversations: string
    searchConversations: string
    lastMessage: string
    created: string
    updated: string
  }
  files: {
    title: string
    uploadFile: string
    downloadFile: string
    deleteFile: string
    fileType: string
    fileSize: string
    uploadDate: string
    noFiles: string
    imagePreview: string
    documentPreview: string
    fileTooLarge: string
    unsupportedFileType: string
  }
  sidebar: {
    menu: string
    conversations: string
    files: string
    settings: string
    help: string
    about: string
    toggleSidebar: string
  }
  settings: {
    title: string
    theme: string
    language: string
    notifications: string
    privacy: string
    account: string
    darkMode: string
    lightMode: string
    systemMode: string
    french: string
    english: string
  }
  errors: {
    networkError: string
    serverError: string
    timeoutError: string
    unknownError: string
    tryAgain: string
    contactSupport: string
  }
}

