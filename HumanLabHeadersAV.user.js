// ==UserScript==
// @name           Lab Reheader AV
// @namespace      Phcscript
// @version        2.6
// @description    Replaces Lab Headers with Human readable ones
// @updateURL 	   https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/HumanLabHeadersAV.user.js
// @downloadURL	   https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/HumanLabHeadersAV.user.js
// @include        *av/echart*
// @include        *av/providerinbox/inbox*
// @include        *oscar/oscarEncounter/oscarConsultationRequest/attachConsultation2.jsp*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/waitForKeyElements.js
// ==/UserScript==

jQuery.noConflict();

(function() {
	'use strict';
	// style patch for attachConsultation2.jsp
		const css = `
    	td {
      	height: 100%;
      }
   `;

		const styleElement = document.createElement('style');
		styleElement.textContent = css;
		document.head.appendChild(styleElement); 

})();

function startIt() {
	nameExchange();
  // Trigger for echart
	jQuery("i.material-icons-outlined.cursor-pointer").mouseup(function() {
    console.log("mouseup");
    // Code to be executed when the mouse button is released over the element
		setTimeout(function(){
      	nameExchange();
		},1000);
	});
  // Trigger for consultation attachements AV
 	jQuery(".list-header").mouseup(function() {
    console.log("mouseup");
    // Code to be executed when the mouse button is released over the element
		setTimeout(function(){
      	nameExchange();
		},1000);
	});
}

function nameExchange() {
  console.log("nameExchange");
    jQuery('[data-rbd-draggable-id="labs"]').find("div.word-break-all").each(function() {
  	// 'this' refers to each descendant div with 'word-break-all'
      jQuery(this).html(processLabName(jQuery(this).text()));
		});
    jQuery(".truncate-row-by-width.max-width-300").each(function() {
    // this is the inbox in the list view
      jQuery(this).html(processLabName(jQuery(this).text()));
		});
    jQuery("span.text").each(function() {  // OSCAR AV consults
      jQuery(this).html( processLabName(jQuery(this).html()) );
		});
}

// wait for ajax load before parsing eChart (AV)
waitForKeyElements("[data-rbd-draggable-id='labs'] div.word-break-all", startIt);
// wait for ajax load before parsing consultation requests (OSCAR, AV)
waitForKeyElements(".list-header", startIt);
// wait for ajax load before parsing AV Inbox
waitForKeyElements(".truncate-row-by-width.max-width-300", startIt);


function processLabName(strTestName) {
	theNames=strTestName.split('/');
	if(theNames.length>1)	{ 
		var thePhrase=renameTheLab(theNames[0]);
		for(var name_id=1;name_id<theNames.length;name_id++) {
				thePhrase+='/';
				thePhrase+=renameTheLab(theNames[name_id]);			
			}
    return thePhrase;
  } else {
  	return renameTheLab(strTestName); 
  }
}


function renameTheLab(strOldName){
	var strNewName=strOldName;
	switch(strOldName.trim())
	{
		case 'HAEM1':
			strNewName='CBC';
			break;
		case 'HAEM3':
			strNewName='INR';
			break;
		case 'HAEM8':
			strNewName='SemAn';
		case 'CHEM1':
			strNewName='FE';
			break;
		case 'CHEM2':
			strNewName='UA';
			break;
		case 'CHEM3.5':
			strNewName='ABG';
			break;
		case 'CHEM4':
			strNewName='LYTES/A1C';
			break;
		case 'CHEM5':
			strNewName='CK';
			break;
		case 'CHEM5.5':
			strNewName='TROP';
			break;
		case 'CHEM6':
			strNewName='CHOL';
			break;
		case 'CHEM8':
			strNewName='GLUC';
			break;
		case 'CHEM9':
			strNewName='UCHEM';
			break;
		case 'CHEM10':
			strNewName='ACR';
			break;
		case 'CHEM11':
			strNewName='TSH';
			break;
		case 'CHEM12':
			strNewName='PITHorm';
			break;
		case 'CHEM14':
			strNewName='CaTests';
			break;
		case 'CHEM15':
			strNewName='HCG-Horm';
			break;
		case 'CHEM17': // crp protein electrophoresis
			strNewName='CRP';
			break;
		case 'CHEM18': // Celiac and ANA
			strNewName='Celiac/ANA';
			break;
		case 'CHEM19':
			strNewName='SAL/ACET';
			break;
		case 'CHEM21':
			strNewName='ETOH';
			break;
		case 'CHEM25':
			strNewName='FOBT';
			break;
		case 'CHEM28':
			strNewName='PTH';
			break;
		case 'MICRO3':
			strNewName='UCUL';
			break;
		case 'MICRO3.5':
			strNewName='GC/CHLA';
			break;
		case 'MICRO11':
			strNewName='Fungus';
			break;
		case 'PATHP1':
			strNewName='Path';
			break;
		case 'HISTOP1':
			strNewName='Histo';
			break;
		case 'PATHPDF1':
			strNewName='PDF';
			break;
		case 'REFER2':
			strNewName='HepHIVSer';
			break;
		case 'HEACWO':
			strNewName='CT-Head';
			break;
		default:
			break;
	}
  if (strNewName != strOldName) { console.log(strOldName+"=>"+strNewName); }
	return strNewName;
}


