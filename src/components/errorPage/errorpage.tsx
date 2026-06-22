import React from "react";


const ErrorMessage:React.FC<{message:string}> = ({
  message = "Something went wrong. Please try again."
}) => {
  return (
    <div className="min-h-[300px] flex items-center justify-center">

      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">

        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>

        <h2 className="mt-4 text-xl font-bold text-red-700">
          Error
        </h2>

        <p className="mt-2 text-red-600">
          {message}
        </p>

      </div>

    </div>
  );
};

export default ErrorMessage;