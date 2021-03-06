import { Message } from "discord.js";
import { Meta } from "./interfaces";
import { configureServer } from "./serverConfig";
import { receiveAnon } from "./anonymous-message/handle";
import { resolveAutoThread } from "./auto-thread/handle";

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

async function handleDefaultMessage(META: Meta, message: Message) {

    resolveAutoThread(message);
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
            if (META.fromGuild || !META.commandArgs) return;
            receiveAnon(META, message);
            break;
        case "/config":
            // Configure Forumify 
            if (!META.isMod || !META.fromGuild || !META.commandArgs) return;
            configureServer(META, message);
            break;
        default:
            handleDefaultMessage(META, message);
            // message.reply("Sorry, I don't quite understand. Do you need `/help`?");
            break;
    }
    return;
}

export default { delegate };
