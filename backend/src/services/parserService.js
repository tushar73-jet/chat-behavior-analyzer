const { parse } = require("whatsapp-chat-parser");

const parseChat = async (fileContent) => {
  try {
    if (!fileContent) throw new Error("File content is empty.");
    
    // Log snippet for debugging
    console.log("Analyzing file starting with:", fileContent.substring(0, 50));
    
    const rawMessages = parse(fileContent); // v4 usually exports parse directly

    if (!rawMessages || rawMessages.length === 0) {
      throw new Error("No chat messages found in file. Ensure it's a valid WhatsApp .txt export.");
    }

    const normalizedMessages = rawMessages.map((msg) => ({
      timestamp: msg.date.toISOString(),
      sender: msg.author,
      message: msg.message,
    }));

    return normalizedMessages;
  } catch (error) {
    console.error("Error parsing chat:", error.message);
    throw new Error(`Parsing Error: ${error.message}`);
  }
};

module.exports = {
  parseChat,
};
