const keyDate = new Date(Date.UTC(2023, 9, 27, 11));
const squadronResetDate = new Date(Date.UTC(2023, 3, 15, 0));
const aviaKeyDate = new Date(Date.UTC(2023, 4, 23, 8));

const bottomLineups = [ "3_1", "2_1", "5_1", "4_1", "6_1", "1_1" ];
const topLineups = [ "10_2", "8_2_2", "9_2", "11_2", "8_2" ];

let whenBottomLineups = [ "", "", "", "", "", "" ]; // "now", "today" or number of days to change (1 = tomorrow, 2 = after tomorrow etc.)
let whenTopLineups = [ "", "", "", "", "" ];
let whenECLineups = [ "", "", "", "" ];

const aviaBrackets =
    // Lineups
    [
        // Diapasons
        [
            { min: "1.0", max: "2.0" },
            { min: "2.3", max: "3.7" },
            { min: "4.0", max: "5.0" },
            { min: "5.3", max: "6.3" },
            { min: "6.7", max: "7.7" },
            { min: "8.0", max: "9.0" },
            { min: "9.3", max: "10.3" },
            { min: "10.7", max: "11.7" },
            { min: "12.0", max: "12.7" },
        ],
        [
            { min: "1.0", max: "2.0" },
            { min: "2.3", max: "3.3" },
            { min: "3.7", max: "4.7" },
            { min: "5.0", max: "6.0" },
            { min: "6.3", max: "7.3" },
            { min: "7.7", max: "8.7" },
            { min: "9.0", max: "10.0" },
            { min: "10.3", max: "11.3" },
            { min: "11.7", max: "12.7" },
        ],
        [
            { min: "1.0", max: "1.7" },
            { min: "2.0", max: "3.0" },
            { min: "3.3", max: "4.3" },
            { min: "4.7", max: "5.7" },
            { min: "6.0", max: "7.0" },
            { min: "7.3", max: "8.3" },
            { min: "8.7", max: "9.7" },
            { min: "10.0", max: "10.7" },
            { min: "11.0", max: "11.7" },
            { min: "12.0", max: "12.7" },
        ],
        [
            { min: "1.0", max: "1.7" },
            { min: "2.0", max: "2.7" },
            { min: "3.0", max: "4.0" },
            { min: "4.3", max: "5.3" },
            { min: "5.7", max: "6.7" },
            { min: "7.0", max: "8.0" },
            { min: "8.3", max: "9.3" },
            { min: "9.7", max: "10.3" },
            { min: "10.7", max: "11.3" },
            { min: "11.7", max: "12.7" },
        ],
    ];

