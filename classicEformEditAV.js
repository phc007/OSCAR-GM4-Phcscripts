// ==UserScript==
// @name     eFormEdit
// @description Adds links for the hidden editor for js eforms when you open the eform manager in a new tab
// @version  1
// @grant    none
// @namespace Phcscript
// @include https://app.avaros.ca/oscar/eform/efmformmanager.jsp
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js    
// ==/UserScript==

jQuery.noConflict();

(function() {
	'use strict';

  const css = `
    [class^="icon-"], [class*=" icon-"] {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-top: 1px;
      *margin-right: .3em;
      line-height: 14px;
      vertical-align: text-top;
      background-image: url("../images/glyphicons-halflings.png");
      background-position: 14px 14px;
      background-repeat: no-repeat;
    }
    .icon-edit {
      background-position: -96px -72px;
    }

	`;

  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  
})();


jQuery(document).ready(function() {

  // <a href="#" onclick="newWindow('/oscar/eform/efmshowform_data.jsp?fid=47', 'Form0'); return false;">
  
  jQuery('[data-eform-id]').each(function() {
    var fid = jQuery(this).attr('data-eform-id');
    jQuery(this).find("td:first").append( "<a onclick=\"newWindow('efmformmanageredit.jsp?fid="+fid+"', 'Form0');return false;\"><i class='icon-edit'></i></a>" );
  });
	
  // <i class="material-icons color-text-secondary">edit</i> 
  jQuery(".material-icons").html(function(index, oldHtml) {
  return oldHtml.replace(/edit/g, "view");
});
  
});
