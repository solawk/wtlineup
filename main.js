const allGroundLineups = [ "1_1", "2_1", "3_1", "4_1", "5_1", "6_1", "8_2", "8_2_2", "9_2", "10_2", "11_2" ];

// EC - aviaBrackets

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
            localStorage.setItem("lastUpdate", Date.now().toString());
            showCenter();
            if (!prepareForFirstDisplay())
            {
                if (localStorage.getItem("lineup"))
                {
                    selectLineup(localStorage.getItem("lineup"), true);
                }
                else
                {
                    selectLineup("1_1", true);
                }
            }

            el("refreshButton").disabled = false;
            el("refreshIcon").style.filter = "";
            console.log("Refreshed successfully");
        }
        else
        {
            console.log(this.status);
        }
    });

    xhr.open("GET", "https://script.google.com/macros/s/AKfycbzq-ElAFHCDzk6dVqomddksLWLcNHbvBi2K5_4JZeh8OrejAt-isCrhleXiJYQA3A4Vnw/exec");

    xhr.send(null);
}

// Contains an array of all vehicles in the database
let vehicles;
let lastUpdate;

if (typeof exports === 'undefined')
{
    vehicles = localStorage.getItem("vehicles");
    lastUpdate = localStorage.getItem("lastUpdate");

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
        if (!prepareForFirstDisplay())
        {
            if (localStorage.getItem("lineup"))
            {
                const storedLineup = localStorage.getItem("lineup");
                if (storedLineup.includes("-"))
                {
                    setMode("ec", true);
                }
                else
                {
                    setMode("ground", true);
                }

                selectLineup(storedLineup, true);
            }
            else
            {
                setMode("ground", true);
                selectLineup("1_1", true);
            }
        }


        if (lastUpdate == null)
        {
            localStorage.setItem("lastUpdate", Date.now().toString());
            refreshData();
        }
        else if (Date.now() - parseInt(lastUpdate) > 1000 * 60 * 60 * 12)
        {
            refreshData();
        }
    }
}

function prepareForFirstDisplay()
{
    const selection = new URLSearchParams(window.location.search).get("select");
    if (selection != null)
    {
        if (allGroundLineups.includes(selection.toString()))
        {
            setMode("ground", true);
            selectLineup(selection, true);
            return true;
        }
        else if (selection.includes("-"))
        {
            setMode("ec", true);
            selectLineup(selection, true);
            return true;
        }
    }

    return false;
}

function showCenter()
{
    el("loadingDiv").style.display = "none";
    el("centerDiv").style.display = "inline";
}

function refreshData()
{
    el("refreshButton").disabled = true;
    el("refreshIcon").style.filter = "blur(5px)";
    getData();
}

function getAllLineupsOfBottomAircraft(v)
{
    const isAircraft = v.cl === "fighter" || v.cl === "attacker" || v.cl === "bomber";
    if (!isAircraft || v.br === "") return null; // Return null if the vehicle isn't a bottom lineup aircraft
    if (v.enName === "Sakeen") return []; // Богоизбранный самолёт богоизбранной нации

    const lineups = [];
    const brRanges =
        {
            '1_1': [ 1.0, 2.0 ],
            '2_1': [ 1.7, 2.7 ],
            '3_1': [ 2.3, 3.3 ],
            '4_1': [ 3.0, 4.0 ],
            '5_1': [ 4.0, 5.0 ],
            '6_1': [ 5.0, 6.3 ],
        };

    for (const lineup in brRanges)
    {
        const isWithinRange = parseFloat(v.br) > brRanges[lineup][0] - 0.1 && parseFloat(v.br) < brRanges[lineup][1] + 0.1;
        if (isWithinRange) lineups.push(lineup);
    }

    return lineups;
}

function getGuaranteedLineups(v)
{
    const bottomAircraftLineups = getAllLineupsOfBottomAircraft(v);
    let lineups = [];
    if (bottomAircraftLineups != null) lineups = lineups.concat(bottomAircraftLineups);
    if (v.lineups !== "") lineups = lineups.concat(v.lineups.split(" "));

    return lineups;
}

function getTeams(nation, type)
{
    switch (nation)
    {
        case "ussr":        return type === "bottom" ? "red" : "red";
        case "germany":     return type === "bottom" ? "blue" : "blue";
        case "usa":         return type === "bottom" ? "red" : "blue";
        case "britain":     return type === "bottom" ? "red" : "blue";
        case "france":      return type === "bottom" ? "red" : "blue";
        case "italy":       return type === "bottom" ? "blue" : "blue";
        case "japan":       return type === "bottom" ? "blue" : "blue";
        case "china":       return type === "bottom" ? "red" : "red";
        case "sweden":      return type === "bottom" ? "red" : "blue";
        case "israel":      return type === "bottom" ? "red" : "blue";
        default:            return "blue";
    }
}

function getAllVehiclesInLineup(lineup, type)
{
    const vehiclesBlue = []; // Axis or NATO
    const vehiclesRed = []; // Allies or USSR+PLA

    const blueName = type === "bottom" ? "axis" : "nato";

    for (const v of vehicles)
    {
        const lineups = getGuaranteedLineups(v);
        if (!lineups.includes(lineup)) continue;

        if (getTeams(v.nation, type) === "blue") vehiclesBlue.push(v);
        else vehiclesRed.push(v);

        /*const teams = v.team.split(" ");
        if (teams.includes(blueName)) vehiclesBlue.push(v);
        else vehiclesRed.push(v);*/
    }

    return { blue: vehiclesBlue, red: vehiclesRed };
}

function getAllVehiclesInEC(start, end)
{
    const result = [];

    for (const v of vehicles)
    {
        if (v.cl !== "fighter" && v.cl !== "attacker" && v.cl !== "bomber") continue;
        if (v.br < start || v.br > end) continue;

        result.push(v);
    }

    return result;
}

// Reports

function post(body)
{
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === 4)
        {
            console.log(this.responseText);
            alert("OK");
        }
        else
        {
            console.log(this.status);
        }
    });

    xhr.open("POST", "https://script.google.com/macros/s/AKfycbzq-ElAFHCDzk6dVqomddksLWLcNHbvBi2K5_4JZeh8OrejAt-isCrhleXiJYQA3A4Vnw/exec");

    xhr.send(new Blob([JSON.stringify(body)]));
}

// Bot integration

(function(exports)
{
    exports.getGuaranteedLineups = getGuaranteedLineups
})(typeof exports === 'undefined' ? this['main'] = {} : exports);
