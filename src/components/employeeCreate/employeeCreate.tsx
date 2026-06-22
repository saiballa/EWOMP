import React, { useEffect,useState,useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  database,
  DATABASE_ID,
  EMPLOYEE_ONBOARDING,
  ID,
  AUDIT_LOGS,
  DEPARTMENT_LIST,
  EMPLOYEE_LIST,
} from "../../../utils/appwrite";
import {
  EmployeeCreationValidation,
  type EmployeeCreationType,
} from "../../validation/validate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../../store/authState";
import { UpdateProfile } from "../../store/profile";
import type { DepartMentType } from "../../types/type";

const EmployeeCreatePage: React.FC = () => {
  const { OnBoardingprofilEmail, OnBoardingprofileId, OnBoardingprofileName,onBoardingDocId } =
    UpdateProfile((state) => state);
  let [departmentList,setDepartmentList] = useState<DepartMentType[]>([]);
  const queryClient = useQueryClient();
  const userRole = AuthState((state) => state.userRole);
  let userDepartmentName = useRef<string>("");
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<EmployeeCreationType>({
    defaultValues: {
      employeeId: OnBoardingprofileId || "",
      name: OnBoardingprofileName || "",
      email: OnBoardingprofilEmail || "",
      phone: "",
      address: "",
      designation: "",
    },
    resolver: yupResolver(EmployeeCreationValidation),
    mode: "onChange",
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: EmployeeCreationType) => {
      const response = await database.createDocument(
        DATABASE_ID,
        EMPLOYEE_LIST,
        ID.unique(),
        {
          employeeId:OnBoardingprofileId,
          name:OnBoardingprofileName,
          email:OnBoardingprofilEmail,
          phone:data?.phone,
          gender:data?.gender,
          dob:data?.dob.toISOString().split("T")[0],
          address:data?.address,
          designation:data?.designation,
          departmentId:data?.departmentId,
          role:data?.role,
          status:data?.status
        },
      );
      return response;
    },
    onSuccess: async () => {
        if(!onBoardingDocId) return;

      await database.createDocument(DATABASE_ID, AUDIT_LOGS, ID.unique(), {
        description: `${userRole} is created a employee profile`,
        actionBy: userRole,
      });

      await database.updateDocument(DATABASE_ID,EMPLOYEE_ONBOARDING,onBoardingDocId,{
        profileStatus:true,
      });

      queryClient.invalidateQueries({ queryKey: ["onboard"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee onboarding created sucessfully");
      navigate("/dashboard/employeelist");
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const CreateEmployeeDataSubmit: SubmitHandler<EmployeeCreationType> = (
    data,
  ) => {
    userDepartmentName.current=data?.departmentId;
    mutation.mutate(data);
  };

  useEffect(() => {
    const fetchDepartMentList = async () => {
      const data = await database.listDocuments<DepartMentType>(
        DATABASE_ID,
        DEPARTMENT_LIST,
      );
      setDepartmentList(data?.documents);
    };
    fetchDepartMentList();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-3 sm:px-4 md:px-6">
  <div className="mx-auto max-w-4xl w-full">

    <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Employee Profile Registration
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Create and manage employee workforce records within EWOMP.
        </p>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 md:p-8">

        <form
          className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
          onSubmit={handleSubmit(CreateEmployeeDataSubmit)}
        >

          {/* Employee ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employee ID
            </label>

            <input
              type="text"
              {...register("employeeId")}
              placeholder="EMP001"
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.employeeId?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.employeeId?.message}
              </span>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.name?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.name?.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="john@company.com"
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.email?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.email?.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone Number
            </label>

            <input
              type="tel"
              {...register("phone")}
              placeholder="+91 9876543210"
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.phone?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.phone?.message}
              </span>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gender
            </label>

            <select
              {...register("gender")}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {errors.gender?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.gender?.message}
              </span>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Date of Birth
            </label>

            <input
              type="date"
              {...register("dob")}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.dob?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.dob?.message}
              </span>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Designation
            </label>

            <input
              type="text"
              {...register("designation")}
              placeholder="Software Engineer"
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.designation?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.designation?.message}
              </span>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Department
            </label>

            <select
              {...register("departmentId")}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select Department</option>

              {departmentList.map((department) => (
                <option key={department.$id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>

            {errors.departmentId?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.departmentId?.message}
              </span>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              System Role
            </label>

            <select
              {...register("role")}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>

            {errors.role?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.role?.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employment Status
            </label>

            <select
              {...register("status")}
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="probation">Probation</option>
            </select>

            {errors.status?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.status?.message}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Address
            </label>

            <textarea
              rows={4}
              {...register("address")}
              placeholder="Enter employee address..."
              className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {errors.address?.message && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.address?.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              disabled={mutation.isPending}
              className={`
                flex w-full items-center justify-center rounded-lg sm:rounded-xl py-3 sm:py-4
                text-sm sm:text-base font-semibold text-white transition
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
                  <span>Creating Employee Profile...</span>
                </div>
              ) : (
                "Create Employee Profile"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
</div>
    </>
  );
};
export default EmployeeCreatePage;
