// ==UserScript==
// @name     Browser PIN save defeat
// @author   Peter Hutten-Czapski
// @license  GNU General Public License v3
// @version  0.1
// @description Prevents the browser from trying to save the PIN as the password
// @namespace Phcscript
// @grant     none
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/loginAV.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/loginAV.user.js
// @include https://app.avaros.ca/login
// ==/UserScript==

(function() {
    'use strict';
    const el = document.getElementsByName("pin");
    el[0].type = "text";
    el[0].style["-webkit-text-security"] = "disc";
})();
