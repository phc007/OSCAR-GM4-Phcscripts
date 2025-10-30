// ==UserScript==
// @name     Ticklers AV PHC 
// @version  1.1
// @grant    none
// @namespace Phcscript
// @include */oscar/tickler/ticklerAdd.jsp*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

jQuery.noConflict();



//=====Get Parameters============
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

jQuery(document).ready(function() {
  
	jQuery("textarea").html(params.ticker);
});
  
