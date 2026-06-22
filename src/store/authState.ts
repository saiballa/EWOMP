import {create} from "zustand";
import type { AuthStateType } from "../types/type";

const employeeId = localStorage.getItem("userId") || null;
const employeeRole = localStorage.getItem("userRole") || null;

export const AuthState = create<AuthStateType>((set)=>({
        userId: employeeId || null,
        userRole:employeeRole || null,
        loadingState:false,
        isUserLoggedIn:false,
        setAuth( id, role) {
            localStorage.setItem("userRole",role);
            localStorage.setItem("userId",id);
            set(()=>({userId:id,userRole:role,isUserLoggedIn:true}))
        },
        setLoggout() {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            set(()=>({userId:null,userRole:null,isUserLoggedIn:false}));
        },
}))

