// ==UserScript==
// @name           Lab Reheader
// @namespace      Phcscript
// @version        2.7.1
// @description    Replaces Lab Headers with Human readable ones
// @include        */casemgmt/forward.jsp*
// @include        */oscarEncounter/oscarConsultationRequest/attachConsultation2.jsp*
// @include        */oscarEncounter/oscarConsultationRequest/ConsultationFormRequest.jsp*
// @include        */oscarEncounter/ViewRequest.do*
// @include        */dms/inboxManage.do*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/waitForKeyElements.js
// ==/UserScript==


jQuery.noConflict();

function startIt() {
	nameExchange();
  // Trigger for eChart down button
	jQuery("#imglabs5").mouseup(function() {
    console.log("mouseup");
    // Code to be executed when the mouse button is released over the element
		setTimeout(function(){
      	nameExchange();
		},1000);
	});
  // Trigger for consultation attachements OSCAR
 	jQuery("#selectAlllab").mouseup(function() {
    console.log("mouseup");
    // Code to be executed when the mouse button is released over the element
		setTimeout(function(){
      	nameExchange();
		},1000);
	});
  // Trigger for OSCAR inbox
 	jQuery("#summaryView tr td").mouseup(function() {
    console.log("mouseup");
    // Code to be executed when the mouse button is released over the element
		setTimeout(function(){
      	nameExchange();
		},1000);
	});
}


// wait for ajax load before parsing eChart (OSCAR, OpenO, Well)
waitForKeyElements("#labslist a.links", startIt);

// wait for ajax load before parsing consultation requests (OSCAR)
waitForKeyElements(".lab", startIt);

// wait for ajax load before parsing OSCAR Inbox
waitForKeyElements("#summaryView", startIt);

function nameExchange() {
    jQuery("#labslist a.links").each(function() {  //eChart
      jQuery(this).html( processLabName(jQuery(this).html()) );
		});
    jQuery(".text").each(function() {  // OSCAR
      jQuery(this).html( processLabName(jQuery(this).html()) );
		}); 
    jQuery("li.lab").each(function() {  // OSCAR consults
      jQuery(this).html( processLabName3(jQuery(this).html()) );
		});
    jQuery("#summaryView tr td:nth-child(8)").each(function() {  // OSCAR inbox
      jQuery(this).html( processLabName(jQuery(this).html()) );
		});
}

function processLabName(strTestName) {
	theNames=strTestName.split('/');
	if(theNames.length>1)	{ 
		var thePhrase=renameTheLab(theNames[0]);
		for(var name_id=1; name_id < theNames.length; name_id++) {
				thePhrase+='/';
				thePhrase+=renameTheLab(theNames[name_id]);			
			}
    return thePhrase;
  } else {
  	return renameTheLab(strTestName); 
  } 
}

function processLabName3(strTestName) {
	theNames=strTestName.split(' ');
	if(theNames.length>1)	{ 
		var thePhrase=renameTheLab(theNames[0]);
		for(var name_id=1; name_id < theNames.length; name_id++) {
				thePhrase+=' ';
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
		case 'CHEM17':
			strNewName='CRP';
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
		case 'CARDIOPDF':
			strNewName='ECG';
			break;
		default:
			break;
	}
  if (strNewName != strOldName) { console.log(strOldName+"=>"+strNewName); }
	return strNewName;
}
