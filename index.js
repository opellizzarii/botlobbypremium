const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

const app = express();
app.use(express.json());

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);

app.post('/mover-times', async (req, res) => {
  const { timeA, timeB } = req.body;

  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const canalA = await guild.channels.fetch(process.env.CALL_A_ID);
    const canalB = await guild.channels.fetch(process.env.CALL_B_ID);

    for (const id of timeA) {
      const membro = await guild.members.fetch(id);
      if (membro.voice.channel) {
        await membro.voice.setChannel(canalA);
      }
    }

    for (const id of timeB) {
      const membro = await guild.members.fetch(id);
      if (membro.voice.channel) {
        await membro.voice.setChannel(canalB);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao mover jogadores' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API rodando');
});
