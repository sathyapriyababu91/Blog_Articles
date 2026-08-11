import React, { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { navLinks } from '../data/navLinks'

function Navbar() {
  const [isLogin, setIsLogin] = useState(false)
  const [username, setUsername] = useState("") 
  const navigate = useNavigate()

  const checkLogin = () => {
    const loginStatus = localStorage.getItem("isLogin")
    setIsLogin(loginStatus === "true")
    
    if (loginStatus === "true") {
      setUsername(localStorage.getItem("username") || "User")
    }
  }

  useEffect(() => {
    checkLogin()
    const handleAuthChange = () => {
      checkLogin()
    }
    window.addEventListener("authChange", handleAuthChange)
    return () => {
      window.removeEventListener("authChange", handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLogin")
    localStorage.removeItem("username")
    setIsLogin(false)
    setUsername("")
    navigate("/AI_Blog_Articles/login")
  }

  return (
    <nav className="bg-[#0B0F19]/80 backdrop-blur-xl border-b border-gray-800/60 sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-10 py-4">
        
        {/* LOGO */}
        <Link
          to="/AI_Blog_Articles/blog"
          className="flex items-center gap-2.5 text-2xl font-black text-white tracking-tight hover:opacity-90 transition duration-200"
        >
          <i className="bi bi-pencil-square bg-gradient-to-tr from-cyan-500 to-blue-600 text-white px-2.5 py-1.5 rounded-xl shadow-lg shadow-cyan-500/20"></i>
          <span className="font-extrabold tracking-square">Blog<span className="text-cyan-400">AI</span></span>
        </Link>

        {/* MIDDLE AI BADGE */}
        <div className="hidden md:flex items-center gap-2 bg-gray-900/80 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-bold border border-cyan-500/30 tracking-wide shadow-sm shadow-cyan-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          🚀 AI CORE ACTIVATED
        </div>

        {/* NAVIGATION LINKS */}
        <ul className="flex gap-6 items-center text-sm font-semibold">
          {navLinks.map((item) => {
            const isWrite = item.name === "Write";
            const isLinks = item.name.toLowerCase() === "links";
            const isSpecialButton = isWrite || isLinks;

            return (
              <li key={item.id}>
                {isSpecialButton ? (
                  <NavLink
                    to={item.ref}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                      isWrite
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                        : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 hover:-translate-y-0.5"
                    }`}
                  >
                    <span>{isWrite ? "✍️" : "🔗"}</span>
                    <span>{item.name}</span>
                  </NavLink>
                ) : (
                  <NavLink
                    to={item.ref}
                    className={({ isActive }) =>
                      `relative py-1 text-xs uppercase tracking-wider transition-colors duration-200 hover:text-cyan-400 ${
                        isActive 
                          ? "text-cyan-400 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan-400 after:rounded-full after:shadow-[0_0_8px_#22d3ee]" 
                          : "text-gray-400"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            );
          })}

          {/* DYNAMIC AUTH BUTTONS */}
          {!isLogin ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-800">
              <Link to="/AI_Blog_Articles/login" className="text-gray-400 hover:text-cyan-400 transition-colors font-bold text-xs uppercase tracking-wider px-2 py-1">
                Login
              </Link>
              <Link to="/AI_Blog_Articles/signup" className="bg-white text-gray-950 px-5 py-2 rounded-full hover:bg-gray-100 transition shadow-md font-bold text-xs uppercase tracking-wider">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6 pl-4 border-l border-gray-800">
              <Link to="/AI_Blog_Articles/profile" className="font-bold text-xs uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity">
                Hi, {username}
              </Link>
              
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-5 py-2 rounded-full hover:bg-rose-600 hover:text-white transition-all duration-200 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar