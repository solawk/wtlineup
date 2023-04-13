const keyDate = new Date(Date.UTC(2023, 3, 10, 11));

function setSchedule()
{
    const nowDate = Date.now();

    const diff = nowDate - keyDate;
    const diffInDaysUnfloored = diff / (1000 * 60 * 60 * 24);
    const diffInDays = Math.floor(diffInDaysUnfloored);

    const totalMinutesRemaining = Math.floor(((diffInDays + 1) - diffInDaysUnfloored) * 24 * 60);
    const hoursRemaining = Math.floor(totalMinutesRemaining / 60);
    const minutesRemaining = totalMinutesRemaining - (hoursRemaining * 60);

    const bottomLineups = [ "6_1", "1_1", "3_1", "2_1", "5_1", "4_1" ];
    const topLineups = [ "9_2", "8_2", "10_2", "8_2_2" ];

    let diffInDaysModBottom = diffInDays % bottomLineups.length;
    if (diffInDaysModBottom < 0) diffInDaysModBottom += bottomLineups.length;

    let diffInDaysModTop = diffInDays % topLineups.length;
    if (diffInDaysModTop < 0) diffInDaysModTop += topLineups.length;

    const nextBottom = (diffInDaysModBottom + 1) % bottomLineups.length;
    const nextTop = (diffInDaysModTop + 1) % topLineups.length;

    el("sched_currentBottom").innerHTML = bottomLineups[diffInDaysModBottom];
    el("sched_currentTop").innerHTML = topLineups[diffInDaysModTop];

    el("sched_nextBottom").innerHTML = bottomLineups[nextBottom];
    el("sched_nextTop").innerHTML = topLineups[nextTop];

    el("sched_hours").innerHTML = hoursRemaining.toString();
    el("sched_minutes").innerHTML = minutesRemaining.toString();

    // Future days

    const nextRotation = nowDate + ((diffInDays + 1) - diffInDaysUnfloored) * 24 * 60 * 60 * 1000;
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

        futureDiv.innerHTML += "<span style='white-space: nowrap'>[<a class='undecoratedLinks' onclick='clickOnScheduleLineup(this)'>" + bLineup + "</a>] & [<a class='undecoratedLinks' onclick='clickOnScheduleLineup(this)'>" + tLineup + "</a>]</span> <span style='white-space: nowrap'> – " + dateString + " </span>";
        if (d !== 4) futureDiv.innerHTML += "<br>";
    }
}

function clickOnScheduleLineup(elem)
{
    const lineup = elem.innerHTML;
    selectLineup(lineup, true);
    window.scrollTo(0, 0);
}

setSchedule();

setInterval(() => { setSchedule(); }, 1000 * 30); // Every 30 seconds

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