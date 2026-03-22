const whatsappParser = require("whatsapp-chat-parser");


const parseChat = async (fileContent) => {
  try {
    const rawMessages = whatsappParser.parse(fileContent);

    // Normalize the output to ensure consistency
    const normalizedMessages = rawMessages.map((msg) => ({
      timestamp: msg.date.toISOString(),
      sender: msg.author,
      message: msg.message,
    }));

    return normalizedMessages;
  } catch (error) {
    console.error("Error parsing chat:", error);
    throw new Error("Failed to parse chat file. Please ensure it is a valid export.");
  }
};

module.exports = {
  parseChat,
};
