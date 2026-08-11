import api from "../../app/apiInstance";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Write() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState([]);
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

 useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "true") {
      alert("Please login first");
      navigate("/AI_Blog_Articles/login", { replace: true });
    }
  }, [navigate]);

 // Generate AI Summary
  const handleGenerateSummary = async () => {
    if (!description.trim()) {
      setMessage("Please write a description first.");
      return;
    }

    setIsGenerating(true);
    setMessage("Generating AI summary...");

    try {
      const response = await api.post(
  "/generate-summary",
  {
    description,
  }
);

      const summaryText = response.data.summary;

      const pointsArray = summaryText
        .split("\n")
        .map((line) => line.replace(/^(\d+[\.\)]\s*|[*•-]\s*)/g, "").trim())
        .filter((line) => line !== "" && !line.toLowerCase().includes("here are"));

      setSummary(pointsArray);
      setMessage("");
    } catch (error) {
      console.error(error.response?.data);
      setMessage("Failed to generate summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Blog
  const handleSave = async (status) => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill title and description.");
      return;
    }

   const currentUsername = localStorage.getItem("userName") || localStorage.getItem("username");

    const newArticle = {
  title,
  description,
  summary: summary.join("\n"),
  tags,
  username: currentUsername,
  category1: tags ? tags.split(",")[0].trim() : "Tech",
  status,
  date: new Date().toLocaleDateString(),
};

    try {
      await api.post(
  "/blogs",
  newArticle
);
      

      alert(`Article ${status} successfully!`);
      navigate("/AI_Blog_Articles/blog");
    } catch (error) {
      console.error(error);
      alert("Failed to save article.");
    }
  };

  // Clear Form
  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setSummary([]);
    setTags("");
    setMessage("");
  };
  const wordCount = description.trim()
  ? description.trim().split(/\s+/).length
  : 0;

const readingTime = Math.max(1, Math.ceil(wordCount / 200));

 return (
  <div className="min-h-screen bg-[#070A13] text-white flex justify-center items-center p-6">
    <div className="w-full max-w-3xl bg-[#0B0F19] p-8 rounded-2xl shadow-xl">

      <div className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-4xl font-bold text-cyan-400">
          ✍️ Create New Article
        </h1>

        <p className="text-gray-400 mt-2">
          Write your ideas and generate AI-powered summaries.
        </p>
      </div>

        <input
          className="w-full p-3 rounded-lg bg-[#161B26] mb-4 outline-none border border-transparent focus:border-cyan-500"
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="8"
          className="w-full p-3 rounded-lg bg-[#161B26] mb-4 outline-none border border-transparent focus:border-cyan-500"
          placeholder="Write article..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-between text-sm text-gray-400 mb-4">
  <span>📝 Words: {wordCount}</span>
  <span>🔠 Characters: {description.length}</span>
</div>

<p className="text-cyan-400 text-sm mb-4">
  📖 Reading Time: {readingTime} min
</p>

        <button
  onClick={handleGenerateSummary}
  disabled={isGenerating}
 className={`px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:scale-105 ${
  isGenerating ? "opacity-50 cursor-not-allowed" : ""
}`}
>
  {isGenerating ? "Generating..." : "✨ Generate AI Summary"}
</button>

        {message && (
          <p className="text-yellow-300 mb-4">{message}</p>
        )}

        {summary.length > 0 && (
          <div className="bg-[#161B26] p-4 rounded-xl mb-4">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">
              AI Summary
            </h2>

            <ol className="list-decimal pl-5 space-y-2">
              {summary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        )}

        <input
          className="w-full p-3 rounded-lg bg-[#161B26] mb-6 outline-none border border-transparent focus:border-cyan-500"
          placeholder="Tags (Example: React, JavaScript)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex flex-wrap gap-4">

          <button
  onClick={handleCancel}
  className="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-500 text-white transition-all duration-300 font-semibold shadow-lg hover:scale-105"
>
  🗑 Clear
</button>

         <button
  onClick={() => handleSave("draft")}
  className="px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-500 text-white transition-all duration-300 font-semibold shadow-lg hover:scale-105"
>
  💾 Save Draft
</button>

          <button
            onClick={() => handleSave("published")}
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-white transition-all duration-300 font-semibold shadow-lg hover:scale-105"
          >
            🚀 Publish
          </button>

        </div>

      </div>
    </div>
  );
}

export default Write;     
