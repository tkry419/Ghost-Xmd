import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    return SENSITIVE.some(s => key.toLowerCase().includes(s));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "📌 *GETVAR*\n━━━━━━━━━━━━━━━━\nHEROKU_APP_NAME or HEROKU_API_KEY not set.\n━━━━━━━━━━━━━━━━\n© Ghost Tech");
        }

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `📌 *GETVAR*\n━━━━━━━━━━━━━━━━\nUsage: ${prefix}getvar VAR_NAME\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
        }

        const varName = text.trim().split(" ")[0];

        if (isSensitive(varName)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "📌 *GETVAR*\n━━━━━━━━━━━━━━━━\nThat variable is protected and cannot be retrieved. 🔒\nFor your own security.\n━━━━━━━━━━━━━━━━\n© Ghost Tech");
        }

        if (m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "📌 *GETVAR*\n━━━━━━━━━━━━━━━━\nUse this command in your DM only, not in groups. 🔒\n━━━━━━━━━━━━━━━━\n© Ghost Tech");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });
            const varValue = response.data[varName];
            if (varValue !== undefined) {
                await sendInteractive(client, m, `📌 *GETVAR*\n━━━━━━━━━━━━━━━━\n${varName} = ${varValue}\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
            } else {
                await sendInteractive(client, m, `📌 *GETVAR*\n━━━━━━━━━━━━━━━━\nVar "${varName}" doesn't exist.\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
            }
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `📌 *GETVAR*\n━━━━━━━━━━━━━━━━\nFailed to fetch var.\n${error.response?.data || error.message}\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
        }
    });
};
