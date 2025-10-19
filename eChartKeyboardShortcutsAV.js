// ==UserScript==
// @name           EChart_KeyboardShortcuts AV
// @namespace      Phcscript
// @version        1
// @description Various Echart shortcut buttons (Alt+ p,t,d,c,m,a,r,x,o).
// @include        *av/echart*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==


jQuery.noConflict();

jQuery(document).ready(function() {
	setTimeout(function(){
    // identify areas where an alt function causes an effect
    jQuery('[data-rbd-draggable-id="preventions"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>P</u>REVENTION');
    jQuery('[data-rbd-draggable-id="ticklers"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>T</u>ICKLER');
    jQuery('[data-rbd-draggable-id="disease_registry"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>D</u>ISEASE REGISTRY');
    jQuery('[data-rbd-draggable-id="consultations"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>C</u>ONSULTATION');
    jQuery('[data-rbd-draggable-id="medications"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('MEDICATION <u>Rx</u>');
    jQuery('[data-rbd-draggable-id="documents"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('D<u>O</u>CUMENTS');
    jQuery('[data-rbd-draggable-id="allergies"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').html('<u>A</u>LLERGY');
	},3000);
});

document.addEventListener('keydown', function(e) {
    // keys Alt + b e f v s b t h are reserved for Firefox
    // keys g i j k n p q s u v w y z are available to add to the below
  
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
      jQuery('[data-rbd-draggable-id="measurements"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
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

});


/*
 
      jQuery('[data-rbd-draggable-id="risk_factors"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');
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
      jQuery('[data-rbd-draggable-id="eforms"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').trigger('click');

 */


