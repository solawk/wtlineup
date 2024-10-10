const TelegramBot = require("node-telegram-bot-api");

// Functions from other modules
const { getLineups, whenIsLineup, BL, TL, AB } = require("./schedule.js");
const { getSuggestions } = require("./search.js");
const { getGuaranteedLineups } = require("./main.js");
const { hrefOfVehicle } = require("./frontend.js");

let token, refreshTime;

try
{
    // dev
    const configFile = require("./config.json");
    token = configFile.tgtoken;
    refreshTime = 3;

    console.log("DEV LAUNCHED");
}
catch (e)
{
    token = process.env.TOKEN;
    refreshTime = 30;
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

// Work

if (1)
{
    const mainMsgId = 16;
    const widgetMsgId = 17;

    const msgs = lineupFunction();

    //console.log(msgs);

    setInterval(async () =>
    {
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
    }, refreshTime * 1000)
}

/*bot.on('text', async msg =>
{
    console.log(msg);
});*/

function lineupFunction()
{
    const en = false;

    const lineups = getLineups();

    //refreshWhenLineups(lineups);

    // String localization
    const gsb = en ? "*Ground SB* now" : "*Совместные СБ сейчас:*";
    const asb = en ? "**Enduring Confrontation** now" : "*Противостояние сейчас:*";
    const availableIn = en ? "In " : "Через ";
    const days = en ? " d " : " д ";
    const hours = en ? " h " : " ч ";
    const minutes = en ? " min" : " мин";
    const squadron = en ? "**Squadron activity** reset in" : "*Сброс полковой активности*";
    const linkDisclaimer = en ? "Clicking a lineup opens the WTLineup website with the list of vehicles" :
        "Нажатие на сетап направляет на веб-сайт WTLineup со списком техники";
    const firstDay = en ? " (1st day of the cycle)" : " (день 1/3)";
    const secondDay = en ? " (2nd day of the cycle)" : " (день 2/3)";
    const thirdDay = en ? " (3rd day of the cycle)" : " (день 3/3)";

    const weekDaysEn = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
    const weekDaysRu = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
    const weekDays = en ? weekDaysEn : weekDaysRu;

    const authors = en ? "by Solawk" : "от Solawk";

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
    let cycleDay;
    switch (lineups.sqD)
    {
        case 2: cycleDay = firstDay; break;
        case 1: cycleDay = secondDay; break;
        case 0: cycleDay = thirdDay; break;
    }

    /*const msg = new EmbedBuilder()
        .setTitle(name)
        .setDescription(linkDisclaimer)
        .setURL('https://solawk.github.io/wtlineup')
        .setThumbnail(thumbnailUrl)
        .addFields(
            { name: gsb,
                value: "[**" + lineups.bottomNow + "**](" + link(lineups.bottomNow) + ") и " + "[**" + lineups.topNow + "**](" + link(lineups.topNow) + ")",
                inline: true },
            { name: availableIn + lineups.nextHours + hours + lineups.nextMinutes + minutes,
                value: "[" + lineups.bottomNext + "](" + link(lineups.bottomNext) + ") и " + "[" + lineups.topNext + "](" + link(lineups.topNext) + ")",
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
            { name: authors,
                value: boosty + ", " + github }
        );*/

    let msg1 = "";
    let msg2 = "";

    msg1 += gsb + "\n" + "[" + lineups.bottomNow + "](" + link(lineups.bottomNow) + ") и " + "[" + lineups.topNow + "](" + link(lineups.topNow) + ")";
    msg1 += "\n" + "*" + availableIn + lineups.nextHours + hours + lineups.nextMinutes + minutes + ":*";
    msg1 += "\n" + "[" + lineups.bottomNext + "](" + link(lineups.bottomNext) + ") и " + "[" + lineups.topNext + "](" + link(lineups.topNext) + ")";
    msg1 += "\n" + futureLineupsString;
    msg1 += "\n\n" + asb + "\n" + aviaNowString;
    msg1 += "\n" + "*" + availableIn + lineups.aviaNextDays + days + lineups.aviaNextHours + hours + lineups.aviaNextMinutes + minutes + ":*\n" + aviaNextString;
    msg1 += "\n\n" + squadron + "\n" + squadronResetString + cycleDay;
    msg1 += "\n\n" + boosty + ", " + github + ", " + wtlineupWebsite;

    msg2 += "[" + lineups.bottomNow + "](" + link(lineups.bottomNow) + ") и " + "[" + lineups.topNow + "](" + link(lineups.topNow) + ")";
    msg2 += "\n=> " + "[" + lineups.bottomNext + "](" + link(lineups.bottomNext) + ") и " + "[" + lineups.topNext + "](" + link(lineups.topNext) + ")";

    return [ msg1, msg2 ];
}