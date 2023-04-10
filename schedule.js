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
}

function clickOnScheduleLineup(elem)
{
    const lineup = elem.innerHTML;
    selectLineup(lineup, true);
    window.scrollTo(0, 0);
}

setSchedule();

setInterval(() => { setSchedule(); }, 1000 * 30); // Every 30 seconds