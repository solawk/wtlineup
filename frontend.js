function el(name)
{
    return document.getElementById(name);
}

function toggleLineupDropdown()
{
    el("lineupDropdownDiv").classList.toggle("dropdownShow");
}

let teamBlue = null;
let teamRed = null;

let sorting = "nationForward";

function selectLineup(name, ignoreToggle) // type = bottom or top lineup
{
    if (!ignoreToggle) toggleLineupDropdown();

    el("lineupButton").innerHTML = "<span id='lineupSpan' style='font-size: " + (size === "normal" ? "1" : "2") + "em'>" + name + "</span>";

    const type = name.split("_")[1] === '1' ? "bottom" : "top";

    const lineupVehicles = getAllVehiclesInLineup(name, type);
    teamBlue = lineupVehicles.blue;
    teamRed = lineupVehicles.red;

    fillLineupTable();

    localStorage.setItem("lineup", name);
}

function changeSorting(newSorting)
{
    sorting = newSorting;
    fillLineupTable();
}

function fillLineupTable()
{
    el("lineupBlue").innerHTML = "";
    el("lineupRed").innerHTML = "";

    // Head
    function addHeader(tableName, isLeftOrder)
    {
        const tr = document.createElement("tr");
        tr.style.textShadow = "1px 1px 1px black";
        tr.style.fontWeight = "bolder";
        el(tableName).appendChild(tr);

        const headerClass = isLeftOrder ? "tableHeaderBlue" : "tableHeaderRed";

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
            case "ussr":        aStats.nation = 2; break;
            case "germany":     aStats.nation = 1; break;
            case "usa":         aStats.nation = 0; break;
            case "britain":     aStats.nation = 3; break;
            case "france":      aStats.nation = 7; break;
            case "italy":       aStats.nation = 6; break;
            case "japan":       aStats.nation = 4; break;
            case "china":       aStats.nation = 5; break;
            case "sweden":      aStats.nation = 8; break;
            case "israel":      aStats.nation = 9; break;
        }

        switch (b.nation)
        {
            case "ussr":        bStats.nation = 2; break;
            case "germany":     bStats.nation = 1; break;
            case "usa":         bStats.nation = 0; break;
            case "britain":     bStats.nation = 3; break;
            case "france":      bStats.nation = 7; break;
            case "italy":       bStats.nation = 6; break;
            case "japan":       bStats.nation = 4; break;
            case "china":       bStats.nation = 5; break;
            case "sweden":      bStats.nation = 8; break;
            case "israel":      bStats.nation = 9; break;
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

    teamBlue.sort(sortVehicles);
    teamRed.sort(sortVehicles);

    addHeader("lineupBlue", true);
    addHeader("lineupRed", false);

    function addVehicle(tableName, vehicle, isLeftOrder)
    {
        const tr = document.createElement("tr");
        tr.style.textShadow = "1px 1px 1px black";
        el(tableName).appendChild(tr);

        const tdNation = document.createElement("td");
        const tdClass = document.createElement("td");
        const tdBR = document.createElement("td");
        const tdName = document.createElement("td");

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

        tdNation.appendChild(getNation(vehicle.nation));
        tdClass.appendChild(getClass(vehicle.cl));
        tdBR.innerHTML = vehicle.br;
        tdName.innerHTML = (locale === "ru" && vehicle.ruName !== "") ? vehicle.ruName : vehicle.enName;

        tdNation.classList.add("vehicleTd");
        tdClass.classList.add("vehicleTd");
        tdBR.classList.add("vehicleTd");
        tdName.classList.add("vehicleTd");

        tdBR.classList.add("vehicleNameSize");
        tdName.classList.add("vehicleNameSize");

        if (size === "big")
        {
            tdBR.classList.add("vehicleNameSizeBig");
            tdName.classList.add("vehicleNameSizeBig");
        }
    }

    for (const v of teamBlue)   addVehicle("lineupBlue", v, true);
    for (const v of teamRed)    addVehicle("lineupRed", v, false);
}

function getNation(nation)
{
    const img = document.createElement("img");
    img.style.maxWidth = "2em";
    img.style.filter = "drop-shadow(1px 1px 2px #000000)";
    let src;
    let title;

    let l = locale === "en" ? en : ru;

    switch (nation)
    {
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

let size = "normal";
function toggleSize()
{
    if (size === "normal")
    {
        size = "big";
    }
    else
    {
        size = "normal";
    }

    el("mainTable").classList.toggle("mainTableSizeBig");
    el("lineupSpan").style.fontSize = (size === "normal" ? "1" : "2") + "em";

    for (const lb of el("lineupDropdownDiv").childNodes)
    {
        if (lb.nodeName !== "BUTTON") continue;
        lb.style.fontSize = (size === "normal" ? "1" : "2") + "em";
    }

    const allResizableNodes = document.querySelectorAll("[class*='vehicleNameSize']");
    for (const n of allResizableNodes) n.classList.toggle("vehicleNameSizeBig");
}