import { Message } from "discord.js";
import { Meta } from "../interfaces";
import { registerServerInfo } from "../utils";
import prisma from "../../prisma/client";

function setAlias(META: Meta, message: Message) {

    const args = META.commandArgs;
    if (!args || args?.length < 1 || !META.fromGuild) return;

    // Make sure server is already recorded
    registerServerInfo(message);

    prisma.channels.update({
        where: {
            channelId: message.channelId
        },
        data: {
            alias: args[0]
        }
    });
}

function setServerAlias(META: Meta, message: Message) {

    const guildId = message.guildId;
    const args = META.commandArgs;
    if (!guildId) return;
    if (!args || args?.length < 1 || !META.fromGuild) return;

    // Make sure server is already recorded
    registerServerInfo(message);

    prisma.server.update({
        where: {
            guildId: guildId
        },
        data: {
            alias: args[0]
        }
    });
}

export { setAlias, setServerAlias };
