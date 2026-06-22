import React,{useState} from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import {
  database,
  DATABASE_ID,
  DEPARTMENT_LIST,
} from "../../../utils/appwrite";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import type { DepartMentType } from "../../types/type";
import { AuthState } from "../../store/authState";
import { UpdateProfile } from "../../store/profile";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import SweetAlertComponent from "../sweetAlert/warning";

const DepartmentListPage: React.FC = () => {
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const userRole = AuthState((state) => state.userRole);
  const queryClient = useQueryClient();
  const setDepartmentManager = UpdateProfile(
    (state) => state.setDepartmentManager,
  );
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["department"],
    queryFn: async () => {
      const response = await database.listDocuments<DepartMentType>(
        DATABASE_ID,
        DEPARTMENT_LIST,
      );
      return response;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 3,
  });

  const mutation = useMutation({
    mutationFn:async(id:string)=>{
      await database.deleteDocument(DATABASE_ID,DEPARTMENT_LIST,id);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["department"]});
      toast.success("Employee delete operation is successful");
    },
    onError:(error:any)=>{
      toast.error(error?.message || "Employee delete operation is unsuccessful,something went wrong!")
    }
  })

  const deleteDepartmentFun=()=>{
    mutation.mutate(deleteDepartmentId);
  }

  const columnDefs = [
    {
      headerName: "Department Name",
      field: "name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department Description",
      field: "description",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department Manager",
      field: "managerId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department status",
      field: "status",
      cellRenderer: (params: any) => {
        return params.value ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        ) : (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Unactive
          </span>
        );
      },
    },
    {
      headerName: "Department manager assign",
      cellRenderer: (params: any) => {
        return(
          <button className="rounded-lg
          bg-emerald-600
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          transition
          hover:bg-emerald-700
          hover:shadow-md"
          onClick={() => {
            if (userRole === "admin" || userRole === "hr") {
              setDepartmentManager(params.data.$id);
              navigate("/dashboard/departments/update");
            } else {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "This employee already has an onboarding request.",
                confirmButtonText: "OK",
              });
            }
          }}
        >{params.data.managerId ? "Update Manager" : "Assign Manager"}</button>
        )
      },
    },
    {
      headerName:"Delete department",
      cellRenderer:(params:any)=>(
        <button
          className="
          rounded-lg
          bg-red-500
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          transition
          hover:bg-red-600
          hover:shadow-md"
          onClick={() => {
            if (userRole === "admin") {
                setDeleteDepartmentId(params?.data?.$id);
                setIsDelete(true);
            } else {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "This employee already has an onboarding request.",
                confirmButtonText: "OK",
              });
            }
          }}
        >Delete department</button>
      )
    }
  ];

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Department list can't be able to fetch,something went wrong!" />
    );
  }

  return (
    <>
      <div className="space-y-6 p-3 sm:p-4 md:p-6 pt-6 md:pt-4">
  {/* Page Header */}
  <div className="flex flex-col gap-2">
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
      Department Management
    </h1>

    <p className="text-sm text-slate-600">
      View, manage, and organize departments across the organization.
    </p>
  </div>

  {/* Department Table */}
  <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Department List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            All available departments in the organization.
          </p>
        </div>

        {isFetching && (
          <div className="self-start rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
            Refreshing...
          </div>
        )}
      </div>
    </div>

    <div
      className="overflow-x-auto"
      style={{ height: 500 }}
    >
      <div className="min-w-[700px] h-full">
        <AgGridReact
          theme={themeQuartz}
          rowData={data?.documents || []}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  </div>

  {/* Action Card */}
  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Department Administration
          </span>

          <h2 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900">
            Create New Department
          </h2>

          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Add a new department to your organization and assign teams,
            managers, and reporting structures.
          </p>
        </div>

        <button
          onClick={() => {
            if (userRole === "admin") {
              navigate("/dashboard/departments/create");
            } else {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Only administrators can create departments.",
                confirmButtonText: "OK",
              });
            }
          }}
          className="
            w-full
            lg:w-auto
            inline-flex
            items-center
            justify-center
            rounded-xl
            bg-emerald-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-emerald-700
          "
        >
          + Create Department
        </button>

      </div>
    </div>
  </div>

  {isDelete && (
    <SweetAlertComponent
      confirm={deleteDepartmentFun}
      cancel={() => setIsDelete(false)}
      title="Are you sure"
      type="warning"
    />
  )}
</div>
    </>
  );
};

export default DepartmentListPage;
