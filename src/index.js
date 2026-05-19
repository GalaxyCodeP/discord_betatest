const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  ModalBuilder,
  Partials,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");
const { readConfig } = require("./config");
const { CUSTOM_IDS, FIELD_IDS } = require("./constants");

const config = readConfig();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === "setup-beta-panel") {
      await handleSetupPanelCommand(interaction);
      return;
    }

    if (interaction.isButton() && interaction.customId === CUSTOM_IDS.openRegisterModal) {
      await showRegisterModal(interaction);
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId === CUSTOM_IDS.registerModal) {
      await handleRegisterSubmit(interaction);
    }
  } catch (error) {
    console.error("Failed to handle interaction:", {
      interactionId: interaction.id,
      customId: interaction.isMessageComponent() || interaction.isModalSubmit() ? interaction.customId : undefined,
      commandName: interaction.isChatInputCommand() ? interaction.commandName : undefined,
      error
    });

    await replyInteractionError(interaction);
  }
});

async function handleSetupPanelCommand(interaction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      content: "คุณไม่มีสิทธิ์ใช้คำสั่งนี้",
      ephemeral: true
    });
    return;
  }

  const panelEmbed = new EmbedBuilder()
    .setColor(0x2f80ed)
    .setTitle(`${config.serverName} | BETA TESTER Registration`)
    .setDescription([
      "เปิดรับสมัครผู้ทดสอบระบบก่อนเปิดใช้งานจริง",
      "",
      "**สิ่งที่ผู้สมัครควรพร้อม**",
      "• เข้าใจพื้นฐานการเล่น Minecraft Java",
      "• แจ้งบั๊กพร้อมรายละเอียดที่ตรวจสอบได้",
      "• เคารพกฎชุมชนและทีมงาน",
      "",
      `กดปุ่ม ${config.registerEmoji} ด้านล่างเพื่อกรอกแบบฟอร์มสมัคร`
    ].join("\n"))
    .addFields(
      {
        name: "ข้อมูลที่ต้องกรอก",
        value: "ชื่อในเกม, อายุ, ประสบการณ์, เหตุผลที่สมัคร และเวลาที่สะดวกทดสอบ",
        inline: false
      },
      {
        name: "หมายเหตุ",
        value: "ทีมงานจะตรวจสอบใบสมัครและติดต่อกลับผ่าน Discord หากผ่านการคัดเลือก",
        inline: false
      }
    )
    .setFooter({ text: `${config.serverName} Beta Program` })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(CUSTOM_IDS.openRegisterModal)
      .setEmoji(config.registerEmoji)
      .setLabel("สมัคร BETA TESTER")
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.channel.send({
    embeds: [panelEmbed],
    components: [row]
  });

  await interaction.reply({
    content: "ส่งแผงลงทะเบียนเรียบร้อยแล้ว",
    ephemeral: true
  });
}

async function showRegisterModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(CUSTOM_IDS.registerModal)
    .setTitle(`${config.serverName} BETA TESTER`);

  const minecraftNameInput = new TextInputBuilder()
    .setCustomId(FIELD_IDS.minecraftName)
    .setLabel("ชื่อ Minecraft Java")
    .setPlaceholder("เช่น SteveTH")
    .setStyle(TextInputStyle.Short)
    .setMinLength(3)
    .setMaxLength(16)
    .setRequired(true);

  const ageInput = new TextInputBuilder()
    .setCustomId(FIELD_IDS.age)
    .setLabel("อายุ")
    .setPlaceholder("เช่น 18")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setRequired(true);

  const experienceInput = new TextInputBuilder()
    .setCustomId(FIELD_IDS.experience)
    .setLabel("ประสบการณ์เล่น Minecraft / ทดสอบเซิร์ฟเวอร์")
    .setPlaceholder("เล่าประสบการณ์แบบสั้น ๆ")
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(10)
    .setMaxLength(700)
    .setRequired(true);

  const reasonInput = new TextInputBuilder()
    .setCustomId(FIELD_IDS.reason)
    .setLabel("เหตุผลที่อยากเป็น BETA TESTER")
    .setPlaceholder("ทำไมคุณถึงเหมาะกับการทดสอบ THAIBLOCK COMMUNITY")
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(10)
    .setMaxLength(700)
    .setRequired(true);

  const availabilityInput = new TextInputBuilder()
    .setCustomId(FIELD_IDS.availability)
    .setLabel("เวลาที่สะดวกทดสอบ")
    .setPlaceholder("เช่น จันทร์-ศุกร์ 19:00-22:00")
    .setStyle(TextInputStyle.Short)
    .setMinLength(3)
    .setMaxLength(100)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(minecraftNameInput),
    new ActionRowBuilder().addComponents(ageInput),
    new ActionRowBuilder().addComponents(experienceInput),
    new ActionRowBuilder().addComponents(reasonInput),
    new ActionRowBuilder().addComponents(availabilityInput)
  );

  await interaction.showModal(modal);
}

