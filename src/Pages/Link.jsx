import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../app/apiInstance";

function Link() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Input state
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("");

  // Error / Status
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // Preview
  const [previewData, setPreviewData] = useState(null);

  // Logged-in username
  const currentUsername =
    localStorage.getItem("userName") ||
    localStorage.getItem("username");

  // =========================
  // FETCH ARTICLES
  // =========================
  const fetchArticles = async () => {
    if (!currentUsername) {
      navigate("/AI_Blog_Articles/login");
      return;
    }

    try {
      const res = await api.get(`/blogs/user/${currentUsername}`);

      setAllArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "Error fetching articles:",
        err.response?.data || err.message
      );

      setAllArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH SINGLE ARTICLE
  // =========================
  useEffect(() => {
    const fetchSingleArticle = async () => {
      if (!id) {
        await fetchArticles();
        return;
      }

      try {
        const res = await api.get(`/blogs/${id}`);

        setArticle(res.data);
      } catch (err) {
        console.error(
          "Error fetching article:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSingleArticle();
  }, [id]);

  // =========================
  // YOUTUBE EMBED URL
  // =========================
  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      let videoId = null;

      // youtube.com/watch?v=VIDEO_ID
      if (parsedUrl.hostname.includes("youtube.com")) {
        videoId = parsedUrl.searchParams.get("v");

        // youtube.com/embed/VIDEO_ID
        if (!videoId && parsedUrl.pathname.startsWith("/embed/")) {
          videoId = parsedUrl.pathname.split("/embed/")[1];
        }

        // youtube.com/shorts/VIDEO_ID
        if (!videoId && parsedUrl.pathname.startsWith("/shorts/")) {
          videoId = parsedUrl.pathname.split("/shorts/")[1];
        }
      }

      // youtu.be/VIDEO_ID
      if (parsedUrl.hostname === "youtu.be") {
        videoId = parsedUrl.pathname.substring(1);
      }

      if (!videoId) return null;

      videoId = videoId.split("?")[0].split("&")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      return null;
    }
  };

  // =========================
  // GENERATE PREVIEW
  // =========================
  const handleGeneratePreview = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsSuccessMessage(false);

    if (!youtubeUrlInput.trim()) {
      setErrorMessage("Please enter a YouTube link!");
      return;
    }

    const embed = getEmbedUrl(youtubeUrlInput);

    if (!embed) {
      setErrorMessage("Please enter a valid YouTube URL!");
      return;
    }

    setErrorMessage(
      "Fetching transcript and generating AI summary..."
    );
    setIsSuccessMessage(true);

    let videoTitle = "YouTube Video AI Insights & Notes";

    // =========================
    // GET YOUTUBE TITLE
    // =========================
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(
          youtubeUrlInput
        )}&format=json`
      );

      if (response.ok) {
        const data = await response.json();

        if (data?.title) {
          videoTitle = data.title;
        }
      }
    } catch (err) {
      console.warn("Could not fetch YouTube title:", err);
    }

    // =========================
    // AI SUMMARY
    // =========================
    try {
      const summaryRes = await api.post(
        "/link/generate-summary",
        {
          youtubeUrl: youtubeUrlInput,
        }
      );

      const summary = Array.isArray(summaryRes.data?.summary)
        ? summaryRes.data.summary
        : [];

      setPreviewData({
        title: videoTitle,
        youtubeUrl: youtubeUrlInput,
        username: currentUsername,
        status: "published",
        date: new Date().toLocaleDateString(),
        description: `Complete chapter-wise AI breakdown and detailed notes extracted from: ${videoTitle}`,
        summary: summary,
      });

      setErrorMessage("");
      setIsSuccessMessage(false);
    } catch (err) {
      console.error(
        "Error generating AI summary:",
        err.response?.data || err.message
      );

      setErrorMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to generate AI summary from transcript."
      );

      setIsSuccessMessage(false);
    }
  };

  // =========================
  // SAVE TO LIBRARY
  // =========================
  const handleSaveToLibrary = async () => {
    if (!previewData) return;

    try {
      const res = await api.post("/blogs", previewData);

      const newId = res.data?._id || res.data?.id;

      if (newId) {
        navigate(`/AI_Blog_Articles/links/${newId}`);
      } else {
        await fetchArticles();

        setYoutubeUrlInput("");
        setPreviewData(null);
      }
    } catch (err) {
      console.error(
        "Error saving article:",
        err.response?.data || err.message
      );

      alert(
        "Failed to save: " +
          (err.response?.data?.error ||
            err.response?.data?.message ||
            err.message)
      );
    }
  };

  // =========================
  // DELETE ARTICLE
  // =========================
  const handleDeleteArticle = async (deleteId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete this saved link?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/blogs/${deleteId}`);

      setAllArticles((prev) =>
        prev.filter(
          (item) => (item._id || item.id) !== deleteId
        )
      );
    } catch (err) {
      console.error(
        "Error deleting article:",
        err.response?.data || err.message
      );

      alert(
        "Failed to delete the article."
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A13] flex justify-center items-center">
        <p className="text-cyan-400 font-bold animate-pulse">
          Loading YouLearn View...
        </p>
      </div>
    );
  }

  // =========================================================
  // LIBRARY PAGE
  // =========================================================
  if (!id) {
    return (
      <div className="min-h-screen bg-[#070A13] text-gray-100 p-6 md:p-12 pt-28 max-w-6xl mx-auto">

        {/* INPUT BANNER */}
        <div className="bg-[#0B0F19] p-6 md:p-8 rounded-3xl border border-gray-800 shadow-2xl mb-8">

          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>

            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Paste YouTube Link to Generate YouLearn View
            </h2>
          </div>

          <form
            onSubmit={handleGeneratePreview}
            className="space-y-4"
          >
            <div className="flex gap-4">

              <input
                type="text"
                value={youtubeUrlInput}
                onChange={(e) =>
                  setYoutubeUrlInput(e.target.value)
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 bg-[#121826] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none"
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Generate Preview
              </button>

            </div>

            {errorMessage && (
              <p
                className={`text-xs font-bold mt-2 ${
                  isSuccessMessage
                    ? "text-cyan-400 animate-pulse"
                    : "text-rose-400"
                }`}
              >
                {errorMessage}
              </p>
            )}
          </form>
        </div>

        {/* PREVIEW */}
        {previewData && (
          <div className="mb-16 bg-[#0B0F19] border-2 border-cyan-500/50 p-6 md:p-8 rounded-3xl shadow-2xl">

            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-800">

              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                ✨ Preview Mode (Not Saved Yet)
              </span>

              <button
                onClick={handleSaveToLibrary}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <i className="bi bi-bookmark-fill"></i>
                Save to Library
              </button>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* VIDEO */}
              <div className="lg:col-span-7 space-y-4">

                <div className="w-full bg-black aspect-video rounded-2xl overflow-hidden border border-gray-800">

                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(
                      previewData.youtubeUrl
                    )}
                    title={previewData.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                </div>

                <h3 className="text-lg font-black text-white">
                  {previewData.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {previewData.description}
                </p>

              </div>

              {/* SUMMARY */}
              <div className="lg:col-span-5 bg-[#121826]/80 p-5 rounded-2xl border border-gray-800 flex flex-col h-[450px] overflow-y-auto space-y-4 custom-scrollbar">

                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2 sticky top-0 bg-[#121826] py-1">
                  <i className="bi bi-stars text-purple-400"></i>
                  AI Summary & Chapters
                </h4>

                {Array.isArray(previewData.summary) &&
                previewData.summary.length > 0 ? (
                  previewData.summary.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#0B0F19] rounded-xl border border-gray-800 space-y-2"
                    >

                      <div className="flex items-center justify-between">

                        <h5 className="text-xs font-bold text-cyan-300 leading-snug">
                          {item.heading ||
                            `Key Insight ${idx + 1}`}
                        </h5>

                        {item.timestamp && (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 whitespace-nowrap ml-2">
                            {item.timestamp}
                          </span>
                        )}

                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed font-normal">
                        {item.desc || item}
                      </p>

                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center">
                    No summary available.
                  </p>
                )}

              </div>
            </div>
          </div>
        )}

        {/* SAVED LINKS */}
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center justify-between">

          <span>Saved Links Library</span>

          <span className="text-xs text-gray-500 font-medium">
            Total: {allArticles.length}
          </span>

        </h3>

        {allArticles.length === 0 ? (
          <div className="text-center py-16 bg-[#0B0F19]/40 rounded-3xl border border-gray-800/60">

            <p className="text-gray-500 text-sm">
              No links saved in library yet.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {allArticles.map((item) => {

              const itemId = item._id || item.id;

              return (
                <div
                  key={itemId}
                  onClick={() =>
                    navigate(
                      `/AI_Blog_Articles/links/${itemId}`
                    )
                  }
                  className="relative bg-[#0B0F19]/60 border border-gray-800/80 hover:border-cyan-500/50 p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl"
                >

                  {/* DELETE */}
                  <button
                    onClick={(e) =>
                      handleDeleteArticle(itemId, e)
                    }
                    className="absolute top-4 right-4 text-gray-500 hover:text-rose-400 bg-[#121826] hover:bg-rose-500/10 p-2.5 rounded-xl border border-gray-800 hover:border-rose-500/30 transition-all duration-200 cursor-pointer z-10"
                    title="Delete Link"
                  >
                    🗑️
                  </button>

                  <div>

                    <div className="flex items-center justify-between mb-3 pr-10">

                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                        YouTube Video
                      </span>

                      <span className="text-xs text-gray-500 font-medium">
                        {item.date}
                      </span>

                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                      {item.title || "Untitled Video"}
                    </h4>

                    <p className="text-xs text-gray-400 line-clamp-2 mb-6 leading-relaxed">
                      {item.youtubeUrl}
                    </p>

                  </div>

                  <div className="flex items-center text-xs font-bold text-cyan-400 gap-1 pt-4 border-t border-gray-800/60">

                    <span>
                      Open YouLearn View
                    </span>

                    <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // DETAIL VIEW
  // =========================================================
  return (
    <div className="min-h-screen bg-[#070A13] text-gray-100 p-6 md:p-10 pt-24">

      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() =>
            navigate("/AI_Blog_Articles/links")
          }
          className="mb-6 text-xs font-bold text-gray-400 hover:text-cyan-400 bg-[#0B0F19] px-4 py-2.5 rounded-xl border border-gray-800 transition-colors cursor-pointer flex items-center gap-1.5 w-fit"
        >
          <i className="bi bi-arrow-left"></i>
          Back to Links Library
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* VIDEO + DESCRIPTION */}
          <div className="lg:col-span-7 space-y-6">

            {article?.youtubeUrl &&
            getEmbedUrl(article.youtubeUrl) ? (

              <div className="w-full bg-black aspect-video rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">

                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(article.youtubeUrl)}
                  title={article.title || "YouTube Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

              </div>

            ) : (

              <div className="w-full bg-[#0B0F19] aspect-video rounded-3xl border border-gray-800 flex items-center justify-center text-gray-500 text-sm">
                No Video URL Provided
              </div>

            )}

            <div className="bg-[#0B0F19]/60 p-6 md:p-8 rounded-3xl border border-gray-800">

              <h1 className="text-2xl md:text-3xl font-black text-cyan-400 mb-2 uppercase tracking-tight">
                {article?.title || "Untitled Video"}
              </h1>

              <p className="text-gray-500 text-xs font-bold mb-6">
                {article?.date || "Recent"}
              </p>

              <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                {article?.description ||
                  "No description available."}
              </div>

            </div>
          </div>

          {/* AI SUMMARY */}
          <div className="lg:col-span-5 bg-[#0B0F19]/60 p-6 md:p-8 rounded-3xl border border-gray-800 flex flex-col h-[650px]">

            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">

              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">

                <i className="bi bi-stars text-purple-400"></i>

                AI Summary & Notes

              </h3>

              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                Interactive
              </span>

            </div>

            <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">

              {Array.isArray(article?.summary) &&
              article.summary.length > 0 ? (

                article.summary.map((item, index) => (

                  <div
                    key={index}
                    className="p-4 bg-[#121826]/80 rounded-2xl border border-gray-800 hover:border-cyan-500/40 transition-all duration-200 space-y-2"
                  >

                    <div className="flex items-center justify-between">

                      <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">

                        {item.heading ||
                          `Key Insight ${index + 1}`}

                      </h4>

                      {item.timestamp && (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {item.timestamp}
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-normal">
                      {item.desc || item}
                    </p>

                  </div>

                ))

              ) : (

                <p className="text-gray-500 text-sm text-center mt-10">
                  No summary generated for this link.
                </p>

              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Link;