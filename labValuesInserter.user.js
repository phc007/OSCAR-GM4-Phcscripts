 // ==UserScript==
// @name           Lab Values Inserter
// @author         Various community contributors
// @description    Only fetches historical lab values (eGFR, A1C, etc.) if current value is abnormal. Adds tooltip with full history.
// @include        */lab/CA/ALL/labDisplay.jsp*
// @version        6.2
// @updateURL 	    https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/labValuesInserter.user.js
// @downloadURL	   https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/labValuesInserter.user.js
// @namespace      Phcscript
// @grant          none
// ==/UserScript==

window.addEventListener("load", function () {
    const start = Date.now();
    console.log("starting timer...");
    const demoNo = getDemoNo();
    if (!demoNo) {
        console.error("Demographic number not found!");
        return;
    }

    const labConfigs = [
        {
            name: "eGFR",
            LOINC: "33914-3",
            testName: "Estimated GFR",
            values: [],
            dates: [],
            normalRange: { min: 60, max: 999 },
        },
        {
            name: "A1C",
            LOINC: "4548-4",
            testName: "Hemoglobin A1c",
            values: [],
            dates: [],
            normalRange: { min: 4, max: 5.9 },
        },
        {
            name: "K",
            LOINC: "2823-3",
            testName: "Potassium",
            values: [],
            dates: [],
            normalRange: { min: 3.5, max: 5 },
        },
        {
            name: "CRP",
            LOINC: "1988-5",
            testName: "C Reactive Protein",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 7.5 },
        },
        {
            name: "Hb",
            LOINC: "718-7",
            testName: "Hemoglobin",
            values: [],
            dates: [],
            normalRange: { min: 135, max: 180 },
        },
        {
            name: "AST",
            LOINC: "1920-8",
            testName: "Aspartate Aminotransferase",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 36 },
        },
        {
            name: "ALT",
            LOINC: "1742-6",
            testName: "Alanine Aminotransferase",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 50 },
        },
        {
            name: "LDL",
            LOINC: "39469-2",
            testName: "LDL Cholesterol",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 0 },
        },
        {
            name: "ACR",
            LOINC: "9318-7",
            testName: "Urine ACR (Albumin/Creatinine Ratio)",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 2 },
        },
        {
            name: "PSA",
            LOINC: "2857-1",
            testName: "Prostate Specific Ag",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 0 },
        },
        {
            name: "CEA",
            LOINC: "2039-6",
            testName: "Carcinoembryonic Ag",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 0 },
        },
        {
            name: "Ferritin",
            LOINC: "2276-4",
            testName: "Ferritin",
            values: [],
            dates: [],
            normalRange: { min: 45, max: 200 },
        },
        {
            name: "TSH",
            LOINC: "3016-3",
            testName: "TSH",
            values: [],
            dates: [],
            normalRange: { min: 0.3, max: 5.5 },
        },
        {
            name: "TG",
            LOINC: "14927-8",
            testName: "Triglycerides",
            values: [],
            dates: [],
            normalRange: { min: 0, max: 2.3 },
        },
    ];

    const abnormalLabs = [];

    // First pass: check for abnormalities in current values
    const rows = document.querySelectorAll("tr.NormalRes, tr.AbnormalRes, tr.HiLoRes");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, i) => {
            const anchors = cell.querySelectorAll("a");
            anchors.forEach(a => {
                const testName = a.textContent.trim();
                //const lab = labConfigs.find(l => testName.includes(l.testName));
                const lab = labConfigs.find(l => testName === l.testName);
                if (lab && i + 1 < cells.length) {
                    const resultText = cells[i + 1].textContent.trim();
                    const valueMatch = resultText.match(/-?\d+(?:\.\d+)?/); // extract the number portion of <10 or >60
                    const value = valueMatch ? parseFloat(valueMatch[0]) : NaN;
                    if (!isNaN(value) && (value < lab.normalRange.min || value > lab.normalRange.max)) {
                        if (!abnormalLabs.includes(lab)) {
                            //var code = a.getAttribute('title').split(': ')[1];
                            //lab.identifier = code;
                            //console.log(code);
                            abnormalLabs.push(lab);
                        }
                    }
                }
            });
        });
    });

    // Fetch and insert only for abnormal labs
fetchLabsSequentially().then(() => {
    console.log("All labs fetched and inserted!");
});
 
async function fetchLabsSequentially() {
    for (let i = 0; i < abnormalLabs.length; i++) {
        const lab = abnormalLabs[i];

        // Fetch values for this lab
        await fetchLabValues(lab, demoNo);

        // Insert values immediately after fetching
        insertLabValues(lab);
        const ms = Date.now() - start;
        console.log(`Inserted values for ${lab.name} at ${Math.floor(ms / 1000)} sec`);
    }

}


