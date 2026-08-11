import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../app/apiInstance";
import { blogs as staticBlogs } from "../data/blogs"; 

function Blog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedBlogs, setSavedBlogs] = useState([]); 
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "AI", "ML", "FSD", "UI UX", "PY", "DS"];

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin !== "true") {
      navigate("/AI_Blog_Articles/login", { replace: true });
    } else {
      fetchBlogs();
    }
  }, [navigate]);

  const fetchBlogs = async () => {
  try {
    const username = localStorage.getItem("username");

    if (!username) {
      console.log("Username not found in localStorage");
      setBlogs(staticBlogs);
      setLoading(false);
      return;
    }

    const res = await api.get(`/blogs/user/${username}`);

    const userDatabaseBlogs = res.data || [];

    const combinedBlogs = [...userDatabaseBlogs, ...staticBlogs];

    setBlogs(combinedBlogs);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    setBlogs(staticBlogs);
    setLoading(false);
  }
};
  const toggleBookmark = (e, id) => {
    e.stopPropagation(); 
    if (savedBlogs.includes(id)) {
      setSavedBlogs(savedBlogs.filter(bId => bId !== id));
    } else {
      setSavedBlogs([...savedBlogs, id]);
    }
  };

  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category2?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === "All" || 
      blog.category1?.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A13] flex justify-center items-center">
        <p className="text-cyan-400 font-bold animate-pulse">Loading Blogs Library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A13] text-gray-100 pb-24">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col text-center lg:text-left items-center lg:items-start space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Discover Tomorrow's Ideas Today
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-500 tracking-tight leading-[1.15] max-w-xl drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              Explore the World of <br className="hidden lg:block"/>
              AI-Powered Blogging
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-md lg:max-w-none font-medium leading-relaxed">
              Read beautifully structured articles, insights, and expert technical breakdowns.
            </p>

            <div className="w-full max-w-md pt-2">
              <div className="flex items-center bg-[#0B0F19]/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl shadow-2xl px-4 py-3.5 focus-within:border-cyan-500/80 transition-all duration-300">
                <i className="bi bi-search text-gray-500 mr-3 text-base"></i>
                <input 
                  type="text" 
                  placeholder="Search articles or categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none text-sm font-medium text-white placeholder:text-gray-600 bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full min-h-[300px] lg:min-h-[420px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative w-full max-w-[440px] aspect-square rounded-3xl border border-cyan-500/30 bg-[#0B0F19]/60 backdrop-blur-xl overflow-hidden p-2 shadow-[0_0_50px_rgba(6,182,212,0.15)] group animate-float">
              <img
                src="https://i.pinimg.com/736x/8e/e6/51/8ee6511a72b387eb96c6abb8d77dd494.jpg"
                alt="AI Blogging Smart Concept"
                className="w-full h-full object-cover rounded-2xl opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 group-hover:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2.5 mt-12 w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/20"
                  : "bg-[#121826] text-gray-400 border-gray-800/60 hover:border-gray-700 hover:text-white"
              }`}
            >
              {cat === "All" ? "🌐 All Content" : `# ${cat}`}
            </button>
          ))}
        </div>
      </div>

      <hr className="max-w-7xl mx-auto border-gray-900 mb-12 px-6 md:px-10" />

      {/* Articles Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-2 uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span> Articles & Explanations ({selectedCategory})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => {
              const blogId = blog._id || blog.id;
              return (
                <article 
                  key={blogId} 
                  className="group bg-[#0B0F19]/40 border border-gray-800/60 rounded-3xl overflow-hidden shadow-xl hover:border-cyan-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer"
                  onClick={() => navigate(`/AI_Blog_Articles/blog/${blogId}`)}
                >
                  <div className="h-52 w-full relative overflow-hidden bg-[#070A13]">
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#121826] to-[#070A13]"></div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                      <span className="bg-[#0B0F19]/90 backdrop-blur-md text-cyan-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-gray-800">
                        {blog.category1 || "Tech"}
                      </span>
                      {blog.category2 && (
                        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                          {blog.category2}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={(e) => toggleBookmark(e, blogId)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-cyan-400 border border-gray-800 shadow-sm"
                    >
                      <i className={`bi ${savedBlogs.includes(blogId) ? 'bi-bookmark-fill text-cyan-400' : 'bi-bookmark'}`}></i>
                    </button>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2.5 text-[11px] text-gray-500 font-bold uppercase tracking-wide">
                      <span>{blog.date || "Recent"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <i className="bi bi-clock"></i> 4 min read
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-white tracking-tight line-clamp-2 mb-2.5 group-hover:text-cyan-400 transition-colors duration-200">
                      {blog.title}
                    </h2>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6 font-medium">
                      {blog.description || blog.full}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-900 text-[11px] text-gray-500 font-bold">
                      <div className="flex items-center gap-2.5">
                        {blog.authorImage ? (
                          <img 
                            src={blog.authorImage} 
                            alt={blog.author}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-900"
                          />
                        ) : (
                          <i className="bi bi-person-circle text-gray-600 text-sm"></i>
                        )}
                        <span className="text-gray-300 font-extrabold">By {blog.username || blog.author || "Admin"}</span>
                      </div>
                      
                      <i className="bi bi-share text-gray-500 hover:text-cyan-400 text-sm cursor-pointer transition-colors"></i>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-[#0B0F19]/40 rounded-3xl border border-dashed border-gray-800">
              <i className="bi bi-folder2-open text-gray-700 text-5xl mb-3 block"></i>
              <p className="text-gray-500 font-bold">No articles found matching the current matrix.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;