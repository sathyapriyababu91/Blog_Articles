import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../app/apiInstance";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const validate = () => {
    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }

    if (!form.email.includes("@")) {
      setError("Email must contain @");
      return false;
    }

    if (form.password.length < 5) {
      setError("Password must be at least 5 characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await api.post("/auth/register", form);

      alert(res.data.message);

      navigate("/AI_Blog_Articles/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    // PREMIUM FULL DARK WRAPPER
    <div className='min-h-screen bg-[#070A13] flex items-center justify-center p-4 md:p-10'>
      <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#0B0F19]/60 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl overflow-hidden gap-0'>
        
        {/* LEFT - LUXURY COVER WITH AI OVERLAY */}
<div className="relative w-full max-w-[440px] aspect-square rounded-3xl border border-cyan-500/30 bg-[#0B0F19]/60 backdrop-blur-xl overflow-hidden p-2 shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] group animate-float">
  {/* Image with object-cover for perfect fit */}
  <img 
    src="https://i.pinimg.com/736x/8e/e6/51/8ee6511a72b387eb96c6abb8d77dd494.jpg"
    alt="AI Blogging Smart Concept"
    className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700" />
  
  {/* Professional Dark Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-[#070A13] via-[#070a1380] to-transparent" />
  
  {/* Subtle Glowing Pulse effect */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
  
  {/* Branding Text inside Image */}
  <div className="absolute bottom-12 left-10 text-white z-10">
    <h2 className="text-4xl font-extrabold tracking-tight">Join the Future</h2>
    <p className="text-cyan-400 mt-2 font-medium tracking-widest uppercase text-xs">Start your AI journey today</p>
  </div>
</div>
        {/* RIGHT - PREMIUM DARK SIGNUP INTERFACE FORM */}
        <div className='flex items-center justify-center w-full p-8 md:p-12 bg-[#0B0F19]/40'>
          <form
            onSubmit={handleSubmit}
            className='w-full max-w-md flex flex-col'
          >
            <div className="mb-8">
              <h2 className='text-3xl font-extrabold text-white tracking-tight uppercase text-cyan-400 shadow-sm'>
                Create Account
              </h2>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1.5">
                Join us today! Please fill in your credentials.
              </p>
            </div>

            {error && (
              <div className='bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-4 py-3.5 rounded-xl mb-5 flex items-center gap-2'>
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <input
                  className='w-full bg-[#121826] border border-gray-800/80 px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all duration-300'
                  type="text"
                  placeholder='Full Name'
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              <div>
                <input
                  className='w-full bg-[#121826] border border-gray-800/80 px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all duration-300'
                  type="email"
                  placeholder='Email Address'
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <input
                  className='w-full bg-[#121826] border border-gray-800/80 px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all duration-300'
                  type="password"
                  placeholder='Password'
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs uppercase font-extrabold tracking-widest rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/10 transition-all duration-200 active:scale-[0.99] cursor-pointer"
            >
              Register Account
            </button>

            <p className='mt-6 text-xs uppercase tracking-wider font-semibold text-gray-500 text-center'>
              Already have an account?
              <Link
                className='text-cyan-400 font-extrabold ml-2 hover:text-cyan-300 transition-colors'
                to={'/AI_Blog_Articles/login'}
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Signup