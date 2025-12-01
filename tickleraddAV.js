// ==UserScript==
// @name     Ticklers AV PHC 
// @version  1.6
// @grant    none
// @namespace Phcscript
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.js
// @include */oscar/tickler/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

jQuery.noConflict();

jQuery(document).ready(function() {
    var url = new URL(window.location.href);
    var params = url.searchParams;  
  	if (params.get("tickler")){
      console.log("Ready to insert "+params.get("tickler"));
      jQuery('textarea[name="textarea"]').text(params.get("tickler"));
    }
});
