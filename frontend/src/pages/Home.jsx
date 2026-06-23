import { useNavigate } from "react-router-dom";
import buildingBg from "../assets/buildingBackground.jpg";
import Logo from "./Logo";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
  className="relative flex flex-col h-screen w-screen items-center justify-center"
  style={{
    backgroundImage: `url(${buildingBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Dark gradient overlay - improves contrast and adds depth */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

  {/* Logo */}
  <Logo className="absolute top-6 left-6 sm:top-8 sm:left-8 h-9 sm:h-11 text-white z-10" />

  {/* Content */}
  <div className="relative z-10 text-center max-w-2xl px-4">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
      Welcome to <span className="text-indigo-400">RentTrack</span>
    </h1>
    <p className="text-base sm:text-lg md:text-xl mb-10 text-gray-300 leading-relaxed">
      Manage your rental properties, tenants, and payments seamlessly.
      Keep track of everything in one place with secure access.
    </p>
    <button
      onClick={() => navigate("/login")}
      className="px-8 py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-base sm:text-lg font-semibold shadow-xl shadow-indigo-600/30"
    >
      Login to Continue
    </button>
  </div>

  <p className="absolute bottom-6 text-sm text-gray-400 text-center px-4 z-10">
    Simplify property management with RentTrack
  </p>
</div>
  );
}