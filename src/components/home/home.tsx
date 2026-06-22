import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100">

  {/* Navbar */}
  <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
        EWOMP
      </h1>

      <Link
        to="/login"
        className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition text-sm sm:text-base"
      >
        Login
      </Link>
    </div>
  </nav>

  {/* Hero Section */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

      {/* Left Content */}
      <div>

        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
          Employee Workforce Management
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mt-4 sm:mt-6 leading-tight">
          Employee Workforce
          <br />
          Operations &
          <span className="text-indigo-600"> Management Portal</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600">
          Register your employee account and access workforce management
          tools, employee information, onboarding, departments, and
          organizational resources.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-10">

          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base text-center"
          >
            Create Employee Account
          </Link>

          <Link
            to="/login"
            className="border border-slate-300 hover:bg-slate-50 px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition text-sm sm:text-base text-center"
          >
            Employee Login
          </Link>

          <Link
            to="/adminlogin"
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base text-center"
          >
            🛡️ Admin Login
          </Link>

        </div>

        <p className="mt-4 text-xs sm:text-sm text-slate-500">
          Administrative access is restricted to authorized system administrators only.
        </p>

      </div>

      {/* Right Image */}
      <div className="flex justify-center mt-6 md:mt-0">
        <img
          src="./ewomp.png"
          alt="Employees"
          className="w-48 sm:w-64 md:w-full max-w-md rounded-full"
        />
      </div>

    </div>
  </section>

  {/* Features */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-base sm:text-lg text-slate-800">
          Employee Profiles
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Manage employee information and organizational details.
        </p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-base sm:text-lg text-slate-800">
          Department Management
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Organize employees into departments and teams.
        </p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-base sm:text-lg text-slate-800">
          Role-Based Access
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Secure access based on employee responsibilities.
        </p>
      </div>

    </div>
  </section>

</div>
  );
};

export default HomePage;
