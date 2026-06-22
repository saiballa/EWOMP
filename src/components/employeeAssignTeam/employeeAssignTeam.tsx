import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  database,
  DATABASE_ID,
  DEPARTMENT_LIST,
  EMPLOYEE_LIST,
  AUDIT_LOGS,
  ID,
} from "../../../utils/appwrite";
import type { DepartMentType, EmployeeProfileType } from "../../types/type";
import {
  EmployeeAssignTask,
  type EmployeeAssignTaskType,
} from "../../validation/validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthState } from "../../store/authState";
import { useNavigate } from "react-router-dom";
import { UpdateProfile } from "../../store/profile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const EmployeeAssignTeamPage: React.FC = () => {
  const [employeeDetails,setEmployeeDeatils] = useState<EmployeeProfileType | null>(null);
  const employeeAssignId = UpdateProfile((state) => state.employeeAssignId);
  const userRole = AuthState((state) => state.userRole);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  console.log(employeeDetails);
  const { data } = useQuery({
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

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<EmployeeAssignTaskType>({
    defaultValues: {
      managerId:"",
      teamId:"",
    },
    resolver: yupResolver(EmployeeAssignTask),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: EmployeeAssignTaskType) => {
      if (!employeeDetails?.$id) return;

      await database.updateDocument(
        DATABASE_ID,
        EMPLOYEE_LIST,
        employeeDetails?.$id,
        {
          managerId: data.managerId,
          team: data.teamId,
          status:data.status,
        },
      );
    },
    onSuccess: async () => {
      await database.createDocument(DATABASE_ID, AUDIT_LOGS, ID.unique(), {
        description: `${userRole} is assigned employee team and manager`,
        actionBy: userRole,
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee assigned team complete sucessfully");
      navigate("/dashboard/employeelist");
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const UPdateEmployeeDetails: SubmitHandler<EmployeeAssignTaskType> = (
    data,
  ) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    const fetchEmployeeDeatils = async () => {
      if (!employeeAssignId) return;
      const response = await database.getDocument<EmployeeProfileType>(
        DATABASE_ID,
        EMPLOYEE_LIST,
        employeeAssignId,
      );
      setEmployeeDeatils(response);
    };
    fetchEmployeeDeatils();
  }, []);

  useEffect(() => {
  if (employeeDetails) {
    reset({
      managerId: employeeDetails.managerId || "",
      teamId: employeeDetails.team || "",
    });
  }
}, [employeeDetails, reset]);

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16 md:pt-6 px-3 sm:px-4 md:px-6 pb-6">
  <div className="mx-auto max-w-6xl space-y-6">

    {/* Department Section */}
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Departments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View department manager assignments.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 sm:py-3 text-left text-sm font-semibold text-slate-700">
                Department
              </th>
              <th className="py-2 sm:py-3 text-left text-sm font-semibold text-slate-700">
                Manager
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.documents.map((department) => (
              <tr key={department.$id} className="border-b border-slate-100">
                <td className="py-3 sm:py-4 font-medium text-slate-800">
                  {department.name}
                </td>
                <td className="py-3 sm:py-4 text-slate-600">
                  {department.managerId || "Not Assigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Assignment Form */}
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Employee Task Assignment
        </h1>

        <p className="mt-2 text-sm sm:text-base text-blue-100">
          Assign reporting manager, team and status for employees.
        </p>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 md:p-10">
        <form className="space-y-5" onSubmit={handleSubmit(UPdateEmployeeDetails)}>

          {/* Manager */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employee Manager
            </label>

            <input
              type="text"
              {...register("managerId")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 sm:px-4 sm:py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              placeholder="Manager ID"
            />

            {errors.managerId?.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.managerId.message}
              </p>
            )}
          </div>

          {/* Team */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employee Team
            </label>

            <input
              type="text"
              {...register("teamId")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 sm:px-4 sm:py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              placeholder="Team Name"
            />

            {errors.teamId?.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.teamId.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employee Status
            </label>

            <select
              {...register("status")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 sm:px-4 sm:py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
            </select>

            {errors.status?.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full rounded-xl py-3 sm:py-4 font-semibold text-white transition ${
              mutation.isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {mutation.isPending ? "Assigning..." : "Assign Employee"}
          </button>

        </form>
      </div>
    </div>

  </div>
</div>
    </>
  );
};

export default EmployeeAssignTeamPage;
