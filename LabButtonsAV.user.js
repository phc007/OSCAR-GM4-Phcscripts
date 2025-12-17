// ==UserScript==
// @name     Lab Display Buttons PHC
// @author   Peter Hutten-Czapski
// @version  2.1
// @namespace Phcscript
// @grant     none
// @description Macro buttons for AV for rapid entry of common lab comments, and opening related ticklers and billing
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/LabButtonsAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/LabButtonsAV.user.js
// @include https://app.avaros.ca/av/*inbox*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/waitForKeyElements.js
// ==/UserScript==

var demographicNo = "";
var providerNo = "";
var segmentID = "";

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
/*
var input12=document.createElement("input");
input12.type="button";
input12.value="Colon";
input12.id="colonoscopy";
input12.addEventListener("click", function() {
  if (demographicNo) {
    postBilling("Q142A"); //Colorectal Cancer Screening Test Exclusion code
  	openPrevention('COLONOSCOPY');
		openTickler('Colonoscopy repeat in 3yr',getFutureDate(3)); // 3, 5, or 10yr PHC fix
  } else {
    ClickPreventions('COLONOSCOPY');
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
    postBilling("Q131A"); //?necessary the tracking code
  	openPrevention('MAM');
    openTickler('Mammo repeat in 2yr',getFutureDate(2));
  } else {
    ClickPreventions('MAM');
  }
});
input13.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input13.setAttribute("title", "Mammography Prevention");
input13.setAttribute("disabled", "");
input13.classList.add('providerdependent'); //for billing
input11.classList.add('demodependent'); //for prevention billing and tickler
menuContainer.appendChild(input13);

*/

var span1=document.createElement("span");
span1.id="alert";
span1.classList.add('alert');
span1.setAttribute("style", "color: red;");
menuContainer.appendChild(span1);

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
  console.log('Running after:', reason);
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


function accessIframe() {
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
    document.querySelectorAll("button").forEach(btn => {
      btn.style.backgroundColor = "";
    });

    // Clear alert text
    const alertEl = document.getElementById("alert");
    if (alertEl) alertEl.textContent = "";

    console.log(
      "segmentID:" + params.get("segmentID") +
      "  docId:" + params.get("docId") +
      "  demographicNo:" + getNoFromString(iframeHeadContent, "demographicNo") +
      "  providerNo:" + getNoFromString(iframeHeadContent, "providerNo")
    );

    segmentID = params.get("segmentID");
    demographicNo =
      getNoFromString(iframeHeadContent, "demographicNo") ||
      getNoFromString(iframeHeadContent, "demographicID");

    providerNo = getNoFromString(iframeHeadContent, "providerNo");

    // Enable / disable demographic dependent elements
    document.querySelectorAll(".demodependent").forEach(el => {
      el.disabled = demographicNo === "";
    });

    if (demographicNo === "") console.log("no demo here");

    // Enable / disable provider dependent elements
    document.querySelectorAll(".providerdependent").forEach(el => {
      el.disabled = providerNo === "";
    });

    if (providerNo === "") console.log("no provider here");

    // Add links to show / hide raw HL7
    const iframeBody = iframeDoc.body;
    const rawHl7El = iframeDoc.querySelector("[id^='rawhl7']");
    const theId = rawHl7El ? rawHl7El.id : null;

    if (theId && iframeBody) {
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
        elementText.includes("Human Papilloma Virus") ||
        elementText.includes("HEACWO")
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

      if (
        (innerText.includes("Operative") || innerText.includes("OPERATIVE")) &&
        innerText.includes("colonoscope")
      ) {
        if (alertEl) alertEl.textContent = "Colonoscopy";
      }

      if (innerText.includes("MAMMOGRAM")) {
        if (alertEl) alertEl.textContent = "Mammo";
      }

      if (innerText.includes("ED Adult Report")) {
        const er = document.getElementById("er");
        if (er) er.style.backgroundColor = "aquamarine";
      }

      if (
        innerText.includes("ADMISSION NOTE") ||
        innerText.includes("DISCHARGE SUMMARY") ||
        innerText.includes("Transfer of Care")
      ) {
        const h = document.getElementById("h");
        if (h) h.style.backgroundColor = "aquamarine";
      }
    }, 300);

    // Remove <br> after alert-wrapper
    const alertWrap = iframeDoc.querySelector("div.alert-wrapper");
    if (alertWrap && alertWrap.nextElementSibling?.tagName === "BR") {
      alertWrap.nextElementSibling.remove();
    }

  }, 300);
}

function getNoFromString(queryString, key) {
  const regex = new RegExp(`${key}\\s?=\\s?["']([\\d]+)["']`,'m');
  const match = queryString.match(regex);
  if (match && match[1]) {
    return match[1]; // The captured group contains the value
  }
  return "";
}
