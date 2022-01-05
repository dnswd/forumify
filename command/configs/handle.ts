import { Message } from "discord.js";
import prisma from "../../prisma/client";

function setAlias(newAlias: string, message: Message) {
    // TODO: Filter DM
    // TODO: Record guild if not exists
    prisma.channels.update({
        where: {
            channelId: message.channelId
        },
        data: {
            alias: newAlias
        }
    });
}

export { setAlias };
