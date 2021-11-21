import { Message } from "discord.js";
import { Meta } from "./interfaces";
import { configureServer } from "./serverConfig";

function sendHelp(message: Message) {
    const helpContent = `
***FORUMIFY***
Create organized discussion inside Discord.

Here are available Server commands:

    /ping
        Test the server reponse

    /help
        Display this message

    /config <args>
        Configure this server, only serevr member with MANAGE_CHANNEL permission
        can use this command. Use \`/config help\` to show available commands.

Here are available Direct Message commands:

    /anon <alias> <message/attachment>
    /anon <server> <channel> <message/attachment>
        Send anonymous message to channel


To see all available features, visit https://github.com/dnswd/forumify to learn more.`;

    message.channel.send(helpContent);
}

function delegate(META: Meta, message: Message) {

    // TODO: handle prefix change

    switch (META.command) {
        case "/ping":
            message.reply("PONG");
            break;
        case "/help":
            sendHelp(message);
            break;
        case "/anon":
            // Send anonymous message
            // TODO
            break;
        case "/config":
            // Configure Forumify 
            if (!META.isMod || !META.fromGuild || !META.commandArgs) return;
            configureServer(META, message);
            break;
        default:
            message.reply("Sorry, I don't quite understand. Do you need `/help`?");
            break;
    }
    return;
}

export default { delegate };