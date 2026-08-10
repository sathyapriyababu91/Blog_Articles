const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// Initialize the Google Gen AI SDK (it automatically picks up process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({});

const generateSummary = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Call the correct model using the modern syntax
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize this article into 6 short simple sentences. Provide only the plain sentences separated by newlines. Do not include numbers, bullets, or any introductory text:\n\n${description}`,
    });

    res.json({
      summary: response.text,
    });

  } catch (err) {
    console.error("Gemini API Error:", err);

    res.status(500).json({
      message: err.message || "Failed to generate summary",
      status: err.status || 500,
      details: err.errorDetails || null,
    });
  }
};

module.exports = { generateSummary };