function getLineups()
{
    // Now and next
    const nowDateMs = Date.now();

    const diff = nowDateMs - keyDate;
    const diffInDaysUnfloored = diff / (1000 * 60 * 60 * 24);
    const diffInDays = Math.floor(diffInDaysUnfloored);

    const totalMsRemaining = ((diffInDays + 1) - diffInDaysUnfloored) * 24 * 60 * 60 * 1000;
    const totalMinutesRemaining = Math.floor(((diffInDays + 1) - diffInDaysUnfloored) * 24 * 60);
    const hoursRemaining = Math.floor(totalMinutesRemaining / 60);
    const minutesRemaining = totalMinutesRemaining - (hoursRemaining * 60);

    let diffInDaysModBottom = diffInDays % bottomLineups.length;
    if (diffInDaysModBottom < 0) diffInDaysModBottom += bottomLineups.length;

    let diffInDaysModTop = diffInDays % topLineups.length;
    if (diffInDaysModTop < 0) diffInDaysModTop += topLineups.length;

    const indexOfBottomLineupNext = (diffInDaysModBottom + 1) % bottomLineups.length;
    const indexOfTopLineupNext = (diffInDaysModTop + 1) % topLineups.length;

    const indexOfBottomLineupNow = diffInDaysModBottom;
    const indexOfTopLineupNow = diffInDaysModTop;

    const bottomLineupNow = bottomLineups[indexOfBottomLineupNow];
    const topLineupNow = topLineups[indexOfTopLineupNow];

    const bottomLineupNext = bottomLineups[indexOfBottomLineupNext];
    const topLineupNext = topLineups[indexOfTopLineupNext];

    const nextHours = hoursRemaining.toString();
    const nextMinutes = minutesRemaining.toString();

    // Future
    const nextRotation = nowDateMs + ((diffInDays + 1) - diffInDaysUnfloored) * 24 * 60 * 60 * 1000;
    const futureLineups = [];
    for (let d = 0; d < 5; d++)
    {
        const date = new Date(nextRotation + (24 * 60 * 60 * 1000 * (1 + d)));
        const day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        if (month.length === 1) month = '0' + month;

        const bottom = (diffInDaysModBottom + 2 + d) % bottomLineups.length;
        const top = (diffInDaysModTop + 2 + d) % topLineups.length;

        const bLineup = bottomLineups[bottom];
        const tLineup = topLineups[top];
        const dateString = day.toString() + "." + month.toString();

        futureLineups.push({ b: bLineup, t: tLineup, date: dateString, dayOfWeek: date.getDay() })
    }

    // Search days
    const whenBL = [ "", "", "", "", "", "" ]; // "now", "today" or number of days to change (1 = tomorrow, 2 = after tomorrow etc.)
    const whenTL = [ "", "", "", "", "" ];
    whenBL[indexOfBottomLineupNow] = "now";
    whenTL[indexOfTopLineupNow] = "now";
    const nowDate = new Date();
    const nextDate = new Date(Date.now() + totalMsRemaining);
    const isNextToday = nowDate.getHours() < nextDate.getHours();
    whenBL[indexOfBottomLineupNext] = isNextToday ? "today" : 1;
    whenTL[indexOfTopLineupNext] = isNextToday ? "today" : 1;
    for (let d = 0; d < 5; d++)
    {
        const bottom = (diffInDaysModBottom + 2 + d) % bottomLineups.length;
        const top = (diffInDaysModTop + 2 + d) % topLineups.length;
        if (whenBL[bottom] === "") whenBL[bottom] = isNextToday ? 1 + d : 2 + d;
        if (whenTL[top] === "") whenTL[top] = isNextToday ? 1 + d : 2 + d;
    }

    // Squadron
    const squadron_diff = nowDateMs - squadronResetDate;
    let squadron_diffInDaysUnfloored = squadron_diff / (1000 * 60 * 60 * 24);
    if (squadron_diffInDaysUnfloored < 0) squadron_diffInDaysUnfloored += 3;
    const squadron_diffInDaysUntilReset = 3 - (squadron_diffInDaysUnfloored % 3);

    const squadron_totalMinutesRemaining = Math.floor(squadron_diffInDaysUntilReset * 24 * 60);
    const squadron_daysRemaining = Math.floor(squadron_totalMinutesRemaining / (24 * 60));
    const squadron_hoursRemaining = Math.floor((squadron_totalMinutesRemaining - (squadron_daysRemaining * 24 * 60)) / 60);
    const squadron_minutesRemaining = squadron_totalMinutesRemaining - (squadron_daysRemaining * 24 * 60) - (squadron_hoursRemaining * 60);

    // Avia
    const aviaDiff = nowDateMs - aviaKeyDate;
    const aviaDiffInPairsUnfloored = aviaDiff / (1000 * 60 * 60 * 48); // pair is 2 days
    const aviaDiffInPairs = Math.floor(aviaDiffInPairsUnfloored);

    const aviaTotalMsRemaining = ((aviaDiffInPairs + 1) - aviaDiffInPairsUnfloored) * 48 * 60 * 60 * 1000;
    const aviaTotalMinutesRemaining = Math.floor(((aviaDiffInPairs + 1) - aviaDiffInPairsUnfloored) * 48 * 60);
    const aviaDaysRemaining = Math.floor(aviaTotalMinutesRemaining / (24 * 60));
    const aviaHoursRemaining = Math.floor(aviaTotalMinutesRemaining / 60) - (aviaDaysRemaining * 24);
    const aviaMinutesRemaining = aviaTotalMinutesRemaining - (aviaHoursRemaining * 60) - (aviaDaysRemaining * 24 * 60);

    let aviaDiffInPairsModBrackets = aviaDiffInPairs % aviaBrackets.length;
    if (aviaDiffInPairsModBrackets < 0) aviaDiffInPairsModBrackets += aviaBrackets.length;

    const aviaIndexOfBracketNow = aviaDiffInPairsModBrackets;
    const aviaIndexOfBracketNext = (aviaDiffInPairsModBrackets + 1) % aviaBrackets.length;

    const aviaBracketNow = aviaBrackets[aviaIndexOfBracketNow];
    const aviaBracketNext = aviaBrackets[aviaIndexOfBracketNext];

    whenECLineups[aviaIndexOfBracketNow] = "now";
    const nextECDate = new Date(Date.now() + aviaTotalMsRemaining);
    const isNextTomorrow = aviaDaysRemaining < 1;
    const isNextECToday = isNextTomorrow ? nowDate.getHours() < nextECDate.getHours() : false;
    whenECLineups[aviaIndexOfBracketNext] = isNextECToday ? "today" : (isNextTomorrow ? 1 : 2);
    for (let d = 0; d < 3; d++)
    {
        const ecl = (aviaDiffInPairs + 2 + d) % aviaBrackets.length;
        if (whenECLineups[ecl] === "") whenECLineups[ecl] = isNextECToday ? (1 + (2 * d) + (isNextTomorrow ? 1 : 2)) : (2 + (2 * d) + (isNextTomorrow ? 1 : 2));
    }

    return { bottomNow: bottomLineupNow, topNow: topLineupNow,
        bottomNext: bottomLineupNext, topNext: topLineupNext,
        nextHours: nextHours, nextMinutes: nextMinutes,
        future: futureLineups, whenBL: whenBL, whenTL: whenTL, whenEC: whenECLineups,
        sqD: squadron_daysRemaining, sqH: squadron_hoursRemaining, sqM: squadron_minutesRemaining,
        aviaNow: aviaBracketNow, aviaNext: aviaBracketNext,
        aviaNextDays: aviaDaysRemaining, aviaNextHours: aviaHoursRemaining, aviaNextMinutes: aviaMinutesRemaining };
}

