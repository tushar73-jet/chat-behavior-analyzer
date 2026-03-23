const dayjs = require("dayjs");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const SESSION_GAP_HOURS = 4;

const calculateStats = (messages) => {
  if (!messages || messages.length === 0) return {};

  const participants = [...new Set(messages.map((m) => m.sender))];
  const stats = {};

  participants.forEach((p) => {
    stats[p] = {
      messageCount: 0,
      wordCount: 0,
      avgWordPerMessage: 0,
      totalResponseTime: 0,
      responseCount: 0,
      avgResponseTimeMinutes: 0,
      doubleTextCount: 0,
      initiationCount: 0,
      totalSentiment: 0,
      avgSentiment: 0,
    };
  });

  let lastMessage = null;

  messages.forEach((msg) => {
    const sender = msg.sender;
    const timestamp = dayjs(msg.timestamp);

    // Basic counts
    stats[sender].messageCount++;
    stats[sender].wordCount += msg.message.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Analyze Sentiment
    const sentAnalysis = sentiment.analyze(msg.message);
    stats[sender].totalSentiment += sentAnalysis.comparative;

    if (lastMessage) {
      const lastTimestamp = dayjs(lastMessage.timestamp);
      const diffInMinutes = timestamp.diff(lastTimestamp, "minute");
      const diffInHours = timestamp.diff(lastTimestamp, "hour");

      // Initiation Detection (significant gap)
      if (diffInHours >= SESSION_GAP_HOURS) {
        stats[sender].initiationCount++;
      }

      // Interaction patterns
      if (lastMessage.sender === sender) {
        // Double texting
        stats[sender].doubleTextCount++;
      } else {
        // Response
        stats[sender].totalResponseTime += diffInMinutes;
        stats[sender].responseCount++;
      }
    } else {
      // First message in chat
      stats[sender].initiationCount++;
    }

    lastMessage = msg;
  });

  // Finalize averages and compute derived metrics
  participants.forEach((p) => {
    const pStats = stats[p];
    
    if (pStats.messageCount > 0) {
      pStats.avgWordPerMessage = parseFloat((pStats.wordCount / pStats.messageCount).toFixed(2));
    }
    
    if (pStats.responseCount > 0) {
      pStats.avgResponseTimeMinutes = parseFloat((pStats.totalResponseTime / pStats.responseCount).toFixed(1));
    }

    if (pStats.messageCount > 0) {
      pStats.avgSentiment = parseFloat((pStats.totalSentiment / pStats.messageCount).toFixed(3));
    }

    // Cleaning up raw totals before sending back
    delete pStats.totalSentiment;
    delete pStats.totalResponseTime;
    delete pStats.responseCount;
  });

  return {
    metadata: {
      totalMessages: messages.length,
      participants: participants,
      timespan: {
        start: messages[0].timestamp,
        end: messages[messages.length - 1].timestamp
      }
    },
    userStats: stats
  };
};

module.exports = {
  calculateStats,
};
