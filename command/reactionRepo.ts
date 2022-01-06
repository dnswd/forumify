import { MessageReaction } from "discord.js";
import { Meta } from "./interfaces";
import { handle } from "./starred-message/handle";

function delegate(META: Meta, react: MessageReaction) {

    const _react = react.emoji.name;

    switch (_react) {
        case "⭐":
            handle(META, react);
            break;

        default:
            break;
    }
}

export default { delegate };
