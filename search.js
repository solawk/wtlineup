let searchTimeout = null;
const suggestionsTable = el("searchDropdownTable");

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

function searchInput()
{
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { searchSuggest(); }, 200);
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

    let suggestionsStartWith = [];
    let suggestionsInclude = [];

    for (const v of vehicles)
    {
        if ((v.enName.toLowerCase().startsWith(query.toLowerCase()) || v.ruName.toLowerCase().startsWith(query.toLowerCase())) && suggestionsStartWith.length < 10)
        {
            suggestionsStartWith.push(v);
            continue;
        }

        if ((v.enName.toLowerCase().includes(query.toLowerCase()) || v.ruName.toLowerCase().includes(query.toLowerCase())) && suggestionsInclude.length < 10)
        {
            suggestionsInclude.push(v);
        }
    }

    let suggestions = [...suggestionsStartWith];
    let remainingCapacity = 10 - suggestions.length;

    for (let i = 0; i < remainingCapacity && suggestionsInclude.length > 0; i++)
    {
        suggestions.push(suggestionsInclude.shift());
    }

    suggestionsTable.innerHTML = "";

    for (const s of suggestions)
    {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        const tdLineups = document.createElement("td");
        tr.appendChild(tdName);
        tr.appendChild(tdLineups);

        const span = document.createElement("span");
        span.innerHTML = (locale === "ru" && s.ruName !== "") ? s.ruName : s.enName;
        tdName.appendChild(span);

        tdName.innerHTML += "&nbsp;";

        const img = getNation(s.nation);
        tdName.appendChild(img);

        tdName.style.padding = "0.5em";

        const lineups = getGuaranteedLineups(s);
        for (const l of lineups)
        {
            const btn = document.createElement("button");
            btn.innerHTML = l;
            btn.className = "suggestion lineupSuggestion";
            btn.onclick = () =>
                {
                    if (l.length === 0) return;
                    selectLineup(l, true);
                    clearSuggestions();
                };
            tdLineups.appendChild(btn);
        }

        tr.classList.add("suggestion");
        suggestionsTable.appendChild(tr);
    }
}

function clearSuggestions()
{
    suggestionsTable.classList.remove("dropdownShow");
}