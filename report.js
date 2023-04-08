function switchReportWindow(isOn)
{
    el("reportDiv").style.display = isOn ? "block" : "none";
}

function sendReport()
{
    const body = {};

    const report_typeButton = document.querySelector("input[name='report_type']:checked");
    if (report_typeButton) body.type = report_typeButton.value;
    else
    {
        alert("No report type selected");
        return;
    }

    const report_enNameInput = el("report_enName");
    body.enName = report_enNameInput.value.trim();

    const report_ruNameInput = el("report_ruName");
    body.ruName = report_ruNameInput.value.trim();

    const report_clButton = document.querySelector("input[name='report_cl']:checked");
    body.cl = report_clButton.value;

    const report_brInput = el("report_br");
    body.br = report_brInput.value.trim();

    const report_lineupsInput = el("report_lineups");
    body.lineups = report_lineupsInput.value.trim();

    const report_nationButton = document.querySelector("input[name='report_nation']:checked");
    body.nation = report_nationButton.value;

    const report_teamButton = document.querySelector("input[name='report_team']:checked");
    body.team = report_teamButton.value;

    const report_infoInput = el("report_info");
    body.info = report_infoInput.value;

    console.log(body);

    post(body);
}