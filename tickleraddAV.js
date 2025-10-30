// ==UserScript==
// @name     Ticklers AV PHC 
// @version  1
// @grant    none
// @namespace Phcscript
// @include */oscar/tickler/ticklerAdd.jsp*
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


window.onload = function() {
// Get all textarea elements on the page
const textareas = document.getElementsByTagName('textarea');

// Check if any textarea elements exist
if (textareas.length > 0) {
  // Access the first textarea element (you might need to adjust the index if there are multiple)
  const firstTextarea = textareas[0];

  // Change the text content of the textarea
  firstTextarea.value = params.tickler;
}
}
