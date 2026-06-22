import React from "react";  
import {Doughnut,Bar,Line} from "react-chartjs-2";
import { database,DATABASE_ID,EMPLOYEE_ONBOARDING,EMPLOYEE_LIST,DEPARTMENT_LIST,AUDIT_LOGS } from "../../../utils/appwrite";
import type { EmployeeProfileType,AuditLogType,Onboarding_Employee,DepartMentType } from "../../types/type";
import "../../charts/chartConfig";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";

const WorkforceReports:React.FC = () => {

    const { data: employees } = useQuery({
  queryKey: ["employees"],
  queryFn: async()=>{
    const response = await database.listDocuments<EmployeeProfileType>(DATABASE_ID,EMPLOYEE_LIST);
    return response;
}
});

const activeCount = employees?.documents.filter(emp => emp.status === "active").length ?? 0;
const probationCount =employees?.documents.filter(emp => emp.status === "probation").length ?? 0;
const inactiveCount =employees?.documents.filter(emp => emp.status === "inactive").length ?? 0;
const terminatedCount = employees?.documents.filter(emp => emp.status === "terminated").length ?? 0;

const { data: departments } = useQuery({
  queryKey: ["departments"],
  queryFn:  async()=>{
    const response = await database.listDocuments<DepartMentType>(DATABASE_ID,DEPARTMENT_LIST);
    return response;
}
});

const departmentCounts =
  departments?.documents.map((dept) => ({
    name: dept.name,
    count:
      employees?.documents.filter(
        (emp) => emp.departmentId === dept.name
      ).length ?? 0,
  })) ?? [];

  console.log(departmentCounts)

const { data: onboarding } = useQuery({
  queryKey: ["onboarding"],
  queryFn:  async()=>{
    const response = await database.listDocuments<Onboarding_Employee>(DATABASE_ID,EMPLOYEE_ONBOARDING);
    return response?.documents;
}
});

const { data: auditLogs } = useQuery({
  queryKey: ["auditLogs"],
  queryFn: async()=>{
    const response = await database.listDocuments<AuditLogType>(DATABASE_ID,AUDIT_LOGS,[Query.limit(100)]);
    return response?.documents;
}
});



const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "#E2E8F0",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};


const employeeStatusData = {
  labels: ["Active", "Probation", "Inactive", "Terminated"],
  datasets: [
    {
      data: [activeCount,inactiveCount,probationCount,terminatedCount],
      backgroundColor: [
        "#22c55e",
        "#eab308",
        "#64748b",
        "#ef4444",
      ],
    },
  ],
};

const departmentData = {
  labels: departmentCounts.map((d) => d.name),

  datasets: [
    {
      label: "Employees",
      data: departmentCounts.map((d) => d.count),

      backgroundColor: [
        "#6366F1",
        "#8B5CF6",
        "#06B6D4",
        "#10B981",
        "#F59E0B",
      ],

      borderRadius: 8,
    },
  ],
};

const onboardingData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ],
  datasets: [
    {
       label: "New Employees",
      data: [5, 8, 12, 9, 15, 18],
      borderColor: "#6366F1",
      backgroundColor: "rgba(99,102,241,0.2)",
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
};

const auditLogData = {
  labels: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ],
  datasets: [
    {
      label: "Audit Events",
      data: [15, 23, 18, 30, 28, 10, 5],
      backgroundColor: "#0EA5E9",
      borderRadius: 8,
    },
  ],
};


  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:p-4 md:p-6 pt-20 md:pt-6">

  {/* Header */}
  <div className="mb-6">
    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
      Workforce Reports
    </h1>

    <p className="mt-2 text-sm text-slate-600">
      Workforce analytics and operational insights.
    </p>
  </div>

  {/* KPI Cards */}
  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Total Employees
      </p>

      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
        {employees?.documents.length}
      </h2>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Departments
      </p>

      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-indigo-600">
        {departments?.documents.length}
      </h2>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Onboardings
      </p>

      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600">
        {onboarding?.length}
      </h2>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Audit Logs
      </p>

      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-amber-600">
        {auditLogs?.length}
      </h2>
    </div>

  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

    {/* Employee Status */}
    <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

      <h2 className="mb-4 text-base sm:text-lg font-bold text-slate-800">
        Employee Status Distribution
      </h2>

      <div className="mx-auto h-[250px] sm:h-[320px] max-w-sm">
        <Doughnut
          data={employeeStatusData}
          options={{
            ...chartOptions,
            maintainAspectRatio: false,
          }}
        />
      </div>

    </div>

    {/* Department Distribution */}
    <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

      <h2 className="mb-4 text-base sm:text-lg font-bold text-slate-800">
        Department Distribution
      </h2>

      <div className="h-[250px] sm:h-[320px]">
        <Bar
          data={departmentData}
          options={{
            ...chartOptions,
            maintainAspectRatio: false,
          }}
        />
      </div>

    </div>

    {/* Onboarding Trend */}
    <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

      <h2 className="mb-4 text-base sm:text-lg font-bold text-slate-800">
        Monthly Onboarding Trend
      </h2>

      <div className="h-[250px] sm:h-[320px]">
        <Line
          data={onboardingData}
          options={{
            ...chartOptions,
            maintainAspectRatio: false,
          }}
        />
      </div>

    </div>

    {/* Audit Activity */}
    <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

      <h2 className="mb-4 text-base sm:text-lg font-bold text-slate-800">
        Audit Activity
      </h2>

      <div className="h-[250px] sm:h-[320px]">
        <Bar
          data={auditLogData}
          options={{
            ...chartOptions,
            maintainAspectRatio: false,
          }}
        />
      </div>

    </div>

  </div>

</div>
  );
};

export default WorkforceReports;