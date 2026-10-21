// ==UserScript==
// @name        BMI and SI to English converter
// @author		Peter Hutten-Czapski
// @description Calculates BMI, WHtR and Converts from kg to lb, cm to in.  Currently works in most OSCAR forks
// @version     1.4
// @namespace   Phcscript
// @updateURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/WtHtBMI.user.js
// @downloadURL https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/WtHtBMI.user.js
// @include     *oscarEncounter/oscarMeasurements/SetupMeasurements.do?*
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none

// ==/UserScript==

(function () {
    'use strict';

    function initialize() {
        if (!window.jQuery) {
            window.setTimeout(initialize, 100);
            return;
        }

        var $ = window.jQuery;

        $(function () {
            var form = document.getElementById('theForm') || document;

            // Discover a measurement using its hidden inputType field.
            // The row number may be different on every OSCAR page.
            function findMeasurement(type) {
                var result = null;

                $(form).find('input[name]').each(function () {
                    var match = this.name.match(
                        /^value\(inputType-(\d+)\)$/
                    );

                    if (!match || $.trim($(this).val()) !== type) {
                        return;
                    }

                    var row = match[1];
                    var $value = $(form).find(
                        'input[name="value(inputValue-' + row + ')"]'
                    ).first();

                    if (!$value.length) {
                        return;
                    }

                    result = {
                        type: type,
                        row: row,
                        input: $value,
                        comment: $(form).find(
                            'input[name="value(comments-' + row + ')"]'
                        ).first()
                    };

                    return false;
                });

                return result;
            }

            // Only the fields actually present on the page are returned.
            var height = findMeasurement('HT');
            var weight = findMeasurement('WT');
            var bmi = findMeasurement('BMI');
            var waist = findMeasurement('WAIS');
            var waistHeight = findMeasurement('WHTR');

            var blue = { 'background-color': '#d9e6f2' };

            function highlight(measurement) {
                if (measurement && measurement.input.length) {
                    measurement.input.css(blue);
                }
            }

            function setComment(measurement, text) {
                if (measurement && measurement.comment.length) {
                    measurement.comment.val(text);
                }
            }

            function readPositive(measurement) {
                if (!measurement) {
                    return null;
                }

                var value = $.trim(measurement.input.val());

                if (value === '' || !$.isNumeric(value)) {
                    return null;
                }

                value = Number(value);

                return isFinite(value) && value > 0 ? value : null;
            }

            function setCalculated(measurement, value, digits) {
                if (!measurement) {
                    return;
                }

                if (value === null || !isFinite(value) || value <= 0) {
                    measurement.input.val('');
                    return;
                }

                measurement.input.val(value.toFixed(digits));
                highlight(measurement);
            }

            // BMI = weight in kg / height in metres squared.
            function calcBMI() {
                if (!bmi) {
                    return;
                }

                var kg = readPositive(weight);
                var cm = readPositive(height);

                if (kg === null || cm === null) {
                    bmi.input.val('');
                    return;
                }

                setCalculated(bmi, kg / Math.pow(cm / 100, 2), 1);
            }

            // Waist-to-height ratio: both measurements must use the same units.
            function calcWaistHeightRatio() {
                if (!waistHeight) {
                    return;
                }

                var waistCm = readPositive(waist);
                var heightCm = readPositive(height);

                if (waistCm === null || heightCm === null) {
                    waistHeight.input.val('');
                    return;
                }

                setCalculated(waistHeight, waistCm / heightCm, 2);
            }

            function updateCalculations() {
                calcBMI();
                calcWaistHeightRatio();
            }

            // Pounds -> kilograms on double-click.
            function weightEnglishToMetric() {
                var pounds = readPositive(weight);

                if (pounds === null) {
                    return;
                }

                var kg = Math.round(pounds * 0.45359237 * 10) / 10;

                if (confirm(
                    'Convert ' + pounds + ' pounds to ' + kg + ' kg?'
                )) {
                    weight.input.val(kg);
                    convertWeightComment();
                    updateCalculations();
                }
            }

            // Feet/inches -> centimetres on double-click.
            function heightEnglishToMetric() {
                var value = $.trim(height.input.val());
                var match = value.match(
                    /^\s*(\d+)\s*'\s*(?:(\d+)\s*"?\s*)?$/
                );

                if (!match) {
                    return;
                }

                var feet = Number(match[1]);
                var inches = match[2] === undefined
                    ? 0
                    : Number(match[2]);

                if (inches >= 12) {
                    alert('Please enter inches from 0 to 11.');
                    return;
                }

                var cm = Math.round(
                    (feet * 30.48 + inches * 2.54) * 10
                ) / 10;

                if (confirm(
                    'Convert ' + feet + ' ft ' + inches +
                    ' in to ' + cm + ' cm?'
                )) {
                    height.input.val(cm);
                    convertHeightComment();
                    updateCalculations();
                }
            }

            // Centimetres -> English units in the comment field.
            function convertWeightComment() {
                var kg = readPositive(weight);

                if (kg !== null) {
                    setComment(
                        weight,
                        (kg * 2.20462262).toFixed(0) + ' lbs'
                    );
                }
            }

            function convertHeightComment() {
                var cm = readPositive(height);

                if (cm === null) {
                    return;
                }

                var totalInches = cm / 2.54;
                var roundedInches = Math.round(totalInches);
                var feet = Math.floor(roundedInches / 12);
                var inches = roundedInches % 12;

                setComment(
                    height,
                    totalInches.toFixed(1) + ' inches or ' +
                    feet + ' ft ' + inches + ' in'
                );
            }

            function convertWaistComment() {
                var cm = readPositive(waist);

                if (cm !== null) {
                    setComment(waist, (cm / 2.54).toFixed(1) + ' inches');
                }
            }

            // Waist inches -> centimetres on double-click.
            function waistEnglishToMetric() {
                var inches = readPositive(waist);

                if (inches === null) {
                    return;
                }

                var cm = Math.round(inches * 2.54 * 10) / 10;

                if (confirm(
                    'Convert ' + inches + ' inches to ' + cm + ' cm?'
                )) {
                    waist.input.val(cm);
                    convertWaistComment();
                    calcWaistHeightRatio();
                }
            }

            // Highlight only the calculated fields that exist.
            highlight(bmi);
            highlight(waistHeight);

            // Register handlers only for measurements that exist.
            if (weight) {
                weight.input.on('input', calcBMI);
                weight.input.on('change', function () {
                    convertWeightComment();
                    calcBMI();
                });
                weight.input.on('dblclick', weightEnglishToMetric);
                weight.input.attr(
                    'title',
                    'Double-click to convert pounds to kilograms'
                );
            }

            if (height) {
                height.input.on('input', function () {
                    calcBMI();
                    calcWaistHeightRatio();
                });

                height.input.on('change', function () {
                    convertHeightComment();
                    updateCalculations();
                });

                height.input.on('dblclick', heightEnglishToMetric);
                height.input.attr(
                    'title',
                    'Double-click to convert feet/inches to centimetres'
                );
            }

            if (waist) {
                waist.input.on('input', calcWaistHeightRatio);

                waist.input.on('change', function () {
                    convertWaistComment();
                    calcWaistHeightRatio();
                });

                waist.input.on('dblclick', waistEnglishToMetric);
                waist.input.attr(
                    'title',
                    'Double-click to convert inches to centimetres'
                );
            }

            if (bmi) {
                bmi.input.attr('title', 'Automatically calculated BMI');
            }

            if (waistHeight) {
                waistHeight.input.attr(
                    'title',
                    'Automatically calculated waist-to-height ratio'
                );
            }

            // Calculate initial values if the relevant inputs are available.
            updateCalculations();

            console.info('[OSCAR converter] Initialized:', {
                height: !!height,
                weight: !!weight,
                bmi: !!bmi,
                waist: !!waist,
                waistHeightRatio: !!waistHeight
            });
        });
    }

    initialize();
})();
