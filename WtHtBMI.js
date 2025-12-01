// ==UserScript==
// @name        BMI and SI to English converter
// @description Calculates BMI, Converts from kg to lb, cm to in.
// @version     1.1
// @namespace   Phcscript
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/WtHtBMI.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/WtHtBMI.js
// @include     *oscarEncounter/oscarMeasurements/SetupMeasurements.do?*
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none

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


addGlobalStyle('.note { font-size: 10px ! important; background-color: #D3D3D3 ! important;}');
addGlobalStyle('.data { font-size: 12px ! important; background-color: white ! important;}');


var $wtRowLabel = $('td:contains("WT")');
var $wtInput = $wtRowLabel.next('td').next('td').find('input');
$wtInput.css("background-color","#d9e6f2");
$wtInput.attr("title","double click to convert to kg");


var $htRowLabel = $('td:contains("HT")');
var $htInput = $htRowLabel.next('td').next('td').find('input');
$htInput.css("background-color","#d9e6f2");
$htInput.attr("title","double click to convert feet'inches to cm");

var $bmiRowLabel = $('td:contains("Body Mass Index")');
var $bmiInput = $bmiRowLabel.next('td').next('td').find('input');

if($wtInput.length && $htInput.length && $bmiInput.length){
  $wtInput.keyup(function(){
    calcBMI( $(this).val(),$htInput.val() );
  });

  $htInput.keyup(function(){
    calcBMI( $wtInput.val(),$(this).val() );
  });  

}

function calcBMI(w,h) {
  b = '';
  if ( $.isNumeric(w) && $.isNumeric(h) && h!=="" && w!=="" ) {
    if (h > 0) {
      b = (w/Math.pow(h/100,2)).toFixed(1);
      if ( $bmiInput.length ) {
        $bmiInput.val(b);
        $bmiInput.css("background-color","#d9e6f2");
      }
    }
   }
}

function wtEnglish2Metric($obj) {
		if( $obj.length && $.isNumeric($obj.val()) ) {
			weight = $obj.val();
			weightM = Math.round(weight * 10 * 0.4536) / 10 ;
			if(confirm("Are you sure you want to change " + weight + " pounds to " + weightM +"kg?") ) {
				$obj.val(weightM);
			}
		}
}

function htEnglish2Metric($obj) {
		height = $obj.val();
		if(height.length > 1 && height.indexOf("'") > 0 ) {
			feet = height.substring(0, height.indexOf("'"));
			inch = height.substring(height.indexOf("'"));
			if(inch.length == 1) {
				inch = 0;
			} else {
				inch = inch.charAt(inch.length-1)=='"' ? inch.substring(0, inch.length-1) : inch;
				inch = inch.substring(1);
			}
			height = Math.round((feet * 30.48 + inch * 2.54) * 10) / 10 ;
			if(confirm("Are you sure you want to change " + feet + " feet " + inch + " inch(es) to " + height +"cm?") ) {
				$obj.val(height);
			}
		}
}

function Convertwt(){
  if($wtInput.length && $.isNumeric($wtInput.val())){
        vWTlb = (Number($wtInput.val())*2.2).toFixed(0);
        var $wtRowComment = $wtRowLabel.next('td').next('td').next('td').next('td').find('input');
        $wtRowComment.val(+vWTlb+ " lbs");
  }
}

function Convertht(){
  if($htInput.length && $.isNumeric($htInput.val())){
        vHTin = (Number($htInput.val())/2.54).toFixed(1);
        var realFeet = vHTin/12;
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        var $htRowComment = $htRowLabel.next('td').next('td').next('td').next('td').find('input');
        $htRowComment.val(+vHTin+" inches"+" or "+ feet + " ft "+inches + " in");
  }
}


$wtInput.change(Convertwt);
$wtInput.dblclick(function() {
    wtEnglish2Metric($wtInput);
    $wtInput.trigger("keyup");
  	Convertwt();
  });
$htInput.change(Convertht);
$htInput.dblclick(function() {
    htEnglish2Metric($htInput);
  	$htInput.trigger("keyup");
  	Convertht();
  });
