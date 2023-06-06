const { Client, Intents, GatewayIntentBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static').path;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const cmdsk2000 = new SlashCommandBuilder()
    .setName('k2000')
    .setDescription('Fait la commande pour le savoir :)');

const pingpong = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Fait la commande pour le savoir :)');

const minecraft = new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription("Pour avoir l'IP sur serveur Minecraft Britania");

const play = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Ne pas utiliser en cours de développement')
    .addStringOption(option =>
        option.setName('url')
            .setDescription('Ne pas utiliser en cours de développement - URL de la vidéo YouTube')
            .setRequired(true));

client.once('ready', () => {
    client.guilds.cache.forEach(guild => {
        guild.commands.set([cmdsk2000.toJSON(), pingpong.toJSON(), minecraft.toJSON(), play.toJSON()])
            .then(() => {
                console.log(`Slash commands registered for guild "${guild.name}" (${guild.id})`);
            })
            .catch(console.error);
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'k2000') {
        interaction.reply('<@440189962638327828>... Que dire sur ce monsieur, On peut dire qu\'il est toujours derrière le Monsieur <@256893525768011776> et c\'est pas le seul, il est aussi derrière <@263686495167184906> ' + 'https://media.tenor.com/o3AN6z7vah8AAAAC/vilebrequin-vilebrequin-merde.gif');
    } else if (commandName === 'ping') {
        interaction.reply('Pong!');
    } else if (commandName === 'minecraft') {
        interaction.reply('Salut ! L\'IP du serveur Britania est : 000.000.000.000');
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
                ffmpeg: ffmpegPath
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

client.login("mettre_le_token_du_bot");
