import React, { useEffect, useState } from "react";
import { database, DATABASE_ID, EMPLOYEE_LIST } from "../../../utils/appwrite";
import { useQuery } from "@tanstack/react-query";
import { AuthState } from "../../store/authState";
import type { EmployeeProfileType } from "../../types/type";
import DashboardLoader from "../loader/loader";
import ErrorMessage from "../errorPage/errorpage";
import { Query } from "appwrite";

const TeamsPage: React.FC = () => {
  const userId = AuthState((state) => state.userId);
  const [employeeData, setEmployeeData] = useState<EmployeeProfileType | null>(
    null,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await database.listDocuments<EmployeeProfileType>(
        DATABASE_ID,
        EMPLOYEE_LIST,
      );
      return response;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 3,
  });

  const managerTeam = data?.documents.filter(
    (item) => item.managerId === employeeData?.name,
  );

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!userId) return;

        const response = await database.listDocuments<EmployeeProfileType>(
          DATABASE_ID,
          EMPLOYEE_LIST,
          [Query.equal("employeeId", userId)],
        );

        setEmployeeData(response.documents[0]);
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      }
    };

    fetchEmployee();
  }, [userId]);

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Can't able to fetch data from server,Something went wrong!" />
    );
  }

  return (
    <>
      <div className="space-y-6">
  {/* Heading */}
  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      Team Members
    </h1>

    <p className="mt-2 text-sm text-slate-600">
      View all employees assigned to your team.
    </p>
  </div>

  {/* Empty State */}
  {(!managerTeam || managerTeam.length === 0) ? (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <h2 className="text-lg font-semibold text-slate-700">
        No Team Members Found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        There are currently no employees assigned to your team.
      </p>
    </div>
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {managerTeam.map((employee) => (
        <div
          key={employee.$id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <img
              src={
                employee.profilePic ||
                "https://ui-avatars.com/api/?name=Employee&background=e2e8f0&color=334155"
              }
              alt={employee.name}
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />

            <div>
              <h3 className="font-semibold text-slate-900">
                {employee.name}
              </h3>

              <p className="text-sm text-slate-500">
                {employee.designation}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium text-slate-700">
                Email:
              </span>{" "}
              {employee.email}
            </p>

            <p>
              <span className="font-medium text-slate-700">
                Department:
              </span>{" "}
              {employee.departmentId}
            </p>

            <p>
              <span className="font-medium text-slate-700">
                Team:
              </span>{" "}
              {employee.team}
            </p>
          </div>

          <div className="mt-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                employee.status === "active"
                  ? "bg-green-100 text-green-700"
                  : employee.status === "probation"
                  ? "bg-yellow-100 text-yellow-700"
                  : employee.status === "inactive"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </>
  );
};
export default TeamsPage;
