import { useState } from "react";
import { UserStore } from "../store/Userstroe";
import DirectoryForm from "./FormComponent";

export default function HomePage() {
  const { user } = UserStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {showForm ? (
        <div className="w-full max-w-2xl animate-fadeIn">
          <DirectoryForm handleClose={() => setShowForm(false)} />
        </div>
      ) : (
        <div className="w-full max-w-md transform transition-all duration-500 hover:scale-105">

          {/* Decorative background glow */}
          <div className="absolute inset-0 bg-blue-400/5 blur-3xl rounded-full"></div>

          {/* Main card */}
          <div className="relative border-2 border-dashed border-blue-600/40 hover:border-blue-400 p-8 sm:p-12 rounded-2xl text-center transition-all duration-500 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm shadow-2xl">

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-2xl"></div>

            {/* Content */}
            <div className="relative space-y-6">
              {/* Welcome message */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 tracking-wide">
                  WELCOME BACK
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent animate-pulse">
                    {user.user||user?.username || "User"}
                  </span>
                  <span className="text-3xl">👋</span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-gray-400 text-sm sm:text-base">
                Ready to organize your notes? Create a new directory to get started.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => setShowForm(true)}
                className="
                  group relative
                  bg-gradient-to-r from-blue-600 to-blue-500 
                  text-white font-semibold
                  px-8 py-3 rounded-xl
                  hover:from-blue-500 hover:to-blue-400
                  active:scale-95
                  transition-all duration-300
                  shadow-lg hover:shadow-2xl hover:shadow-blue-500/40
                  border border-blue-400
                  overflow-hidden
                "
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Directory
                </span>
              </button>

              {/* Decorative dots */}
              <div className="flex justify-center gap-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
//     <div className="min-h-screen bg-[#0a0f1a] text-blue-100 flex flex-col items-center justify-center px-4">

//   {/* Card Container */}
//   <div className="bg-[#111827] border border-blue-500/20 rounded-2xl shadow-xl p-6 w-full max-w-lg">

//     {/* Title */}
//     <h2 className="text-3xl font-bold text-blue-400 text-center mb-4 tracking-wide">
//       Welcome to NoteHub
//     </h2>

//     <p className="text-blue-200 text-center mb-6">
//       Store notes, manage tasks, and collaborate in real time.
//     </p>

//     {/* Action Buttons */}
//     <div className="flex flex-col gap-3">

//       <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-blue-600/30 transition-all">
//         Create Directory
//       </button>

//       <button className="w-full py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-medium transition-all">
//         View Notes
//       </button>

//     </div>
//   </div>
// </div>

  );
}
