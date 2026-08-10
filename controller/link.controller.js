const Link = require('../model/link.model');
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({});

// Extract YouTube video ID from various URL formats
function extractVideoId(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
  return match ? match[1] : null;
}

// Generate summary endpoint using Gemini AI directly
const generateSummary = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const prompt = `Generate a structured JSON summary with 4 detailed chapters for a YouTube video URL: ${youtubeUrl}. Each chapter must contain a "heading", "desc" (2 short sentences explaining the topic), and approximate "timestamp" (e.g., "00:00", "03:15", "10:30", "18:45"). Only return valid JSON as a raw array of objects (do not wrap in markdown code blocks like json).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();
    text = text.replace(/```json|```/g, '').trim();
    const summary = JSON.parse(text);

    res.json({ summary });
  } catch (err) {
    console.error("FULL AI ERROR:", err);
    res.status(500).json({ error: err.message || 'Could not generate summary.' });
  }
};

const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLinkById = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ error: 'Article not found' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLink = async (req, res) => {
  try {
    const newLink = new Link(req.body);
    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const deletedLink = await Link.findByIdAndDelete(req.params.id);
    if (!deletedLink) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  generateSummary,
  getAllLinks,
  getLinkById,
  createLink,
  deleteLink,
};