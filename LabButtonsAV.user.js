// ==UserScript==
// @name     Lab Display Buttons PHC
// @author   Peter Hutten-Czapski
// @version  1.9
// @namespace Phcscript
// @grant     none
// @description Macro buttons for AV for rapid entry of common lab comments, and opening related ticklers and billing
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/LabButtonsAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/LabButtonsAV.user.js
// @include https://app.avaros.ca/av/providerinbox/inbox*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// ==/UserScript==

//jQuery.noConflict();

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
  billingURL += "&bill="+bcode;  //add a parameter for the billing greasemonkey
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

// Find a suitable place to insert the menu on the page
document.body.appendChild(menuContainer);

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


// wait for the body of the iframe is loaded, and reload if the iframe changes
waitForKeyElements("body", accessIframe, false,'iframe[title="Preview"]');

function accessIframe(){
	setTimeout(function(){
    	var currentIframeUrl = jQuery('iframe[title="Preview"]')[0].contentWindow.location.href;
    	console.log("accessing iframe "+currentIframeUrl);
    	var url = new URL(currentIframeUrl);
    	var params = url.searchParams;
		var $iframeContents = jQuery('iframe[title="Preview"]').contents();
    	var iframeHeadContent = $iframeContents.find("head").html();

    	jQuery(":button").css("background-color", ""); // Removes and resets the inline 'background-color' property
    	jQuery("#alert").text("");

		// extract information from the iFrame parameters and head content that may be useful for Macros
		console.log("segmentID:"+params.get("segmentID")+"  docId:"+params.get("docId") + "  demographicNo:" + getNoFromString(iframeHeadContent,'demographicNo') + "  providerNo:" + getNoFromString(iframeHeadContent,'providerNo'));

    	segmentID = params.get("segmentID");
			demographicNo = getNoFromString(iframeHeadContent,'demographicNo') != "" ? getNoFromString(iframeHeadContent,'demographicNo') : getNoFromString(iframeHeadContent,'demographicID') ;
    	providerNo = getNoFromString(iframeHeadContent,'providerNo');

    	if (demographicNo == "") {
        console.log("no demo here");
       	jQuery(".demodependent").prop("disabled", true);
      } else {
       	jQuery(".demodependent").prop("disabled", false);
      }
    	if (providerNo == "") {
        console.log("no provider here");
       	jQuery(".providerdependent").prop("disabled", true);
      } else {
       	jQuery(".providerdependent").prop("disabled", false);
      }

	// add links to show / hide the raw HL7
			var $iframeBody = $iframeContents.find("body");
    	var theId = $iframeContents.find("[id^='rawhl7']").attr('id');
    	if (theId){
				$iframeBody.append('<a id="showraw" onclick="document.getElementById(\''+theId+'\').style.display = \'block\'">Show HL7</a>&nbsp;|&nbsp;<a id="hideraw" onclick="document.getElementById(\''+theId+'\').style.display = \'none\'">Hide HL7</a>');
      }

	// scan the raw HL7 content for key words reflecting pap psa fit
    	var elementText = $iframeContents.find("#"+theId).text();
    	if (elementText.includes('Human Papilloma Virus') || elementText.includes('HEACWO')){  // NB .includes is case sensitive
        jQuery('#pap').css('background-color', 'aquamarine');
      }
      if (elementText.includes('Prostate Specific Antigen Monitoring')){
        jQuery('#psa').css('background-color', 'aquamarine');
      }
    	if (elementText.includes('FECAL IMMUNOCHEMICAL TEST')){
        jQuery('#fit').css('background-color', 'aquamarine');
      }

  // different code necessary to detect colonoscopy mammography from nested HRM iframe
      setTimeout(function(){
        var $innerIframeContents = $iframeContents.find('.document-preview').contents();
        var innerElementText = $innerIframeContents.find('div').text();
        if ((innerElementText.includes('Operative') || innerElementText.includes('OPERATIVE')) && innerElementText.includes('colonoscope')){
          jQuery("#alert").text("Colonoscopy");
        }
        if (innerElementText.includes('MAMMOGRAM')){
          jQuery("#alert").text("Mammo");
        }
        if (innerElementText.includes('ED Adult Report')){
          jQuery('#er').css('background-color', 'aquamarine');
        }
        if (innerElementText.includes('ADMISSION NOTE') || innerElementText.includes('DISCHARGE SUMMARY') || innerElementText.includes('Transfer of Care')){
          jQuery('#h').css('background-color', 'aquamarine');
        }
      },300);

	// remove <br> from successive alert wraps  
			var $alertwrap = $iframeContents.find('div.alert-wrapper');
			var $alertbr = $alertwrap.next('br');
  		$alertbr.remove(); 
    
	},300);
}

function getNoFromString(queryString, key) {
  const regex = new RegExp(`${key}\\s?=\\s?["']([\\d]+)["']`,'m');
  const match = queryString.match(regex);
  if (match && match[1]) {
    return match[1]; // The captured group contains the value
  }
  return "";
}
