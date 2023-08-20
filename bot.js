// Requirements and constants
const { Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, SlashCommandBuilder, REST, Routes,
    ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ActivityType
} = require("discord.js");
const fetch = require("cross-fetch");

const SOLAWKID = "147774917071339520";
const REQUESTSCH = "1141064242485801142";
const COPYCENTER = "1142770040303800440";
let solawkAnswer = null;
let STATUSMSGIDS;
let REFRESHTIME;
const VEHICLESREFRESHTIME = 8 * 60 * 60 * 1000;

const thumbnails =
    {
        l1_1: [
            "https://encyclopedia.warthunder.com/images/us_m5a1_stuart.png",
            "https://encyclopedia.warthunder.com/images/germ_sdkfz_234_2.png",
            "https://encyclopedia.warthunder.com/images/p-400.png",
            "https://encyclopedia.warthunder.com/images/bf-109e-1.png",
        ],
        l2_1: [
            "https://encyclopedia.warthunder.com/images/ussr_t_34_1941.png",
            "https://encyclopedia.warthunder.com/images/p-51_a-36.png",
            "https://encyclopedia.warthunder.com/images/germ_pzkpfw_iv_ausf_f2.png",
            "https://encyclopedia.warthunder.com/images/il_2_1942_luftwaffe.png",
        ],
        l3_1: [
            "https://encyclopedia.warthunder.com/images/us_m18_hellcat.png",
            "https://encyclopedia.warthunder.com/images/germ_kv_1_kwk_40.png",
            "https://encyclopedia.warthunder.com/images/saab_b18b.png",
            "https://encyclopedia.warthunder.com/images/bf-109f-1.png",
        ],
        l4_1: [
            "https://encyclopedia.warthunder.com/images/ussr_t_34_85_zis_53.png",
            "https://encyclopedia.warthunder.com/images/germ_pzkpfw_vi_ausf_e_tiger.png",
            "https://encyclopedia.warthunder.com/images/f6f-3.png",
            "https://encyclopedia.warthunder.com/images/bf-109f-4.png",
        ],
        l5_1: [
            "https://encyclopedia.warthunder.com/images/us_t26e5.png",
            "https://encyclopedia.warthunder.com/images/germ_pzkpfw_vi_ausf_b_tiger_iip.png",
            "https://encyclopedia.warthunder.com/images/wyvern_s4.png",
            "https://encyclopedia.warthunder.com/images/bf-109g-14.png",
        ],
        l6_1: [
            "https://encyclopedia.warthunder.com/images/ussr_t_44_100.png",
            "https://encyclopedia.warthunder.com/images/germ_panzerjager_tiger.png",
            "https://encyclopedia.warthunder.com/images/douglas_a_1h.png",
            "https://encyclopedia.warthunder.com/images/ki_84_hei.png",
        ],
        l8_2: [
            "https://encyclopedia.warthunder.com/images/ussr_t_54_1947.png",
            "https://encyclopedia.warthunder.com/images/germ_pzkpfw_maus.png",
            "https://encyclopedia.warthunder.com/images/tu-2_postwar_late.png",
            "https://encyclopedia.warthunder.com/images/a2d.png",
        ],
        l8_2_2: [
            "https://encyclopedia.warthunder.com/images/cn_ztz_59a.png",
            "https://encyclopedia.warthunder.com/images/il_magach_5.png",
            "https://encyclopedia.warthunder.com/images/su-11.png",
            "https://encyclopedia.warthunder.com/images/f-84g_france.png",
        ],
        l9_2: [
            "https://encyclopedia.warthunder.com/images/ussr_t_64a_1971.png",
            "https://encyclopedia.warthunder.com/images/il_merkava_mk_2d.png",
            "https://encyclopedia.warthunder.com/images/mi_24d.png",
            "https://encyclopedia.warthunder.com/images/bo_105cb2.png",
        ],
        l10_2: [
            "https://encyclopedia.warthunder.com/images/ussr_t_80bvm.png",
            "https://encyclopedia.warthunder.com/images/germ_leopard_2a6.png",
            "https://encyclopedia.warthunder.com/images/mig_29_9_13.png",
            "https://encyclopedia.warthunder.com/images/f_16a_block_10.png",
        ],
    };

const msgsFile = require("../wtlineup_msg.json");
STATUSMSGIDS = msgsFile.msgs;

let token, clientId, probability;
try
{
    // dev
    const configFile = require("./config.json");
    token = configFile.token;
    clientId = configFile.clientId;
    probability = parseFloat(configFile.probability);
    REFRESHTIME = 3;

    console.log("--- DEV LAUNCHED ---");
}
catch (e)
{
    // prod
    token = process.env.TOKEN;
    clientId = process.env.CLIENTID;
    probability = parseFloat(process.env.probability);

    REFRESHTIME = 30;
}

// Functions from other modules
const { getLineups, BL, TL } = require("./schedule.js");
const { getSuggestions } = require("./search.js");
const { getGuaranteedLineups } = require("./main.js");
const { hrefOfVehicle } = require("./frontend.js");
const { theFunnyImages, theFunnyNames, theFunnyDescriptions, theFunnyHashing } = require("./thefunny");

// Initialization
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ] });

let vehicles = null;
let thumbnail = 7; // 0-3 - bottom, 4-7 - top
let whenBL = [ "", "", "", "", "", "" ];
let whenTL = [ "", "", "", "" ];

client.once(Events.ClientReady, async () =>
{
    console.log("Bot ready");

    await fetchVehicles();
    console.log("Vehicles loaded successfully");

    setInterval(async () => { await fetchVehicles(); }, VEHICLESREFRESHTIME);
});

async function fetchVehicles()
{
    // Fetching the database
    const response = await fetch("https://script.google.com/macros/s/AKfycbzq-ElAFHCDzk6dVqomddksLWLcNHbvBi2K5_4JZeh8OrejAt-isCrhleXiJYQA3A4Vnw/exec");
    const responseText = await response.text();
    vehicles = JSON.parse(responseText);
}

// Events
client.on(Events.MessageCreate, async (message) => {
    const isSolawk = message.author.id === SOLAWKID;
    if (!isSolawk) return;

    const isCopycenter = message.channel.id === COPYCENTER;
    if (isCopycenter)
    {
        solawkAnswer = { content: message.content };
        await message.reply("Принято");
        return;
    }

    const isPing = message.mentions.has(client.user);
    if (isSolawk && isPing)
    {
        await message.reply(solawkAnswer);
    }
});

client.on(Events.InteractionCreate, async (interaction) =>
{
    if (!interaction.isButton()) return;

    if (interaction.customId === "searchRu")
    {
        if (vehicles == null)
        {
            await interaction.reply({
                content: "Бот только что запустился и не успел загрузить данные о технике, попробуйте снова через несколько секунд",
                ephemeral: true });
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId('searchModalRu')
            .setTitle('Поиск техники');

        const nameInput = new TextInputBuilder()
            .setCustomId('searchNameInput')
            .setLabel("Введите название техники (или его часть)")
            .setStyle(TextInputStyle.Short);

        const actionRow = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }

    if (interaction.customId === "theFunny")
    {
        const modal = new ModalBuilder()
            .setCustomId("theFunnyModal")
            .setTitle("Какой ты вид хлеба");

        modal.addComponents(
        [
            new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("cityInput")
                        .setLabel("В каком городе ты не родился?")
                        .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("colorInput")
                    .setLabel("Какого цвета твой любимый амогус?")
                    .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("summerInput")
                    .setLabel("Как ты провёл это лето?")
                    .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("riemannInput")
                    .setLabel("Приведи контрпример к гипотезе Римана")
                    .setStyle(TextInputStyle.Paragraph),
            )
        ]);

        await interaction.showModal(modal);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'searchModalRu')
    {
        const name = interaction.fields.getTextInputValue('searchNameInput');

        const message = await interaction.reply({ embeds: [ await searchFunction(name, false) ], ephemeral: true });
        setTimeout(async () => {
            message.delete().then().catch();
        }, 5 * 60 * 1000);
    }

    if (interaction.customId === 'theFunnyModal')
    {
        const values =
            interaction.fields.getTextInputValue('cityInput') +
            interaction.fields.getTextInputValue('colorInput') +
            interaction.fields.getTextInputValue('summerInput') +
            interaction.fields.getTextInputValue('riemannInput');

        const choice = theFunnyHashing(values);

        const message = await interaction.reply({ embeds: [ await theFunnyFunction(choice, false) ], ephemeral: true });
        setTimeout(async () => {
            message.delete().then().catch();
        }, 5 * 60 * 1000);
    }
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

async function refreshStatusMessages()
{
    for (const msg of STATUSMSGIDS)
    {
        let channel, message;

        try
        {
            channel = await client.channels.fetch(msg.ch);
        }
        catch (e)
        {
            continue;
        }

        if (channel == null) continue;

        try
        {
            message = await channel.messages.fetch(msg.msg);
        }
        catch (e)
        {
            continue;
        }

        if (message == null) continue;

        message.edit({ content: null, embeds: [ lineupFunction(null, false) ], components: [ menu(false) ] });
    }
}

setInterval(async () =>
{
    if (vehicles == null) return;
    thumbnail++;
    if (thumbnail > 7) thumbnail = 0;
    await refreshStatusMessages();
}, REFRESHTIME * 1000);

function menu(en)
{
    if (en)
    {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('searchEn')
                    .setLabel('🔎 Vehicle search')
                    .setStyle(ButtonStyle.Primary)
            );
    }
    else
    {
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('searchRu')
                    .setLabel('🔎 Поиск техники')
                    .setStyle(ButtonStyle.Primary));

        /*if (Math.random() * 100 < probability) actionRow.addComponents(
            new ButtonBuilder()
                .setCustomId('theFunny')
                .setLabel('🍞 Какой ты вид хлеба')
                .setStyle(ButtonStyle.Secondary));*/

        return actionRow;
    }
}

function lineupFunction(interaction, en)
{
    const lineups = getLineups();

    whenBL = lineups.whenBL;
    whenTL = lineups.whenTL;

    // String localization
    const name = en ? "Simulator Battles Lineup Info Board" : "Сводка сетапов симуляторных боёв";
    const gsb = en ? "**Ground SB** now" : "**Совместные СБ** сейчас";
    const asb = en ? "**Enduring Confrontation** now" : "**Противостояние** сейчас";
    const availableNow = en ? "Available now" : "Доступны сейчас";
    const availableIn = en ? "In " : "Через ";
    const days = en ? " d " : " д ";
    const hours = en ? " h " : " ч ";
    const minutes = en ? " min" : " мин";
    const future = en ? "Future lineups" : "Будущие сетапы";
    const squadron = en ? "**Squadron activity** reset in" : "Сброс **полковой активности** через";
    const linkDisclaimer = en ? "Clicking a lineup opens the WTLineup website with the list of vehicles" :
        "Нажатие на сетап направляет на веб-сайт WTLineup со списком техники";
    const firstDay = en ? " (1st day of the cycle)" : " (1-й день цикла)";
    const secondDay = en ? " (2nd day of the cycle)" : " (2-й день цикла)";
    const thirdDay = en ? " (3rd day of the cycle)" : " (3-й день цикла)";

    const weekDaysEn = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
    const weekDaysRu = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
    const weekDays = en ? weekDaysEn : weekDaysRu;

    const authors = en ? "by Solawk" : "от Solawk";

    const boosty = "[Boosty](https://boosty.to/solawk)";
    const github = "[GitHub](https://github.com/solawk/wtlineup)";

    // Links
    function link(lineup)
    {
        return "https://solawk.github.io/wtlineup/?select=" + lineup;
    }

    // Avia brackets
    let aviaNowString = "";
    for (let i = 0; i < lineups.aviaNow.length; i++)
    {
        aviaNowString += lineups.aviaNow[i].min.toString() + " - " + lineups.aviaNow[i].max.toString() + (i % 3 === 2 ? "\n" : "‎ ‎ ‎ ");
    }

    let aviaNextString = "";
    for (let i = 0; i < lineups.aviaNext.length; i++)
    {
        aviaNextString += lineups.aviaNext[i].min.toString() + " - " + lineups.aviaNext[i].max.toString() + (i % 3 === 2 ? "\n" : "‎ ‎ ‎ ");
    }

    // Future lineups
    let futureLineupsString = "";
    for (let i = 0; i < 5; i++)
    {
        futureLineupsString += lineups.future[i].date + " (" + weekDays[lineups.future[i].dayOfWeek] + ")"
            + " - [" + lineups.future[i].b + "](" + link(lineups.future[i].b)
            + ") & " + "[" + lineups.future[i].t + "](" + link(lineups.future[i].t) + ")";
        if (i < 4) futureLineupsString += "\n";
    }

    // Squadron
    let squadronResetString = lineups.sqD + days + lineups.sqH + hours + lineups.sqM + minutes;
    let cycleDay;
    switch (lineups.sqD)
    {
        case 2: cycleDay = firstDay; break;
        case 1: cycleDay = secondDay; break;
        case 0: cycleDay = thirdDay; break;
    }

    // Thumbnail
    const isBottom = thumbnail < 4;
    const thumbnailIndex = isBottom ? thumbnail : thumbnail - 4;
    const property = isBottom ? "l" + lineups.bottomNow : "l" + lineups.topNow;
    const thumbnailUrl = thumbnails[property][thumbnailIndex];

    const msg = new EmbedBuilder()
        .setTitle(name)
        .setDescription(linkDisclaimer)
        .setURL('https://solawk.github.io/wtlineup')
        .setThumbnail(thumbnailUrl)
        .addFields(
            { name: gsb,
                value: "[**" + lineups.bottomNow + "**](" + link(lineups.bottomNow) + ") & " + "[**" + lineups.topNow + "**](" + link(lineups.topNow) + ")",
                inline: true },
            { name: availableIn + lineups.nextHours + hours + lineups.nextMinutes + minutes,
                value: "[" + lineups.bottomNext + "](" + link(lineups.bottomNext) + ") & " + "[" + lineups.topNext + "](" + link(lineups.topNext) + ")",
                inline: true },
            { name: future,
                value: futureLineupsString },
            { name: asb,
                value: aviaNowString,
                inline: true },
            { name: availableIn + lineups.aviaNextDays + days + lineups.aviaNextHours + hours + lineups.aviaNextMinutes + minutes,
                value: aviaNextString,
                inline: true },
            { name: squadron,
                value: squadronResetString + cycleDay },
            { name: " ",
                value: boosty + ", " + github }
        )
        .setFooter({ text: authors });

    //await interaction.reply({ embeds: [ msg ], ephemeral: true });
    return msg;
}

function searchFunction(query, en)
{
    //const query = interaction.options.getString(en ? "name" : "название");
    const suggestions = getSuggestions(query, vehicles, getGuaranteedLineups, 10);

    // String localization
    const name = en ? "Search results - " : "Результаты поиска - ";
    const noneFound = en ? "No matching vehicles" : "Подходящей техники не найдено";
    const linkDisclaimer = en ? "Clicking a lineup opens the WTLineup website with the list of vehicles" :
        "Нажатие на сетап направляет на веб-сайт WTLineup со списком техники";
    const deletingName = en ? "This message will be deleted in 5 minutes" :
        "Это сообщение будет удалено через 5 минут";
    const deletingDesc = en ? "If the bot has been restarted in this period of time and the message has not been deleted, delete it manually" :
        "Если бот перезагружался за это время и оно не удалилось, удалите его самостоятельно";

    const authors = en ? "by Solawk" : "от Solawk";

    const boosty = "[Boosty](https://boosty.to/solawk)";
    const github = "[GitHub](https://github.com/solawk/wtlineup)";

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

            // Day
            const isBottom = s.l[i].endsWith("1");
            const indexOfLineup = isBottom ? BL.indexOf(s.l[i]) : TL.indexOf(s.l[i]);
            const when = isBottom ? whenBL[indexOfLineup] : whenTL[indexOfLineup];

            const whenRu =
                {
                    whenNow: "доступен сейчас!",
                    whenToday: "будет позже сегодня",
                    whenTomorrow: "будет завтра",
                    whenAfterTomorrow: "будет послезавтра",
                    whenAfterDaysBefore: "будет через ",
                    whenAfterDaysAfter: " д",
                };

            const whenEn =
                {
                    whenNow: "available now!",
                    whenToday: "available later today",
                    whenTomorrow: "available tomorrow",
                    whenAfterTomorrow: "available after tomorrow",
                    whenAfterDaysBefore: "available after ",
                    whenAfterDaysAfter: " days",
                };

            if (when !== "")
            {
                let whenString = " ("
                switch (when)
                {
                    case "now": whenString += en ? whenEn.whenNow : whenRu.whenNow; break;
                    case "today": whenString += en ? whenEn.whenToday : whenRu.whenToday; break;
                    case 1: whenString += en ? whenEn.whenTomorrow : whenRu.whenTomorrow; break;
                    case 2: whenString += en ? whenEn.whenAfterTomorrow : whenRu.whenAfterTomorrow; break;

                    default:
                        whenString += (en ? whenEn.whenAfterDaysBefore : whenRu.whenAfterDaysBefore)
                            + (when - 1).toString() + (en ? whenEn.whenAfterDaysAfter : whenRu.whenAfterDaysAfter);
                        break;
                }
                whenString += ")";
                lineupsString += whenString;
            }

            if (i < s.l.length - 1) lineupsString += "\n";
        }

        const vname = ((!en && s.v.ruName !== "") ? s.v.ruName : s.v.enName);
        lineupsString += "\n[Найти " + vname + " в Google](" + hrefOfVehicle(s.v) + ")";

        //const nameString = "[" + ((!en && s.v.ruName !== "") ? s.v.ruName : s.v.enName) + "](" + hrefOfVehicle(s.v) + ")";

        msg.addFields(
            { name: vname + " - " + (en ? nationsEn[s.v.nation] : nationsRu[s.v.nation]) + ", " + s.v.br.toString(),
                value: lineupsString.length > 0 ? lineupsString : "-" }
        );
    }

    if (suggestions.length === 0)
    {
        msg.addFields({ name: noneFound, value: "** **" });
    }

    msg.addFields({ name: deletingName, value: deletingDesc });
    msg.addFields({ name: " ",
        value: boosty + ", " + github });

    //await interaction.reply({ embeds: [ msg ], ephemeral: true });

    return msg;
}

function theFunnyFunction(choice, en)
{
    const img = theFunnyImages[choice];
    const chname = theFunnyNames[choice];
    const chdesc = theFunnyDescriptions[choice];

    const msg = new EmbedBuilder()
        .setTitle("Результаты теста")
        .setImage(img);

    msg.addFields(
        { name: "Ты " + chname + "!",
            value: chdesc }
    );

    return msg;
}

const requestDeployment = new SlashCommandBuilder()
    .setName("развернуть")
    .setDescription("Запросить развёртывание в этом канале (нужно право управления сервером)");

const rest = new REST().setToken(token);
registerCommands();

async function registerCommands()
{
    try
    {
        const commands = [ requestDeployment ];
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("Commands registered successfully");
    }
    catch (e)
    {
        console.log(e);
    }
}

client.on(Events.InteractionCreate, async (interaction) =>
{
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName)
    {
        case "развернуть":
            const guildMember = await interaction.guild.members.fetch(interaction.user);
            const permissions = guildMember.permissions;
            const isGuildManager = (permissions.bitfield & BigInt(1 << 5)) > 0;

            if (!isGuildManager)
            {
                interaction.reply({ content: "Чтобы развернуть бота, нужно иметь право управления сервером!", ephemeral: true });
            }
            else
            {
                const channel = interaction.channel;
                const botStatusMessage = await channel.send("Запрос на развёртывание бота WTLineup был отправлен разработчику.\n" +
                    "Когда он будет принят, это сообщение станет выводом для бота.\n" +
                    "Если вы удалите это сообщение и/или канал, бот не сломается, но лучше так не делать.\n" +
                    "Пишите на Boosty (https://boosty.to/solawk), если есть вопросы.");

                const msgid = botStatusMessage.id;
                const chid = botStatusMessage.channel.id;
                const username = interaction.user.username;
                const servername = interaction.guild.name;

                const reqch = await client.channels.fetch(REQUESTSCH);
                if (reqch == null)
                {
                    console.log("Requests channel not found!!!");
                }

                await reqch.send("Сервер: " + servername + "\n" +
                    "Пользователь: " + username + "\n" +
                    "{ \"msg\": \"" + msgid + "\", \"ch\": \"" + chid + "\" }");

                await interaction.reply({ content: "Это сообщение можно удалить", ephemeral: true });
            }

            return;
    }
});

client.login(token);