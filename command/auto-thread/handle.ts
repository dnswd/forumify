import { Message, TextChannel, GuildChannelManager } from "discord.js";
import prisma from "../../prisma/client";


async function autoThread(message: Message, disable = false) {

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

export default autoThread;