import React from "react";
import { useQuery } from "@tanstack/react-query";
import { database,DATABASE_ID,EMPLOYEE_ONBOARDING,EMPLOYEE_LIST,DEPARTMENT_LIST,AUDIT_LOGS } from "../../../utils/appwrite";
import type { EmployeeProfileType,AuditLogType,DepartMentType,Onboarding_Employee } from "../../types/type";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { Link } from "react-router-dom";
import { Query } from "appwrite";

const DashboardHome:React.FC = () => {

  const { data: employees,isLoading,isError } = useQuery({
  queryKey: ["employees"],
  queryFn: async()=>{
    const response = await database.listDocuments<EmployeeProfileType>(DATABASE_ID,EMPLOYEE_LIST);
    return response;
}
});

const activeEmployess = employees?.documents.filter((item)=> item.status === "active");

const { data: departments } = useQuery({
  queryKey: ["departments"],
  queryFn:  async()=>{
    const response = await database.listDocuments<DepartMentType>(DATABASE_ID,DEPARTMENT_LIST);
    return response;
}
});

const { data: onboarding } = useQuery({
  queryKey: ["onboarding"],
  queryFn:  async()=>{
    const response = await database.listDocuments<Onboarding_Employee>(DATABASE_ID,EMPLOYEE_ONBOARDING);
    return response;
}
});

const pendingOnboardingEmployess = onboarding?.documents?.filter((item)=> item.profileStatus !== true);

const { data: auditLogs } = useQuery({
  queryKey: ["auditlogs"],
  queryFn: async()=>{
    const response = await database.listDocuments<AuditLogType>(DATABASE_ID,AUDIT_LOGS,[Query.limit(100)]); 
    return response;
}
});

const listOfAuditLogs = auditLogs?.documents.slice(-5);

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Can't able to fetch data from server,Something went wrong!" />
    );
  }

  return (
   <div className="space-y-6">

  {/* Header */}
  <div className="flex flex-col gap-2 sm:mt-5">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
      Dashboard
    </h1>

    <p className="text-sm sm:text-base text-slate-500">
      Welcome back. Here's an overview of your workforce and recent activity.
    </p>
  </div>

  {/* KPI Cards */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500">
        Total Employees
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-800">
        {employees?.documents?.length ?? 0}
      </h2>
    </div>

    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500">
        Active Employees
      </p>

      <h2 className="mt-2 text-3xl font-bold text-green-600">
        {activeEmployess?.length ?? 0}
      </h2>
    </div>

    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500">
        Pending Onboarding
      </p>

      <h2 className="mt-2 text-3xl font-bold text-orange-500">
        {pendingOnboardingEmployess?.length ?? 0}
      </h2>
    </div>

    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500">
        Departments
      </p>

      <h2 className="mt-2 text-3xl font-bold text-indigo-600">
        {departments?.documents?.length ?? 0}
      </h2>
    </div>

  </div>

  {/* Main Section */}
  <div className="grid gap-6 lg:grid-cols-3">

    {/* Quick Actions */}
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">

      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Quick Actions
      </h2>

      <div className="grid gap-3">

        <button className="rounded-xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700">
         <Link to={"/dashboard/employeelist"}>Employees List</Link>
        </button>

        <button className="rounded-xl bg-green-600 px-4 py-3 text-white transition hover:bg-green-700">
          <Link to={"/dashboard/onboarding"}>Start Onboarding</Link>
        </button>

        <button className="rounded-xl bg-slate-800 px-4 py-3 text-white transition hover:bg-slate-900">
          <Link to={"/dashboard/departments"}>Manage Departments</Link>
        </button>

      </div>
    </div>

    {/* Recent Activity */}
    <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm border border-slate-100">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Activity
        </h2>

        <span className="text-xs text-slate-500">
          Latest Audit Logs
        </span>
      </div>

      <div className="space-y-3">

        {listOfAuditLogs?.length ? (
          listOfAuditLogs.slice(0, 5).map((log) => (
            <div
              key={log.$id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-800">
                {log.description}
              </p>

              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:justify-between">
                <span>
                  Action By: {log.actionBy}
                </span>

                <span>
                  {new Date(log.$createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
            <p className="text-slate-500">
              No recent activity available.
            </p>
          </div>
        )}

      </div>

    </div>

  </div>
</div>
  );
};

export default DashboardHome;