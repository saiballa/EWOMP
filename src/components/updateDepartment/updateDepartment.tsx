import React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  database,
  DATABASE_ID,
  DEPARTMENT_LIST,
  AUDIT_LOGS,
  ID,
} from "../../../utils/appwrite";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  DepartUpdateValidation,
  type DepartmentUpdateType,
} from "../../validation/validate";
import { UpdateProfile } from "../../store/profile";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AuthState } from "../../store/authState";
import { useNavigate } from "react-router-dom";

const UpdateDepartMentPage: React.FC = () => {
    console.log("department updated");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userRole = AuthState((state) => state.userRole);
  const departmentManagerAssign = UpdateProfile(
    (state) => state.departmentManagerAssign
  );
  console.log(departmentManagerAssign);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<DepartmentUpdateType>({
    defaultValues: {
      departmentManager: "",
    },
    resolver: yupResolver(DepartUpdateValidation),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: DepartmentUpdateType) => {
      if (!departmentManagerAssign) return;
      const response = await database.updateDocument(
        DATABASE_ID,
        DEPARTMENT_LIST,
        departmentManagerAssign,
        {
            managerId:data.departmentManager
        },
      );
      return response;
    },
    onSuccess: async () => {
      await database.createDocument(DATABASE_ID, AUDIT_LOGS, ID.unique(), {
        description: `${userRole} is updated manager of department`,
        actionBy: userRole,
      });
      queryClient.invalidateQueries({ queryKey: ["department"] });
      toast.success("Manager assigned to department sucessfully");
      navigate("/dashboard/departments");
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const submitDataToUpdate: SubmitHandler<DepartmentUpdateType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
  <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 md:px-6">
    <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Assign Department Manager
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-emerald-100">
          Assign a manager to oversee department operations and workforce activities.
        </p>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 md:p-8">
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit(submitDataToUpdate)}>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Department Manager
            </label>

            <input
              type="text"
              {...register("departmentManager")}
              placeholder="Enter employee name or ID"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            {errors.departmentManager?.message && (
              <p className="mt-2 text-xs sm:text-sm text-red-500">
                {errors.departmentManager.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full rounded-xl py-3 font-semibold text-white transition text-sm sm:text-base
              ${mutation.isPending
                ? "cursor-not-allowed bg-emerald-400"
                : "bg-emerald-600 hover:bg-emerald-700"
              }`}
          >
            {mutation.isPending ? "Assigning Manager..." : "Assign Manager"}
          </button>

        </form>
      </div>

    </div>
  </div>
</div>
  );
};

export default UpdateDepartMentPage;