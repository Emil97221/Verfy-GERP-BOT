const express = require("express");
const axios = require("axios");

const app = express();

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "https://DEINE-WEBSITE.DE/callback";
const BOT_TOKEN = process.env.TOKEN;
const GUILD_ID = "YOUR_GUILD_ID";
const ROLE_ID = "VERIFIED_ROLE_ID";

// HOME
app.get("/", (req, res) => {
  res.send("GERP VERIFY SYSTEM ONLINE");
});

// VERIFY START
app.get("/verify", (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(url);
});

// CALLBACK
app.get("/callback", async (req, res) => {

  const code = req.query.code;

  // TOKEN HOLEN
  const tokenRes = await axios.post("https://discord.com/api/oauth2/token",
    new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  const accessToken = tokenRes.data.access_token;

  // USER INFO
  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const user = userRes.data;

  // ACCOUNT ALTER CHECK (2h = 0.083 Tage)
  const created = new Date(user.id / 4194304 + 1420070400000);
  const ageHours = (Date.now() - created) / 3600000;

  if (ageHours < 2) {
    return res.send("❌ Account zu neu (min 2 Stunden)");
  }

  // ROLE GIVING
  await axios.put(
    `https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}/roles/${ROLE_ID}`,
    {},
    {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      }
    }
  );

  res.send("✅ Verifiziert! Du kannst jetzt zurück zu Discord.");
});

app.listen(3000, () => {
  console.log("WEB SERVER ONLINE");
});
