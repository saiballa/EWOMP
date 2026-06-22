interface ImportMetaEnv{
   readonly  VITE_APPWRITE_ENDPOINT:string
   readonly  VITE_APPWRITE_PROJECT:string
   readonly VITE_APPWRITE_DATABASE:string
   readonly VITE_APPWRITE_BUCKET_ID:string
   readonly VITE_APPWRITE_EMPLOYEE_LIST:string
   readonly VITE_APPWRITE_DEPARTMENT_LIST:string
   readonly VITE_APPWRITE_ONBOARDING:string
   readonly VITE_APPWRITE_AUDITLogs:string
   readonly VITE_APPWRITE_ADMIN_TABLE:string
   readonly VITE_APPWRITE_EMPLOYEE_LIFECYCLE:string
}

interface ImportMeta{
    readonly env: ImportMetaEnv
}