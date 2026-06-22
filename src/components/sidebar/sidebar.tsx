import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiUserPlus,
  FiBarChart2,
  FiTrendingUp,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { AuthState } from "../../store/authState";

const Sidebar: React.FC = () => {
  const userRole = AuthState((state) => state.userRole);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 text-white md:hidden">
        <h1 className="text-xl font-bold">EWOMP</h1>

        <button onClick={() => setIsOpen(true)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
           bg-slate-900
    text-white
    flex
    flex-col
    z-50
    transition-transform
    duration-300

    fixed
    top-0
    left-0
    h-dvh
    w-64

    ${
      isOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }

    md:sticky
    md:top-0
    md:h-screen
    md:w-56
    md:translate-x-0
    md:flex
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-4 md:hidden">
          <h1 className="text-xl font-bold">EWOMP</h1>

          <button onClick={() => setIsOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:block border-b border-slate-700 p-3 md:p-4">
          <h1 className="text-2xl font-bold">EWOMP</h1>

          <p className="mt-1 text-sm text-slate-400">
            Employee Management
          </p>
        </div>

        <nav className="flex-1 p-2 md:p-3">
          <ul className="space-y-2">

            {(userRole === "admin" || userRole === "hr") && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiHome size={20} />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/departments"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiBriefcase size={20} />
                    <span>Departments</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/employeelist"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiUsers size={20} />
                    <span>Employee List</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/onboarding"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiUserPlus size={20} />
                    <span>Onboarding</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/audit"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiBarChart2 size={20} />
                    <span>Reports</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/workforce"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiTrendingUp size={20} />
                    <span>Workforce</span>
                  </Link>
                </li>
              </>
            )}

            {userRole === "manager" && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiHome size={20} />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/teams"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FiUsers size={20} />
                    <span>My Team</span>
                  </Link>
                </li>
              </>
            )}

            {userRole === "employee" && (
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                >
                  <FiHome size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <FiUser size={20} />
                <span>Profile</span>
              </Link>
            </li>

          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;