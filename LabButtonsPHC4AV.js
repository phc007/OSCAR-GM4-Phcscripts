// ==UserScript==
// @name     Lab Display Buttons PHC
// @version  1.3.1
// @namespace Phcscript
// @grant     GM.xmlHttpRequest
// @include https://app.avaros.ca/av/providerinbox/inbox*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

jQuery.noConflict();


function ButtonFunction(str){
  jQuery('textarea:first').attr("id", "myId");
    //jQuery('#acknowledge-dropdown-trigger').click();
  	jQuery("span:contains('Acknowledge')").click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val(str);
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
          accessIframe();        
      },500);
   },500);
}

function onViewPrevention(url, preventionSelected) {
	iframe = document.querySelector('iframe#prevention-preview');
	if (!iframe) {
		return;
	}
	jQuery('.prevention-result-item-inner').removeClass('active');
	if (document.previewUrl != url) {
		document.previewUrl = url;
		iframe.src = url;
		iframe.classList.remove('d-none');
		jQuery('.section-right').addClass('active');
		jQuery('#preview-backdrop').removeClass('d-none');
		if (preventionSelected) {
			jQuery(preventionSelected).addClass('active');
		}
	}
}

   //https://app.avaros.ca/oscar/oscarPrevention/index.jsp?demographic_no=4714

function openPrevention(prev){
  var preventionURL = 'https://app.avaros.ca/oscar/oscarPrevention/index.jsp?demographic_no=';
  preventionURL += demographicNo;
  preventionURL += '&prevention='+prev // pass parameter for prevention greasemonkey
	var newWindow2 = window.open(preventionURL, '_blank', 'width=600,height=400');
	if (newWindow2) { // Check if the window was successfully opened
		
	} else {
		alert('Popup blocked! Please allow popups for this site.');
	}  
}
	//https://app.avaros.ca/oscar/tickler/ticklerDemoMain.jsp?demoview=25249&parentAjaxId=tickler
  //https://app.avaros.ca/oscar/tickler/ticklerAdd.jsp?demographic_no=4714&name=PATIENT%2C+NOTA&chart_no=&bFirstDisp=false&messageID=null&doctor_no=1001&remoteFacilityId=
  //https://app.avaros.ca/oscar/tickler/ticklerAdd.jsp?updateParent=true&parentAjaxId=tickler&bFirstDisp=false&messageID=null&demographic_no=4714&chart_no=&name=PATIENT%2C+NOTA

function openTickler(tickler, adate){
  var ticklerURL = 'https://app.avaros.ca/oscar/tickler/ticklerAdd.jsp?xml_appointment_date='+adate+'&demographic_no=';
  ticklerURL += demographicNo;
  ticklerURL += '&name=' + demographicNo;
  ticklerURL += '&chart_no=&bFirstDisp=false&messageID=null&doctor_no=' + providerNo;
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
	var newWindow3 = window.open(billingURL, '_blank', 'width=1450,height=450');
	if (newWindow3) { // Check if the window was successfully opened
		
	} else {
		alert('Popup blocked! Please allow popups for this site.');
	}  
}

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
input6.addEventListener("click", function() {ButtonFunction("Hospital Emergency Patient");});
input6.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input6.setAttribute("title", "ER patient");
menuContainer.appendChild(input6);

var input7=document.createElement("input");
input7.type="button";
input7.value="H";
input7.addEventListener("click", function() {ButtonFunction("Hospital Inpatient");});
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
input9.value="papP";
input9.addEventListener("click", function() {openPrevention('HPV Screen');});
input9.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input9.setAttribute("title", "HPV Screen Prevention");
input9.setAttribute("disabled", "");
input9.classList.add('demodependent');
menuContainer.appendChild(input9);

var input10=document.createElement("input");
input10.type="button";
input10.value="Pap$";
input10.addEventListener("click", function() {postBilling("Q011A");});
input10.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input10.setAttribute("title", "HPV Screen billing");
input10.setAttribute("disabled", "");
input10.classList.add('demodependent');
input10.classList.add('providerdependent');
menuContainer.appendChild(input10);

