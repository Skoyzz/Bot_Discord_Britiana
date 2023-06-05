const { Client, GatewayIntentBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const cmdsk2000 = new SlashCommandBuilder()
    .setName("k2000")
    .setDescription("Fait la commande pour le savoir :)");

const pingpong = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Fait la commande pour le savoir :)");

client.on("ready", () => {
    client.application.commands.set([cmdsk2000.toJSON(), pingpong.toJSON()]);
    console.log("Bot OK !");
});

client.on("messageCreate", message => {
    console.log(message);
});

client.on("interactionCreate", interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "k2000") {
            interaction.reply("En cours de développement");
        } else if (interaction.commandName === "ping") {
            interaction.reply("En cours");
        }
    }
});

client.login("_____token______");
