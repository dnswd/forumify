import { Client, ClientEvents } from "discord.js";

const { Message } = require("discord.js");

function handleEvents(type: string, client: Client, eventObject: ClientEvents) {
    let META = {
        type: "",
        isMod: false,
        fromGuild: false,
    }

    console.log(eventObject)

    // META.type = type
    // META.isMod = client.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
    // META.fromGuild = client.guildId

}

export default {
    handleEvents
}