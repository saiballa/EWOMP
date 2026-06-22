import React from "react";
import { useQuery } from "@tanstack/react-query";
import { database, DATABASE_ID, AUDIT_LOGS } from "../../../utils/appwrite";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import type { AuditLogType } from "../../types/type";
import { Query } from "appwrite";

const AuditLogPage: React.FC = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["auditlogs"],
    queryFn: async () => {
      const response = await database.listDocuments<AuditLogType>(
        DATABASE_ID,
        AUDIT_LOGS,
        [Query.limit(100)]
      );
      return response;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 3,
  });

  const todaysActivities = () => {
  if (!data?.documents) return 0;
  const now = new Date();
  return data.documents.reduce((num, doc) => {
    const createdDate = new Date(doc.$createdAt);
    const isSameDay =
      createdDate.getDate() === now.getDate() &&
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear();

    return isSameDay ? num + 1 : num;
  }, 0);
};

  const columnDefs = [
    {
      headerName: "Description",
      field: "description",
      flex: 3,
    },
    {
      headerName: "Action By",
      field: "actionBy",
      flex: 1.5,
    },
    {
      headerName: "Created At",
      field: "$createdAt",
      flex: 1.5,
      valueFormatter: (params: any) => new Date(params.value).toLocaleString(),
    },
  ];

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Can't able to fetch data from server,Something went wrong!" />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-3 py-4 sm:p-4 md:p-6 pt-20 md:pt-6">

  {/* Header */}
  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
        Audit Logs
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Track and monitor all workforce, department, and administrative
        activities.
      </p>
    </div>

    {isFetching && (
      <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 w-fit">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />

        <span className="text-sm font-medium text-indigo-600">
          Refreshing...
        </span>
      </div>
    )}

  </div>

  {/* Stats */}
  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Total Logs
      </p>

      <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-800">
        {data?.documents.length || 0}
      </h3>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Today's Activities
      </p>

      <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-indigo-600">
        {todaysActivities()}
      </h3>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        System Events
      </p>

      <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600">
        Active
      </h3>
    </div>

  </div>

  {/* Table Card */}
  <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 md:p-5 shadow-sm">

    <div className="mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-slate-800">
        Activity History
      </h2>

      <p className="text-sm text-slate-500">
        Complete record of actions performed across the platform.
      </p>
    </div>

    <div className="overflow-x-auto">

      <div
        className="ag-theme-alpine min-w-[700px]"
        style={{
          height: "600px",
          width: "100%",
        }}
      >
        <AgGridReact
          theme={themeQuartz}
          rowData={data?.documents}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
        />
      </div>

    </div>

  </div>

</div>
    </>
  );
};

export default AuditLogPage;
