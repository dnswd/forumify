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
                    alias: alias
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
                alias: alias
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

export { configureAnonChannel };