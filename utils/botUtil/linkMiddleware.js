export default async (context, next) => {
    const { m, isBotAdmin } = context;

    if (!m.isGroup) {
        return m.reply(`👥 *GROUP ONLY*\n━━━━━━━━━━━━━━━━\nThis command only works in groups!\nPrivate chat? For this? Pathetic.\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
    }

    if (!isBotAdmin) {
        return m.reply(`👮 *ADMIN REQUIRED*\n━━━━━━━━━━━━━━━━\nI need admin rights to get the group link!\nMake me admin or watch me do nothing.\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
    }

    await next();
};
