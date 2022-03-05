// ===============================
// This file provides different useful methods, which are used by commands or index
// ===============================

// ----------------------------
// Check Msg
// ----------------------------

// checks, if given message is from dm (personal chat with bot)
function from_dm(msg) {
    return msg.channel.type === 'DM'
}

// checks, if given message is from guild (a discord server)
function from_guild(msg) {
    return msg.channel.type === 'GUILD_TEXT' || msg.channel.type === 'GROUP_DM'
        || msg.channel.type === 'GUILD_PUBLIC_THREAD' || msg.channel.type === 'GUILD_PRIVATE_THREAD'
}

// checks, if given message is from an nsfw channel
function is_nsfw_channel(msg) {
    return from_dm(msg) || (from_guild(msg) && msg.channel.nsfw)
}

// print all commands for the author from message in a human-readable string
async function commands_to_string(msg) {
    let out = ""

    for (const command of Object.keys(msg.client.commands)) {
        out += `${command.toUpperCase()}**\n`
    }

    return out
}

// returns a link of dm-channel between author and bot
// note: custom text works only in embed
function link_to_dm(msg, text = "") {
    let link = `https://discord.com/channels/@me/${msg.author.dmChannel.id}/`
    if (text !== "") link = custom_text_to_link(link, text)
    return link
}

// returns a link to the sent message
// note: custom text works only in embed
function link_to_message(msg, text = "") {
    let link;
    if (from_dm(msg)) {
        link = link_to_dm(msg) + msg.id

    } else if (from_guild(msg)) {
        link = `https://discord.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`
    }
    if (text !== "") link = "\n" + custom_text_to_link(link, text)
    return link
}

function trim_text(string, size, use_dots) {
    const dots = " ..."

    if (string.length >= size) {

        if (use_dots) {
            string = string.substring(0, size - dots.length - 1).trim() + dots

        } else {
            string = string.substring(0, size - 1)
        }
    }
    return string
}


// --------------------
// Permissions
// --------------------
// check if author from message is admin
function is_admin(msg) {
    if (from_dm(msg)) {
        return is_admin_from_dm(msg)

    } else {
        return is_admin_from_guild(msg)
    }
}

// check, if the author from message have all the given permissions as list
function has_permission(msg, permission_list) {
    return !from_dm(msg) && msg.member.permissions.has(permission_list)
}
// --------------------
// ----------------------------


// ----------------------------
// Private
// ----------------------------
// add custom text to a link with markdown-syntax -> [Link Text](link)
function custom_text_to_link(link, text) {
    return `[${text}](${link})`
}

// check, if the author from message is an admin when chatting per dm
function is_admin_from_dm(msg) {
    return msg.client.config.user_ids_admin.includes(msg.author.id)
}

// check, if the author from message is an admin when chatting per guild
function is_admin_from_guild(msg) {
    return msg.client.config.user_ids_admin.includes(msg.member.id)
        || msg.member.roles.cache.some(role => msg.client.config.role_ids_admin.includes(role.id))
}
// ----------------------------


module.exports = { from_guild, from_dm, is_nsfw_channel, is_admin, has_permission,
    commands_to_string, link_to_dm, link_to_message, trim_text }