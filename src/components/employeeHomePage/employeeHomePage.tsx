import React, { useMemo } from "react";

const EmployeeHomePage: React.FC = () => {
  const attendance = useMemo(
    () => Math.floor(Math.random() * 80) + 20,
    []
  );

  const holidays = [
    { date: "01 Jan", name: "New Year's Day" },
    { date: "26 Jan", name: "Republic Day" },
    { date: "14 Mar", name: "Holi" },
    { date: "18 Apr", name: "Good Friday" },
    { date: "15 Aug", name: "Independence Day" },
    { date: "27 Aug", name: "Ganesh Chaturthi" },
    { date: "02 Oct", name: "Gandhi Jayanti" },
    { date: "20 Oct", name: "Diwali" },
    { date: "05 Nov", name: "Guru Nanak Jayanti" },
    { date: "25 Dec", name: "Christmas Day" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
  {/* Welcome Card */}
  <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-5 sm:p-6 md:p-8 text-white shadow-lg">
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
      Welcome to the Organization 👋
    </h1>

    <p className="mt-2 sm:mt-3 text-sm sm:text-base text-indigo-100 leading-relaxed">
      We're glad to have you as part of our team. Stay productive and have a great day at work.
    </p>
  </div>

  {/* Attendance */}
  <div className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 shadow-sm border border-slate-200">
    <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
      Attendance Overview
    </h2>

    <div className="mt-4 sm:mt-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm sm:text-base text-slate-600">
          Current Attendance
        </span>

        <span className="font-bold text-green-600 text-sm sm:text-base">
          {attendance}%
        </span>
      </div>

      <div className="mt-3 h-2 sm:h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${attendance}%` }}
        />
      </div>
    </div>
  </div>

  {/* Holidays */}
  <div className="rounded-2xl bg-white p-4 sm:p-5 md:p-6 shadow-sm border border-slate-200">
    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">
      Indian Holidays 2026
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      {holidays.map((holiday) => (
        <div
          key={holiday.name}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200 p-3 sm:p-4"
        >
          <p className="font-medium text-sm sm:text-base text-slate-800">
            {holiday.name}
          </p>

          <span className="self-start sm:self-auto rounded-lg bg-indigo-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-indigo-700">
            {holiday.date}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Quick Note */}
  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
    <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
      Employee Portal
    </h3>

    <p className="mt-2 text-xs sm:text-sm text-blue-700 leading-relaxed">
      Use your profile page to keep personal information updated and stay informed about upcoming company activities.
    </p>
  </div>
</div>
  );
};

export default EmployeeHomePage;

