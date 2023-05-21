let searchTimeout = null;
let suggestionTable = null;

if (typeof exports === 'undefined')
{
    searchTimeout = null;
    suggestionsTable = el("searchDropdownTable");

    el("searchInput").oninput = (e) =>
    {
        searchInput();
    }

    el("searchInput").onfocus = (e) =>
    {
        if (e.currentTarget.value.trim() === "") return;

        searchInput();
    }

    el("searchInput").onblur = (e) =>
    {
        if (el('searchDropdownTable').contains(e.relatedTarget)) return;

        if (searchTimeout) clearTimeout(searchTimeout);
        clearSuggestions();
    }
}

function searchInput()
{
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { searchSuggest(); }, 200);
}

function getSuggestions(input, source, glFuncFromBot, amount)
{
    let suggestionsStartWith = [];
    let suggestionsInclude = [];

    const glFunc = glFuncFromBot ? glFuncFromBot : getGuaranteedLineups;
    const maxAmount = amount ? amount : 10;

    for (const v of source)
    {
        if ((v.enName.toLowerCase().startsWith(input.toLowerCase()) || v.ruName.toLowerCase().startsWith(input.toLowerCase())) && suggestionsStartWith.length < maxAmount)
        {
            suggestionsStartWith.push({v: v, l: glFunc(v)});
            continue;
        }

        if ((v.enName.toLowerCase().includes(input.toLowerCase()) || v.ruName.toLowerCase().includes(input.toLowerCase())) && suggestionsInclude.length < maxAmount)
        {
            suggestionsInclude.push({v: v, l: glFunc(v)});
        }
    }

    let suggestions = [...suggestionsStartWith];
    let remainingCapacity = maxAmount - suggestions.length;

    for (let i = 0; i < remainingCapacity && suggestionsInclude.length > 0; i++)
    {
        suggestions.push(suggestionsInclude.shift());
    }

    //console.log(suggestions);
    return suggestions;
}

function searchSuggest()
{
    suggestionsTable.classList.add("dropdownShow");

    const query = el("searchInput").value;
    if (query.trim() === "")
    {
        clearSuggestions();
        return;
    }

    const suggestions = getSuggestions(query, vehicles);

    suggestionsTable.innerHTML = "";

    for (const s of suggestions)
    {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        const tdLineups = document.createElement("td");
        tr.appendChild(tdName);
        tr.appendChild(tdLineups);

        const a = document.createElement("a");
        a.innerHTML = (locale === "ru" && s.v.ruName !== "") ? s.v.ruName : s.v.enName;
        a.target = "_blank";
        a.href = hrefOfVehicle(s.v);
        a.classList.toggle("undecoratedLinks");

        tdName.appendChild(a);

        tdName.innerHTML += "&nbsp;";

        const img = getNation(s.v.nation);
        tdName.appendChild(img);

        tdName.style.padding = "0.5em";

        const lTable = document.createElement("table");
        tdLineups.appendChild(lTable);
        const lineups = s.l;
        for (const l of lineups)
        {
            if (l.length === 0) continue;

            const lTr = document.createElement("tr");
            lTable.appendChild(lTr);

            const lTdButton = document.createElement("td");
            lTr.appendChild(lTdButton);

            const btn = document.createElement("button");
            btn.innerHTML = l;
            btn.className = "suggestion lineupSuggestion";
            btn.onclick = () =>
                {
                    selectLineup(l, true);
                    clearSuggestions();
                };
            lTdButton.appendChild(btn);


            const lTdWhen = document.createElement("td");
            lTr.appendChild(lTdWhen);

            const when = whenIsLineup(l);

            let whenString = " – ";
            switch (when)
            {
                case "now": whenString += (locale === "ru") ? ru.whenNow : en.whenNow; break;
                case "today": whenString += (locale === "ru") ? ru.whenToday : en.whenToday; break;
                case 1: whenString += (locale === "ru") ? ru.whenTomorrow : en.whenTomorrow; break;
                case 2: whenString += (locale === "ru") ? ru.whenAfterTomorrow : en.whenAfterTomorrow; break;

                default:
                    whenString += ((locale === "ru") ? ru.whenAfterDaysBefore : en.whenAfterDaysBefore)
                        + (when - 1).toString() + ((locale === "ru") ? ru.whenAfterDaysAfter : en.whenAfterDaysAfter);
                    break;
            }

            lTdWhen.innerHTML = whenString;
            lTdWhen.style.paddingRight = "0.5em";
        }

        tr.classList.add("suggestion");
        suggestionsTable.appendChild(tr);
    }

    if (suggestions.length === 0)
    {
        suggestionsTable.innerHTML = (locale === "ru") ? ru.noneFound : en.noneFound;
    }
}

function clearSuggestions()
{
    suggestionsTable.classList.remove("dropdownShow");
}

// Bot integration

(function(exports)
{
    exports.getSuggestions = getSuggestions
})(typeof exports === 'undefined' ? this['search'] = {} : exports);
