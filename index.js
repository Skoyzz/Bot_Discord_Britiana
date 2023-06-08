const { Client, GatewayIntentBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static').path;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  console.log('Le bot est prêt !');
  client.user.setActivity('Développé par Skoyzz'); // Ajout de l'activité
});

const cmdsk2000 = new SlashCommandBuilder()
  .setName('k2000')
  .setDescription('Fait la commande pour le savoir :)');

const pingpong = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Je me demande que ce cache derrière cette commande');

const minecraft = new SlashCommandBuilder()
  .setName('minecraft')
  .setDescription("Pour avoir l'IP Minecraft Britania");

const play = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Ne pas utiliser en cours de développement')
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('Lecture possible MAIS il y a pas de queue !! -- En cours de développement - URL de la vidéo YouTube')
      .setRequired(true)
  );

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'k2000') {
    interaction.reply(
      '<@440189962638327828>... Que dire sur ce monsieur, On peut dire qu\'il est toujours derrière le Monsieur <@256893525768011776> et c\'est pas le seul, il est aussi derrière <@263686495167184906> ' +
        'https://media.tenor.com/o3AN6z7vah8AAAAC/vilebrequin-vilebrequin-merde.gif'
    );
  } else if (commandName === 'ping') {
    interaction.reply('Pong!');
  } else if (commandName === 'minecraft') {
    interaction.reply("Salut ! L'IP du serveur Britania est : play.britania-minecraft.fr");
  } else if (commandName === 'play') {
    const url = options.getString('url');
    if (!url) {
      interaction.reply('Veuillez fournir une URL de vidéo YouTube valide !');
      return;
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      interaction.reply('Vous devez rejoindre un salon vocal d\'abord !');
      return;
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        ffmpeg: ffmpegPath,
      });

      const stream = ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      interaction.reply('La lecture de la musique a commencé !');
    } catch (error) {
      console.error(error);
      interaction.reply('Une erreur s\'est produite lors de la lecture de la musique.');
    }
  }
});

client.login("token");
