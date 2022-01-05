import { Message } from "discord.js";
import { Meta } from "./interfaces";
import { setAlias, setServerAlias } from "./configs/handle";
import { configureAutoThread } from "./auto-thread/handle";
import { configureStarChannel } from "./starred-message/handle";


function enableAnon(message: Message, isGlobal = false) {
    // TODO:
}

function disableAnon(message: Message, isGlobal = false) {
    // TODO:
}

export function configureServer(META: Meta, message: Message) {

    if (META.commandArgs && META.commandArgs.length > 1) {
        switch (META.commandArgs[0]) {
            // Setup channel alias
            case "set-alias":
                setAlias(META, message);
                break;
            // Setup server alias
            case "set-server-alias":
                setServerAlias(META, message);
                break;
            // Enable anonymous message
            case "allow-anon":
                break;
            case "allow-anon-globally":
                break;
            case "disallow-anon":
                break;
            case "disallow-anon-globally":
                break;
            case "enable-auto-thread":
                configureAutoThread(message);
                break;
            case "disable-auto-thread":
                configureAutoThread(message, true);
                break;
            case "set-star-channel":
                configureStarChannel(META, message);
                break;
            default:
                message.reply("Uhh... Wrong configuration command. Do you need `/help`?");
                break;
        }
    } else {
        message.reply("Insufficent arguments. Do you need `/help`?");
    }
    return;
}