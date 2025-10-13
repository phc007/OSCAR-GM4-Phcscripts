// ==UserScript==
// @name     Lab Display Buttons PHC
// @version  1
// @namespace Phcscript
// @grant    none
// @include *av/providerinbox/inbox*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

jQuery.noConflict();

const menuContainer = document.createElement('div');
menuContainer.id = 'myGreasemonkeyButtons';
menuContainer.setAttribute("style", "font-size:12px;position:fixed;top:8px;left:1120px;");

//========Buttons============
var input1=document.createElement("input");
input1.type="button";
input1.value="Normal";
input1.onclick = ButtonFunction1;
input1.setAttribute("style", "font-size:12px;padding: 2px; margin-right: 3px;");
input1.setAttribute("title", "Normal");
menuContainer.appendChild(input1);
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

var input2=document.createElement("input");
input2.type="button";
input2.value="Stable";
input2.onclick = ButtonFunction2;
input2.setAttribute("style", "font-size:12px;padding: 2px; margin-right: 3px;");
input2.setAttribute("title", "Stable");
menuContainer.appendChild(input2);
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

var input3=document.createElement("input");
input3.type="button";
input3.value="Improving";
input3.onclick = ButtonFunction3;
input3.setAttribute("style", "font-size:12px;padding: 2px; margin-right: 3px;");
input3.setAttribute("title", "Improving");
menuContainer.appendChild(input3);
function ButtonFunction3(){
  jQuery('textarea:first').attr("id", "myId");
    //jQuery('textarea:first').val("first");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Abnormal but improving");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
   },500);
}

var input4=document.createElement("input");
input4.type="button";
input4.value="Partial";
input4.onclick = ButtonFunction4;
input4.setAttribute("style", "font-size:12px;padding: 2px; margin-right: 3px;");
input4.setAttribute("title", "Incomplete");
menuContainer.appendChild(input4);
function ButtonFunction4(){
  jQuery('textarea:first').attr("id", "myId");
    jQuery('#acknowledge-dropdown-trigger').click();
    setTimeout(function(){
         jQuery('textarea:not(#myId)').val("Incomplete result");
        jQuery('textarea:not(#myId)').trigger2("change");
      setTimeout(function(){
          jQuery('#acknowledge-trigger').click();
      },500);
    },500);
}

var input5=document.createElement("input");
input5.type="button";
input5.value="Rx";
input5.onclick = ButtonFunction5;
input5.setAttribute("style", "font-size:12px;padding: 2px; margin-right: 3px;");
input5.setAttribute("title", "Rx request approved");
menuContainer.appendChild(input5);
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

var input6=document.createElement("input");
input6.type="button";
input6.value="ER";
input6.onclick = ButtonFunction6;
input6.setAttribute("style", "font-size:12px;padding: 2px; margin-right: 3px;");
input6.setAttribute("title", "ER patient");
menuContainer.appendChild(input6);
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

var input7=document.createElement("input");
input7.type="button";
input7.value="H";
input7.onclick = ButtonFunction7;
input7.setAttribute("style", "font-size:12px;padding: 2px;");
input7.setAttribute("title", "Hospital patient");
menuContainer.appendChild(input7);
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


var input8=document.createElement("input");
input8.type="button";
input8.value="Consultant";
input8.onclick = ButtonFunction7;
input8.setAttribute("style", "font-size:12px;padding: 2px;");
input8.setAttribute("title", "Specialist managed patient");
menuContainer.appendChild(input8);
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
// Find a suitable place to insert the menu on the page
document.body.appendChild(menuContainer);

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
