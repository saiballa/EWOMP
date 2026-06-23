import { Client,Account,Databases,Storage,ID } from "appwrite";

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);

const database = new Databases(client);

const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
export const EMPLOYEE_LIST = import.meta.env.VITE_APPWRITE_EMPLOYEE_LIST;
export const DEPARTMENT_LIST=import.meta.env.VITE_APPWRITE_DEPARTMENT_LIST;
export const EMPLOYEE_ONBOARDING = import.meta.env.VITE_APPWRITE_ONBOARDING;
export const AUDIT_LOGS= import.meta.env.VITE_APPWRITE_AUDITLogs;
export const ADMIN_TABLE=import.meta.env.VITE_APPWRITE_ADMIN_TABLE;



export {ID,account,database,storage}