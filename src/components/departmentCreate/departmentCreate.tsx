import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  database,
  DATABASE_ID,
  DEPARTMENT_LIST,
  ID,
  AUDIT_LOGS,
} from "../../../utils/appwrite";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  DepartMentValidation,
  type DepartmentValidationType,
} from "../../validation/validate";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { AuthState } from "../../store/authState";


const DepartmentCreatePage: React.FC = () => {
  const userRole = AuthState((state) => state.userRole);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DepartmentValidationType>({
    defaultValues: {
      name: "",
      description: "",
      status: true,
    },
    resolver: yupResolver(DepartMentValidation),
    mode: "onChange",
  });
  const mutation = useMutation({
    mutationFn: async (data: DepartmentValidationType) => {
      const response = await database.createDocument(
        DATABASE_ID,
        DEPARTMENT_LIST,
        ID.unique(),
        {
          name: data.name,
          description: data.description,
          status: data.status,
        },
      );
      return response;
    },
    onSuccess: async () => {
      await database.createDocument(DATABASE_ID, AUDIT_LOGS, ID.unique(), {
        description: `${userRole} is created a Department`,
        actionBy: userRole,
      });
      queryClient.invalidateQueries({ queryKey: ["department"] });
      toast.success("Department created successfully");
      reset();
      navigate("/dashboard/departments");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const dataSubmitTocreateDepartment: SubmitHandler<
    DepartmentValidationType
  > = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div>
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8">
              <h1 className="text-3xl font-bold text-white">
                Create Department
              </h1>

              <p className="mt-2 text-sm text-emerald-100">
                Add a new department and configure its details.
              </p>
            </div>

            {/* Form */}
            <form
              className="space-y-6 p-8"
              onSubmit={handleSubmit(dataSubmitTocreateDepartment)}
            >
              {/* Department Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department Name
                </label>

                <input
                  type="text"
                  {...register("name")}
                  placeholder="Enter department name"
                  className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            text-slate-700
            outline-none
            transition
            focus:border-emerald-500
            focus:ring-4
            focus:ring-emerald-100
          "
                />
                {errors.name?.message && <span>{errors.name?.message}</span>}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Enter department description"
                  className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            text-slate-700
            outline-none
            transition
            focus:border-emerald-500
            focus:ring-4
            focus:ring-emerald-100
          "
                />
                {errors.description?.message && (
                  <span>{errors.description?.message}</span>
                )}
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("status")}
                    className="
              h-5
              w-5
              rounded
              border-slate-300
              text-emerald-600
              focus:ring-emerald-500
            "
                  />
                  <div>
                    <p className="font-medium text-slate-900">
                      Active Department
                    </p>

                    <p className="text-sm text-slate-500">
                      Enable this department immediately after creation.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
            type="submit"
            disabled={mutation.isPending}
            className={`
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              py-3
              font-semibold
              text-white
              transition
              ${
                mutation.isPending
                  ? "cursor-not-allowed bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
            `}
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Creating Department...</span>
              </div>
            ) : (
              "Create Department"
            )}
          </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default DepartmentCreatePage;
