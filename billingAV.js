// ==UserScript==
// @name     Billing PHC AV
// @version  1
// @description Bills passed billing code in URL parameters
// @grant    none
// @namespace Phcscript
// @include */av/billing2/invoice/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js  
// ==/UserScript==

jQuery.noConflict();


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


jQuery(document).ready(function() {
    var params = {};
    if (location.search) {
        var parts = location.search.substring(1).split('&');
        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }
    console.log(params);  
  
  	if (params.bill){
      console.log("parameter bill is "+params.bill);
			setTimeout(function(){ 
        jQuery("#service-code-select").trigger2("click");
        jQuery("#service-code-select").val(params.bill); 
        jQuery("#service-code-select").trigger2("change");
  		},1000);
    }

});

