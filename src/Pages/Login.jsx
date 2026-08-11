import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../app/apiInstance'

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const validate = () => {
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
      const res = await api.post("/auth/login", form);

      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLogin", "true");
      localStorage.setItem(
        "username",
        res.data.username || res.data.name || res.data.userName
      );

      window.dispatchEvent(new Event("authChange"));

      navigate("/AI_Blog_Articles");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid Email or Password"
      );
    }
  };

  return (
    <div className='min-h-screen bg-[#070A13] flex items-center justify-center p-4 md:p-10'>
      <div className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#0B0F19]/60 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl overflow-hidden'>
        
        {/* LEFT - LUXURY AI IMAGE SECTION */}
        <div className="hidden md:block w-full h-full min-h-[550px] relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          <img 
            src="https://i.pinimg.com/736x/b2/e7/b5/b2e7b526d3f2125edaaf10ec8536507e.jpg" 
            alt="AI Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#070A13] via-[#070a1380] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-12 left-10 text-white z-10">
            <h2 className="text-4xl font-extrabold tracking-tight">AI Insights</h2>
            <p className="text-cyan-400 mt-2 font-medium tracking-widest uppercase text-xs">Unlock Intelligent Content</p>
          </div>
        </div>

        {/* RIGHT - LOGIN FORM SECTION */}
        <div className='flex items-center justify-center w-full p-8 md:p-12 bg-[#0B0F19]/40'>
          <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col'>
            <div className="mb-8">
              <h2 className='text-3xl font-extrabold text-white tracking-tight uppercase text-cyan-400'>Welcome Back</h2>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1.5">Please enter your details.</p>
            </div>

            {error && (
              <div className='bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold px-4 py-3.5 rounded-xl mb-5 flex items-center gap-2'>
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <input
                className='w-full bg-[#121826] border border-gray-800/80 px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500'
                type="email"
                placeholder='Email Address'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className='w-full bg-[#121826] border border-gray-800/80 px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500'
                type="password"
                placeholder='Password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button type="submit" className="w-full py-3.5 text-xs uppercase font-extrabold tracking-widest rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all">
              Login In
            </button>

            <p className='mt-6 text-xs uppercase tracking-wider font-semibold text-gray-500 text-center'>
              Don't have an account?
              <Link className='text-cyan-400 font-extrabold ml-2' to={'/AI_Blog_Articles/signup'}>Sign up for free</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login