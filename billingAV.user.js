// ==UserScript==
// @name     Billing2 PHC AV
// @author   Peter Hutten-Czapski
// @version  2.3
// @description Bills passed billing code in URL parameters.  Used in some Lab buttons or macros
// @grant    none
// @namespace Phcscript
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/billingAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/billingAV.user.js
// @include */av/billing2/invoice/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/waitForKeyElements.js
// ==/UserScript==

var url = new URL(window.location.href);
var params = url.searchParams;

if (params.get("bill")){ // check for non empty, null, undefined, 0, false, NaN
	waitForKeyElements("#service-code-select", insertMyText, true);
}

function insertMyText() {
  jQuery('h6').text("Billing "+params.get("bill"));
  const textel = document.getElementById('service-code-select');
  setTimeout(function(){
  textel.focus(); // Focus the element before executing the command
  document.execCommand('insertText', false, params.get("bill"));  //ancient and deprecated but may just work
    },3000);
}
