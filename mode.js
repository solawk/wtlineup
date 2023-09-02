let mode = "ground"; // ground / ec

function setMode(newMode)
{
    mode = newMode;
    //fillLineupTable();

    el("lineupRed").classList.remove("red");
    el("lineupRed").classList.remove("gray");
    el("lineupBlue").classList.remove("blue");
    el("lineupBlue").classList.remove("gray");

    el("lineupRed").classList.add(mode === "ground" ? "red" : "gray");
    el("lineupBlue").classList.add(mode === "ground" ? "blue" : "gray");

    el("groundModeButton").disabled = mode === "ground";
    el("ecModeButton").disabled = mode !== "ground";

    el("lineupFlagsRed").style.display = mode === "ground" ? "" : "none";
    el("lineupFlagsBlue").style.display = mode === "ground" ? "" : "none";
    el("lineupFlagsGray").style.display = mode !== "ground" ? "" : "none";

    el("lineupDropdownDiv").innerHTML = "";

    if (mode === "ground")
    {
        for (const l of allGroundLineups)
        {
            const button = document.createElement("button");
            button.onclick = () => { selectLineup(l); };
            button.className = "suggestion lineupSuggestion";
            button.innerHTML = l;
            el("lineupDropdownDiv").appendChild(button);
        }

        selectLineup(allGroundLineups[0], true);
    }
    else
    {
        const table = document.createElement("table");
        el("lineupDropdownDiv").appendChild(table);
        const tr = document.createElement("tr");
        table.appendChild(tr);

        for (const day of aviaBrackets)
        {
            const td = document.createElement("td");
            tr.appendChild(td);

            for (const l of day)
            {
                const lineupString = l.min + "-" + l.max;
                const button = document.createElement("button");
                button.onclick = () => { selectLineup(lineupString); };
                button.className = "suggestion lineupSuggestion";
                button.innerHTML = lineupString;
                td.appendChild(button);
            }
        }

        selectLineup(aviaBrackets[0][0].min + "-" + aviaBrackets[0][0].max, true);
    }

    if (mode !== "ground")
    {
        el("lineupDropdownDiv").classList.add("dropdownShow");

        el("lineupDropdownDiv").style.left = (window.innerWidth / 2) - (el("lineupDropdownDiv").clientWidth / 2) + "px";

        el("lineupDropdownDiv").classList.remove("dropdownShow");
    }
    else
    {
        el("lineupDropdownDiv").style.left = "unset";
    }
}