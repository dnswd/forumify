import { Client, ClientEvents, Message, MessageReaction, Permissions, ThreadChannel } from "discord.js";

interface Meta {
    type: string,
    isMod: boolean | undefined,
    fromGuild: boolean,
    command?: string,
    commandArgs?: string[],
}

function isMessage(eventObj: Message | ClientEvents): eventObj is Message {
    const premise = eventObj as Message;
    return premise.member !== undefined &&
        premise.tts !== undefined;
}

function isReact(eventObj: MessageReaction | ClientEvents): eventObj is MessageReaction {
    const premise = eventObj as MessageReaction;
    return premise.message !== undefined &&
        premise.emoji != undefined;
}

function isThread(eventObj: ThreadChannel | ClientEvents): eventObj is ThreadChannel {
    const premise = eventObj as ThreadChannel;
    return premise.autoArchiveDuration != undefined;
}

function handleEvents(type: string, eventObject: ClientEvents) {

    const META: Meta = {
        type,
        isMod: false,
        fromGuild: false,
    };

    console.log(eventObject);

    //  messageCommand
    if (isMessage(eventObject)) {
        const message = eventObject as Message;

        // abort if it's invoked by Forumify itself or another bot
        if (message.author.bot || message.author.id === message.client.user?.id) return;

        const content = message.content.trim().split(/\s+/);
        META.command = content[0];
        META.commandArgs = content.slice(1);
        META.isMod = message.member?.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS);
        message.channel.send("PONG");
    }

    // reactCommand
    else if (isReact(eventObject)) {
        const react = eventObject as MessageReaction;

        // abort if it's invoked by Forumify itself
        if (react.me) return;
    }

    else if (isThread(eventObject)) {
        const thread = eventObject as ThreadChannel;

    }


    // threadCommand

    // META.type = type
    // META.isMod = client.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
    // META.fromGuild = client.guildId

}

export default {
    handleEvents
};