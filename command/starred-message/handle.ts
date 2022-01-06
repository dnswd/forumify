import { MessageReaction, MessageEmbed, TextChannel, Message } from "discord.js";
import { Meta } from "../interfaces";
import prisma from "../../prisma/client";

async function handle(META: Meta, react: MessageReaction) {

    const guildId = react.message.guildId;
    // Early stop, react.count == null when reaction is new 
    if (react.count === null ||
        guildId === null ||
        typeof guildId === "undefined") return;

    const result = await prisma.server.findUnique({
        select: {
            starChannel: true,
            starTreshold: true,
        },
        where: {
            guildId: guildId
        }
    });

    if (result == null) return;
    const { author, content, url } = react.message;
    const { starChannel, starTreshold } = result;

    if (!starChannel) return;
    const channel = await react.client.channels.fetch(starChannel.channelId);

    // react.count only shows number of react by OTHERS, not including now
    if (react.count + 1 >= starTreshold && channel instanceof TextChannel) {

        if (!!author && !!content && !!url && !!channel) {
            const starredMessage = new MessageEmbed({
                author: {
                    name: author?.username,
                    iconURL: author?.defaultAvatarURL
                },
                color: "#FABE00",
                description: content
            }).addField("Message link", url);

            channel.send({ embeds: [starredMessage] });
        }
    }
    return;
}

async function configureStarChannel(META: Meta, message: Message) {

    const args = META.commandArgs;
    const guildId = message.guildId;
    if (!guildId || !args || args.length < 1) return;

    prisma.server.update({
        where: {
            guildId: guildId
        },
        data: {
            starId: args[0]
        }
    });
}

export { handle, configureStarChannel };
