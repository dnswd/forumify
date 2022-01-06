import { TextChannel, Message } from "discord.js";
import { registerServerInfo } from "../utils";
import { Meta } from "../interfaces";
import prisma from "../../prisma/client";

async function configureAnonChannel(META: Meta, message: Message, disable = false) {

    const channel = message.channel;
    if (!(channel instanceof TextChannel) || !META.commandArgs) return;
    const alias = META.commandArgs[1];
    if (!alias || alias.length > 255) return;

    if (disable) {
        // Unregister the channel

        try {
            await prisma.channels.update({
                where: {
                    channelId: message.channelId
                },
                data: {
                    alias: null
                }
            });
        } catch (error) {
            console.error(error);
        }

    } else {
        // Make sure server is already recorded
        registerServerInfo(message);

        try {
            // Register the channel
            const channelId = await prisma.channels.update({
                where: {
                    channelId: message.channelId
                },
                data: {
                    alias: alias
                }
            });

            if (!channelId) {
                console.error("ChannelId is empty. There might be a bug");
                console.error(channelId);
                console.error(message);
            }

        } catch (error) {
            console.error("Alias is taken");
            console.error(error);
        }
    }
}

async function receiveAnon(META: Meta, message: Message) {
    if (!META.commandArgs || META.commandArgs.length < 2) return;

    try {
        const result = await prisma.channels.findUnique({
            select: {
                channelId: true
            },
            where: {
                alias: META.commandArgs[0]
            }
        });

        if (!result) return;

        const attachments: string[] = [];
        message.attachments.forEach((v) => { attachments.push(v.url); });

        const channel = message.client.channels.fetch(result.channelId);
        if (!(channel instanceof TextChannel)) return;

        channel.send({
            content: META.commandArgs.slice(1).join(" "),
            files: attachments
        });

    } catch (error) {
        console.error(error);
    }
}

export { configureAnonChannel, receiveAnon };
