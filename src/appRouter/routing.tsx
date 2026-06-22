import React from "react";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import LayoutPage from "../rootLayout/layout";
import { AuthState } from "../store/authState";
import HomePage from "../components/home/home";
import RegisterEmployeePage from "../components/signup/signup";
import RegisterConfirmPage from "../components/registerConfirm/registerConfirm";
import LoginPage from "../components/login/signin";
import DashboardLayoutPage from "../dashLayout/dashboardLayout";
import DashboardHome from "../components/landingPage/landingPage";
import EmployeeDashboard from "../components/employeeDashboard/employeeDashboard";
import OnBoardingPage from "../components/onboarding/onBoarding";
import CreateOnboardingPage from "../components/createOnboarding/createOnboarding";
import AdminLoginPage from "../components/adminLogin/adminLogin";
import { Navigate } from "react-router-dom";
import DepartmentListPage from "../components/department/departments";
import DepartmentCreatePage from "../components/departmentCreate/departmentCreate";
import EmployessListPage from "../components/employeeList/employeeLits";
import EmployeeCreatePage from "../components/employeeCreate/employeeCreate";
import UpdateDepartMentPage from "../components/updateDepartment/updateDepartment";
import EmployeeAssignTeamPage from "../components/employeeAssignTeam/employeeAssignTeam";
import AuditLogPage from "../components/audit/auditLog";
import WorkforceReports from "../components/workforce/workforceReport";
import TeamsPage from "../components/team/teams";
import EmployeeProfileUpdatePage from "../components/employeeProfileUpdate/employeeProfileUpdate";
import EmployeeHomePage from "../components/employeeHomePage/employeeHomePage";

const AppRouter:React.FC=()=>{

    const userId = AuthState((state)=> state.userId);
    const userRole = AuthState((state)=> state.userRole);

     const PublicRoute = () => {
        return userId && userRole ? (
            <Navigate to="/dashboard" replace />
        ) : (
            <LayoutPage />
        );
    };

    const PrivateRoute = () => {
        return userId && userRole ? (
            <DashboardLayoutPage />
        ) : (
            <Navigate to="/" replace />
        );
    };

const DashboardRedirect = () => {
  if (userRole === "employee") {
    return <Navigate to="/dashboard/employeeHomePage" replace />;
  }

  return <DashboardHome />;
};

const router = createBrowserRouter([
        {
            path:"/",
            element:<PublicRoute/>,
            children:[
                {index:true,element:<HomePage/>},
                {path:"/register",element:<RegisterEmployeePage/>},
                {path:"/confirm",element:<RegisterConfirmPage/>},
                {path:"/login",element:<LoginPage/>},
                {path:"/adminlogin",element:<AdminLoginPage/>},
            ]
        },{
            path:"/dashboard",
            element:<PrivateRoute/>,
            children:[
                {index:true,element:<DashboardRedirect/>},
                {path:"onboarding",element:<OnBoardingPage/>},
                {path:"onboarding/create",element:<CreateOnboardingPage/>},
                {path:"profile",element:<EmployeeDashboard/>},
                {path:"departments",element:<DepartmentListPage/>},
                {path:"departments/create",element:<DepartmentCreatePage/>},
                {path:"employeelist",element:<EmployessListPage/>},
                {path:"employees/create",element:<EmployeeCreatePage/>},
                {path:"departments/update",element:<UpdateDepartMentPage/>},
                {path:"employees/assign",element:<EmployeeAssignTeamPage/>},
                {path:"audit",element:<AuditLogPage/>},
                {path:"workforce",element:<WorkforceReports/>},
                {path:"teams",element:<TeamsPage/>},
                {path:"employeeProfileUpdate/:id",element:<EmployeeProfileUpdatePage/>},
                {path:"employeeHomePage",element:<EmployeeHomePage/>},
            ]
        }
    ])
    

    return(
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRouter;