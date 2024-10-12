const TelegramBot = require("node-telegram-bot-api");

// Functions from other modules
const { getLineups, whenIsLineup, BL, TL, AB } = require("./schedule.js");
const { getSuggestions } = require("./search.js");
const { getGuaranteedLineups } = require("./main.js");
const { hrefOfVehicle } = require("./frontend.js");

// Copypasted imports
const VEHICLESREFRESHTIME = 1 * 60 * 60 * 1000;
let vehicles = null;
let whenBL = [ "", "", "", "", "", "" ];
let whenTL = [ "", "", "", "", "" ];

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

async function fetchVehicles()
{
    // Fetching the database
    const response = await fetch("https://script.google.com/macros/s/AKfycbzq-ElAFHCDzk6dVqomddksLWLcNHbvBi2K5_4JZeh8OrejAt-isCrhleXiJYQA3A4Vnw/exec");
    const responseText = await response.text();
    vehicles = JSON.parse(responseText);
}

function refreshWhenLineups(lineups)
{
    whenBL = lineups.whenBL;
    whenTL = lineups.whenTL;
    whenEC = lineups.whenEC;
}

// TG bot stuff

let token, refreshTime;

async function loadVehicles()
{
    await fetchVehicles();
    console.log("Vehicles loaded successfully");
}

try
{
    // dev
    const configFile = require("./config.json");
    token = configFile.tgtokendev;
    refreshTime = 10;

    console.log("DEV LAUNCHED");

    loadVehicles();
}
catch (e)
{
    token = process.env.TOKEN;
    refreshTime = 30;

    loadVehicles();
    setInterval(async () => { await fetchVehicles(); }, VEHICLESREFRESHTIME);
}

const bot = new TelegramBot(token,
{
    polling: true
});

const channelId = -1002474439807;

// Deployment

if (0) deployment();
async function deployment()
{
    const mainMsg = await bot.sendMessage(channelId, "Main message");
    const widgetMsg = await bot.sendMessage(channelId, "Widget message");
    console.log(mainMsg);
    console.log(widgetMsg);
};

// Channel work

if (1)
{
    const mainMsgId = 16;
    const widgetMsgId = 17;

    //console.log(msgs);

    async function refreshMessages()
    {
        const msgs = lineupFunction();

        try
        {
            await bot.editMessageText(msgs[0], { chat_id: channelId, message_id: mainMsgId, parse_mode: "Markdown", link_preview_options: JSON.stringify({ is_disabled: true }) });
            
        } catch (e)
        {
            //console.log(e);
        };

        try
        {
            await bot.editMessageText(msgs[1], { chat_id: channelId, message_id: widgetMsgId, parse_mode: "Markdown", link_preview_options: JSON.stringify({ is_disabled: true }) });
        } catch (e) {};
    }

    refreshMessages();

    setInterval(refreshMessages, refreshTime * 1000);
}

function lineupFunction()
{
    const lineups = getLineups();

    refreshWhenLineups(lineups);

    // String localization
    const gsb = "*Совместные СБ сейчас:*";
    const asb = "*Противостояние сейчас:*";
    const availableIn = "Через ";
    const days = " д ";
    const hours = " ч ";
    const minutes = " мин";
    const squadron = "*Сброс полковой активности*";
    const squadronDays = [" (день 1/3)", " (день 2/3)", " (день 3/3)" ];

    const weekDays = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];

    const searchLink = "[Поиск техники](https://t.me/wtlineup_bot)";

    const boosty = "[Boosty](https://boosty.to/solawk)";
    const github = "[GitHub](https://github.com/solawk/wtlineup)";
    const wtlineupWebsite = "[сайт WTLineup](https://bit.ly/wt-sim)";

    // Links
    function link(lineup)
    {
        return "https://solawk.github.io/wtlineup/?select=" + lineup;
    }

    // Avia brackets
    let aviaNowString = "";
    for (let i = 0; i < lineups.aviaNow.length; i++)
    {
        const addComma = i < lineups.aviaNow.length - 1;

        aviaNowString += "[" + lineups.aviaNow[i].min.toString() + "-" + lineups.aviaNow[i].max.toString() + "]("
            + link(lineups.aviaNow[i].min.toString() + "-" + lineups.aviaNow[i].max.toString()) + ")" + (addComma ? ", " : "");
    }

    let aviaNextString = "";
    for (let i = 0; i < lineups.aviaNext.length; i++)
    {
        const addComma = i < lineups.aviaNext.length - 1;

        aviaNextString += "[" + lineups.aviaNext[i].min.toString() + "-" + lineups.aviaNext[i].max.toString() + "]("
            + link(lineups.aviaNext[i].min.toString() + "-" + lineups.aviaNext[i].max.toString()) + ")" + (addComma ? ", " : "");
    }

    // Future lineups
    let futureLineupsString = "";
    for (let i = 0; i < 5; i++)
    {
        futureLineupsString += lineups.future[i].date + " (" + weekDays[lineups.future[i].dayOfWeek] + ")"
            + " – [" + lineups.future[i].b + "](" + link(lineups.future[i].b)
            + ") и " + "[" + lineups.future[i].t + "](" + link(lineups.future[i].t) + ")";
        if (i < 4) futureLineupsString += "\n";
    }

    // Squadron
    let squadronResetString = lineups.sqD + days + lineups.sqH + hours + lineups.sqM + minutes;
    const cycleDay = squadronDays[2 - lineups.sqD];

    let msg1 = "";
    let msg2 = "";

    msg1 += gsb + "\n" + "[" + lineups.bottomNow + "](" + link(lineups.bottomNow) + ") и " + "[" + lineups.topNow + "](" + link(lineups.topNow) + ")";
    msg1 += "\n" + "*" + availableIn + lineups.nextHours + hours + lineups.nextMinutes + minutes + ":*";
    msg1 += "\n" + "[" + lineups.bottomNext + "](" + link(lineups.bottomNext) + ") и " + "[" + lineups.topNext + "](" + link(lineups.topNext) + ")";
    msg1 += "\n" + futureLineupsString;
    msg1 += "\n\n" + asb + "\n" + aviaNowString;
    msg1 += "\n" + "*" + availableIn + lineups.aviaNextDays + days + lineups.aviaNextHours + hours + lineups.aviaNextMinutes + minutes + ":*\n" + aviaNextString;
    msg1 += "\n\n" + squadron + "\n" + squadronResetString + cycleDay;
    msg1 += "\n\n" + searchLink;
    msg1 += "\n\n" + boosty + ", " + github + ", " + wtlineupWebsite;

    msg2 += "[" + lineups.bottomNow + "](" + link(lineups.bottomNow) + ") и " + "[" + lineups.topNow + "](" + link(lineups.topNow) + ")";
    msg2 += " => ";
    msg2 += "[" + lineups.bottomNext + "](" + link(lineups.bottomNext) + ") и " + "[" + lineups.topNext + "](" + link(lineups.topNext) + ")";

    return [ msg1, msg2 ];
}

// Search work

bot.onText(/\/start/, msg =>
{
    bot.sendMessage(msg.chat.id, "Готов искать сетапы техники! Введите её название целиком, либо введите часть и я выведу наиболее подходящие варианты");
});

bot.on("text", msg =>
{
    if (msg.text === "/start") return;

    if (vehicles == null)
    {
        bot.sendMessage(msg.chat.id, "Бот только что запустился и не успел загрузить данные о технике, попробуйте снова через несколько секунд");
        return;
    }

    const replymsg = searchFunction(msg.text.trim());
    bot.sendMessage(msg.chat.id, replymsg, { parse_mode: "Markdown", link_preview_options: JSON.stringify({ is_disabled: true }) });
});

function searchFunction(query)
{
    const suggestions = getSuggestions(query, vehicles, getGuaranteedLineups, 10, AB);

    // String localization
    const name = "Результаты поиска - ";
    const noneFound = "Подходящей техники не найдено";

    const boosty = "[Boosty](https://boosty.to/solawk)";
    const github = "[GitHub](https://github.com/solawk/wtlineup)";
    const wtlineupWebsite = "[сайт WTLineup](https://bit.ly/wt-sim)";

    // Links
    function link(lineup)
    {
        return "https://solawk.github.io/wtlineup/?select=" + lineup;
    }

    let msg = name + "*" + query + "*";

    for (const s of suggestions)
    {
        let lineupsString = "";

        for (let i = 0; i < s.l.length; i++)
        {
            lineupsString += "[" + s.l[i] + "](" + link(s.l[i]) + ")";

            const whenRu =
                {
                    whenNow: "доступен сейчас!",
                    whenToday: "будет позже сегодня",
                    whenTomorrow: "будет завтра",
                    whenAfterTomorrow: "будет послезавтра",
                    whenAfterDaysBefore: "будет через ",
                    whenAfterDaysAfter: " д",
                };

            // Day
            const isEC = s.l[i].includes("-");
            const isBottom = s.l[i].endsWith("1");
            const indexOfLineup = isBottom ? BL.indexOf(s.l[i]) : TL.indexOf(s.l[i]);
            const when = !isEC ? (isBottom ? whenBL[indexOfLineup] : whenTL[indexOfLineup]) : whenIsLineup(s.l[i]);

            if (when !== "")
            {
                let whenString = " ("
                switch (when)
                {
                    case "now": whenString += whenRu.whenNow; break;
                    case "today": whenString += whenRu.whenToday; break;
                    case 1: whenString += whenRu.whenTomorrow; break;
                    case 2: whenString += whenRu.whenAfterTomorrow; break;

                    default:
                        whenString += (whenRu.whenAfterDaysBefore) + (when - 1).toString() + (whenRu.whenAfterDaysAfter);
                        break;
                }
                whenString += ")";
                lineupsString += whenString;
            }

            if (i < s.l.length - 1) lineupsString += "\n";
        }

        const vname = (s.v.ruName !== "" ? s.v.ruName : s.v.enName);
        lineupsString += "\n[Найти " + vname + " в Google](" + hrefOfVehicle(s.v).replaceAll("(", "").replaceAll(")", "") + ")";

        msg += "\n\n*" + vname + "* - " + nationsRu[s.v.nation] + ", " + s.v.br.toString() + "\n";
        msg += "\n" + lineupsString.length > 0 ? lineupsString : "-";
    }

    if (suggestions.length === 0)
    {
        msg += "\n" + noneFound;
    }

    msg += "\n\n" + boosty + ", " + github + ", " + wtlineupWebsite;

    return msg;
}

bot.on("polling_error", console.log);