// ==UserScript==
// @name     Billing2 PHC AV
// @version  2
// @description Bills passed billing code in URL parameters
// @grant    none
// @namespace Phcscript
// @include */av/billing2/invoice/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js 
// @require https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// ==/UserScript==

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

var url = new URL(window.location.href);
var params = url.searchParams;

//console.log(params);  

function passBill(){
  console.log("Passing parameter bill: " + params.get("bill") ); 
  jQuery("#service-code-select").trigger2("click");
  jQuery("#service-code-select").val(params.get("bill")); 
  jQuery("#service-code-select").trigger2("change");
}

if (params.get("bill")){ // check for non empty, null, undefined, 0, false, NaN 
  waitForKeyElements("#service-code-select", passBill, true); // ensure that the defined element is loaded, call passBill() and do it only once
}