function setSchedule()
{
    const scheduleData = getLineups();

    // Lineups
    el("sched_currentBottom").innerHTML = scheduleData.bottomNow;
    el("sched_currentTop").innerHTML = scheduleData.topNow;

    el("sched_nextBottom").innerHTML = scheduleData.bottomNext;
    el("sched_nextTop").innerHTML = scheduleData.topNext;

    el("sched_hours").innerHTML = scheduleData.nextHours.toString();
    el("sched_minutes").innerHTML = scheduleData.nextMinutes.toString();

    // Squadron

    const upperSquadronSpan = document.createElement("span");
    const lowerSquadronSpan = document.createElement("span");
    const lowerSquadronInSpan = document.createElement("span");
    const lowerSquadronDSpan = document.createElement("span");
    const lowerSquadronHSpan = document.createElement("span");
    const lowerSquadronMinSpan = document.createElement("span");
    upperSquadronSpan.style.whiteSpace = lowerSquadronSpan.style.whiteSpace = "nowrap";

    upperSquadronSpan.id = "LOC_squadronReset";
    lowerSquadronInSpan.id = "LOC_inLineup2";
    lowerSquadronDSpan.id = "LOC_dLineup2";
    lowerSquadronHSpan.id = "LOC_hLineup2";
    lowerSquadronMinSpan.id = "LOC_minLineup2";

    const futureDiv = el("scheduleFuture");

    futureDiv.appendChild(upperSquadronSpan);
    futureDiv.innerHTML += "<br>";
    futureDiv.appendChild(lowerSquadronInSpan);
    futureDiv.innerHTML += "&nbsp;" + scheduleData.sqD + "&nbsp;";
    futureDiv.appendChild(lowerSquadronDSpan);
    futureDiv.innerHTML += "&nbsp;" + scheduleData.sqH + "&nbsp;";
    futureDiv.appendChild(lowerSquadronHSpan);
    futureDiv.innerHTML += "&nbsp;" + scheduleData.sqM + "&nbsp;";
    futureDiv.appendChild(lowerSquadronMinSpan);

    // Future days

    futureDiv.innerHTML = "";
    for (let d = 0; d < 5; d++)
    {
        const bLineup = scheduleData.future[d].b;
        const tLineup = scheduleData.future[d].t;
        const dateString = scheduleData.future[d].date + " (<span id='LOC_weekDay" + scheduleData.future[d].dayOfWeek.toString() + "'></span>)";

        futureDiv.innerHTML += "<span style='white-space: nowrap'>[<a class='undecoratedLinks' onclick='clickOnScheduleLineup(this)'>" + bLineup + "</a>]<span class='lineupsAmpersand'> & </span>[<a class='undecoratedLinks' onclick='clickOnScheduleLineup(this)'>" + tLineup + "</a>]</span> <span style='white-space: nowrap'> – " + dateString + " </span>";
        futureDiv.innerHTML += "<br>";
    }

    // When
    whenBottomLineups = scheduleData.whenBL;
    whenTopLineups = scheduleData.whenTL;

    confirmLocale();
}

function whenIsLineup(lineup)
{
    let index = bottomLineups.indexOf(lineup);

    if (index === -1)
    {
        index = topLineups.indexOf(lineup);

        if (index === -1)
        {
            // EC

            let earliest = 999;
            let earliestb = -1;

            for (let b = 0; b < 4; b++)
            {
                for (const ecl of aviaBrackets[b])
                {
                    if (lineup.startsWith(ecl.min) && lineup.endsWith(ecl.max))
                    {
                        if (whenECLineups[b] === "now")
                        {
                            return "now";
                        }
                        else if (whenECLineups[b] === "today")
                        {
                            return "today";
                        }
                        else if (whenECLineups[b] < earliest)
                        {
                            earliest = whenECLineups[b];
                            earliestb = b;
                        }
                    }
                }
            }

            return whenECLineups[earliestb];
        }
        
        return whenTopLineups[index];
    }

    return whenBottomLineups[index];
}

function clickOnScheduleLineup(elem)
{
    const lineup = elem.innerHTML;
    selectLineup(lineup, true);
    window.scrollTo(0, 0);
}

if (typeof exports === 'undefined')
{
    setSchedule();

    setInterval(() => { setSchedule(); }, 1000 * 30); // Every 30 seconds
}

function toggleFuture()
{
    const futureDiv = el("scheduleFuture");

    if (futureDiv.style.display === "none")
    {
        futureDiv.style.display = "block";
    }
    else
    {
        futureDiv.style.display = "none";
    }
}

// Bot integration

(function(exports)
{
    exports.getLineups = getLineups;
    exports.whenIsLineup = whenIsLineup;
    exports.BL = bottomLineups;
    exports.TL = topLineups;
    exports.AB = aviaBrackets;
})(typeof exports === 'undefined' ? this['schedule'] = {} : exports);