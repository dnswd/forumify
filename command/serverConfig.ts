import { Message } from "discord.js";
import { Meta } from "./interfaces";
import { setAlias } from "./configs/handle";


function enableAnon(message: Message, isGlobal = false) {
    // TODO:
}

function disableAnon(message: Message, isGlobal = false) {
    // TODO:
}

function autoThread(message: Message) {
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
                break;
            case "disable-auto-thread":
                break;
            case "set-pin-channel":
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