// ==UserScript==
// @name           EChart_KeyboardShortcuts AV
// @namespace      Phcscript
// @version        1.3
// @description Various Echart shortcut buttons (Alt+ p,t,d,l,c,m,a,r,x,o).
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/eChartKeyboardShortcutsAV.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/eChartKeyboardShortcutsAV.js
// @include        *av/echart*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==


jQuery.noConflict();

jQuery(document).ready(function() {
	setTimeout(function(){
    // identify areas where an alt function causes an effect
    jQuery('[data-rbd-draggable-id="preventions"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>P</u>revention');
    jQuery('[data-rbd-draggable-id="ticklers"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>T</u>ickler');
    jQuery('[data-rbd-draggable-id="disease_registry"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>D</u>isease Registry');
    jQuery('[data-rbd-draggable-id="consultations"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>C</u>onsultation');
    jQuery('[data-rbd-draggable-id="medications"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('Medication <u>Rx</u>');
    jQuery('[data-rbd-draggable-id="measurements"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>M</u>easurement');
    jQuery('[data-rbd-draggable-id="documents"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('D<u>o</u>cuments');
    jQuery('[data-rbd-draggable-id="allergies"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>A</u>llergy');
    jQuery("span:contains('New Note')").html('<u>N</u>ew Note');
	},3000);
});


document.addEventListener('keydown', function(e) {
    // keys Alt + b e f v s b t h are reserved for Firefox
    // keys g j k p q s u w y z are available to add to the below
  
    if (e.code === 'KeyP' && e.altKey) {
    	console.log('Alt + P was pressed!'); 
      jQuery('[data-rbd-draggable-id="preventions"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    }
    if (e.code === 'KeyT' && e.altKey) {
      console.log('Alt + T was pressed!'); 
      jQuery('[data-rbd-draggable-id="ticklers"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    }
    if (e.code === 'KeyD' && e.altKey) {
      console.log('Alt + D was pressed!'); 
      jQuery('[data-rbd-draggable-id="disease_registry"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    } 
    if (e.code === 'KeyC' && e.altKey) {
      console.log('Alt + C was pressed!'); 
      jQuery('[data-rbd-draggable-id="consultations"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    }
    if (e.code === 'KeyM' && e.altKey) {
      console.log('Alt + M was pressed!'); 
      jQuery('[data-rbd-draggable-id="measurements"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span').trigger('click');
    }
    if (e.code === 'KeyA' && e.altKey) {
      console.log('Alt + A was pressed!'); 
      jQuery('[data-rbd-draggable-id="allergies"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    }
    if (e.code === 'KeyR' && e.altKey) {
      console.log('Alt + R was pressed! for Renewing all Rx'); 
      jQuery('[data-rbd-draggable-id="medications"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    }
    if (e.code === 'KeyX' && e.altKey) {
      console.log('Alt + X was pressed! for new Rx'); 
      jQuery('[data-rbd-draggable-id="medications"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').trigger('click');
    }
    if (e.code === 'KeyO' && e.altKey) {
      console.log('Alt + O was pressed!'); 
      jQuery('[data-rbd-draggable-id="documents"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');       
    }
  
  	// New Note
    if (e.code === 'KeyN' && e.altKey) {
      console.log('Alt + N was pressed!'); 
      jQuery("div:has(span:contains('New Note'))").trigger('click');             
    }

  	// CDM Indicators
    if (e.code === 'KeyJ' && e.altKey) {
      console.log('Alt + J was pressed!'); 
      jQuery('[data-rbd-draggable-id="measurements"] > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').trigger('click');

    }  
  
  	// a given measurement group - you can substitute your desired measurement group title for "vitals"
    if (e.code === 'KeyI' && e.altKey) {
      console.log('Alt + I was pressed!'); 
      jQuery('[data-rbd-draggable-id="measurements"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span').trigger('click');
      setTimeout(function(){
      	jQuery('div.measurement-group-item:contains("vitals")').trigger('click');   
      },500);
    }  
 
  
  	// eforms
    if ((e.code === 'Digit1' || e.code === 'Numpad1') && e.altKey) {
    	console.log('Alt + 1 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("1.")').trigger('click');  // you can substitute your desired eform title for 1. here
      },500);
    }
    if ((e.code === 'Digit2' || e.code === 'Numpad2') && e.altKey) {
    	console.log('Alt + 2 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("2.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit3' || e.code === 'Numpad3') && e.altKey) {
    	console.log('Alt + 3 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("3.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit4' || e.code === 'Numpad4') && e.altKey) {
    	console.log('Alt + 4 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("4.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit5' || e.code === 'Numpad5') && e.altKey) {
    	console.log('Alt + 5 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("5.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit6' || e.code === 'Numpad6') && e.altKey) {
    	console.log('Alt + 6 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("6.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit7' || e.code === 'Numpad7') && e.altKey) {
    	console.log('Alt + 7 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("7.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit8' || e.code === 'Numpad8') && e.altKey) {
    	console.log('Alt + 8 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("8.")').trigger('click');
      },500);
    }
    if ((e.code === 'Digit9' || e.code === 'Numpad9') && e.altKey) {
    	console.log('Alt + 9 was pressed!'); 
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      setTimeout(function(){
      	jQuery('.truncate-row-1:contains("9.")').trigger('click');
      },500);
    }
  
 
});



/*
			// formats for unused "+"
 
      jQuery('[data-rbd-draggable-id="risk_factors"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="other_meds"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="labs"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="social_history"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="medical_history"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="ongoing_concerns"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="reminders"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="messenger"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');    
      jQuery('[data-rbd-draggable-id="family_history"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="labs"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="econsults"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="disease_registry"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="forms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');


 */



