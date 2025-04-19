import React from "react";
import { userbarProps } from "@/app/interfaces/usercb";

const Userbar: React.FC<userbarProps> = ({ name, email, role, imageUrl }) => {
  return (
    <div className="col-span-1 bg-gray-800 p-4 rounded-2xl shadow-xl text-white">
      <div className="flex flex-col items-center">
        <img
          src={imageUrl || "https://via.placeholder.com/100"}
          alt="Profile"
          className="rounded-full w-24 h-24 mb-4"
        />
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-400">{email}</p>
        <span className="text-xs mt-2 px-3 py-1 bg-indigo-500 rounded-full">
          {role.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default Userbar;
