import {create} from "zustand";
import type { ProfileSetup } from "../types/type";

export const UpdateProfile = create<ProfileSetup>((set)=>({
    OnBoardingprofileId:null,
    OnBoardingprofilEmail:null,
    OnBoardingprofileName:null,
    onBoardingDocId:null,
    departmentManagerAssign:null,
    employeeAssignId:null,
    setProfile(id:string,name:string,email:string,docId:string) {
        set(()=>({OnBoardingprofileId:id,OnBoardingprofileName:name,OnBoardingprofilEmail:email,onBoardingDocId:docId}));
    },
    setDepartmentManager(id:string) {
        set(()=>({departmentManagerAssign:id}))
    },
    setEmployeeId(id) {
        set(()=>({employeeAssignId:id}));
    },

}))