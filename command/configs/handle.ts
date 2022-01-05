import { Message } from "discord.js";
import { Meta } from "../interfaces";
import prisma from "../../prisma/client";

function setAlias(META: Meta, message: Message) {
    // TODO: Filter DM
    // TODO: Record guild if not exists

    const args = META.commandArgs;
    if (!args || args?.length < 1 || !META.fromGuild) return;


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
    // TODO: Filter DM
    // TODO: Record guild if not exists

    const guildId = message.guildId;
    const args = META.commandArgs;
    if (!guildId) return;
    if (!args || args?.length < 1 || !META.fromGuild) return;

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
