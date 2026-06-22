import React,{useRef} from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RegisterEmployeeValidation } from "../../validation/validate";
import type { RegisterEmployeeType } from "../../validation/validate";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  account,
  ID,
  database,
  DATABASE_ID,
  EMPLOYEE_ONBOARDING,
} from "../../../utils/appwrite";
import type { Onboarding_Employee } from "../../types/type";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Query } from "appwrite";
import Swal from "sweetalert2";


const RegisterEmployeePage: React.FC = () => {
  const listOfOnboardingEmployess = useRef<Onboarding_Employee | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterEmployeeType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(RegisterEmployeeValidation),
    mode: "onChange",
  });
  const navigate = useNavigate();
  const mutation = useMutation<any, Error, RegisterEmployeeType>({
    mutationFn: async (data: RegisterEmployeeType) => {
      const response = await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.name,
      );
      return response;
    },
    onSuccess: async(response, variables) => {
      if(!listOfOnboardingEmployess.current) return;
      await database.updateDocument<Onboarding_Employee>(DATABASE_ID,EMPLOYEE_ONBOARDING,listOfOnboardingEmployess.current?.$id,{
              userId:response.$id,
              status:true,
            });
      toast.success(
        response?.message || "Employee account created successfully!",
      );
      console.log(variables);
      navigate("/confirm");
    },
    onError: (response) => {
      toast.error(response?.message);
      console.error(response?.message);
    },
  });

  const dataToSubmitHandle: SubmitHandler<RegisterEmployeeType> = async (
    data,
  ) => {
    const onBoardingListData =
      await database.listDocuments<Onboarding_Employee>(
        DATABASE_ID,
        EMPLOYEE_ONBOARDING,
        [Query.equal("userEmail", data.email)],
      );

    listOfOnboardingEmployess.current = onBoardingListData.documents[0];
    if (
      data.email === onBoardingListData.documents[0]?.userEmail &&
      data.name === onBoardingListData.documents[0]?.userName
    ) {
        mutation.mutate(data);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "This employee already has an onboarding request.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-3 py-6 sm:p-6">

  <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">

    {/* Left Section */}
    <div className="hidden md:flex flex-col justify-center bg-indigo-700 text-white p-8 sm:p-10">

      <div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
          EWOMP
        </h1>

        <p className="text-indigo-100 text-base sm:text-lg leading-relaxed">
          Employee Workforce Operations & Management Platform
        </p>

        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-indigo-100 text-sm sm:text-base">
          <p>✓ Employee Onboarding</p>
          <p>✓ Workforce Management</p>
          <p>✓ Role Based Access</p>
          <p>✓ Department Management</p>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 flex justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Employee"
          className="w-40 sm:w-64"
        />
      </div>

    </div>

    {/* Right Section */}
    <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center">

      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Create Account
        </h2>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Register to access the employee portal
        </p>
      </div>

      <form
        onSubmit={handleSubmit(dataToSubmitHandle)}
        className="space-y-4 sm:space-y-5"
      >

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            {...register("name")}
            className="
              w-full
              px-3 sm:px-4
              py-2.5 sm:py-3
              text-sm sm:text-base
              rounded-xl
              border border-slate-300
              outline-none
              focus:ring-2 focus:ring-indigo-500
              focus:border-indigo-500
              transition
            "
          />

          {errors.name?.message && (
            <span className="text-xs sm:text-sm text-red-500">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="
              w-full
              px-3 sm:px-4
              py-2.5 sm:py-3
              text-sm sm:text-base
              rounded-xl
              border border-slate-300
              outline-none
              focus:ring-2 focus:ring-indigo-500
              focus:border-indigo-500
              transition
            "
          />

          {errors.email?.message && (
            <span className="text-xs sm:text-sm text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            {...register("password")}
            className="
              w-full
              px-3 sm:px-4
              py-2.5 sm:py-3
              text-sm sm:text-base
              rounded-xl
              border border-slate-300
              outline-none
              focus:ring-2 focus:ring-indigo-500
              focus:border-indigo-500
              transition
            "
          />

          {errors.password?.message && (
            <span className="text-xs sm:text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`
            w-full
            py-3
            rounded-xl
            text-sm sm:text-base
            text-white
            font-semibold
            transition
            ${
              mutation.isPending
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 mt-6 sm:mt-8">
        Already have an account?
        <Link
          to="/login"
          className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Login
        </Link>
      </p>

    </div>

  </div>
</div>
    </>
  );
};
export default RegisterEmployeePage;
