// ==UserScript==
// @name     Ticklers AV PHC
// @author   Peter Hutten-Czapski 2025
// @version  2.1
// @grant    none
// @namespace Phcscript
// @description Native date, sensible presets, and the ability to take a passed tickler message from lab macro
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.user.js
// @include *tickler*
// ==/UserScript==

function DateAdd(startDate, numDays, numMonths, numYears) {
        var returnDate = new Date(startDate.getTime());
        var yearsToAdd = numYears;
        var month = returnDate.getMonth() + numMonths;
        if (month > 11) {
                yearsToAdd = Math.floor((month + 1) / 12);
                month -= 12 * yearsToAdd;
                yearsToAdd += numYears;
        }
        returnDate.setMonth(month);
        returnDate.setFullYear(returnDate.getFullYear() + yearsToAdd);
        returnDate.setTime(returnDate.getTime() + 60000 * 60 * 24 * numDays);
        return returnDate;
}

function addMonth2(no) {
        var gCurrentDate = new Date();
        var newDate = DateAdd(gCurrentDate, 0, no, 0);
        var newYear = newDate.getFullYear()
        var newMonth = newDate.getMonth() + 1;
        if (newMonth < 10) {
                newMonth = "0" + newMonth
        }
        var newDay = newDate.getDate();
        if (newDay < 10) {
                newDay = "0" + newDay;
        }
        return newYear + "-" + newMonth + "-" + newDay;
        const dateInput = document.querySelector('input[name="xml_appointment_date"]');
}
console.log("this window is included in the Tickler selection");

function waitForDocumentComplete({ timeout = 5000 } = {}) {
  return new Promise(resolve => {
    // Already complete → run immediately
    if (document.readyState === 'complete') {
      resolve({ reason: 'ready' });
      return;
    }

    let settled = false;

    const done = (reason) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      window.removeEventListener('load', onLoad);
      resolve({ reason });
    };

    const onLoad = () => done('load');

    // Normal path
    window.addEventListener('load', onLoad, { once: true });

    // Fallback timeout
    const timer = setTimeout(() => done('timeout'), timeout);
  });
}

waitForDocumentComplete({ timeout: 7000 }).then(({ reason }) => {
  console.log('Running after:', reason);
  configureTickler();
});

function configureTickler() {
        const elements = document.getElementsByName("xml_appointment_date");
        const oldVal = elements[0].value;
        if (oldVal.length > 10) {elements[0].value = oldVal.substring(0,10);}
        elements[0].type = "date";
        const parentDiv = document.getElementById('serviceDateWrapper');
        const newDiv = document.createElement('div');
        const newHtml = `<div style="flex: 1 1 100%; display: flex; justify-content: flex-end; align-items: center;">
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(2) + `"'>2m</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(6) + `"'>6m</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(12) + `"'>1y</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(24) + `"'>2y</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(36) + `"'>3y</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(60) + `"'>5y</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                                <a href="#" onclick='const elements = document.getElementsByName("xml_appointment_date"); elements[0].value="` + addMonth2(120) + `"'>10y</a>
                                <span>&nbsp; &nbsp; &nbsp;</span>
                            </div>
                            <div class="error-message my-2" id="errorServiceDate"></div>`;
        newDiv.innerHTML = newHtml;
        if (parentDiv){
          const oldFirstChildDiv = parentDiv.children[2];
          if (oldFirstChildDiv) { // Check if there is a first child to replace
                  parentDiv.replaceChild(newDiv, oldFirstChildDiv);
          } else {
                  parentDiv.appendChild(newDiv); // If no first child, just append the new one
          }
        } else {
          // for ticklerEdit.jsp
          elements[0].removeAttribute("readonly");
          const oldDiv = elements[0].nextElementSibling;
          elements[0].style.width = '250px';
          elements[0].style.height = '32px';
          oldDiv.replaceWith(newDiv);
        }

        var url = new URL(window.location.href);
        var params = url.searchParams;
        console.log(params);
        if (params.get("tickler")) {
                console.log("Ready to insert " + params.get("tickler"));
                const textarea = document.querySelector(`textarea[name="textarea"]`);
                if (textarea) {
                        textarea.value = params.get("tickler");
                } else {
                        console.warn(`textarea not found.`);
                }
        }

};
