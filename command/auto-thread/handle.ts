import { Message, TextChannel, GuildChannelManager } from "discord.js";
import prisma from "../../prisma/client";


async function configureAutoThread(message: Message, disable = false) {

    const channel = message.channel;
    if (!(channel instanceof TextChannel)) return;

    if (disable) {
        // Unregister the channel
        await prisma.channels.update({
            where: {
                channelId: message.channelId
            },
            data: {
                autoThread: false
            }
        });

    } else {
        // Make sure server is already recorded
        checkOrCreateServerDB(message);

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
            console.error("ChannelId is empty. there might be a bug");
            console.error(channelId);
            console.error(message);
            return;
        }

        // TODO: Register channel
    }
}

async function checkOrCreateServerDB(message: Message) {

    const guild = message.guild;

    // If not in a server, abort
    if (!guild) return;

    const result = await prisma.server.findUnique({
        where: {
            guildId: guild.id,
        }
    });

    if (!result) {
        // Record server if not yet recorded
        const guildChannels: GuildChannelManager = guild.channels;
        const guildChannelIds: { channelId: string, autoThread: boolean }[] = guildChannels.cache
            .map(c => ({
                channelId: c.id,
                autoThread: false
            }));

        await prisma.server.create({
            data: {
                guildId: guild.id,
                channels: {
                    create: guildChannelIds
                }
            }
        });
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