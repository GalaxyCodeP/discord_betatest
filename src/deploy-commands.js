const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readConfig } = require("./config");

async function main() {
  const config = readConfig();

  const commands = [
    new SlashCommandBuilder()
      .setName("setup-beta-panel")
      .setDescription("ส่งแผงลงทะเบียน BETA TESTER ของ THAIBLOCK COMMUNITY")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(config.token);

  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );

  console.log("Deployed slash commands successfully.");
}

main().catch((error) => {
  console.error("Failed to deploy slash commands:", error);
  process.exitCode = 1;
});
