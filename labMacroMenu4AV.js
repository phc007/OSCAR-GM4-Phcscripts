// ==UserScript==
// @name     Lab Display Macro Menu PHC
// @version  1.3
// @grant    none
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/labMacroMenu4AV.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/labMacroMenu4AV.js
// @include *av/providerinbox/inbox*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

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

function ButtonFunction(str){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val(str);
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
          accessIframe();        
      },500);
   },500);
}


/* 
//functions to parse identifiers for more complex macros

setTimeout(function(){
	// initial preview trigger
  console.log("time");
  jQuery('tr').on('mouseup', function (){
    console.log("mouse click");
    initiate2ndTrigger();
    accessIframe();
  })
},4000);

function initiate2ndTrigger(){
	setTimeout(function(){  
    jQuery('.left-node, .right-node').on('mouseup', function (){
      console.log("mouse click 2");
      accessIframe();
    }) 
	},2000);
}

function accessIframe(){
	setTimeout(function(){   	
    	var currentIframeUrl = jQuery('iframe[title="Preview"]')[0].contentWindow.location.href;
    	console.log("accessing iframe "+currentIframeUrl);
    	var url = new URL(currentIframeUrl);
    	var params = url.searchParams;
			var $iframeContents = jQuery('iframe[title="Preview"]').contents();
    	var iframeHeadContent = $iframeContents.find("head").html();
    	
			console.log("segmentID:"+params.get("segmentID")+"  docId:"+params.get("docId") + "  demographicNo:" + getNoFromString(iframeHeadContent,'demographicNo'));

			var $iframeBody = $iframeContents.find("body"); 
			var $alertwrap = $iframeContents.find('div.alert-wrapper');
			var $alertbr = $alertwrap.next('br');
  		$alertbr.remove();      
	},3000);
}

function getNoFromString(queryString, key) {
  const regex = new RegExp(`${key}\\s?=\\s?"([\\d]+)"`,'m');
  const match = queryString.match(regex);
  if (match && match[1]) {
    return match[1]; // The captured group contains the value
  }
  return null;
}

*/

// Create a new div to hold the dropdown
const menuContainer = document.createElement('div');
menuContainer.id = 'myGreasemonkeyMenu';
menuContainer.setAttribute("style", "font-size:12px;position:fixed;top:30px;left:1120px;");

// Create the select element
const dropdown = document.createElement('select');
dropdown.id = 'myFunctionDropdown';

// Create options for the dropdown
const option0 = document.createElement('option');
option0.value = 'function0';
option0.textContent = '-Macro-';

const option1 = document.createElement('option');
option1.value = 'function1';
option1.textContent = 'Normal';

const option2 = document.createElement('option');
option2.value = 'function2';
option2.textContent = 'Stable';

const option3 = document.createElement('option');
option3.value = 'function3';
option3.textContent = 'Improving';

const option4 = document.createElement('option');
option4.value = 'function4';
option4.textContent = 'Incomplete';

const option5 = document.createElement('option');
option5.value = 'function5';
option5.textContent = 'Rx';

const option6 = document.createElement('option');
option6.value = 'function6';
option6.textContent = 'ER';

const option7 = document.createElement('option');
option7.value = 'function7';
option7.textContent = 'Inpatient';

const option8 = document.createElement('option');
option8.value = 'function8';
option8.textContent = 'Consultant';

// Append options to the dropdown
dropdown.appendChild(option0);
dropdown.appendChild(option1);
dropdown.appendChild(option2);
dropdown.appendChild(option3);
dropdown.appendChild(option4);
dropdown.appendChild(option5);
dropdown.appendChild(option6);
dropdown.appendChild(option7);
dropdown.appendChild(option8);

// Append the dropdown to the container
menuContainer.appendChild(dropdown);

// Find a suitable place to insert the menu on the page
document.body.appendChild(menuContainer);


// Get a reference to the dropdown element
const myFunctionDropdown = document.getElementById('myFunctionDropdown');

// Add an event listener to the dropdown
myFunctionDropdown.addEventListener('change', function() {
    const selectedFunction = this.value;

    if (selectedFunction === 'function1') {
        ButtonFunction("Normal");
    } else if (selectedFunction === 'function2') {
        ButtonFunction("Stable");
    } else if (selectedFunction === 'function3') {
        ButtonFunction("Improving");
    } else if (selectedFunction === 'function4') {
        ButtonFunction("Incomplete");
    } else if (selectedFunction === 'function5') {
        ButtonFunction("Rx reviewed and request granted");
    } else if (selectedFunction === 'function6') {
        ButtonFunction("Hospital Emergency Patient");
    } else if (selectedFunction === 'function7') {
        ButtonFunction("Hospital Inpatient");
    } else if (selectedFunction === 'function8') {
        ButtonFunction("Consultant ordered and followed");
    }
   revertSelection();
});

function revertSelection(){
    const mySelect = document.getElementById("myFunctionDropdown");
    // Set the value of the select element back to the first option which is just a header
    setTimeout(function(){
          mySelect.value = "function0";
      },500);
}
