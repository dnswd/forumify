import { MessageReaction, MessageEmbed } from "discord.js";
import { Meta } from "../interfaces";
import prisma from "../../prisma/client";

async function handle(META: Meta, react: MessageReaction) {

    const guildId = react.message.guildId;
    const channel = react.message.channel;
    // Early stop, react.count == null when reaction is new 
    if (react.count === null ||
        guildId === null ||
        channel === null ||
        typeof guildId === "undefined" ||
        typeof channel === "undefined") return;

    const result = await prisma.server.findFirst({
        select: {
            starTreshold: true
        },
        where: {
            guildId: {
                equals: guildId
            }
        }
    });

    if (result == null) return;
    const { author, content, url } = react.message;
    const { starTreshold } = result;

    // react.count only shows number of react by OTHERS, not including now
    if (react.count + 1 >= starTreshold && !!author && !!content && !!url) {

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


    return;
}

export { handle };