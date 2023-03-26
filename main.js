console.clear();
console.log(`\x1b[47m\x1b[30m discord-activedev-badge v1.0.0 \x1b[0m\n`);

const botToken = process.argv[2], destroyAfterUse = process.argv.includes('-d');
if(typeof botToken != 'string') return console.log(`\x1b[36mUsage: \x1b[0mnode . <botToken> [-d]\n\nbotToken  -  Your bot token. If you don't have a bot or bot token, create a new one on the Discord Developer Portal (https://discord.com/developers/applications).\n-d  -  Destroy the bot after use.\n\n`);

const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async () => {
    const botCommands = [
        { name: 'cats', description: 'Gives you a random fact about cats.' },
    ];
    const rest = new REST({ version: '10' }).setToken(botToken);

    try {
        console.log(`\x1b[36m> Reloading slash commands...\x1b[0m`);
        await rest.put(Routes.applicationCommands(client.user.id), { body: botCommands });

        console.log(`\x1b[36m> Slash commands reloaded.\x1b[0m`);
        console.log(`\n\x1b[32mLogged as ${client.user.tag}\n\x1b[36mInvite your bot: \x1b[37mhttps://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\x1b[0m\n`);

        if(destroyAfterUse){
            console.log(`\x1b[36mThis bot will shutdown after use. Remove -d flag to keep the bot online.\x1b[0m`);
        }
        client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'cats') {
                const fact = facts[Math.floor(Math.random() * facts.length)];
                await interaction.reply(`**${fact.t}**\n${fact.d}\n\nSource: www.purina.ca/articles/cat/facts/10-fascinating-facts-about-cats`);
                if(destroyAfterUse) {
                    console.log(`\x1b[36mClosing...\x1b[0m`);
                    client.destroy();
                    process.exit(0);
                }
            }
        });
    } catch (e) { console.error(`\x1b[33m> Reloading slash commands failed.\x1b[0m\n`, e); return process.exit(1); }
});

client.login(botToken);

// Source: https://www.purina.ca/articles/cat/facts/10-fascinating-facts-about-cats
const facts = [
    {
        t: 'The first year of a cat\'s life is roughly equal to the first 15 years of human life.',
        d: 'Your cat\'s second year is roughly equal to the first 25 of a human\'s. After that, your cat tends to develop more slowly and ages about four to five human years every 12 months.'
    }, {
        t: 'Cats can rotate their ears 180 degrees.',
        d: 'While humans have six muscles in both of their outer ears, cats have 32 muscles in each of theirs! These muscles give cats the ability to swivel and rotate their ears to pinpoint the exact source of a noise.'
    }, {
        t: 'The hearing of the average cat is at least five times stronger than that of a human adult.',
        d: 'Cat hearing is extremely sensitive and can hear tones at much higher pitches than humans. This gives them an advantage in nature, as most of their prey, such as rodents or birds, make high-pitched sounds.'
    }, {
        t: 'In the largest domestic cat breed, the average male weighs approximately 20 pounds.',
        d: 'Some of these large domestic cats include the Siberian Cat, Ragdoll, Maine Coon and British Shorthair. These big cats are typically known for their fluffy coats and affectionate nature.'
    }, {
        t: 'Domestic cats spend about 70 per cent of the day sleeping and 15 per cent of the day grooming.',
        d: 'Cats are evolved to sleep most of the time they don\'t spend hunting, saving up their strength to catch their dinner. While they are not hunting at home, these evolutionary traits have carried over. Adult cats can sleep from 16 to 20 hours a day. Kittens and older cats can sleep almost 24 hours a day.'
    }, {
        t: 'A cat cannot see directly under its nose.',
        d: 'While cats are typically known for their powerful vision, they have a blind spot! This is because prey usually does not come directly under a cat\'s nose. When prey does come close to the cat, they are much more likely to rely on their sense of smell than their vision.'
    }, {
        t: 'Cats have five toes on each front paw, but only four on the back ones.',
        d: 'It\'s not uncommon, though, for cats to have extra toes. The cat with the most toes known had 32—eight on each paw!'
    }, {
        t: 'Some believe that if you dream about a white cat, good luck will follow.',
        d: 'In many countries, myths and fables, white cats are seen as a symbol of good luck and are believed to represent purity and happiness. '
    }, {
        t: 'Meows are not innate cat language—they developed them to communicate with humans!',
        d: 'Adult cats that do not live with humans have clear communication with one another. Cats communicate with one another through scent, facial expression, complex body language and touch. Domesticated cats meow at humans to communicate their needs.'
    }
]