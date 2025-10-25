// ==UserScript==
// @name           Lab Reheader AV
// @namespace      Phcscript
// @version        1.1
// @description    Replaces Lab Headers with Human readable ones
// @include        *av/echart*
// @include        *av/providerinbox/inbox*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==


jQuery.noConflict();

jQuery(document).ready(function() {
	setTimeout(function(){
   
    nameExchange();
    
    jQuery("i.material-icons-outlined.cursor-pointer").mouseup(function() {
    // Code to be executed when the mouse button is released over the element
      setTimeout(function(){
      	nameExchange();
      },1000);
    });

	},3000);
});

function nameExchange() {
    jQuery('[data-rbd-draggable-id="labs"]').find("div.word-break-all").each(function() {
  	// 'this' refers to each descendant div with 'word-break-all'
      jQuery(this).html(processLabName(jQuery(this).text()));
      //console.log(jQuery(this).text());
		});
    jQuery("div.truncate-row-by-width").each(function() {
  	// 'this' refers to each descendant div with 'word-break-all'
      jQuery(this).html(processLabName(jQuery(this).text()));
      //console.log(jQuery(this).text());
		});  
  
}

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
	switch(strOldName)
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
		case 'MICRO11':
			strNewName='Fungus';
			break;
		case 'REFER2':
			strNewName='HepHIVSer';
			break;

		//Use an uncommentted copy of the following 3 lines for each test name you want to map
		//case 'USER_UNFRIENDLY_TEST_NAME':
		//strNewName='USER_FRIENDLY_TEST_NAME';
		//break;
		default:
			break;
	}
  if (strNewName != strOldName) { console.log(strOldName+"=>"+strNewName); }
	return strNewName;
}



