import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  database,
  DATABASE_ID,
  EMPLOYEE_ONBOARDING,
  ID,
  AUDIT_LOGS,
} from "../../../utils/appwrite";
import {
  OnboardingCreationValidation,
  type OnboardingCreationType,
} from "../../validation/validate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../../store/authState";

const CreateOnboardingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const userRole = AuthState((state) => state.userRole);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<OnboardingCreationType>({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: yupResolver(OnboardingCreationValidation),
    mode: "onChange",
  });
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (data: OnboardingCreationType) => {
      const response = await database.createDocument(
        DATABASE_ID,
        EMPLOYEE_ONBOARDING,
        ID.unique(),
        {
          userName: data?.name,
          userEmail: data?.email,
          status: false,
          profileStatus: false,
        },
      );
      return response;
    },
    onSuccess: async () => {
      await database.createDocument(DATABASE_ID, AUDIT_LOGS, ID.unique(), {
        description: `${userRole} is created a employee onBoarding`,
        actionBy: userRole,
      });
      queryClient.invalidateQueries({ queryKey: ["onboard"] });
      toast.success("Employee onboarding created sucessfully");
      navigate("/dashboard/onboarding");
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const dataHandleToSubmit: SubmitHandler<OnboardingCreationType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-3 sm:px-4 md:px-6">
  <div className="mx-auto w-full max-w-2xl">

    <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Create Employee Onboarding
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-indigo-100">
          Create an onboarding request for a new employee and start the hiring workflow.
        </p>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 md:p-8">
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit(dataHandleToSubmit)}>

          {/* Employee Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employee Name
            </label>

            <input
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className="
                w-full
                rounded-lg sm:rounded-xl
                border border-slate-300
                bg-white
                px-3 sm:px-4
                py-2.5 sm:py-3
                text-sm sm:text-base text-slate-700
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
            />

            {errors?.name?.message && (
              <p className="mt-2 text-xs sm:text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Employee Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employee Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="employee@company.com"
              className="
                w-full
                rounded-lg sm:rounded-xl
                border border-slate-300
                bg-white
                px-3 sm:px-4
                py-2.5 sm:py-3
                text-sm sm:text-base text-slate-700
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
            />

            {errors?.email?.message && (
              <p className="mt-2 text-xs sm:text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`
              w-full
              rounded-lg sm:rounded-xl
              py-2.5 sm:py-3
              text-sm sm:text-base
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
            {mutation.isPending ? "Creating Onboarding..." : "Create Onboarding"}
          </button>

        </form>
      </div>

    </div>
  </div>
</div>
    </>
  );
};

export default CreateOnboardingPage;
