import type { Models } from "appwrite";

export interface AuthStateType{
    userId:string | null;
    loadingState:boolean;
    userRole:string | null;
    isUserLoggedIn:boolean;
    setAuth:(id:string,role:string)=> void;
    setLoggout:()=> void;
}

export interface EmployeListType extends Models.Document{
    name:string;
    email:string;
    role:string;
    employeeId:string;
}

export interface EmployeeProfileType extends Models.Document{
    employeeId:string;
    name:string ;
    email:string;
    phone:string;
    gender:string;
    dob:string;
    address:string;
    team:string;
    designation:string;
    departmentId:string;
    managerId:string;
    status:string;
    profilePic:string;
    role:string;
}

export interface ProfileSetup{
    OnBoardingprofileId:string | null;
    OnBoardingprofileName:string | null;
    OnBoardingprofilEmail:string | null;
    onBoardingDocId:string| null;
    departmentManagerAssign:string | null;
    employeeAssignId:string | null;
    setProfile:(id:string,name:string,email:string,docId:string)=> void;
    setDepartmentManager:(id:string)=>void;
    setEmployeeId:(id:string)=> void;
}

export interface Onboarding_Employee extends Models.Document{
    userId:string;
    userName:string;
    userEmail:string;
    status:boolean;
    profileStatus:boolean;
}

export interface AdminLogType extends Models.Document{
    name:string;
    email:string;
}

export interface DepartMentType extends Models.Document{
    name:string;
    description:string;
    managerId:string | null;
    status:boolean;
}


export interface SweetAlertProps{
    confirm:()=> void,
    cancel:()=> void,
    title:string,
    type:"warning" | "info" | "error" | "success";
}

export interface AuditLogType extends Models.Document{
    description:string;
    actionBy:string;
}