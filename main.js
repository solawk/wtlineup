// Vehicles

function getData()
{
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === 4)
        {
            vehicles = JSON.parse(this.responseText);
            localStorage.setItem("vehicles", this.responseText);
            showCenter();
            if (localStorage.getItem("lineup")) selectLineup(localStorage.getItem("lineup"), true);
            console.log("Refreshed successfully");
        }
        else
        {
            console.log(this.status);
        }
    });

    xhr.open("GET", "https://script.google.com/macros/s/AKfycbzUwt3pDEbua0xJ67-J90GSYaiZjLkQlLtnuaHLTtgFYUMOD3UZ3LtC-r3M9XMpadmAjQ/exec?what=vehicles");

    xhr.send(null);
}

// Contains an array of all vehicles in the database
let vehicles = localStorage.getItem("vehicles");
if (vehicles == null)
{
    console.log("Fetching from database");
    getData();
}
else
{
    console.log("Fetched from local storage");
    vehicles = JSON.parse(vehicles);
    showCenter();
    if (localStorage.getItem("lineup")) selectLineup(localStorage.getItem("lineup"), true);
}

function showCenter()
{
    el("loadingDiv").style.display = "none";
    el("centerDiv").style.display = "inline";
}

function refreshData()
{
    getData();
}

function getAllVehiclesInLineup(lineup, type)
{
    const vehiclesBlue = []; // Axis or NATO
    const vehiclesRed = []; // Allies or USSR+PLA

    const blueName = type === "bottom" ? "axis" : "nato";

    for (const v of vehicles)
    {
        const lineups = v.lineups.split(" ");
        if (!lineups.includes(lineup)) continue;

        const teams = v.team.split(" ");
        if (teams.includes(blueName)) vehiclesBlue.push(v);
        else vehiclesRed.push(v);
    }

    return { blue: vehiclesBlue, red: vehiclesRed };
}

// Reports

let reports = [];

function getReports()
{
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === 4)
        {
            reports = JSON.parse(this.responseText);
        }
        else
        {
            console.log(this.status);
        }
    });

    xhr.open("GET", "https://script.google.com/macros/s/AKfycbzUwt3pDEbua0xJ67-J90GSYaiZjLkQlLtnuaHLTtgFYUMOD3UZ3LtC-r3M9XMpadmAjQ/exec?what=reports");

    xhr.send(null);
}

function post()
{
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === 4)
        {
            console.log(this.responseText);
        }
        else
        {
            console.log(this.status);
        }
    });

    xhr.open("POST", "https://script.google.com/macros/s/AKfycbzq-ElAFHCDzk6dVqomddksLWLcNHbvBi2K5_4JZeh8OrejAt-isCrhleXiJYQA3A4Vnw/exec");

    const body =
        {
            type: "add",
            enName: "VFW",
            ruName: "",
            cl: "spg",
            br: "20.0",
            lineups: "4_1 5_1",
            nation: "germany",
            info: ""
        };

    xhr.send(new Blob([JSON.stringify(body)]));
}