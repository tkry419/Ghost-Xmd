import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '🔄', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *RESTART*\n━━━━━━━━━━━━━━━━\nRestarting GHOST-XMD...\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
        setTimeout(() => { process.exit(0); }, 3000);
    });
};
