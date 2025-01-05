function toggleLineupDropdown(close)
{
    if (!close)
    {
        el("lineupDropdownDiv").classList.toggle("dropdownShow");
    }
    else
    {
        el("lineupDropdownDiv").classList.remove("dropdownShow");
    }
}

let teamBlue = null;
let teamRed = null;

let showOnlyNation = null;

let sorting = "nationForward";

function selectLineup(name, ignoreToggle) // type = bottom or top lineup
{
    //console.log(name);
    if (!ignoreToggle) toggleLineupDropdown();

    showOnlyNation = null;

    el("lineupButton").innerHTML = "<span id='lineupSpan'>" + name + "</span>";

    const type = name.split("_")[1] === '1' ? "bottom" : "top";

    el("lineupFlagsRed").innerHTML = el("lineupFlagsBlue").innerHTML = el("lineupFlagsGray").innerHTML = "";

    if (type === "bottom")
    {
        el("lineupFlagsRed").appendChild(getNation("usa", true));
        nbspSpan("lineupFlagsRed");
        el("lineupFlagsRed").appendChild(getNation("ussr", true));
        nbspSpan("lineupFlagsRed");
        el("lineupFlagsRed").appendChild(getNation("britain", true));
        nbspSpan("lineupFlagsRed");
        el("lineupFlagsRed").appendChild(getNation("china", true));
        nbspSpan("lineupFlagsRed");
        el("lineupFlagsRed").appendChild(getNation("france", true));
        nbspSpan("lineupFlagsRed");
        el("lineupFlagsRed").appendChild(getNation("sweden", true));
        nbspSpan("lineupFlagsRed");
        if (parseInt(name.split("_")[0]) >= 5)
        {
            el("lineupFlagsRed").appendChild(getNation("israel", true));
            nbspSpan("lineupFlagsRed");
        }

        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("germany", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("japan", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("italy", true));
    }
    else
    {
        el("lineupFlagsRed").appendChild(getNation("ussr", true));
        nbspSpan("lineupFlagsRed");
        el("lineupFlagsRed").appendChild(getNation("china", true));
        nbspSpan("lineupFlagsRed");

        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("usa", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("germany", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("britain", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("japan", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("italy", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("france", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("sweden", true));
        nbspSpan("lineupFlagsBlue");
        el("lineupFlagsBlue").appendChild(getNation("israel", true));
    }

    el("lineupFlagsGray").appendChild(getNation("usa", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("germany", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("ussr", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("britain", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("japan", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("china", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("italy", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("france", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("sweden", true, true));
    nbspSpan("lineupFlagsGray");
    el("lineupFlagsGray").appendChild(getNation("israel", true, true));

    if (mode === "ground")
    {
        const lineupVehicles = getAllVehiclesInLineup(name, type);
        teamBlue = lineupVehicles.blue;
        teamRed = lineupVehicles.red;
    }
    else
    {
        let startAndEnd = name.split("-");
        if (startAndEnd.length === 1) startAndEnd = name.split("‑");
        const ecVehicles = getAllVehiclesInEC(parseFloat(startAndEnd[0]), parseFloat(startAndEnd[1]));

        teamBlue = [];
        teamRed = [];

        for (let i = 0; i < ecVehicles.length; i++)
        {
            if (i % 2 === 0)
                teamRed.push(ecVehicles[i]);
            else
                teamBlue.push(ecVehicles[i]);
        }
    }

    fillLineupTable([ "nameForward", "brForward", "classForward", "nationForward" ]);
    localStorage.setItem("lineup", name);
}

function changeSorting(newSorting)
{
    sorting = newSorting;
    fillLineupTable();
}

function nbspSpan(elementId)
{
    const spannbsp = document.createElement("span");
    spannbsp.innerHTML = "&nbsp;";
    el(elementId).appendChild(spannbsp);
}

function selectNation(selectedNation, isDeselecting)
{
    const allNations = [ "usa", "germany", "ussr", "britain", "france", "italy", "japan", "china", "israel", "sweden" ];

    for (const nation of allNations)
    {
        function toggleFlag(nation, isGray)
        {
            const flag = el("nation_flag_" + nation + (isGray ? "_gray" : ""));
            if (flag == null) return; // may happen for Israel

            if (!isDeselecting)
            {
                if (selectedNation !== nation)
                {
                    flag.classList.add("nationFlagUnselected");
                }
                else
                {
                    flag.classList.remove("nationFlagUnselected");
                }
            }
            else
            {
                flag.classList.remove("nationFlagUnselected");
            }
        }

        toggleFlag(nation, false);
        toggleFlag(nation, true);
    }

    showOnlyNation = selectedNation;
    fillLineupTable();
}

function fillLineupTable(sortings)
{
    el("lineupBlue").innerHTML = "";
    el("lineupRed").innerHTML = "";

    const tableHeaderBlueStyle = mode === "ground" ? "tableHeaderBlue" : "tableHeaderGray";
    const tableHeaderRedStyle = mode === "ground" ? "tableHeaderRed" : "tableHeaderGray";

    // Head
    function addHeader(tableName, isLeftOrder)
    {
        const tr = document.createElement("tr");
        tr.style.textShadow = "1px 1px 1px black";
        tr.style.fontWeight = "bolder";
        el(tableName).appendChild(tr);

        const headerClass = isLeftOrder ? tableHeaderBlueStyle : tableHeaderRedStyle;

        const tdNation = document.createElement("td");
        tdNation.innerHTML = locale === "en" ? en.nation : ru.nation;
        tdNation.style.fontSize = "0.7em";
        tdNation.style.width = "10%";
        tdNation.classList.add(headerClass);
        tdNation.onclick = () => { sorting !== 'nationForward' ? changeSorting('nationForward') : changeSorting('nationInverse'); };

        const tdClass = document.createElement("td");
        tdClass.innerHTML = locale === "en" ? en.cl : ru.cl;
        tdClass.style.fontSize = "0.7em";
        tdClass.style.width = "10%";
        tdClass.classList.add(headerClass);
        tdClass.onclick = () => { sorting !== 'classForward' ? changeSorting('classForward') : changeSorting('classInverse'); };

        const tdBR = document.createElement("td");
        tdBR.innerHTML = locale === "en" ? en.br : ru.br;
        tdBR.classList.add(headerClass);
        tdBR.onclick = () => { sorting !== 'brForward' ? changeSorting('brForward') : changeSorting('brInverse'); };

        const tdName = document.createElement("td");
        tdName.innerHTML = locale === "en" ? en.name : ru.name;
        tdName.style.paddingRight = tdName.style.paddingLeft = "0.5em";
        tdName.style.textAlign = !isLeftOrder ? "right" : "left";
        tdName.classList.add(headerClass);
        tdName.onclick = () => { sorting !== 'nameForward' ? changeSorting('nameForward') : changeSorting('nameInverse'); };

        if (isLeftOrder)
        {
            tr.appendChild(tdNation);
            tr.appendChild(tdClass);
            tr.appendChild(tdBR);
            tr.appendChild(tdName);
        }
        else
        {
            tr.appendChild(tdName);
            tr.appendChild(tdBR);
            tr.appendChild(tdClass);
            tr.appendChild(tdNation);
        }
    }

    // Sorting

    function sortVehicles(a, b)
    {
        const aStats = {};
        const bStats = {};

        switch (a.nation)
        {
            case "ussr":        aStats.nation = 9; break;
            case "germany":     aStats.nation = 2; break;
            case "usa":         aStats.nation = 8; break;
            case "britain":     aStats.nation = 7; break;
            case "france":      aStats.nation = 1; break;
            case "italy":       aStats.nation = 4; break;
            case "japan":       aStats.nation = 5; break;
            case "china":       aStats.nation = 0; break;
            case "sweden":      aStats.nation = 6; break;
            case "israel":      aStats.nation = 3; break;
        }

        switch (b.nation)
        {
            case "ussr":        bStats.nation = 9; break;
            case "germany":     bStats.nation = 2; break;
            case "usa":         bStats.nation = 8; break;
            case "britain":     bStats.nation = 7; break;
            case "france":      bStats.nation = 1; break;
            case "italy":       bStats.nation = 4; break;
            case "japan":       bStats.nation = 5; break;
            case "china":       bStats.nation = 0; break;
            case "sweden":      bStats.nation = 6; break;
            case "israel":      bStats.nation = 3; break;
        }

        switch (a.cl)
        {
            case "light":       aStats.cl = 0; break;
            case "medium":      aStats.cl = 1; break;
            case "heavy":       aStats.cl = 2; break;
            case "spg":         aStats.cl = 3; break;
            case "spaa":        aStats.cl = 4; break;
            case "fighter":     aStats.cl = 5; break;
            case "attacker":    aStats.cl = 6; break;
            case "bomber":      aStats.cl = 7; break;
            case "heli":        aStats.cl = 8; break;
        }

        switch (b.cl)
        {
            case "light":       bStats.cl = 0; break;
            case "medium":      bStats.cl = 1; break;
            case "heavy":       bStats.cl = 2; break;
            case "spg":         bStats.cl = 3; break;
            case "spaa":        bStats.cl = 4; break;
            case "fighter":     bStats.cl = 5; break;
            case "attacker":    bStats.cl = 6; break;
            case "bomber":      bStats.cl = 7; break;
            case "heli":        bStats.cl = 8; break;
        }

        switch (sorting)
        {
            case "nationForward": return aStats.nation - bStats.nation;
            case "nationInverse": return bStats.nation - aStats.nation;

            case "classForward": return aStats.cl - bStats.cl;
            case "classInverse": return bStats.cl - aStats.cl;

            case "brForward": return parseFloat(b.br !== "" ? b.br : "0.0") - parseFloat(a.br !== "" ? a.br : "0.0");
            case "brInverse": return parseFloat(a.br !== "" ? a.br : "0.0") - parseFloat(b.br !== "" ? b.br : "0.0");

            case "nameForward": return a.enName.localeCompare(b.enName);
            case "nameInverse": return b.enName.localeCompare(a.enName);
        }
    }

    if (sortings)
    {
        for (const s of sortings)
        {
            sorting = s;
            teamBlue.sort(sortVehicles);
            teamRed.sort(sortVehicles);
        }
    }
    else
    {
        teamBlue.sort(sortVehicles);
        teamRed.sort(sortVehicles);
    }

    addHeader("lineupBlue", true);
    addHeader("lineupRed", false);

    function addVehicle(tableName, vehicle, isLeftOrder)
    {
        if (showOnlyNation != null && vehicle.nation !== showOnlyNation) return;

        const tr = document.createElement("tr");
        tr.style.textShadow = "1px 1px 1px black";
        el(tableName).appendChild(tr);

        const tdNation = document.createElement("td");
        const tdClass = document.createElement("td");
        const tdBR = document.createElement("td");
        const tdName = document.createElement("td");
        tdName.style.textAlign = !isLeftOrder ? "right" : "left";
        tdName.style.paddingRight = tdName.style.paddingLeft = "0.5em";

        const aName = document.createElement("a");
        tdName.appendChild(aName);
        aName.target = "_blank";
        aName.href = hrefOfVehicle(vehicle);
        aName.classList.toggle("undecoratedLinks");

        if (isLeftOrder)
        {
            tr.appendChild(tdNation);
            tr.appendChild(tdClass);
            tr.appendChild(tdBR);
            tr.appendChild(tdName);
        }
        else
        {
            tr.appendChild(tdName);
            tr.appendChild(tdBR);
            tr.appendChild(tdClass);
            tr.appendChild(tdNation);
        }

        tdNation.appendChild(getNation(vehicle.nation, false));
        tdClass.appendChild(getClass(vehicle.cl));
        tdBR.innerHTML = vehicle.br;
        aName.innerHTML = (locale === "ru" && vehicle.ruName !== "") ? vehicle.ruName : vehicle.enName;

        tdNation.classList.add("vehicleTd");
        tdClass.classList.add("vehicleTd");
        tdBR.classList.add("vehicleTd");
        tdName.classList.add("vehicleTd");

        tdBR.classList.add("vehicleNameSize");
        tdName.classList.add("vehicleNameSize");
    }

    for (const v of teamBlue)   addVehicle("lineupBlue", v, true);
    for (const v of teamRed)    addVehicle("lineupRed", v, false);
}

function getNation(nation, isChoosable, isGray)
{
    const img = document.createElement("img");
    img.style.maxWidth = "2em";
    img.classList.add("nationFlags");
    img.id = "nation_flag_" + nation + (isGray ? "_gray" : "");

    if (isChoosable)
    {
        img.onclick = (e) =>
        {
            if (showOnlyNation == null)
            {
                selectNation(nation, false);
            }
            else if (showOnlyNation === nation)
            {
                selectNation(null, true);
            }
            else
            {
                selectNation(nation, false);
            }
        };

        img.style.maxWidth = "2.4em";
        img.style.cursor = "pointer";
        img.classList.add("flagFilter");
    }

    let src;
    let title;

    let l = locale === "en" ? en : ru;

    switch (nation)
    {
        case "":            src = "";                   title = ""; break;
        case "ussr":        src = "flags/ussr.png";     title = l.ussr; break;
        case "germany":     src = "flags/germany.png";  title = l.germany; break;
        case "usa":         src = "flags/usa.png";      title = l.usa; break;
        case "britain":     src = "flags/britain.png";  title = l.britain; break;
        case "france":      src = "flags/france.png";   title = l.france; break;
        case "italy":       src = "flags/italy.png";    title = l.italy; break;
        case "japan":       src = "flags/japan.png";    title = l.japan; break;
        case "china":       src = "flags/china.png";    title = l.china; break;
        case "sweden":      src = "flags/sweden.png";   title = l.sweden; break;
        case "israel":      src = "flags/israel.png";   title = l.israel; break;
    }

    img.src = src;
    img.title = title;
    return img;
}

function getClass(cl)
{
    const img = document.createElement("img");
    img.style.maxWidth = "2em";
    img.style.filter = "drop-shadow(1px 1px 2px #000000)";
    let src;
    let title;

    let l = locale === "en" ? en : ru;

    switch (cl)
    {
        case "":            src = "";                       title = ""; break;
        case "light":       src = "classes/light.png";      title = l.light; break;
        case "medium":      src = "classes/medium.png";     title = l.medium; break;
        case "heavy":       src = "classes/heavy.png";      title = l.heavy; break;
        case "spg":         src = "classes/spg.png";        title = l.spg; break;
        case "spaa":        src = "classes/spaa.png";       title = l.spaa; break;
        case "fighter":     src = "classes/fighter.png";    title = l.fighter; break;
        case "attacker":    src = "classes/attacker.png";   title = l.attacker; break;
        case "bomber":      src = "classes/bomber.png";     title = l.bomber; break;
        case "heli":        src = "classes/heli.png";       title = l.heli; break;
    }

    img.src = src;
    img.title = title;
    return img;
}

function hrefOfVehicle(v)
{
    return "https://www.google.com/search?q=War+Thunder+"
        + v.enName.toString().replaceAll(" ", "+") + "+" + v.nation.toString();
}

let isMenuOpen = false;

function toggleMenu()
{
    const menuTd = el("utilsMenuTd");
    const button = el("utilsButton");

    isMenuOpen = !isMenuOpen;

    if (isMenuOpen)
    {
        menuTd.classList.add("utilsMenuTdOpened");
        button.innerHTML = ">";
    }
    else
    {
        menuTd.classList.remove("utilsMenuTdOpened");
        button.innerHTML = "<";
    }
}

function setMarathonInfo(info)
{
    //console.trace();
    //console.log(info);
    if (info == null) return

    // COPY FROM MARATHON BOT START

    const premiumM = [ "Акционный", "Премиумный" ];
    const premiumF = [ "Акционная", "Премиумная" ];
   
    const premiumMen = [ "Gift", "Premium" ];
    const premiumFen = [ "Gift", "Premium" ];

    const dimensions =
    {
        light: 0,
        medium: 0,
        heavy: 0,
        spg: 0,
        spaa: 0,
        fighter: 1,
        attacker: 1,
        bomber: 1,
        heli: 1,
        barge: 2,
        boat: 2,
        chaser: 2,
        destroyer: 2,
        cruiser: 2,
        battleship: 2,
    };

    const classes =
    {
        light: "лёгкий танк",
        medium: "средний танк",
        heavy: "тяжёлый танк",
        spg: "САУ",
        spaa: "ЗСУ",
        fighter: "истребитель",
        attacker: "штурмовик",
        bomber: "бомбардировщик",
        heli: "вертолёт",
        barge: "баржа",
        boat: "катер",
        chaser: "морской охотник",
        destroyer: "эсминец",
        cruiser: "крейсер",
        battleship: "линкор",
    };

    const classesen =
    {
        light: "light tank",
        medium: "medium tank",
        heavy: "heavy tank",
        spg: "SPG",
        spaa: "SPAA",
        fighter: "fighter",
        attacker: "attacker",
        bomber: "bomber",
        heli: "helicopter",
        barge: "barge",
        boat: "boat",
        chaser: "sub-chaser",
        destroyer: "destroyer",
        cruiser: "cruiser",
        battleship: "battleship",
    };

    const clFeminine =
    {
        light:      false,
        medium:     false,
        heavy:      false,
        spg:                true,
        spaa:               true,
        fighter:    false,
        attacker:   false,
        bomber:     false,
        heli:       false,
        barge:              true,
        boat:       false,
        chaser:     false,
        destroyer:  false,
        cruiser:    false,
        battleship: false,
    };

    const nations =
    {
        usa: "США",
        germany: "Германии",
        ussr: "СССР",
        britain: "Великобритании",
        france: "Франции",
        italy: "Италии",
        japan: "Японии",
        china: "Китая",
        sweden: "Швеции",
        israel: "Израиля"
    };

    const nationsen =
    {
        usa: "US",
        germany: "german",
        ussr: "USSR",
        britain: "british",
        france: "french",
        italy: "italian",
        japan: "japanese",
        china: "chinese",
        sweden: "swedish",
        israel: "israeli"
    };

    const months =
    [
        "января", "февраля", "марта",
        "апреля", "мая", "июня",
        "июля", "августа", "сентября",
        "октября", "ноября", "декабря"
    ];

    const monthsen =
    [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    const ranks =
    [
        "3-", "4-", "5 ", "6 ", "7+"
    ];

    const ISRU = locale === "ru";

    // Actual data

    const currentDate = new Date();

    const isTransannual = info.startMonth === "12" && info.endMonth === "1";
    const isJanuary = currentDate.getMonth() === 0;
    const deductYear = isTransannual && isJanuary;

    const startDate = new Date(Date.UTC(currentDate.getUTCFullYear() - (deductYear ? 1 : 0), parseInt(info.startMonth) - 1, parseInt(info.startDay), parseInt(info.eventHour)));
    const endDate = new Date(Date.UTC(new Date().getUTCFullYear() + (parseInt(info.startMonth) > parseInt(info.endMonth) ? 1 : 0) - (deductYear ? 1 : 0), parseInt(info.endMonth) - 1, parseInt(info.endDay), parseInt(info.eventHour)));

    const timeDifference = endDate.getTime() - startDate.getTime();
    const durationInDays = timeDifference / (1000 * 60 * 60 * 24);
    const durationInStages = Math.round(durationInDays / parseInt(info.daysPerStage));

    const timeElapsed = currentDate.getTime() - startDate.getTime();
    const isMarathonOver = timeElapsed > timeDifference;
    const isMarathonNotStarted = currentDate < startDate;
    const currentStage = Math.ceil(timeElapsed / (1000 * 60 * 60 * 24 * parseInt(info.daysPerStage)));

    const stageStartTimestamp = startDate.getTime() + (1000 * 60 * 60 * 24 * parseInt(info.daysPerStage) * (currentStage - 1));
    const stageTimeElapsed = currentDate.getTime() - stageStartTimestamp;
    const stageEndTimestamp = startDate.getTime() + (1000 * 60 * 60 * 24 * parseInt(info.daysPerStage) * currentStage);

    const remainingStageTime = stageEndTimestamp - currentDate.getTime();
    const remainingStageDays = Math.floor(remainingStageTime / (1000 * 60 * 60 * 24));
    const remainingStageHours = Math.floor(remainingStageTime / (1000 * 60 * 60)) - (remainingStageDays * 24);
    const remainingStageMinutes = Math.floor(remainingStageTime / (1000 * 60)) - (remainingStageDays * 24 * 60) - (remainingStageHours * 60);

    const halfhourMinutes = (currentStage > 1 && currentStage <= (durationInStages + 1) && stageTimeElapsed < (1000 * 60 * 30)) ? (30 - Math.floor(stageTimeElapsed / (1000 * 60))) : -1;

    const modeMultipliers = [   parseFloat(info.multGAB), parseFloat(info.multGRB), parseFloat(info.multGSB),
                                parseFloat(info.multAAB), parseFloat(info.multARB), parseFloat(info.multASB),
                                parseFloat(info.multNAB), parseFloat(info.multNRB), parseFloat(info.multGSB) ];
    const currentDimension = dimensions[info.class];
    const rankMultipliers = [ parseFloat(info.multIII), parseFloat(info.multIV), parseFloat(info.multV), parseFloat(info.multVI), parseFloat(info.multVII) ];
    const stageScore = parseInt(info.stageScore);
    const couponScore = parseInt(info.couponScore);

    const scores = [];
    for (let mode = 0; mode < 3; mode++)
    {
        const modeMult = modeMultipliers[currentDimension * 3 + mode];
        scores[mode] = [];
        for (let rank = 0; rank < 5; rank++)
        {
            scores[mode][rank] = { stage: Math.ceil(stageScore / modeMult / rankMultipliers[rank]), coupon: Math.ceil(couponScore / modeMult / rankMultipliers[rank]) };
        }
    }

    // Mental disorders

    const premium = ISRU ? clFeminine[info.class] ? premiumF[parseInt(info.premium)] : premiumM[parseInt(info.premium)] : premiumFen[parseInt(info.premium)];
    const duration = ISRU ? "Марафон проходит с " + info.startDay + (info.startMonth !== info.endMonth ? " " + months[parseInt(info.startMonth) - 1] : "")
                        + " по " + info.endDay + " " + months[parseInt(info.endMonth) - 1]
                        : "Marathon is active from " + info.startDay + (info.startMonth !== info.endMonth ? " of " + monthsen[parseInt(info.startMonth) - 1] : "")
                        + " to " + info.endDay + " of " + monthsen[parseInt(info.endMonth) - 1];
    const rewardStageString = ISRU ? info.rewardStage + (info.rewardStage < 5 ? " этапа" : " этапов") : info.rewardStage + " stages";
    const currentStageString = ISRU ? "Текущий этап – " + currentStage + "/" + durationInStages
                        : "Current stage – " + currentStage + "/" + durationInStages;
    const stageRemaining = ISRU ? "Продлится " + remainingStageDays + " д " + remainingStageHours + " ч " + remainingStageMinutes + " м"
                        : "Available for " + remainingStageDays + " d " + remainingStageHours + " h " + remainingStageMinutes + " min";
    const halfhourRemaining = ISRU ? ((halfhourMinutes > -1) ? "<br>Предыдущий этап доступен ещё " + halfhourMinutes + " м" : "")
                        : ((halfhourMinutes > -1) ? "<br>Previous stage available for " + halfhourMinutes + " more min" : "");

    //                 "RR XXXXXX XXXXXX XXXXXX"
    const modeHeader = ISRU ? "<tr><td>Ранг</td><td>АБ</td><td>РБ</td><td>СБ</td><tr>" : "<tr><td>Rank</td><td>AB</td><td>RB</td><td>SB</td><tr>";
    let stageScores = modeHeader;
    let couponScores = modeHeader;
    for (let rank = 1; rank < 5; rank++)
    {
        stageScores += "<tr><td>" + ranks[rank] + "</td>";
        couponScores += "<tr><td>" + ranks[rank] + "</td>";
        for (let mode = 0; mode < 3; mode++)
        {
            if (currentDimension === 2 && mode === 2)
            {
                // Naval SB
                stageScores += "<td>------</td>";
                couponScores += "<td>------</td>";
            }
            else
            {
                stageScores += "<td>" + scores[mode][rank].stage + "</td>";
                couponScores += "<td>" + scores[mode][rank].coupon + "</td>";
            }
        }
        stageScores += "</tr>";
        couponScores += "</tr>";
    }

    // COPY FROM MARATHON BOT END

    el("maraName").innerHTML = info.name;
    el("maraDesc").innerHTML = ISRU ? premium + " " + classes[info.class] + " " + info.rank + "-го ранга " + nations[info.nation]
                                : premium + " " + nationsen[info.nation] + " " + classesen[info.class] + " of rank " + info.rank;
    el("maraDates").innerHTML = duration;
    el("maraStagesToReward").innerHTML = rewardStageString;
    el("maraCurrentStage").innerHTML = ISRU ? (!isMarathonOver ? (!isMarathonNotStarted ? currentStageString : "Марафон скоро начнётся") : "Марафон завершился!")
                                        : (!isMarathonOver ? (!isMarathonNotStarted ? currentStageString : "Marathon starts soon") : "Marathon is over!");
    el("maraStageLeft").innerHTML =
        ISRU ?
        (!isMarathonOver ?
            (!isMarathonNotStarted ? stageRemaining + halfhourRemaining : "Готовьтесь к гринду")
            : "Ожидайте нового гринда" + halfhourRemaining)
        :
        (!isMarathonOver ?
            (!isMarathonNotStarted ? stageRemaining + halfhourRemaining : "Stand by for the grind")
            : "Pending new grind" + halfhourRemaining);

    el("maraStageScore").innerHTML = info.stageScore;
    el("maraUpgradeScore").innerHTML = info.couponScore;

    el("maraStageTable").innerHTML = stageScores;
    el("maraUpgradeTable").innerHTML = couponScores;
}

// Bot integration

(function(exports)
{
    exports.hrefOfVehicle = hrefOfVehicle
})(typeof exports === 'undefined' ? this['frontend'] = {} : exports);