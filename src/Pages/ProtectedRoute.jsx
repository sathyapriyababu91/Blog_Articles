import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("isLogin") === "true"
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      
      <div className="min-h-screen bg-[#070A13] flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
        
          <div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
 
          <div className="absolute inset-1.5 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin [animation-duration:0.8s]"></div>
        </div>
        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest animate-pulse">
          Securing Connection...
        </p>
      </div>
    )
  }

  if (!isLogin) {
   
    return <Navigate to="/AI_Blog_Articles/login" replace />
  }

  return children
}

export default ProtectedRoute