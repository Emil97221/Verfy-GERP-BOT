const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
  console.log(`BOT ONLINE: ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {

  if (interaction.isChatInputCommand() && interaction.commandName === "verifysend-embed-gerp") {

    const embed = new EmbedBuilder()
      .setTitle("💚 Verifiziere Dich")
      .setDescription(
`Hey 👋 Willkommen bei GERP!

Um alle Kanäle zu sehen, musst du dich verifizieren.

✔ Anti-Bot Schutz
✔ Captcha Check
✔ Account Prüfung

Klicke unten um zu starten 👍`
      )
      .setColor(0x00ff88);

    const button = new ButtonBuilder()
      .setLabel("Verify 🌐")
      .setStyle(ButtonStyle.Link)
      .setURL("https://DEINE-WEBSITE.DE/verify");

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);
