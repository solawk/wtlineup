const en =
    {
        lineupSpan: "Lineup",
        searchSpan: "Search",
        switchLocale: "<img src='flags/britain.png'>",
        refreshData: "Refresh data",
        creditsSpan: "WTLineup made by Solawk",
        nation: "Nation",
        cl: "Class",
        br: "BR",
        name: "Name",
    };

const ru =
    {
        lineupSpan: "Сетап",
        searchSpan: "Поиск",
        switchLocale: "<img src='flags/russia.png'>",
        refreshData: "Обновить данные",
        creditsSpan: "WTLineup за авторством Solawk",
        nation: "Нация",
        cl: "Класс",
        br: "БР",
        name: "Название",
    };

let locale = localStorage.getItem("locale") ? localStorage.getItem("locale") : "en";