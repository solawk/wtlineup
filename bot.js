const { Client, Events, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes
} = require("discord.js");
const fetch = require("cross-fetch");

let token, clientId;

try
{
    // dev
    const configFile = require("./config.json");
    token = configFile.token;
    clientId = configFile.clientId;
}
catch (e)
{
    // prod
    token = process.env.TOKEN;
    clientId = process.env.CLIENTID;
}

//const { token, clientId, guildId } = require("./config.json");

const { getLineups } = require("./schedule.js");
const { getSuggestions } = require("./search.js");
const { getGuaranteedLineups } = require("./main.js");

const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ] });

let vehicles = null;

client.once(Events.ClientReady, async () =>
{
    console.log("Bot ready");

    // Fetching the database
    const response = await fetch("https://script.google.com/macros/s/AKfycbzq-ElAFHCDzk6dVqomddksLWLcNHbvBi2K5_4JZeh8OrejAt-isCrhleXiJYQA3A4Vnw/exec");
    const responseText = await response.text();
    vehicles = JSON.parse(responseText);
    console.log("Vehicles loaded successfully");
});

client.on(Events.MessageCreate, async (message) => {
    const ruLineupMsg = message.content.startsWith("!сетап");
    const enLineupMsg = message.content.startsWith("!lineup");

    if (ruLineupMsg) await message.reply({ content: "Бот теперь использует слэш-команды: /сетап, /поиск\nВведите \"/\" и дождитесь появления списка команд" });
    if (enLineupMsg) await message.reply({ content: "Bot now uses slash-commands: /lineup, /search\nType \"/\" and wait for the command list to appear" });
});

const nationsEn =
    {
        usa: "USA",
        germany: "Germany",
        ussr: "USSR",
        britain: "Britain",
        france: "France",
        italy: "Italy",
        japan: "Japan",
        china: "China",
        sweden: "Sweden",
        israel: "Israel"
    };

const nationsRu =
    {
        usa: "США",
        germany: "Германия",
        ussr: "СССР",
        britain: "Великобритания",
        france: "Франция",
        italy: "Италия",
        japan: "Япония",
        china: "Китай",
        sweden: "Швеция",
        israel: "Израиль"
    };

async function lineupFunction(interaction, en)
{
    const lineups = getLineups();

    // String localization
    const name = en ? "Lineups" : "Сетапы";
    const availableNow = en ? "Available now" : "Доступны сейчас";
    const availableIn = en ? "In " : "Через ";
    const hours = en ? " h " : " ч ";
    const minutes = en ? " min" : " мин";
    const future = en ? "Future lineups" : "Будущие сетапы";
    const linkDisclaimer = en ? "Clicking a lineup opens the WTLineup website with the list of vehicles" :
        "Нажатие на сетап направляет на веб-сайт WTLineup со списком техники";

    const boosty = "[Boosty](https://boosty.to/solawk)";
    const github = "[GitHub](https://github.com/solawk/wtlineup)";
    const authors = en ? "by Solawk" : "от Solawk";

    // Links
    function link(lineup)
    {
        return "https://solawk.github.io/wtlineup/?select=" + lineup;
    }

    // Future lineups
    let futureLineupsString = "";
    for (let i = 0; i < 5; i++)
    {
        futureLineupsString += lineups.future[i].date + " - [" + lineups.future[i].b + "](" + link(lineups.future[i].b)
            + ") & " + "[" + lineups.future[i].t + "](" + link(lineups.future[i].t) + ")";
        if (i < 4) futureLineupsString += "\n";
    }

    const msg = new EmbedBuilder()
        .setTitle(name)
        .setDescription(linkDisclaimer)
        .setURL('https://solawk.github.io/wtlineup')
        .addFields(
            { name: availableNow,
                value: "[**" + lineups.bottomNow + "**](" + link(lineups.bottomNow) + ") & " + "[**" + lineups.topNow + "**](" + link(lineups.topNow) + ")"},
            { name: availableIn + lineups.nextHours + hours + lineups.nextMinutes + minutes,
                value: "[**" + lineups.bottomNext + "**](" + link(lineups.bottomNext) + ") & " + "[**" + lineups.topNext + "**](" + link(lineups.topNext) + ")" },
            { name: future,
                value: futureLineupsString },
            { name: " ",
                value: boosty + ", " + github }
        )
        .setFooter({ text: authors });

    await interaction.reply({ embeds: [ msg ], ephemeral: true });
}

async function searchFunction(interaction, en)
{
    if (vehicles == null)
    {
        await interaction.reply({ content: "Vehicles not loaded in!!! / Список техники не загружен!!!" });
        return;
    }

    const query = interaction.options.getString(en ? "name" : "название");
    const suggestions = getSuggestions(query, vehicles, getGuaranteedLineups);

    // String localization
    const name = en ? "Search results - " : "Результаты поиска - ";
    const linkDisclaimer = en ? "Clicking a lineup opens the WTLineup website with the list of vehicles" :
        "Нажатие на сетап направляет на веб-сайт WTLineup со списком техники";

    const boosty = "[Boosty](https://boosty.to/solawk)";
    const github = "[GitHub](https://github.com/solawk/wtlineup)";
    const authors = en ? "by Solawk" : "от Solawk";

    // Links
    function link(lineup)
    {
        return "https://solawk.github.io/wtlineup/?select=" + lineup;
    }

    const msg = new EmbedBuilder()
        .setTitle(name + query)
        .setDescription(linkDisclaimer)
        .setFooter({ text: authors });

    for (const s of suggestions)
    {
        let lineupsString = "";

        for (let i = 0; i < s.l.length; i++)
        {
            lineupsString += "[" + s.l[i] + "](" + link(s.l[i]) + ")";
            if (i < s.l.length - 1) lineupsString += ", ";
        }

        msg.addFields(
            { name: ((!en && s.v.ruName !== "") ? s.v.ruName : s.v.enName) + " - " + (en ? nationsEn[s.v.nation] : nationsRu[s.v.nation]),
                value: lineupsString.length > 0 ? lineupsString : "-" }
        );
    }

    msg.addFields({ name: " ", value: boosty + ", " + github });

    await interaction.reply({ embeds: [ msg ], ephemeral: true });
}

const enLineupCmd = new SlashCommandBuilder()
    .setName("lineup")
    .setDescription("Simulator battles lineup information");
const ruLineupCmd = new SlashCommandBuilder()
    .setName("сетап")
    .setDescription("Информация о сетапах симуляторных боёв");

const enSearchCmd = new SlashCommandBuilder()
    .setName("search")
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('Vehicle name'))
    .setDescription("Query lineups by the vehicle name");
const ruSearchCmd = new SlashCommandBuilder()
    .setName("поиск")
    .addStringOption(option =>
        option
            .setName('название')
            .setDescription('Название техники'))
    .setDescription("Запрос сетапов по названию техники");

client.on(Events.InteractionCreate, async (interaction) =>
{
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName)
    {
        case "lineup":
            await lineupFunction(interaction, true);
            return;

        case "сетап":
            await lineupFunction(interaction, false);
            return;

        case "search":
            await searchFunction(interaction, true);
            return;

        case "поиск":
            await searchFunction(interaction, false);
            return;

        default:
            await interaction.reply({ content: "Команда не распознана / Invalid command", ephemeral: true });
            return;
    }
});

client.login(token);

const rest = new REST().setToken(token);
registerCommands();

async function registerCommands()
{
    try
    {
        const commands = [ enLineupCmd, ruLineupCmd, enSearchCmd, ruSearchCmd ];
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("Global commands registered successfully");
    }
    catch (e)
    {
        console.log(e);
    }
}