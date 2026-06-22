import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  account,
  DATABASE_ID,
  EMPLOYEE_LIST,
  database,
  EMPLOYEE_ONBOARDING,
} from "../../../utils/appwrite";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  LoginEmployeerValidation,
  type LoginEmployeerType,
} from "../../validation/validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import type { EmployeListType, Onboarding_Employee } from "../../types/type";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../../store/authState";
import Swal from "sweetalert2";

const LoginPage: React.FC = () => {
  const { setAuth } = AuthState((state) => state);
  const storeListOfOnBoard = useRef<Onboarding_Employee[]>([]);
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<LoginEmployeerType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LoginEmployeerValidation),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginEmployeerType) => {
      await account.createEmailPasswordSession(data.email, data.password);
    },
    onSuccess: async () => {
      const userDetails = await account.get();

      const response = await database.listDocuments<EmployeListType>(
        DATABASE_ID,
        EMPLOYEE_LIST,
        [Query.equal("employeeId", userDetails.$id)],
      );

      const { role, employeeId } = response.documents[0];
      setAuth(employeeId, role);
      reset();
      navigate("/dashboard");
    },
    onError(error: any) {
      toast.error(
        error?.response?.message || "User can't login, something went wrong!",
      );
    },
  });

  const dataSubmitToLogin:SubmitHandler<LoginEmployeerType> = (data) => {
    const getData = storeListOfOnBoard.current.find(
      (item) => item.userEmail === data.email,
    );
    console.log(getData);
    if (getData?.profileStatus) {
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

  useEffect(() => {
    const fetchOnBoardDataList = async () => {
      const res = await database.listDocuments<Onboarding_Employee>(
        DATABASE_ID,
        EMPLOYEE_ONBOARDING,
      );
      storeListOfOnBoard.current = res.documents;
    };
    fetchOnBoardDataList();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-3 py-6 sm:p-6">

  <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">

    {/* Left Section (hidden on mobile) */}
    <div className="hidden md:flex flex-col justify-center bg-indigo-700 text-white p-8 sm:p-10">

      <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
        EWOMP
      </h1>

      <p className="text-indigo-100 text-base sm:text-lg">
        Employee Workforce Operations & Management Platform
      </p>

      <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-indigo-100 text-sm sm:text-base">
        <p>✓ Secure Employee Access</p>
        <p>✓ Workforce Management</p>
        <p>✓ HR & Department Portal</p>
        <p>✓ Role-Based Permissions</p>
      </div>

      <div className="mt-8 sm:mt-10 flex justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Employee Login"
          className="w-40 sm:w-64"
        />
      </div>

    </div>

    {/* Right Section */}
    <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center">

      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Welcome Back
        </h2>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Sign in to access your employee account
        </p>
      </div>

      <form
        className="space-y-4 sm:space-y-5"
        onSubmit={handleSubmit(dataSubmitToLogin)}
      >

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
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

          {errors?.email?.message && (
            <span className="text-xs sm:text-sm text-red-500">
              {errors?.email?.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700"
            >
              Forgot Password?
            </Link>
          </div>

          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
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

          {errors?.password?.message && (
            <span className="text-xs sm:text-sm text-red-500">
              {errors?.password?.message}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`
            w-full
            rounded-xl
            py-3
            text-sm sm:text-base
            font-semibold
            text-white
            transition
            ${
              mutation.isPending
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          {mutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>

      </form>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-sm text-slate-500">Don't have an account?</p>

        <Link
          to="/register"
          className="inline-block mt-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base"
        >
          Create Employee Account
        </Link>
      </div>

    </div>

  </div>
</div>
  );
};

export default LoginPage;