async function fetchLabValues(lab, demoNo) {
    const pathArray = window.location.pathname.split("/");
    const newURL = `${window.location.protocol}//${window.location.host}/${pathArray[1]}/lab/CA/ON/labValues.jsp?testName=${encodeURIComponent(
        lab.testName
    )}&demo=${demoNo}&labType=HL7&identifier=${lab.LOINC}`;

    console.log(`Fetching ${lab.name} values from URL:`, newURL);

    try {
        const response = await fetch(newURL);

        if (!response.ok) {
            console.warn(
                `Failed to fetch lab: ${lab.name} — status: ${response.status}`
            );
            return;
        }

        const responseText = await response.text();

        // Convert returned HTML into a DOM document
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, "text/html");

        // Select all result rows
        const rows = doc.querySelectorAll(
            "tr.NormalRes, tr.AbnormalRes, tr.LoRes, tr.HiLoRes"
        );

        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 6) return;

            const name = cells[0].textContent.trim();
            if (name !== lab.testName) return;

            const value = cells[1].textContent.trim();
            const dateTime = cells[5].textContent.trim();

            // Extract only the YYYY-MM-DD part
            const dateMatch = dateTime.match(/^(\d{4}-\d{2}-\d{2})/);
            if (!dateMatch) return;

            if (lab.values.length < 10) {
                lab.values.push(value);
                lab.dates.push(dateMatch[1]);
            }
        });
    } catch (error) {
        console.error(`Error fetching lab: ${lab.name}`, error);
    }
}
function insertLabValues(lab) {
    const rows = document.querySelectorAll("tr.NormalRes, tr.AbnormalRes, tr.HiLoRes");

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, cellIndex) => {
            const anchors = cell.querySelectorAll("a");
            anchors.forEach((a) => {
                const anchorText = a.textContent.replace(/\s+/g, " ").trim();

                //if (anchorText.includes(lab.testName)) {
                  if (anchorText === lab.testName) {
                    const resultCell = cells[cellIndex + 1];
                    if (resultCell) {
                        const resultText = cells[i + 1].textContent.trim();
                        const valueMatch = resultText.match(/-?\d+(?:\.\d+)?/); // extract the number portion of <10 or >60
                        const recentResult = valueMatch ? parseFloat(valueMatch[0]) : NaN;                        
                        if (!isNaN(recentResult) &&
                            (recentResult < lab.normalRange.min || recentResult > lab.normalRange.max)) {
                            const span = document.createElement("span");
                            span.style.marginLeft = "10px";
                            span.style.color = "#000080";
                            span.textContent = ` (${lab.values.slice(1, 3).join(" / ")})`;

                            const tooltip = document.createElement("div");
                            tooltip.className = "custom-tooltip";
                            tooltip.innerHTML = lab.values.map((val, i) =>
                               `<div><strong>${val}</strong> <strong style="color:#36454F;">(${lab.dates[i]})</strong></div>`
                            ).join("");
                            tooltip.style.position = "absolute";
                            tooltip.style.background = "#fefefe";
                            tooltip.style.border = "1px solid #ccc";
                            tooltip.style.padding = "6px 8px";
                            tooltip.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.2)";
                            tooltip.style.borderRadius = "4px";
                            tooltip.style.whiteSpace = "nowrap";
                            tooltip.style.zIndex = "1000";
                            tooltip.style.display = "none";
                            tooltip.style.fontSize = "12px";

                            document.body.appendChild(tooltip);

                            span.addEventListener("mouseover", (e) => {
                                tooltip.style.left = (e.pageX + 10) + "px";
                                tooltip.style.top = (e.pageY + 10) + "px";
                                tooltip.style.display = "block";
                            });

                            span.addEventListener("mousemove", (e) => {
                                tooltip.style.left = (e.pageX + 10) + "px";
                                tooltip.style.top = (e.pageY + 10) + "px";
                            });

                            span.addEventListener("mouseout", () => {
                                tooltip.style.display = "none";
                            });

                            resultCell.appendChild(span);
                        }
                    }
                }
            });
        });
    });
}


    function getDemoNo() {
        const regexes = [
            /demographic_no=(\d*)[&$]/g,
            /demographicNo=(\d*)[&$]/g,
            /demo=(\d*)[&$]/g,
            /demographicNo=(\d+)/,
        ];
        for (const regex of regexes) {
            const match = regex.exec(document.URL) || regex.exec(document.body.innerHTML);
            if (match) return match[1];
        }
        return null;
    }
});
