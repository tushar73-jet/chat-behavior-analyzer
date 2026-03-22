const parserService = require("../services/parserService");
const statsService = require("../services/statsService");

const analyzeChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileContent = req.file.buffer.toString("utf-8");
    const parsedData = await parserService.parseChat(fileContent);

    // Calculate Behavioral Stats
    const statsAnalysis = statsService.calculateStats(parsedData);

    // Generate Basic Behavioral Insights
    const insights = generateInsights(statsAnalysis);

    res.json({
      message: "Analysis complete",
      ...statsAnalysis,
      insights,
    });
  } catch (error) {
    console.error("Analysis controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

const generateInsights = (analysis) => {
  const insights = [];
  const { userStats } = analysis;
  const users = Object.keys(userStats);
  
  if (users.length < 2) return ["Not enough participants for behavioral comparison."];

  const u1 = users[0];
  const u2 = users[1];

  // Imbalance
  const threshold = 1.3; // 30% difference
  const ratio = userStats[u1].messageCount / userStats[u2].messageCount;
  if (ratio > threshold) insights.push(`${u1} is doing significantly more reaching out.`);
  if (ratio < 1/threshold) insights.push(`${u2} is doing significantly more reaching out.`);

  // Response Time / Ghosting
  if (userStats[u1].avgResponseTimeMinutes > userStats[u2].avgResponseTimeMinutes * 1.5) {
    insights.push(`${u1} takes much longer to respond, potentially indicating ghosting or lower priority.`);
  } else if (userStats[u2].avgResponseTimeMinutes > userStats[u1].avgResponseTimeMinutes * 1.5) {
    insights.push(`${u2} takes much longer to respond.`);
  }

  // Low Effort
  if (userStats[u1].avgWordPerMessage < 3) insights.push(`${u1}'s replies are very dry (low word count).`);
  if (userStats[u2].avgWordPerMessage < 3) insights.push(`${u2}'s replies are very dry.`);

  return insights;
};

module.exports = {
  analyzeChat,
};
