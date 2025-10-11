import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/JWTHelper";

export default function Forbidden() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = getUserRole(token);

  // Map role to default page
  const roleHomePath = {
    Employee: "/dashboard/home",
    Manager: "/dashboard/mhome",
    Hr: "/dashboard/hrhome",
  };

  const handleGoBack = () => {
    if (role && roleHomePath[role]) {
      navigate(roleHomePath[role], { replace: true });
    } else {
      navigate("/login", { replace: true }); // fallback if token/role missing
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-12 max-w-lg text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 mx-auto text-red-500 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
        <p className="text-lg text-gray-600 mb-6">Forbidden - You do not have permission to access this page.</p>
        <button
          onClick={handleGoBack}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
