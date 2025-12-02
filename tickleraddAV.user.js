// ==UserScript==
// @name     Ticklers AV PHC 
// @version  1.6
// @grant    none
// @namespace Phcscript
// @description Used by Macro menu commands to pass tickler detail into a new tickler
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.user.js
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
