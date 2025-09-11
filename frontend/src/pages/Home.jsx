import React from "react";
import { useNavigate } from "react-router-dom";
import rentImage from "../assets/rentImage.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col h-screen w-screen items-center justify-center "
      style={{
        backgroundImage: `url(${rentImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center max-w-2xl mt-15">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Welcome to <span className="text-indigo-400">RentTrack</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200 drop-shadow-md">
          Manage your rental properties, tenants, and payments seamlessly.  
          Keep track of everything in one place with secure access.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition text-lg font-medium shadow-lg"
        >
          Login to Continue
        </button>
      </div>
      <p className="absolute bottom-4 text-sm text-gray-300 drop-shadow-md">
        Simplify property management with RentTrack
      </p>
    </div>
  );
}
