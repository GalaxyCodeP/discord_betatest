require("dotenv").config();

const requiredKeys = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID", "ADMIN_CHANNEL_ID"];

function readConfig() {
  const missing = requiredKeys.filter((key) => !process.env[key] || process.env[key].trim().length === 0);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    token: process.env.DISCORD_TOKEN.trim(),
    clientId: process.env.CLIENT_ID.trim(),
    guildId: process.env.GUILD_ID.trim(),
    adminChannelId: process.env.ADMIN_CHANNEL_ID.trim(),
    registerEmoji: process.env.REGISTER_EMOJI?.trim() || "📝",
    serverName: process.env.SERVER_NAME?.trim() || "THAIBLOCK COMMUNITY"
  };
}

module.exports = {
  readConfig
};
