import { Message, TextChannel } from "discord.js";
import prisma from "../../prisma/client";
import { registerServerInfo } from "../utils";

async function configureAutoThread(message: Message, disable = false) {

    const channel = message.channel;
    if (!(channel instanceof TextChannel)) return;

    if (disable) {
        // Unregister the channel

        try {
            await prisma.channels.update({
                where: {
                    channelId: message.channelId
                },
                data: {
                    autoThread: false
                }
            });
        } catch (error) {
            console.error(error);
        }

    } else {
        // Make sure server is already recorded
        registerServerInfo(message);

        // Register the channel
        const channelId = await prisma.channels.update({
            where: {
                channelId: message.channelId
            },
            data: {
                autoThread: true
            }
        });

        if (!channelId) {
            console.error("ChannelId is empty. There might be a bug");
            console.error(channelId);
            console.error(message);
            return;
        }
    }
}

async function resolveAutoThread(message: Message) {

    const channel = await prisma.channels.findUnique({
        select: {
            autoThread: true
        },
        where: {
            channelId: message.channelId
        }
    });

    if (!channel) return;

    if (channel.autoThread) {
        // Start a thread with archive duration depends on Guild's default
        message.startThread({
            name: message.content.substring(0, 100),
            reason: "Auto-thread by Forumify"
        });
        message.react("⬆");
        message.react("⬇");
        // TODO: create an alias for anonymous message
    }
}

export { configureAutoThread, resolveAutoThread };