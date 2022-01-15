import { ThreadChannel } from "discord.js";
import { Meta } from "./interfaces";
import prisma from "../prisma/client";

/**
 * Actions on Thread creation, by default create unique alias for anonymous
 * user to interact with.
 * @param META Command context
 * @param thread Newly created thread
 * @returns None
 */
async function delegate(META: Meta, thread: ThreadChannel) {

    if (thread.deleted || !META.fromGuild) return;

    // check channel alias, if yes use [channel-alias]-[unique-id] as alias
    // else use [channel-id]-[unique-id]

    const threadRecord = await recordThread(thread);
    if (!threadRecord) {
        console.error("Error while recording thread info");
        return;
    }

    let INFO = `Reply this thread anonymously by using one of the following string as alias:
1. ${threadRecord.threadChannelId}-${threadRecord.Id}
2. ${threadRecord.threadId}`;

    const ALIAS = threadRecord.channel.alias;
    if (ALIAS) {
        INFO += `
3. ${ALIAS}-${threadRecord.Id}`;
    }

    thread.send(INFO);
}

async function recordThread(thread: ThreadChannel) {

    if (!thread.parentId || !thread.id) return;

    const DATA = {
        threadChannelId: thread.parentId,
        threadId: thread.id
    };

    try {
        const a = await prisma.threads.create({
            select: {
                Id: true,
                threadId: true,
                threadChannelId: true,
                channel: true
            },
            data: DATA
        });
        return a;
    } catch (error) {
        console.error(error);
        return;
    }
}

export default { delegate };
