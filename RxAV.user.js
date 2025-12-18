// ==UserScript==
// @name     Rx PHC AV
// @author   Peter Hutten-Czapski
// @version  0.1
// @description (re)formats Rx
// @grant    none
// @namespace Phcscript
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/RxAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/RxAV.user.js
// @include */oscarRx/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

                             
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle('#saveButton { color: white ! important; background-color: #039be5 ! important;}');
// the following button is in a dynamically loded iframe
//addGlobalStyle('#faxButton { color: white ! important; background-color: #039be5 ! important;}');