var input11=document.createElement("input");
input11.type="button";
input11.value="papT";
const today = new Date();
today.setFullYear(today.getFullYear() + 5);
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const futureDateString = `${year}-${month}-${day}`;
input11.addEventListener("click", function() {openTickler('Pap',futureDateString)}); 
input11.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input11.setAttribute("title", "Pap Tickler");
input11.setAttribute("disabled", "");
input11.classList.add('demodependent');
input11.classList.add('providerdependent');
menuContainer.appendChild(input11);

var input12=document.createElement("input");
input12.type="button";
input12.value="colonP";
input12.addEventListener("click", function() {openPrevention('COLONOSCOPY');});
input12.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input12.setAttribute("title", "Colonoscopy Prevention");
input12.setAttribute("disabled", "");
input12.classList.add('demodependent');
menuContainer.appendChild(input12);

var input13=document.createElement("input");
input13.type="button";
input13.value="colon$";
input13.addEventListener("click", function() {postBilling("Q142A");});
input13.setAttribute("style", "font-size:12px; padding: 2px; margin-right: 3px;");
input13.setAttribute("title", "HPV Screen billing");
input13.setAttribute("disabled", "");
input13.classList.add('demodependent');
input13.classList.add('providerdependent');
menuContainer.appendChild(input13);

// Find a suitable place to insert the menu on the page
document.body.appendChild(menuContainer);

jQuery(document).ready(function() {
  	console.log("ready!");
  // events to trigger a real change in react
  (function($) {
      $.fn.trigger2 = function(eventName) {
          return this.each(function() {
              var el = $(this).get(0);
              triggerNativeEvent(el, eventName);
          });
      };
      function triggerNativeEvent(el, eventName){
        if (el.fireEvent) { // < IE9
          (el.fireEvent('on' + eventName));
        } else {
          var evt = document.createEvent('Events');
          evt.initEvent(eventName, true, false);
          el.dispatchEvent(evt);
        }
  		}
  }(jQuery));               
});

setTimeout(function(){
	// initial preview trigger
  console.log("time");
  jQuery('tr').on('mouseup', function (){
    console.log("mouse click");
    initiate2ndTrigger();
    accessIframe();
  })
},3000);

function initiate2ndTrigger(){
	setTimeout(function(){  
    jQuery('.left-node, .right-node').on('mouseup', function (){
      console.log("mouse click 2");
      accessIframe();
    }) 
	},2000);
}

var demographicNo = "";
var providerNo = "";

function accessIframe(){
	setTimeout(function(){   	
    	var currentIframeUrl = jQuery('iframe[title="Preview"]')[0].contentWindow.location.href;
    	console.log("accessing iframe "+currentIframeUrl);
    	var url = new URL(currentIframeUrl);
    	var params = url.searchParams;
			var $iframeContents = jQuery('iframe[title="Preview"]').contents();
    	var iframeHeadContent = $iframeContents.find("head").html();

    // extract information from the iFrame parameters and head content that may be useful for Macros   	
			console.log("segmentID:"+params.get("segmentID")+"  docId:"+params.get("docId") + "  demographicNo:" + getNoFromString(iframeHeadContent,'demographicNo') + "  providerNo:" + getNoFromString(iframeHeadContent,'providerNo'));
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
			$iframeBody.append('<a id="showraw" onclick="document.getElementById(\''+theId+'\').style.display = \'block\'">Show HL7</a>&nbsp;|&nbsp;<a id="hideraw" onclick="document.getElementById(\''+theId+'\').style.display = \'none\'">Hide HL7</a>');

	// remove <br> from successive alert wraps  
			var $alertwrap = $iframeContents.find('div.alert-wrapper');
			var $alertbr = $alertwrap.next('br');
  		$alertbr.remove(); 
    
	},3000);
}

function getNoFromString(queryString, key) {
  const regex = new RegExp(`${key}\\s?=\\s?["']([\\d]+)["']`,'m');
  const match = queryString.match(regex);
  if (match && match[1]) {
    return match[1]; // The captured group contains the value
  }
  return "";
}
