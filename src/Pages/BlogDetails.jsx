import { useParams, useNavigate } from "react-router-dom";
import { blogs as staticBlogs } from "../data/blogs";
import React, { useState, useEffect } from "react";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [count, setCount] = useState(Math.floor(Math.random() * 40) + 10);
  const [scrollProgress, setScrollProgress] = useState(0);

  // =========================
  // Fetch Blog
  // =========================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    fetchSingleBlog();
  }, [id]);

  const fetchSingleBlog = async () => {
    setLoading(true);

    try {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

      if (isMongoId) {
        // MongoDB blog
        const res = await axios.get(
          `http://localhost:8080/api/blogs/${id}`
        );

        if (res.data) {
          setBlog(res.data);
        }
      } else {
        // Static blog
        const foundStatic = staticBlogs.find(
          (b) => b.id === id
        );

        if (foundStatic) {
          setBlog(foundStatic);
        }
      }
    } catch (err) {
      console.error(
        "Failed to load blog:",
        err.response?.data || err.message
      );

      // Fallback to static blog
      const foundStatic = staticBlogs.find(
        (b) => b.id === id
      );

      if (foundStatic) {
        setBlog(foundStatic);
      }
    } finally {
      const allStaticRelated = staticBlogs.filter(
        (b) => b.id !== id
      );

      setRelatedBlogs(allStaticRelated);
      setLoading(false);
    }
  };

  // =========================
  // Scroll Progress
  // =========================
  useEffect(() => {
    const updateScrollProgress = () => {
      const totalScroll =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const currentScroll = window.scrollY;

      const scrollPercentage =
        totalScroll > 0
          ? (currentScroll / totalScroll) * 100
          : 0;

      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", updateScrollProgress);

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollProgress
      );
    };
  }, []);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A13] flex justify-center items-center">
        <p className="text-cyan-400 font-bold animate-pulse">
          Loading Article Details...
        </p>
      </div>
    );
  }

  // =========================
  // Blog Not Found
  // =========================
  if (!blog) {
    return (
      <div className="p-20 text-center bg-[#070A13] min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl font-bold text-gray-500">
          😢 Article not found
        </p>

        <button
          onClick={() =>
            navigate("/AI_Blog_Articles/blog")
          }
          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs uppercase font-extrabold tracking-widest hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
        >
          Back to Explorer
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 bg-gradient-to-b from-[#070A13] to-[#04060c] min-h-screen relative">

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_#22d3ee] transition-all duration-75"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Main Article Content */}
        <div className="lg:col-span-2 bg-[#0B0F19]/65 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl p-6 md:p-8 flex flex-col justify-between">

          <div>

            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#070A13] border border-gray-800/50 shadow-inner">

              <img
                src={
                  blog.image ||
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"
                }
                className="w-full h-full object-cover opacity-85"
                alt={blog.title}
              />

              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] uppercase font-black tracking-widest px-3.5 py-1.5 rounded-lg shadow-md">
                  🚀 {blog.category1 || "Tech"}
                </span>
              </div>

            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-black text-cyan-400 mt-6 leading-tight tracking-tight uppercase">
              {blog.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 my-6 p-4 bg-[#121826]/40 rounded-2xl border border-gray-800/60">

              <div className="w-11 h-11 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">
                {blog.author?.[0] ||
                  blog.username?.[0] ||
                  "A"}
              </div>

              <div>
                <p className="text-sm font-extrabold text-gray-200">
                  {blog.author ||
                    blog.username ||
                    "Admin"}
                </p>

                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                  Published on {blog.date || "Recent"} • 4 min read
                </p>
              </div>

            </div>

            {/* Description */}
            <p className="leading-relaxed whitespace-pre-line text-gray-300 text-base font-medium tracking-wide">
              {blog.full || blog.description}
            </p>

          </div>

          {/* Like + Share */}
          <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-900">

            <button
              onClick={() => {
                setLike(!like);
                setCount(
                  like ? count - 1 : count + 1
                );
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                like
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/5"
                  : "bg-[#121826] border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <span>{like ? "❤️" : "🤍"}</span>
              <span>{like ? "Liked" : "Like"}</span>

              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gray-800">
                {count}
              </span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: blog.title,
                      url: window.location.href,
                    })
                    .catch(console.error);
                } else {
                  navigator.clipboard.writeText(
                    window.location.href
                  );

                  alert(
                    "Link copied to clipboard! 🔗"
                  );
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              🔗 Share
            </button>

          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-[#0B0F19]/60 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl p-6 h-fit sticky top-6">

          <h2 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>Up Next</span>
            <span className="text-base animate-pulse">
              🔥
            </span>
          </h2>

          <div className="space-y-4">

            {relatedBlogs.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(
                    `/AI_Blog_Articles/blog/${item.id}`
                  )
                }
                className="group flex gap-3 p-2 rounded-2xl hover:bg-[#121826]/60 transition-all cursor-pointer border border-transparent hover:border-gray-800/60"
              >

                <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#070A13] border border-gray-900 flex-shrink-0">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-95"
                    alt=""
                  />
                </div>

                <div className="overflow-hidden flex flex-col justify-center">

                  <h3 className="text-sm font-bold text-gray-300 line-clamp-2 group-hover:text-cyan-400">
                    {item.title}
                  </h3>

                  <p className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider truncate">
                    By {item.author}
                  </p>

                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default BlogDetails;