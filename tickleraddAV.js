// ==UserScript==
// @name     Ticklers AV PHC 
// @version  1.3
// @grant    none
// @namespace Phcscript
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
