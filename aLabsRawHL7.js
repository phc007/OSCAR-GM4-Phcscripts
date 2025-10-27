// ==UserScript==
// @name     a Lab's Display raw HL7 PHC
// @description works on individually appearing labs, mostly stubs for customisation
// @version  1
// @namespace Phcscript
// @grant    none
// @include */oscar/lab/CA/ALL/labDisplay.jsp*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==



jQuery.noConflict();

jQuery(document).ready(function() {
  	console.log("ready!");
  

	// add links to show / hide the raw HL7 if available 
    	var theId = jQuery("[id^='rawhl7']").attr('id');
  		if (jQuery('#'+theId).html() != "null"){
				jQuery('body').append('<a id="showraw" onclick="document.getElementById(\''+theId+'\').style.display = \'block\'">Show HL7</a>&nbsp;|&nbsp;<a id="hideraw" onclick="document.getElementById(\''+theId+'\').style.display = \'none\'">Hide HL7</a>');
      }
     
  
  
});
