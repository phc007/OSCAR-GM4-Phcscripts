// ==UserScript==
// @name     Lab Display Macro Menu PHC
// @version  1
// @namespace Phcscript
// @grant    none
// @include *av/providerinbox/inbox*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==


// Create a new div to hold the dropdown
const menuContainer = document.createElement('div');
menuContainer.id = 'myGreasemonkeyMenu';
menuContainer.setAttribute("style", "font-size:12px;position:fixed;top:30px;left:1120px;");

// Create the select element
const dropdown = document.createElement('select');
dropdown.id = 'myFunctionDropdown';

// Create options for the dropdown
const option0 = document.createElement('option');
option0.value = 'function1';
option0.textContent = 'Macro';

const option1 = document.createElement('option');
option1.value = 'function1';
option1.textContent = 'Normal';

const option2 = document.createElement('option');
option2.value = 'function2';
option2.textContent = 'Stable';

const option3 = document.createElement('option');
option3.value = 'function3';
option3.textContent = 'Improving';

const option4 = document.createElement('option');
option4.value = 'function4';
option4.textContent = 'Incomplete';

const option5 = document.createElement('option');
option5.value = 'function5';
option5.textContent = 'Rx';

const option6 = document.createElement('option');
option6.value = 'function6';
option6.textContent = 'ER';

const option7 = document.createElement('option');
option7.value = 'function7';
option7.textContent = 'Inpatient';

const option8 = document.createElement('option');
option8.value = 'function8';
option8.textContent = 'Consultant';

// Append options to the dropdown
dropdown.appendChild(option0);
dropdown.appendChild(option1);
dropdown.appendChild(option2);
dropdown.appendChild(option3);
dropdown.appendChild(option4);
dropdown.appendChild(option5);
dropdown.appendChild(option6);
dropdown.appendChild(option7);
dropdown.appendChild(option8);

// Append the dropdown to the container
menuContainer.appendChild(dropdown);

// Find a suitable place to insert the menu on the page
document.body.appendChild(menuContainer);


// Define the functions
function ButtonFunction1(){
  jQuery('textarea:first').attr("id", "myId");
    //jQuery('textarea:first').val("first");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Normal");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
   },500);
}

function ButtonFunction2(){
  jQuery('textarea:first').attr("id", "myId");
    //jQuery('textarea:first').val("first");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Stable");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
   },500);
}

function ButtonFunction3(){
  jQuery('textarea:first').attr("id", "myId");
    //jQuery('textarea:first').val("first");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Improving");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
   },500);
}

function ButtonFunction4(){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Incomplete");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
    },500);
}

function ButtonFunction5(){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Rx reviewed and request granted");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
    },500);
}

function ButtonFunction6(){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Hospital Emergency Patient");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
    },500);
}

function ButtonFunction7(){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Hospital Inpatient");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
    },500);
}

function ButtonFunction8(){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Consultant ordered and followed");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
    },500);
}

// Get a reference to the dropdown element
const myFunctionDropdown = document.getElementById('myFunctionDropdown');

// Add an event listener to the dropdown
myFunctionDropdown.addEventListener('change', function() {
    const selectedFunction = this.value;

    if (selectedFunction === 'function1') {
        ButtonFunction1();
    } else if (selectedFunction === 'function2') {
        ButtonFunction2();
    } else if (selectedFunction === 'function3') {
        ButtonFunction3();
    } else if (selectedFunction === 'function4') {
        ButtonFunction4();
    } else if (selectedFunction === 'function5') {
        ButtonFunction5();
    } else if (selectedFunction === 'function6') {
        ButtonFunction6();
    } else if (selectedFunction === 'function7') {
        ButtonFunction7();
    } else if (selectedFunction === 'function8') {
        ButtonFunction8();
    }
   revertSelection();
});

function revertSelection(){
    const mySelect = document.getElementById("myFunctionDropdown");

    // Set the value of the select element to the value of the desired option
  setTimeout(function(){
          mySelect.value = "function1";
      },500);

}

// events to trigger a real change in react
(function($) {

    $.fn.trigger2 = function(eventName) {
        return this.each(function() {
            var el = $(this).get(0);
            triggerNativeEvent(el, eventName);
        });
    };

    function triggerNativeEvent(el, eventName){
      if (el.fireEvent) { // < IE9
        (el.fireEvent('on' + eventName));
      } else {
        var evt = document.createEvent('Events');
        evt.initEvent(eventName, true, false);
        el.dispatchEvent(evt);
      }
}

}(jQuery));
