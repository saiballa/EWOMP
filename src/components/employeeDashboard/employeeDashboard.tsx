import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  account,
  database,
  DATABASE_ID,
  EMPLOYEE_LIST,
  storage,
  BUCKET_ID,
} from "../../../utils/appwrite";
import { AuthState } from "../../store/authState";
import type { EmployeeProfileType } from "../../types/type";
import { Query } from "appwrite";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { Link } from "react-router-dom";

const EmployeeDashboard: React.FC = () => {
  const setLoggout = AuthState((state) => state.setLoggout);
  const userId = AuthState((state) => state.userId);

  const {
    data: employeeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employeeDetails"],
    queryFn: async () => {
      if (!userId) return;
      const response = await database.listDocuments<EmployeeProfileType>(
        DATABASE_ID,
        EMPLOYEE_LIST,
        [Query.equal("employeeId", userId)],
      );
      return response.documents[0];
    },
  });

  const getImagePreview = (id: string) => {
    try {
      const image_preview = storage.getFileView(BUCKET_ID, id).toString();
      return image_preview;
    } catch (error) {
      console.log(error);
    }
  };

  const userLogout = async () => {
    await account.deleteSession("current");
    setLoggout();
    console.log("deleted");
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Can't able to fetch data from server,Something went wrong!" />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 lg:p-6">
  <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">

    {/* Profile Header */}
    <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">

          <img
            src={
              employeeData?.profilePic
                ? getImagePreview(employeeData.profilePic)
                : "https://ui-avatars.com/api/?name=Employee&background=e2e8f0&color=334155&size=200"
            }
            alt="Profile"
            className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full border-2 sm:border-4 border-slate-200 object-cover"
          />

          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900">
              {employeeData?.name}
            </h1>

            <p className="mt-1 text-sm sm:text-base text-slate-500">
              {employeeData?.designation}
            </p>

            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm text-blue-700 font-medium">
                {employeeData?.role}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${
                  employeeData?.status === "active"
                    ? "bg-green-100 text-green-700"
                    : employeeData?.status === "probation"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {employeeData?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">

          <Link
            to={`/dashboard/employeeProfileUpdate/${employeeData?.$id}`}
            className="w-full sm:w-auto text-center rounded-xl bg-indigo-600 px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-white hover:bg-indigo-700 transition"
          >
            Update Profile
          </Link>

          <button
            onClick={() => userLogout()}
            className="w-full sm:w-auto rounded-xl bg-red-600 px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-white hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </div>

    {/* Quick Summary */}
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

      {[
        ["Employee ID", employeeData?.employeeId],
        ["Department", employeeData?.departmentId],
        ["Team", employeeData?.team],
        ["Reporting Manager", employeeData?.managerId || "Not Assigned"],
      ].map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm"
        >
          <p className="text-xs sm:text-sm text-slate-500">{label}</p>
          <h2 className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-slate-900">
            {value}
          </h2>
        </div>
      ))}
    </div>

    {/* Employee Info */}
    <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="mb-4 sm:mb-6 text-lg sm:text-2xl font-bold text-slate-900">
        Employee Information
      </h2>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">

        {[
          ["Full Name", employeeData?.name],
          ["Email", employeeData?.email],
          ["Phone", employeeData?.phone],
          ["Gender", employeeData?.gender],
          ["DOB", employeeData?.dob],
          ["Designation", employeeData?.designation],
          ["Department", employeeData?.departmentId],
          ["Team", employeeData?.team],
          ["Role", employeeData?.role],
          ["Status", employeeData?.status],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs sm:text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-sm sm:text-base font-medium text-slate-900">
              {value}
            </p>
          </div>
        ))}

      </div>

      <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
        <p className="text-xs sm:text-sm text-slate-500">Address</p>
        <p className="mt-1 text-sm sm:text-base font-medium text-slate-900">
          {employeeData?.address}
        </p>
      </div>
    </div>

  </div>
</div>
  );
};

export default EmployeeDashboard;
