import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../app/apiInstance";

function Profile() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [myArticles, setMyArticles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    const storedUsername = localStorage.getItem("userName") || localStorage.getItem("username");

    if (isLogin === "true" && storedUsername) {
      setUsername(storedUsername);
      fetchArticles(storedUsername);
    } else {
      navigate("/AI_Blog_Articles/login");
    }
  }, [navigate]);

  // Fetch articles and changed console log to English
  const fetchArticles = async (currentUsername) => {
  try {
    const response = await api.get(
      `/blogs/user/${currentUsername}`
    );

    console.log("Fetched data from server:", response.data);
    setMyArticles(response.data);
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
};

  // Delete Article Function
  const handleDelete = async (articleId) => {
  if (window.confirm("Are you sure you want to delete this article?")) {
    try {
      await api.delete(`/blogs/${articleId}`);

      setMyArticles(
        myArticles.filter((article) => article._id !== articleId)
      );

      alert("Article deleted successfully!");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article.");
    }
  }
};

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userName");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("authChange")); 
    navigate("/AI_Blog_Articles/login");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-cyan-900/10 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-md shadow-cyan-500/30">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {username}
              </h1>
              <p className="text-cyan-400 text-sm font-medium">Blogger & AI Enthusiast</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 md:mt-0 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-6 py-2.5 rounded-full hover:bg-rose-600 
            hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider cursor-pointer">
            Logout
          </button>
        </div>

        {/* My Articles Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-3">
            My Articles
          </h2>
          <div className="grid gap-4">
            {myArticles.length > 0 ? (
              myArticles.map((article) => (
                <div key={article._id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div 
                      className="cursor-pointer flex-1" 
                      onClick={() => setExpandedId(expandedId === article._id ? null : article._id)}
                    >
                      <h3 className="text-lg font-semibold text-gray-200 hover:text-cyan-400">
                        {article.title ? article.title : "Untitled Article"}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
  article.status === 'published' 
    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
    : 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
}`}>
  {article.status}
</span>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="bg-red-300/7 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {expandedId === article._id && (
                    <div className="mt-4 pt-4 border-t border-gray-700 text-gray-300">
                      <p className="text-sm">{article.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-6">No articles found. Start writing your first blog!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;