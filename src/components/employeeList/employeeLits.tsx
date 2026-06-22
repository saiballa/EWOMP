import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  database,
  DATABASE_ID,
  EMPLOYEE_LIST,
  EMPLOYEE_ONBOARDING,
  AUDIT_LOGS,
  ID,
} from "../../../utils/appwrite";
import type { EmployeeProfileType } from "../../types/type";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import { AuthState } from "../../store/authState";
import { UpdateProfile } from "../../store/profile";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Query } from "appwrite";
import SweetAlertComponent from "../sweetAlert/warning";

const EmployessListPage: React.FC = () => {
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const userRole = AuthState((state) => state.userRole);
  const setEmployeeId = UpdateProfile((state) => state.setEmployeeId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onBoardingEmployeeId = useRef<string | null>(null);
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await database.listDocuments<EmployeeProfileType>(
        DATABASE_ID,
        EMPLOYEE_LIST,
      );
      return response;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 3,
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await database.deleteDocument(DATABASE_ID, EMPLOYEE_LIST, id);
    },
    onSuccess: async () => {
      if (!onBoardingEmployeeId.current) return;

      const response = await database.listDocuments(
        DATABASE_ID,
        EMPLOYEE_ONBOARDING,
        [Query.equal("userId", onBoardingEmployeeId.current)],
      );

      await database.deleteDocument(
        DATABASE_ID,
        EMPLOYEE_ONBOARDING,
        response.documents[0].$id,
      );

      await database.createDocument(DATABASE_ID, AUDIT_LOGS, ID.unique(), {
        description: `${userRole} is deleted a employee successfully!`,
        actionBy: userRole,
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["onboard"] });
      toast.success("Employee deleted sucessfully");
    },
    onError:(error:any)=>{
      toast.error(error?.message || "Employee delete operation is unsuccessful,something went wrong!")
    }
  });

  const deleteEmployee = () => {
    mutation.mutate(deleteId);
  };

  const columnDefs = [
    {
      headerName: "Employee ID",
      field: "employeeId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Employee Designation",
      field: "designation",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department",
      field: "departmentId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Manager",
      field: "managerId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Team",
      field: "team",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Role",
      field: "role",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => {
        const status = params?.data?.status;

        const statusStyles: Record<string, string> = {
          active: "bg-green-100 text-green-700",
          probation: "bg-yellow-100 text-yellow-700",
          on_leave: "bg-blue-100 text-blue-700",
          inactive: "bg-gray-100 text-gray-700",
          resigned: "bg-orange-100 text-orange-700",
          terminated: "bg-red-100 text-red-700",
        };

        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusStyles[status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {status?.replace("_", " ")}
          </span>
        );
      },
    },
    {
      headerName: "Assign team&Manager",
      cellRenderer: (params: any) => (
        <button
          disabled={params.data.role === "admin"}
          onClick={() => {
            if (userRole === "admin" || userRole === "hr") {
              setEmployeeId(params.data.$id);
              navigate("/dashboard/employees/assign");
            } else {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Admin or Hr has the authority to do this action!.",
                confirmButtonText: "OK",
              });
            }
          }}
          className={`
  rounded-lg
  px-4
  py-2
  text-sm
  font-medium
  shadow-sm
  transition-all
  duration-200
  ${
    params.data.role === "admin"
      ? "cursor-not-allowed bg-slate-300 text-slate-500"
      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
  }
`}
        >
          {params?.data?.managerId ? "Update" : "Assign"}
        </button>
      ),
    },
    {
      headerName: "Delete employee",
      cellRenderer: (params: any) => (
        <button
          disabled={params.data.role === "admin"}
          onClick={() => {
            if (userRole === "admin" || userRole === "hr") {
              onBoardingEmployeeId.current = params?.data?.employeeId;
              setDeleteId(params?.data?.$id);
              setIsDelete(true);
            } else {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "This action can only perform by Admin or Hr",
                confirmButtonText: "OK",
              });
            }
          }}
          className={`
    rounded-lg
    px-4
    py-2
    text-sm
    font-medium
    shadow-sm
    transition-all
    duration-200
    ${
      params.data.role === "admin"
        ? "cursor-not-allowed bg-slate-300 text-slate-500"
        : "bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-95"
    }
  `}
        >
          Delete employee
        </button>
      ),
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
      <div className="space-y-4">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Employee Directory
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            View, manage, and organize all employees across the organization.
          </p>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Employee List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Browse employee profiles, departments, and roles.
              </p>
            </div>

            {isFetching && (
              <div className="flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                Refreshing...
              </div>
            )}
          </div>

          {/* AG Grid */}
          <div
            className="ag-theme-quartz w-full overflow-x-auto"
            style={{ height: "650px" }}
          >
            <AgGridReact
              theme={themeQuartz}
              rowData={data?.documents ?? []}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>
      </div>
      {isDelete && (
        <SweetAlertComponent
          confirm={deleteEmployee}
          cancel={() => setIsDelete(false)}
          title="Are you sure?"
          type="warning"
        />
      )}
    </>
  );
};

export default EmployessListPage;
