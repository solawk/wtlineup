const keyDate = new Date(Date.UTC(2023, 3, 10, 11));
const squadronResetDate = new Date(Date.UTC(2023, 3, 15, 0));

const bottomLineups = [ "6_1", "1_1", "3_1", "2_1", "5_1", "4_1" ];
const topLineups = [ "9_2", "8_2", "10_2", "8_2_2" ];

const whenBottomLineups = [ "", "", "", "", "", "" ]; // "now", "today" or number of days to change (1 = tomorrow, 2 = after tomorrow etc.)
const whenTopLineups = [ "", "", "", "" ];

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
            { min: "10.7", max: "11.3" },
            { min: "11.7", max: "12.0" },
        ],
        [
            { min: "1.0", max: "2.0" },
            { min: "2.3", max: "3.3" },
            { min: "3.7", max: "4.7" },
            { min: "5.0", max: "6.0" },
            { min: "6.3", max: "7.3" },
            { min: "7.7", max: "8.7" },
            { min: "9.0", max: "10.0" },
            { min: "10.3", max: "11.0" },
            { min: "11.3", max: "12.0" },
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
            { min: "11.0", max: "12.0" },
        ],
        [
            { min: "1.0", max: "1.7" },
            { min: "2.0", max: "2.7" },
            { min: "3.0", max: "4.0" },
            { min: "4.3", max: "5.3" },
            { min: "5.7", max: "6.7" },
            { min: "7.0", max: "8.0" },
            { min: "8.3", max: "9.3" },
            { min: "9.7", max: "10.7" },
            { min: "11.0", max: "12.0" },
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
    const whenTL = [ "", "", "", "" ];
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

    return { bottomNow: bottomLineupNow, topNow: topLineupNow,
        bottomNext: bottomLineupNext, topNext: topLineupNext,
        nextHours: nextHours, nextMinutes: nextMinutes,
        future: futureLineups, whenBL: whenBL, whenTL: whenTL,
        sqD: squadron_daysRemaining, sqH: squadron_hoursRemaining, sqM: squadron_minutesRemaining };
}

function setSchedule()
{
    // Lineups
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

    whenBottomLineups[indexOfBottomLineupNow] = "now";
    whenTopLineups[indexOfTopLineupNow] = "now";

    const bottomLineupNext = bottomLineups[indexOfBottomLineupNext];
    const topLineupNext = topLineups[indexOfTopLineupNext];

    const nowDate = new Date();
    const nextDate = new Date(Date.now() + totalMsRemaining);
    const isNextToday = nowDate.getHours() < nextDate.getHours();

    whenBottomLineups[indexOfBottomLineupNext] = isNextToday ? "today" : 1;
    whenTopLineups[indexOfTopLineupNext] = isNextToday ? "today" : 1;

    el("sched_currentBottom").innerHTML = bottomLineupNow;
    el("sched_currentTop").innerHTML = topLineupNow;

    el("sched_nextBottom").innerHTML = bottomLineupNext;
    el("sched_nextTop").innerHTML = topLineupNext;

    el("sched_hours").innerHTML = hoursRemaining.toString();
    el("sched_minutes").innerHTML = minutesRemaining.toString();

    // Squadron

    const squadron_diff = nowDateMs - squadronResetDate;
    let squadron_diffInDaysUnfloored = squadron_diff / (1000 * 60 * 60 * 24);
    if (squadron_diffInDaysUnfloored < 0) squadron_diffInDaysUnfloored += 3;
    const squadron_diffInDaysUntilReset = 3 - (squadron_diffInDaysUnfloored % 3);

    const squadron_totalMinutesRemaining = Math.floor(squadron_diffInDaysUntilReset * 24 * 60);
    const squadron_daysRemaining = Math.floor(squadron_totalMinutesRemaining / (24 * 60));
    const squadron_hoursRemaining = Math.floor((squadron_totalMinutesRemaining - (squadron_daysRemaining * 24 * 60)) / 60);
    const squadron_minutesRemaining = squadron_totalMinutesRemaining - (squadron_daysRemaining * 24 * 60) - (squadron_hoursRemaining * 60);

    // Future days

    const nextRotation = nowDateMs + ((diffInDays + 1) - diffInDaysUnfloored) * 24 * 60 * 60 * 1000;
    const futureDiv = el("scheduleFuture");
    futureDiv.innerHTML = "";
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

        futureDiv.innerHTML += "<span style='white-space: nowrap'>[<a class='undecoratedLinks' onclick='clickOnScheduleLineup(this)'>" + bLineup + "</a>]<span class='lineupsAmpersand'> & </span>[<a class='undecoratedLinks' onclick='clickOnScheduleLineup(this)'>" + tLineup + "</a>]</span> <span style='white-space: nowrap'> – " + dateString + " </span>";
        futureDiv.innerHTML += "<br>";

        if (whenBottomLineups[bottom] === "") whenBottomLineups[bottom] = isNextToday ? 1 + d : 2 + d;
        if (whenTopLineups[top] === "") whenTopLineups[top] = isNextToday ? 1 + d : 2 + d;
    }

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

    futureDiv.appendChild(upperSquadronSpan);
    futureDiv.innerHTML += "<br>";
    futureDiv.appendChild(lowerSquadronInSpan);
    futureDiv.innerHTML += "&nbsp;" + squadron_daysRemaining + "&nbsp;";
    futureDiv.appendChild(lowerSquadronDSpan);
    futureDiv.innerHTML += "&nbsp;" + squadron_hoursRemaining + "&nbsp;";
    futureDiv.appendChild(lowerSquadronHSpan);
    futureDiv.innerHTML += "&nbsp;" + squadron_minutesRemaining + "&nbsp;";
    futureDiv.appendChild(lowerSquadronMinSpan);

    confirmLocale();
}

function whenIsLineup(lineup)
{
    let index = bottomLineups.indexOf(lineup);

    if (index === -1)
    {
        index = topLineups.indexOf(lineup);
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
    exports.BL = bottomLineups;
    exports.TL = topLineups
})(typeof exports === 'undefined' ? this['schedule'] = {} : exports);