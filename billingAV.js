// ==UserScript==
// @name     Billing2 PHC AV
// @version  2.1
// @description Bills passed billing code in URL parameters
// @grant    none
// @namespace Phcscript
// @include */av/billing2/invoice/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js 
// @require https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
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


