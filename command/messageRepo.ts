import { Message } from "discord.js";
import { Meta } from "./interfaces";

function delegate(META: Meta, message: Message) {

    // TODO: handle prefix change

    switch (META.command) {
        case "/ping":
            // test
            message.reply(`PONG ${message}`);
            break;
        case "/anon":
            // Send anonymous message
            // TODO
            break;
        case "/config":
            // Configure Forumify 
            if (!META.isMod) return;
            // TODO
            break;
        default:
            return;
    }
}

export default { delegate };