async function handleRegisterSubmit(interaction) {
  const minecraftName = interaction.fields.getTextInputValue(FIELD_IDS.minecraftName).trim();
  const ageText = interaction.fields.getTextInputValue(FIELD_IDS.age).trim();
  const experience = interaction.fields.getTextInputValue(FIELD_IDS.experience).trim();
  const reason = interaction.fields.getTextInputValue(FIELD_IDS.reason).trim();
  const availability = interaction.fields.getTextInputValue(FIELD_IDS.availability).trim();

  const validationError = validateRegistration({ minecraftName, ageText, experience, reason, availability });
  if (validationError) {
    await interaction.reply({
      content: validationError,
      ephemeral: true
    });
    return;
  }

  const adminChannel = await client.channels.fetch(config.adminChannelId).catch((error) => {
    console.error("Failed to fetch admin channel:", {
      adminChannelId: config.adminChannelId,
      error
    });
    return null;
  });

  if (!adminChannel || adminChannel.type !== ChannelType.GuildText) {
    await interaction.reply({
      content: "ไม่สามารถส่งใบสมัครได้ กรุณาแจ้งทีมงานให้ตรวจสอบค่า ADMIN_CHANNEL_ID",
      ephemeral: true
    });
    return;
  }

  const adminEmbed = new EmbedBuilder()
    .setColor(0x27ae60)
    .setTitle("ใบสมัคร BETA TESTER ใหม่")
    .setDescription(`มีผู้สมัครเข้าร่วมทดสอบ **${config.serverName}**`)
    .addFields(
      { name: "ผู้สมัคร", value: `${interaction.user} (${interaction.user.tag})`, inline: false },
      { name: "Discord ID", value: interaction.user.id, inline: true },
      { name: "Minecraft Java", value: sanitizeEmbedValue(minecraftName), inline: true },
      { name: "อายุ", value: sanitizeEmbedValue(ageText), inline: true },
      { name: "ประสบการณ์", value: sanitizeEmbedValue(experience), inline: false },
      { name: "เหตุผลที่สมัคร", value: sanitizeEmbedValue(reason), inline: false },
      { name: "เวลาที่สะดวก", value: sanitizeEmbedValue(availability), inline: false }
    )
    .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))
    .setFooter({ text: `User ID: ${interaction.user.id}` })
    .setTimestamp();

  await adminChannel.send({ embeds: [adminEmbed] });

  await interaction.reply({
    content: `ส่งใบสมัคร BETA TESTER ของคุณให้ทีมงาน ${config.serverName} แล้ว`,
    ephemeral: true
  });
}

function validateRegistration({ minecraftName, ageText, experience, reason, availability }) {
  if (!/^[A-Za-z0-9_]{3,16}$/.test(minecraftName)) {
    return "ชื่อ Minecraft Java ต้องมี 3-16 ตัวอักษร และใช้ได้เฉพาะ A-Z, a-z, 0-9 หรือ _";
  }

  if (!/^\d{1,2}$/.test(ageText)) {
    return "อายุต้องเป็นตัวเลข 1-2 หลัก";
  }

  const age = Number.parseInt(ageText, 10);
  if (age < 7 || age > 80) {
    return "กรุณากรอกอายุที่ถูกต้อง";
  }

  if (experience.length < 10 || reason.length < 10) {
    return "กรุณากรอกประสบการณ์และเหตุผลให้มีรายละเอียดมากขึ้น";
  }

  if (availability.length < 3) {
    return "กรุณากรอกเวลาที่สะดวกทดสอบ";
  }

  return null;
}

function sanitizeEmbedValue(value) {
  const cleanValue = value
    .replace(/@everyone/g, "@\u200beveryone")
    .replace(/@here/g, "@\u200bhere")
    .slice(0, 1024);

  return cleanValue.length > 0 ? cleanValue : "-";
}

async function replyInteractionError(interaction) {
  const payload = {
    content: "เกิดข้อผิดพลาดระหว่างประมวลผล กรุณาลองใหม่อีกครั้งหรือแจ้งทีมงาน",
    ephemeral: true
  };

  if (interaction.deferred || interaction.replied) {
    await interaction.followUp(payload).catch(() => {});
    return;
  }

  await interaction.reply(payload).catch(() => {});
}

client.login(config.token);
