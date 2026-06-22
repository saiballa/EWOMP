import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-slate-800">
            Account Created Successfully
          </h1>

          {/* Message */}
          <p className="mt-4 text-slate-600 leading-relaxed">
            Your account has been created successfully and is currently awaiting
            HR processing.
          </p>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-slate-700">
              Our HR team will review your registration, complete your employee
              profile, assign your department, designation, and role
              permissions.
            </p>

            <p className="mt-3 text-slate-700">
              Once the process is completed, you will receive access to your
              employee profile and workforce portal.
            </p>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-sm text-slate-500">
            If you have any questions, please contact your HR administrator.
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/login")}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    </>
  );
};
export default RegisterConfirmPage;