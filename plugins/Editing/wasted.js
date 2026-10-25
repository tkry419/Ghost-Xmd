import { Sticker } from 'wa-sticker-formatter';
import { sendInteractive } from '../../lib/sendInteractive.js';

let canvacordModule;

try {
    canvacordModule = await import('canvacord');
} catch (error) {
    console.error('Failed to import canvacord:', error);
}

export default async (context) => {
    const { client, m, Tag, botname } = context;

    const fallbackImage =
        'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';

    const cap = `📌 *WASTED*
━━━━━━━━━━━━━━━━
Converted By ${botname}
━━━━━━━━━━━━━━━━
© Ghost Tech`;

    await client.sendMessage(m.chat, {
        react: { text: '⌛', key: m.reactKey }
    });

    try {
        if (!canvacordModule) {
            throw new Error('Canvacord failed to load');
        }

        const Canvacord =
            canvacordModule.default ?? canvacordModule;

        let target;
        let img;

        if (m.quoted) {
            target = m.quoted.sender;
        } else if (Tag?.length) {
            target = Tag[0];
        } else {
            throw new Error('Reply to a message or tag a user.');
        }

        try {
            img = await client.profilePictureUrl(target, 'image');
        } catch {
            img = fallbackImage;
        }

        if (typeof Canvacord?.Canvacord?.wasted !== 'function') {
            throw new Error(
                'Canvacord.wasted is unavailable in this version'
            );
        }

        const result = await Canvacord.Canvacord.wasted(img);

        if (!result) {
            throw new Error('Canvacord returned no image');
        }

        const sticker = new Sticker(result, {
            pack: 'Triggered',
            author: 'Ghost Tech',
            categories: ['🤩', '🎉'],
            quality: 75,
            background: 'transparent'
        });

        const stickerBuffer = await sticker.toBuffer();

        await client.sendMessage(m.chat, {
            sticker: stickerBuffer
        });

        await client.sendMessage(m.chat, {
            react: { text: '✅', key: m.reactKey }
        });

    } catch (error) {
        console.error('Wasted command error:', error);

        await client.sendMessage(m.chat, {
            react: { text: '❌', key: m.reactKey }
        });

        await sendInteractive(
            client,
            m,
            `❌ *ERROR*
━━━━━━━━━━━━━━━━
Unable to create the WASTED sticker.
Reply to a message or tag a user, then try again.
━━━━━━━━━━━━━━━━
© Ghost Tech`
        );
    }
};
