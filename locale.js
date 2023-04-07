confirmLocale();

function switchLocale()
{
    if (locale === "en")
    {
        locale = "ru";
    }
    else
    {
        locale = "en";
    }

    confirmLocale();
}

function confirmLocale()
{
    let l; // locale object

    if (locale === "en")
    {
        l = en;
    }
    else
    {
        l = ru;
    }

    const LOC_nodes = document.querySelectorAll("[id^='LOC_']");

    for (const n of LOC_nodes)
    {
        const name = n.id.slice(4);
        n.innerHTML = l[name];
    }

    fillLineupTable();
    localStorage.setItem("locale", locale);
}