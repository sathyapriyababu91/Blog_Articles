import React from 'react'

function Footer() {
  return (
    <footer className='bg-[#0B1220] text-white border-t border-gray-800/50 mt-auto'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10'>

        {/* BRAND & SOCIAL SECTION */}
        <div className="col-span-2 md:col-span-1">
          <div className='flex items-center gap-2 mb-5'>
            <i className="bi bi-pencil-square bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1.5 rounded-xl shadow-sm shadow-blue-500/20"></i>
            <span className='text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
              BlogAI
            </span>
          </div>
          <p className='text-gray-400 text-sm leading-relaxed mb-6 font-medium max-w-xs'>
            AI-powered blogging platform for modern content creators.
          </p>
          <div className='flex gap-4 text-gray-400 text-lg'>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200"><i className="bi bi-twitter"></i></a>
            <a href="#" className="hover:text-white transition-colors duration-200"><i className="bi bi-github"></i></a>
            <a href="#" className="hover:text-blue-500 transition-colors duration-200"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>

        {/* PRODUCT LINKS */}
        <div>
          <h2 className='font-bold text-sm tracking-wider uppercase text-gray-300 mb-5'>
            Product
          </h2>
          <ul className='space-y-3 text-gray-400 text-sm font-medium'>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Browse Articles</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Write Article</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">AI Features</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Pricing</a></li>
          </ul>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h2 className='font-bold text-sm tracking-wider uppercase text-gray-300 mb-5'>
            Company
          </h2>
          <ul className='space-y-3 text-gray-400 text-sm font-medium'>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Blog</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Contact</a></li>
          </ul>
        </div>

        {/* LEGAL LINKS */}
        <div>
          <h2 className='font-bold text-sm tracking-wider uppercase text-gray-300 mb-5'>
            Legal
          </h2>
          <ul className='space-y-3 text-gray-400 text-sm font-medium'>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Cookie Policy</a></li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT LOWER BAR */}
      <div className='border-t border-gray-800/60 text-center py-6 text-gray-500 text-xs font-medium tracking-wide'>
        &copy; 2026 BlogAI. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer