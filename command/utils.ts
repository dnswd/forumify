import { Message, GuildChannelManager } from "discord.js";
import prisma from "../prisma/client";

async function registerServerInfo(message: Message) {

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

export { registerServerInfo };
