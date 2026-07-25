import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, participants, pushname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `📌 *BROADCAST*\n━━━━━━━━━━━━━━━━\nProvide a broadcast message!\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
}
if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `📌 *BROADCAST*\n━━━━━━━━━━━━━━━━\nThis command is meant for groups.\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
}

let getGroups = await client.groupFetchAllParticipating() 
         let groups = Object.entries(getGroups) 
             .slice(0) 
             .map(entry => entry[1]) 
         let res = groups.map(v => v.id) 

await sendInteractive(client, m, `📌 *BROADCAST*\n━━━━━━━━━━━━━━━━\nSending broadcast message...\n━━━━━━━━━━━━━━━━\n© Ghost Tech`)

for (let i of res) { 


let txt = `📌 *BROADCAST*\n━━━━━━━━━━━━━━━━\nMessage: ${text}\nWritten by: ${pushname}\n━━━━━━━━━━━━━━━━\n© Ghost Tech` 

await client.sendMessage(i, { 
                 image: { 
                     url: "https://qu.ax/XxQwp.jpg" 
                 }, mentions: participants.map(a => a.id),
                 caption: `${txt}` 
             }) 
         } 
await sendInteractive(client, m, `✅ *DONE*\n━━━━━━━━━━━━━━━━\nMessage sent across all groups.\n━━━━━━━━━━━━━━━━\n© Ghost Tech`);
})

}
