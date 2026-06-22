import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  database,
  DATABASE_ID,
  EMPLOYEE_ONBOARDING,
} from "../../../utils/appwrite";
import type { Onboarding_Employee } from "../../types/type";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import { UpdateProfile } from "../../store/profile";
import { useNavigate } from "react-router-dom";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { AuthState } from "../../store/authState";
import Swal from "sweetalert2";
ModuleRegistry.registerModules([AllCommunityModule]);

const OnBoardingPage: React.FC = () => {
  const userRole = AuthState((state) => state.userRole);
  const setProfile = UpdateProfile((state) => state.setProfile);
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["onboard"],
    queryFn: async () => {
      const response = await database.listDocuments<Onboarding_Employee>(
        DATABASE_ID,
        EMPLOYEE_ONBOARDING,
      );
      return response;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 3,
  });
  const navigate = useNavigate();
  function isCreateDisabled(status: boolean, profileStatus: boolean) {
    return !status || profileStatus;
  }

  function getButtonText(profileStatus: boolean) {
    return profileStatus ? "Created" : "Create";
  }

  const columnDefs = [
    {
      headerName: "Employee Id",
      field: "userId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Employee Name",
      field: "userName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Employee Email",
      field: "userEmail",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Employee Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        return params.value ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Created
          </span>
        ) : (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Pending
          </span>
        );
      },
    },
    {
      headerName: "Employee Profile creation status",
      field: "profileStatus",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        return params.value ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Created
          </span>
        ) : (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Pending
          </span>
        );
      },
    },
    {
      headerName: "Action",
      field: "status",
      cellRenderer: (params: any) => (
        <button
          onClick={() => {
            if (userRole === "admin" || userRole === "hr") {
              setProfile(
                params.data.userId,
                params.data.userName,
                params.data.userEmail,
                params.data.$id,
              );
              navigate("/dashboard/employees/create");
            }else {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "This employee already has an onboarding request.",
                confirmButtonText: "OK",
              });
            }
          }}
          disabled={isCreateDisabled(
            params.data.status,
            params.data.profileStatus,
          )}
          className={`
        rounded-lg
        px-4
        py-2
        text-sm
        font-medium
        transition
        ${
          isCreateDisabled(params.data.status, params.data.profileStatus)
            ? "cursor-not-allowed bg-slate-300 text-slate-500"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }
      `}
        >
          {getButtonText(params.data.profileStatus)}
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (isError) {
    return <ErrorMessage message={"Something went wrong at fetching"} />;
  }

  return (
    <>
      <div className="space-y-6 p-3 sm:p-4 md:p-6 pt-10 md:pt-4">

  {/* Page Header */}
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
      Employee Onboarding
    </h1>

    <p className="mt-2 text-sm text-slate-600">
      Manage onboarding requests and employee registration workflow.
    </p>
  </div>

  {/* Table Card */}
  <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm">

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 px-4 sm:px-6 py-4">

      <div>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Onboarding Requests
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View and track employee onboarding progress.
        </p>
      </div>

      {isFetching && (
        <div className="self-start flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Refreshing...
        </div>
      )}
    </div>

    <div
      className="overflow-x-auto"
      style={{ height: 500 }}
    >
      <div className="min-w-[750px] h-full">
        <AgGridReact
          theme={themeQuartz}
          rowData={data?.documents ?? []}
          columnDefs={columnDefs}
        />
      </div>
    </div>

  </div>

  {/* Action Card */}
  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">

    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 sm:p-6 md:p-8">

      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
        Employee Management
      </span>

      <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-bold text-white">
        Create New Onboarding Request
      </h2>

      <p className="mt-3 text-sm text-indigo-100 max-w-2xl">
        Start the onboarding process for a new employee. Create requests,
        collect employee information, and manage approvals from a single place.
      </p>

    </div>

    <div className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">

      <div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
          Ready to onboard a new employee?
        </h3>

        <p className="mt-1 text-sm text-slate-600">
          Create a new onboarding request and begin the employee setup process.
        </p>
      </div>

      <button
        onClick={() => {
          if (userRole === "admin" || userRole === "hr") {
            navigate("/dashboard/onboarding/create");
          } else {
            Swal.fire({
              icon: "warning",
              title: "Warning",
              text: "This employee already has an onboarding request.",
              confirmButtonText: "OK",
            });
          }
        }}
        className="
          w-full
          md:w-auto
          inline-flex
          items-center
          justify-center
          rounded-xl
          bg-indigo-600
          px-6
          py-3
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-indigo-700
        "
      >
        + Create Onboarding
      </button>

    </div>

  </div>

</div>
    </>
  );
};

export default OnBoardingPage;
