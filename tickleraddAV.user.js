// ==UserScript==
// @name     Ticklers AV PHC 
// @version  1.7
// @grant    none
// @namespace Phcscript
// @description Used by Macro menu commands to pass tickler detail into a new tickler
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/tickleraddAV.user.js
// @include */oscar/tickler/*
// ==/UserScript==

window.onload = function() {
    var url = new URL(window.location.href);
    var params = url.searchParams;  
  	if (params.get("tickler")){
      console.log("Ready to insert "+params.get("tickler"));
      const textarea = document.querySelector(`textarea[name="textarea"]`);
        if (textarea) {
    			textarea.value = params.get("tickler");
  			} else {
    			console.warn(`textarea not found.`);
  		}
    }
};
