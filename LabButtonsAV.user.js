// ==UserScript==
// @name     Lab Display Buttons PHC
// @author   Peter Hutten-Czapski
// @license  GNU General Public License v3
// @version  3.6
// @description Macro buttons for AV for rapid entry of common lab comments, and opening related ticklers and billing
// @namespace Phcscript
// @grant     none
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/LabButtonsAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/LabButtonsAV.user.js
// @include https://app.avaros.ca/av/*inbox*
// @require https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/waitForKeyElements2.js
// ==/UserScript==

var demographicNo = "";
var providerNo = "";
var segmentID = "";
console.log("referrer:"+document.referrer);
console.log("parent parent location:"+window.parent.window.parent.location);
console.log("parent location:"+window.parent.location);
console.log("parent top location:"+window.top.location);
function ButtonFunction(str) {
  console.log('[ButtonFunction] Started with value:', str);

  const firstTextarea = document.querySelector('textarea');
  if (!firstTextarea) {
    console.log('[ButtonFunction] No initial textarea found');
    return;
  }

  firstTextarea.id = 'myId';
  console.log('[ButtonFunction] Assigned temp id');

  // Click the dialog trigger
  const acknowledgeSpan = [...document.querySelectorAll('span')]
    .find(span => span.textContent.includes('Acknowledge'));

  if (!acknowledgeSpan) {
    console.log('[ButtonFunction] Acknowledge span not found');
    return;
  }

  acknowledgeSpan.click();
  console.log('[ButtonFunction] Clicked Acknowledge');

  const observer = new MutationObserver(() => {
    const targetTextarea = document.querySelector('textarea:not(#myId)');
    if (!targetTextarea) return;

    observer.disconnect();
    console.log('[ButtonFunction] Target textarea found');

    // ✅ Use React-safe native setter
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set;

    targetTextarea.focus();
    nativeSetter.call(targetTextarea, str);

    console.log('[ButtonFunction] Native value setter called with:', str);

    // 🔥 Critical: input event updates React state
    targetTextarea.dispatchEvent(
      new Event('input', { bubbles: true })
    );

    console.log('[ButtonFunction] Input event dispatched');

    // Optional but sometimes required
    targetTextarea.dispatchEvent(
      new Event('change', { bubbles: true })
    );

    console.log('[ButtonFunction] Change event dispatched');

    const finalButton = document.querySelector('#acknowledge-trigger');
    if (finalButton) {
      finalButton.click();
      console.log('[ButtonFunction] Final button clicked');
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('[ButtonFunction] Waiting for dialog textarea...');
}

//https://app.avaros.ca/oscar/oscarPrevention/index.jsp?demographic_no=4714
function openPrevention(prev){
  var preventionURL = 'https://app.avaros.ca/oscar/oscarPrevention/index.jsp?demographic_no=';
  preventionURL += demographicNo;
  preventionURL += '&prevention='+prev // pass parameter for prevention greasemonkey
	var newWindow = window.open(preventionURL, '_blank', 'width=600,height=400');
	if (newWindow) { // Check if the window was successfully opened
	} else {
		alert('Popup blocked! Please allow popups for this site.');
	}
}

//https://app.avaros.ca/oscar/tickler/ForwardDemographicTickler.do?docType=HL7&docId=989236&demographic_no=802
function openTickler(tickler, adate){
  var ticklerURL = 'https://app.avaros.ca/oscar/tickler/ForwardDemographicTickler.do?xml_appointment_date='+adate+'&demographic_no=' + demographicNo;
  ticklerURL += '&name=' + demographicNo;
  if (segmentID) { ticklerURL += '&docType=HL7&docId=' + segmentID; }
  ticklerURL += '&chart_no=&bFirstDisp=false&updateParent=false&messageID=null&doctor_no=' + providerNo;
  ticklerURL += '&tickler=' + tickler // pass parameter for tickler greasemonkey
	var newWindow = window.open(ticklerURL, '_blank', 'width=600,height=800');
	if (newWindow) { // Check if the window was successfully opened
	} else {
		alert('Popup blocked! Please allow popups for this site.');
	}
}

//https://app.avaros.ca/oscar/tickler/ticklerDemoMain.jsp?demoview=802
function getTicklers(demoNumber) {
    var pathArray = window.location.href;
    var newURL = "https://app.avaros.ca/oscar/tickler/ticklerDemoMain.jsp?demoview=" + demoNumber;
    fetch(newURL)
        .then(function (response) {
            if (!response.ok) {
                console.error("[getTicklers] Failed to fetch ticklers:", response.status);
                return null;
            }
            return response.text();
        })
        .then(function (str) {
            if (!str) return;
            var regex = /Active<\/TD>[\n\t]*<TD ROWSPAN="1" class="[\w]*Red">[\s\w]*<div[\s\w"=-]*>\s*([\s\w]*\w)\s*</gmi;
            var array;
            var ticklers = [];
            var i = 0;
            var outputEl = document.getElementById("alert");
            if (!outputEl) {
                console.error("[getTicklers] Element with ID 'alert' not found.");
                return;
            }
            while ((array = regex.exec(str)) !== null) {
                ticklers[i] = array[1];
                if (i > 0) {
                    outputEl.textContent += ", ";
                }
                outputEl.textContent += ticklers[i];
                i++;
            }
            if (ticklers.length > 0) {
                outputEl.style.color = "red";
            } else {
                outputEl.style.color = "black";
            }
            outputEl.textContent += " ";
            var a = document.createElement('a');
            a.href = newURL;
            a.title = "Click link to open tickler list";
            a.target = '_blank';
            a.innerHTML = ticklers.length + " ticklers";
            outputEl.append(a);
            console.log("[getTicklers] Found " + ticklers.length + " ticklers");
        })
        .catch(function (error) {
            console.error("[getTicklers] Fetch error:", error);
        });
}

//https://app.avaros.ca/av/billing2/invoice/2808?billRegion=ON&appointment_no=0&demographic_name=&demographic_no=2808&providerview=1001&user_no=1001&apptProvider_no=none&start_time=00%3A00%3A00&xml_provider=1001
function postBilling(bcode){
  var billingURL = "https://app.avaros.ca/av/billing2/invoice/";
  billingURL += demographicNo;
  billingURL += '?billRegion=ON&appointment_no=0&demographic_name=&demographic_no='+demographicNo;
  billingURL += '&user_no='+providerNo;
  billingURL += '&apptProvider_no=none&start_time=00%3A00%3A00&xml_provider='+providerNo;
  billingURL += "&bill="+bcode; //add a parameter for the billing greasemonkey
	var newWindow = window.open(billingURL, '_blank', 'width=1450,height=450');
	if (newWindow) { // Check if the window was successfully opened
	} else {
		alert('Popup blocked! Please allow popups for this site.');
	}
}

// build a menu of buttons
const menuContainer = document.createElement('div');
menuContainer.id = 'myGreasemonkeyButtons';
menuContainer.setAttribute("style", "font-size:12px; position:fixed;top:8px;left:1120px;");

var input1=document.createElement("input");
input1.type="button";
input1.value="Normal";
input1.addEventListener("click", function() {ButtonFunction("Normal");});
input1.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input1.setAttribute("title", "Normal");
menuContainer.appendChild(input1);

var input2=document.createElement("input");
input2.type="button";
input2.value="Stable";
input2.addEventListener("click", function() {ButtonFunction("Stable");});
input2.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input2.setAttribute("title", "Stable");
menuContainer.appendChild(input2);

var input3=document.createElement("input");
input3.type="button";
input3.value="Improving";
input3.addEventListener("click", function() {ButtonFunction("Abnormal but improving");});
input3.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input3.setAttribute("title", "Improving");
menuContainer.appendChild(input3);

var input4=document.createElement("input");
input4.type="button";
input4.value="Partial";
input4.addEventListener("click", function() {ButtonFunction("Incomplete result");});
input4.setAttribute("style", "font-size:12px ;padding: 2px; margin-right: 3px;");
input4.setAttribute("title", "Incomplete");
menuContainer.appendChild(input4);

var input5=document.createElement("input");
input5.type="button";
input5.value="Rx";
input5.addEventListener("click", function() {ButtonFunction("Rx reviewed and request granted");});
input5.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input5.setAttribute("title", "Rx request approved");
menuContainer.appendChild(input5);

var input6=document.createElement("input");
input6.type="button";
input6.value="ER";
input6.id="er";
input6.addEventListener("click", function() {ButtonFunction("Hospital Emergency Patient");});
input6.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input6.setAttribute("title", "ER patient");
menuContainer.appendChild(input6);

var input7=document.createElement("input");
input7.type="button";
input7.value="H";
input7.id="h";
input7.addEventListener("click", function() {ButtonFunction("Hospital patient");});
input7.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input7.setAttribute("title", "Hospital patient");
menuContainer.appendChild(input7);

var input8=document.createElement("input");
input8.type="button";
input8.value="Consultant";
input8.addEventListener("click", function() {ButtonFunction("Consultant ordered and followed");});
input8.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input8.setAttribute("title", "Specialist managed patient");
menuContainer.appendChild(input8);

var input9=document.createElement("input");
input9.type="button";
input9.value="PAP";
input9.id="pap";
input9.addEventListener("click", function() {
  // important billing has to be last in the list to to ensure its the top window.
  openPrevention('HPV Screen');
  openTickler('Pap',getFutureDate(5));
  postBilling("Q011A"); //The pap Qcode may not be necessary as the lab's billing will notify the ministry
});
input9.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input9.setAttribute("title", "HPV Screen Prevention");
input9.setAttribute("disabled", "");
input9.classList.add('demodependent');
menuContainer.appendChild(input9);

var input10=document.createElement("input");
input10.type="button";
input10.value="PSA";
input10.id="psa";
input10.addEventListener("click", function() {
  openPrevention('PSA');
  openTickler('PSA in 2yr',getFutureDate(2)); //2-4 yr if PSA low and low risk
});
input10.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input10.setAttribute("title", "Prostatic Specific Antigen");
input10.setAttribute("disabled", "");
input10.classList.add('demodependent');
menuContainer.appendChild(input10);

var input11=document.createElement("input");
input11.type="button";
input11.value="FIT";
input11.id="fit";
input11.addEventListener("click", function() {
  openPrevention('FIT');
  openTickler('FIT repeat in 2yr',getFutureDate(2));
  postBilling("Q152A"); //Colorectal Cancer Screening Test Completion Fee
});
input11.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input11.setAttribute("title", "Fecal Immunochemical Test");
input11.setAttribute("disabled", "");
input11.classList.add('demodependent');
menuContainer.appendChild(input11);

// the following will be from HRM, no real point unless a demo can be found

var input12=document.createElement("input");
input12.type="button";
input12.value="Colon";
input12.id="colonoscopy";
input12.addEventListener("click", function() {
  if (demographicNo) {
  	openPrevention('COLONOSCOPY');
	openTickler('Colonoscopy repeat in 3yr',getFutureDate(3)); // 3, 5, or 10yr PHC fix
    postBilling("Q142A"); //Colorectal Cancer Screening Test Exclusion code
  } else {
    console.warn('COLONOSCOPY but no demo');
  }
});
input12.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input12.setAttribute("title", "Colonoscopy Prevention");
input12.setAttribute("disabled", "");
input12.classList.add('providerdependent'); //for billing
menuContainer.appendChild(input12);

var input13=document.createElement("input");
input13.type="button";
input13.value="Mammo";
input13.id="mammo";
input13.addEventListener("click", function() {
  if (demographicNo) {
  	openPrevention('MAM');
    openTickler('Mammo repeat in 2yr',getFutureDate(2));
    postBilling("Q131A"); //?necessary the tracking code
  } else {
    console.warn('MAM but no demo');
  }
});
input13.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input13.setAttribute("title", "Mammography Prevention");
input13.setAttribute("disabled", "");
input13.classList.add('providerdependent'); //for billing
input13.classList.add('demodependent'); //for prevention billing and tickler
menuContainer.appendChild(input13);



var span1=document.createElement("span");
span1.id="alert";
span1.classList.add('alert');
span1.setAttribute("style", "color: red;");
menuContainer.appendChild(span1);

var span2=document.createElement("span");
span2.id="warn";
span2.classList.add('alert');
span2.setAttribute("style", "color: aquamarine;");
menuContainer.appendChild(span2);

// Insert the menu on the page
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
  console.log('[waitForDocumentComplete] Running after:', reason);
  document.body.appendChild(menuContainer);
});

// utility to set a date string so many years in the future
function getFutureDate(delta){
  const today = new Date();
  today.setFullYear(today.getFullYear() + delta);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const futureDateString = `${year}-${month}-${day}`;
  return futureDateString;
}

waitForKeyElements("body", accessIframe, false,'iframe[title="Preview"]');

function accessIframe(node) {
  setTimeout(function () {
    const iframe = document.querySelector('iframe[title="Preview"]');
    if (!iframe || !iframe.contentWindow) return;

    const currentIframeUrl = iframe.contentWindow.location.href;
    console.log("accessing iframe " + currentIframeUrl);

    const url = new URL(currentIframeUrl);
    const params = url.searchParams;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const iframeHeadContent = iframeDoc.head ? iframeDoc.head.innerHTML : "";

    // Reset button background colors
      document.getElementById("mammo").style.backgroundColor = "";
      document.getElementById("colonoscopy").style.backgroundColor = "";
      document.getElementById("pap").style.backgroundColor = "";
      document.getElementById("psa").style.backgroundColor = "";
      document.getElementById("fit").style.backgroundColor = "";
      document.getElementById("er").style.backgroundColor = "";
      document.getElementById("h").style.backgroundColor = "";

    // Clear alert text
    const alertEl = document.getElementById("alert");
    if (alertEl) alertEl.textContent = "";

    // Clear warning text
    const alertElw = document.getElementById("warn");
    if (alertElw) alertElw.textContent = "";

    console.log(
      "[accessIframe] segmentID:" + params.get("segmentID") +
      "  docId:" + params.get("docId") +
      "  demographicNo:" + getNoFromString(iframeHeadContent, "demographicNo") +
      "  providerNo:" + getNoFromString(iframeHeadContent, "providerNo")
    );

    segmentID = params.get("segmentID");
    demographicNo =
      getNoFromString(iframeHeadContent, "demographicNo") ||
      getNoFromString(iframeHeadContent, "demographicID");

    providerNo = getNoFromString(iframeHeadContent, "providerNo");



    // Enable / disable provider dependent elements
    document.querySelectorAll(".providerdependent").forEach(el => {
      el.disabled = providerNo === "";
    });

    if (providerNo === "") console.log("[accessIframe] No provider here");

    // Add links to show / hide raw HL7
    const iframeBody = iframeDoc.body;
    const rawHl7El = iframeDoc.querySelector("[id^='rawhl7']");
    const theId = rawHl7El ? rawHl7El.id : null;
    const showrawEl = iframeDoc.querySelector("#showraw");
    const linkthere = showrawEl ? showrawEl.id : null;

    if (theId && iframeBody && !linkthere) {
      iframeBody.insertAdjacentHTML(
        "beforeend",
        `<a id="showraw" onclick="document.getElementById('${theId}').style.display='block'">Show HL7</a>
         &nbsp;|&nbsp;
         <a id="hideraw" onclick="document.getElementById('${theId}').style.display='none'">Hide HL7</a>`
      );
    }

    // Scan raw HL7 content
    if (rawHl7El) {
      const elementText = rawHl7El.textContent || "";

      if (
        elementText.includes("Human Papilloma Virus")
      ) {
        const pap = document.getElementById("pap");
        if (pap) pap.style.backgroundColor = "aquamarine";
      }

      if (elementText.includes("Prostate Specific Antigen Monitoring")) {
        const psa = document.getElementById("psa");
        if (psa) psa.style.backgroundColor = "aquamarine";
      }

      if (elementText.includes("FECAL IMMUNOCHEMICAL TEST")) {
        const fit = document.getElementById("fit");
        if (fit) fit.style.backgroundColor = "aquamarine";
      }
    }

    // Detect nested iframe content (colonoscopy / mammography / ER / hospital)
    setTimeout(function () {
      const innerIframe = iframeDoc.querySelector(".document-preview");
      if (!innerIframe || !innerIframe.contentDocument) return;
      const innerDoc = innerIframe.contentDocument;
      const innerText = innerDoc.body ? innerDoc.body.textContent : "";
      fetchDemographicFromQueryString(innerText)
            .then(result => {
            if (!result) {
                console.log("No demographic data returned");
                return;
            }
            demographicNo = result.extractedNumber;
            console.log("[accessIframe] Extracted demographic number:", demographicNo);
       });

      if (
        (innerText.includes("Operative") || innerText.includes("OPERATIVE")) &&
        innerText.includes("colonoscope")
      ) {
        const colonoscopy = document.getElementById("colonoscopy");
        if (colonoscopy) colonoscopy.style.backgroundColor = "aquamarine";
      }

      if (innerText.includes("MAMMOGRAM")) {
        const mammo = document.getElementById("mammo");
        if (mammo) mammo.style.backgroundColor = "aquamarine";
      }

      if (
          innerText.includes("ED Adult Report") ||
          innerText.includes("was discharged from the Emergency Department")
      ) {
        const er = document.getElementById("er");
        if (er) er.style.backgroundColor = "aquamarine";
      }

      if (
        innerText.includes("ADMISSION NOTE") ||
        innerText.includes("DISCHARGE SUMMARY") ||
        innerText.includes("General Admission Note") ||
        innerText.includes("General Discharge Summary") ||
        innerText.includes("Transfer of Care") ||
        innerText.includes("The following patient was admitted to an inpatient unit")
      ) {
        const h = document.getElementById("h");
        if (h) h.style.backgroundColor = "aquamarine";
      }

     // Enable / disable demographic dependent elements
    document.querySelectorAll(".demodependent").forEach(el => {
      el.disabled = demographicNo === "";
    });

    if (demographicNo === "") {
        console.log("[accessIframe] No demo here");
    } else {
        getTicklers(demographicNo);
    }
    }, 300);

    // Remove <br> after alert-wrapper
      // First Select all alert wrappers
      const alertWraps = iframeDoc.querySelectorAll("div.alert-wrapper");

      alertWraps.forEach(alertWrap => {
          const next = alertWrap.nextElementSibling;
          if (next?.tagName === "BR") {
              next.remove();
          }
      });

  }, 500);
}

function getNoFromString(queryString, key) {
  const regex = new RegExp(`${key}\\s?=\\s?["']([\\d]+)["']`,'m');
  const match = queryString.match(regex);
  if (match && match[1]) {
    return match[1]; // The captured group contains the value
  }
  return "";
}

function getPtFromText(queryString) {
  const regex = new RegExp(`Patient:\s(\w*,\w*)`,'m'); // pattern for HRM mammo name
  const match = queryString.match(regex);
  if (match && match[1]) {
    return match[1]; // The captured group contains the value
  }
}


/**
 * Extract HIN from text, Element, or Document (including iframe.contentDocument)
 * Expected format: HCN: <digits>
 *
 * @param {string | Document | Element | DocumentFragment} input
 * @returns {string|null}
 */
function getHINfromText(input) {
    let text = "";
    let detectedType = "unknown";

    // ---- Detect input type ----
    if (typeof input === "string") {
        detectedType = "string";
        text = input;

    } else if (input instanceof HTMLBodyElement) {
        detectedType = "HTMLBodyElement";
        text = input.textContent || "";

    } else if (input instanceof Document) {
        detectedType = "Document";
        text = input.body ? input.body.textContent : "";

    } else if (input instanceof Element) {
        detectedType = `Element (${input.tagName})`;
        text = input.textContent || "";

    } else if (input instanceof DocumentFragment) {
        detectedType = "DocumentFragment";
        text = input.textContent || "";

    } else if (input && input.nodeType) {
        // Fallback for odd DOM nodes
        detectedType = `DOM Node (nodeType=${input.nodeType})`;
        text = input.textContent || "";
   } else {
        console.warn("[getHINfromText] Unsupported input:", input);
        return null;
    }

    console.log(`[getHINfromText] Detected input type: ${detectedType}`);

    if (!text.trim()) {
        console.warn("[getHINfromText] No text content available");
        return null;
    }

    // ---- Regex for HRM mammo HIN ----
    const regex = /HCN:\s*(\d+)/m;
    const match = text.match(regex);

    if (match && match[1]) {
        console.log("[getHINfromText] Regex match:", match[1]);
        return match[1];
    }

    console.warn("[getHINfromText] No HIN found");
    return null;
}

/**
 * Extract HIN from text, then fetch demographic data
 *
 * @param {string} queryString - iframe body containing HCN
 * @param {number} timeoutMs - Fetch timeout
 * @returns {Promise<{ doc: Document, extractedNumber: string | null } | null>}
 */
function fetchDemographicFromQueryString(queryString, timeoutMs = 10000) {
    console.log("[fetchDemographicFromQueryString] Starting process");

    const hin = getHINfromText(queryString);

    if (!hin) {
        console.warn("[fetchDemographicFromQueryString] Aborting: no HIN extracted");
        return Promise.resolve(null);
    }

    console.log("[fetchDemographicFromQueryString] HIN extracted:", hin);

    return fetchDemographicHTML(hin, "search_hin", timeoutMs)
        .then(result => {
            console.log("[fetchDemographicFromQueryString] Fetch completed");
            return result;
        })
        .catch(err => {
            console.error("[fetchDemographicFromQueryString] Error:", err);
            return null;
        });
}

//https://app.avaros.ca/oscar/demographic/demographiccontrol.jsp?search_mode=search_hin&keyword=123456789&orderby=last_name%2C+first_name&dboperation=search_titlename&limit1=0&limit2=10&displaymode=Search&ptstatus=active&fromMessenger=false&outofdomain=
/**
 * Fetch demographic search HTML with timeout + extract numeric value
 * Returns null if ZERO or MORE THAN ONE matches are found
 *
 * @param {string} keyword - Search keyword (e.g. HIN, name, etc.)
 * @param {string} searchMode - Search mode (e.g. "search_hin")
 * @param {number} timeoutMs
 * @returns {Promise<{ doc: Document, extractedNumber: string | null }>}
 */
function fetchDemographicHTML(keyword, searchMode, timeoutMs = 10000) {
    const baseUrl = "https://app.avaros.ca/oscar/demographic/demographiccontrol.jsp";

    const params = new URLSearchParams({
        search_mode: searchMode,
        keyword: keyword,
        orderby: "last_name, first_name",
        dboperation: "search_titlename",
        limit1: "0",
        limit2: "10",
        displaymode: "Search",
        ptstatus: "active",
        fromMessenger: "false",
        outofdomain: ""
    });

    const url = `${baseUrl}?${params.toString()}`;

    console.log("Fetching demographic HTML...");
    console.log("Request URL:", url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.warn("Fetch aborted due to timeout");
        controller.abort();
    }, timeoutMs);

    return fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "text/html" },
        signal: controller.signal
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        clearTimeout(timeoutId);
        console.log("HTML received (length):", html.length);

        // ---- STRICT REGEX MATCHING ----
        const regex = new RegExp(`dboperation=search_detail\\'\\)\\"\\s>(\\d*)`,'g');
        const matches = [...html.matchAll(regex)];

        console.log("Total regex matches found:", matches.length);

        let extractedNumber = null;

        if (matches.length === 2) { // the regex will throw twice for every succesful demo search
            extractedNumber = matches[0][1];
            console.log("Exactly one demographicNo found:", extractedNumber);
        } else if (matches.length > 2) {
            console.warn("More than one match found — returning null");
        } else {
            console.warn("No matches found");
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        return { doc, extractedNumber };
    })
    .catch(error => {
        clearTimeout(timeoutId);

        if (error.name === "AbortError") {
            console.error("Fetch aborted (timeout)");
        } else {
            console.error("Fetch error:", error);
        }

        throw error;
    });
}
