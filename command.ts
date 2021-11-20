import { Client, ClientEvents, Message, Permissions } from "discord.js";

function isMessage(eventObj: Message | ClientEvents): eventObj is Message {
    const premise = eventObj as Message;
    return premise.member !== undefined &&
        premise.guildId !== undefined;
}

function handleEvents(type: string, client: Client, eventObject: ClientEvents) {
    interface Meta {
        type: string,
        isMod: boolean | undefined,
        fromGuild: boolean,
        command?: string,
        commandArgs?: string[],
    }

    const META: Meta = {
        type,
        isMod: false,
        fromGuild: false,
    }

    if (isMessage(eventObject)) {
        const message = eventObject as Message;

        if (message.author.bot || message.author.id === client.user?.id) return

        META.isMod = message.member?.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
        message.channel.send("PONG")
    }

    // META.type = type
    // META.isMod = client.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
    // META.fromGuild = client.guildId

}

export default {
    handleEvents
}