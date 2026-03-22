const parserService = require("../services/parserService");


const analyzeChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Convert buffer to string
    const fileContent = req.file.buffer.toString("utf-8");

    // Parse the chat content
    const parsedData = await parserService.parseChat(fileContent);

    // Initial response with the parsed data
    res.json({
      message: "Chat parsed successfully.",
      count: parsedData.length,
      data: parsedData,
    });
  } catch (error) {
    console.error("Analysis controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  analyzeChat,
};
