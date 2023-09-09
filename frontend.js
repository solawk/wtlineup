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
    console.log(name);
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
        const startAndEnd = name.split("-");
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

// Bot integration

(function(exports)
{
    exports.hrefOfVehicle = hrefOfVehicle
})(typeof exports === 'undefined' ? this['frontend'] = {} : exports);