import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  account,
  DATABASE_ID,
  EMPLOYEE_LIST,
  database,
  ADMIN_TABLE,
} from "../../../utils/appwrite";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  LoginEmployeerValidation,
  type LoginEmployeerType,
} from "../../validation/validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import type { EmployeListType, AdminLogType } from "../../types/type";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../../store/authState";
import Swal from "sweetalert2";

const AdminLoginPage: React.FC = () => {
  const { setAuth } = AuthState((state) => state);
  const storeListOfOnBoard = useRef<AdminLogType | null>(null);
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

  const dataSubmitToLogin: SubmitHandler<LoginEmployeerType> = (data) => {
    if (storeListOfOnBoard.current?.email === data.email) {
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
      const res = await database.listDocuments<AdminLogType>(
        DATABASE_ID,
        ADMIN_TABLE,
      );
      storeListOfOnBoard.current = res.documents[0];
    };
    fetchOnBoardDataList();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-3 py-6 sm:p-6">

  <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">

    {/* Left Section */}
    <div className="hidden md:flex flex-col justify-center bg-slate-900 text-white p-8 sm:p-10">

      <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
        EWOMP
      </h1>

      <p className="text-slate-300 text-base sm:text-lg">
        Administrator Control Center
      </p>

      <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-slate-300 text-sm sm:text-base">
        <p>🔒 Secure Administration Access</p>
        <p>👥 Workforce & User Management</p>
        <p>🏢 Department Administration</p>
        <p>📊 Reports & Analytics</p>
        <p>🛡️ Role & Permission Control</p>
      </div>

      <div className="mt-10 sm:mt-12 flex justify-center">
        <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-5xl sm:text-7xl">🛡️</span>
        </div>
      </div>

    </div>

    {/* Right Section */}
    <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center">

      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Administrator Login
        </h2>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          Sign in to access the EWOMP administration portal
        </p>
      </div>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(dataSubmitToLogin)}>

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
            py-3
            rounded-xl
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
        <p className="text-xs sm:text-sm text-slate-500">
          Access restricted to authorized administrators only.
        </p>
      </div>

    </div>

  </div>
</div>
  );
};

export default AdminLoginPage;
