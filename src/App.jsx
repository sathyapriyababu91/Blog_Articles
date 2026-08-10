import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Write from './Pages/Write'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Blog from './Pages/Blog'
import BlogDetails from './Pages/BlogDetails'

import Footer from './Pages/Footer'
import ProtectedRoute from './Pages/ProtectedRoute'
import Profile from './Pages/Profile'; 
import LinkPage from './Pages/Link'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070A13] text-gray-100 antialiased selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 w-full">
<Routes>
  <Route path="/" element={<Blog />} />
  <Route path="/AI_Blog_Articles" element={<Blog />} />
  
  <Route path="/blog" element={<Blog />} />
  <Route path="/AI_Blog_Articles/blog" element={<Blog />} />
  
  <Route path="/login" element={<Login />} />
  <Route path="/AI_Blog_Articles/login" element={<Login />} />
  
  <Route path="/signup" element={<Signup />} />
  <Route path="/AI_Blog_Articles/signup" element={<Signup />} />
  
  <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
  <Route path="/AI_Blog_Articles/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />

  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/AI_Blog_Articles/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

  <Route path="/blog/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
  <Route path="/AI_Blog_Articles/blog/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />

<Route path="/links" element={<ProtectedRoute><LinkPage /></ProtectedRoute>} />
<Route path="/AI_Blog_Articles/links" element={<ProtectedRoute><LinkPage /></ProtectedRoute>} />

<Route path="/links/:id" element={<ProtectedRoute><LinkPage /></ProtectedRoute>} />
<Route path="/AI_Blog_Articles/links/:id" element={<ProtectedRoute><LinkPage /></ProtectedRoute>} />
</Routes>
     </main>

      <Footer />
    </div>
  )
}

export default App