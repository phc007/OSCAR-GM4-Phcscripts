// ==UserScript==
// @name        BMI and SI to English converter
// @author		Peter Hutten-Czapski
// @description Calculates BMI and WHtR, converts kg/lb, cm/ft-in and waist inches/cm. Uses prior height when current HT is blank.
// @version     1.5
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

            // Find measurements by hidden inputType, not row number.
            function findMeasurement(type) {
                var result = null;

                $(form).find('input[name]').each(function () {
                    var match = this.name.match(
                        /^value\(inputType-(\d+)\)$/
                    );

                    if (!match || $.trim($(this).val()) !== type) {
                        return;
                    }

                    var rowNumber = match[1];
                    var $input = $(form).find(
                        'input[name="value(inputValue-' +
                        rowNumber + ')"]'
                    ).first();

                    if (!$input.length) {
                        return;
                    }

                    result = {
                        type: type,
                        row: rowNumber,
                        input: $input,
                        rowElement: $input.closest('tr'),
                        comment: $(form).find(
                            'input[name="value(comments-' +
                            rowNumber + ')"]'
                        ).first()
                    };

                    return false;
                });

                return result;
            }

            var height = findMeasurement('HT');
            var weight = findMeasurement('WT');
            var bmi = findMeasurement('BMI');
            var waist = findMeasurement('WAIS');
            var waistHeight = findMeasurement('WHTR');

            var blue = {
                'background-color': '#d9e6f2'
            };

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

            function rawValue(measurement) {
                return measurement
                    ? $.trim(String(measurement.input.val() || ''))
                    : '';
            }

            function readPositive(measurement) {
                var value = rawValue(measurement);

                if (value === '' || !$.isNumeric(value)) {
                    return null;
                }

                value = Number(value);

                return isFinite(value) && value > 0
                    ? value
                    : null;
            }

            // Find the historical value in the note row immediately
            // following the HT measurement row. Stop before the next
            // measurement, so a later measurement's history is not used.
            function getPriorHeightCm() {
                if (!height || !height.rowElement.length) {
                    return null;
                }

                var $row = height.rowElement.next();
                var $history = $();

                while ($row.length && !$row.hasClass('data')) {
                    if ($row.hasClass('note')) {
                        var label = $.trim(
                            $row.children('td').eq(0).text()
                        );

                        if (/the last value/i.test(label)) {
                            $history = $row;
                            break;
                        }
                    }

                    $row = $row.next();
                }

                if (!$history.length) {
                    return null;
                }

                var $cells = $history.children('td');

                if ($cells.length < 3) {
                    return null;
                }

                var units = $.trim($cells.eq(1).text()).toLowerCase();
                var valueText = $.trim($cells.eq(2).text());

                // Do not use empty, non-numeric, or non-positive history.
                if (valueText === '' || !$.isNumeric(valueText)) {
                    return null;
                }

                var value = Number(valueText);

                if (!isFinite(value) || value <= 0) {
                    return null;
                }

                return isFinite(value) && value > 0 ? value : null;
            }

            // Resolve height for calculations:
            // 1. A non-empty current HT value always takes precedence.
            // 2. Only a blank current HT field permits historical fallback.
            // 3. Accept feet/inches notation as well as numeric centimetres.
            function getHeightCm() {
                if (!height) {
                    return null;
                }

                var current = rawValue(height);

                if (current !== '') {
                    if ($.isNumeric(current)) {
                        var cm = Number(current);

                        return isFinite(cm) && cm > 0 ? cm : null;
                    }

                    var match = current.match(
                        /^\s*(\d+)\s*'\s*(?:(\d+)\s*"?\s*)?$/
                    );

                    if (match) {
                        var feet = Number(match[1]);
                        var inches = match[2] === undefined
                            ? 0
                            : Number(match[2]);

                        if (inches >= 12) {
                            return null;
                        }

                        var convertedCm =
                            feet * 30.48 + inches * 2.54;

                        return isFinite(convertedCm) &&
                               convertedCm > 0
                            ? convertedCm
                            : null;
                    }

                    // Non-empty but invalid current entry:
                    // do not silently substitute an old height.
                    return null;
                }

                // Current HT is blank: use the previous height if available.
                return getPriorHeightCm();
            }

            function setCalculated(measurement, value, digits) {
                if (!measurement) {
                    return;
                }

                if (value === null ||
                    !isFinite(value) ||
                    value <= 0) {
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
                var cm = getHeightCm();

                if (kg === null || cm === null) {
                    bmi.input.val('');
                    return;
                }

                setCalculated(
                    bmi,
                    kg / Math.pow(cm / 100, 2),
                    1
                );
            }

            // Waist-to-height ratio; both measurements in cm.
            function calcWaistHeightRatio() {
                if (!waistHeight) {
                    return;
                }

                var waistCm = readPositive(waist);
                var heightCm = getHeightCm();

                if (waistCm === null || heightCm === null) {
                    waistHeight.input.val('');
                    return;
                }

                setCalculated(
                    waistHeight,
                    waistCm / heightCm,
                    2
                );
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

                var kg = Math.round(
                    pounds * 0.45359237 * 10
                ) / 10;

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
                var value = rawValue(height);
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
                    setComment(
                        waist,
                        (cm / 2.54).toFixed(1) + ' inches'
                    );
                }
            }

            // Waist inches -> centimetres on double-click.
            function waistEnglishToMetric() {
                var inches = readPositive(waist);

                if (inches === null) {
                    return;
                }

                var cm = Math.round(
                    inches * 2.54 * 10
                ) / 10;

                if (confirm(
                    'Convert ' + inches + ' inches to ' + cm + ' cm?'
                )) {
                    waist.input.val(cm);
                    convertWaistComment();
                    updateCalculations();
                }
            }

            // Highlight editable conversion fields and calculated fields.
            highlight(height);
            highlight(weight);
            highlight(waist);
            highlight(bmi);
            highlight(waistHeight);

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
                height.input.on('input', updateCalculations);

                height.input.on('change', function () {
                    convertHeightComment();
                    updateCalculations();
                });

                height.input.on('dblclick', heightEnglishToMetric);

                height.input.attr(
                    'title',
                    'Double-click to convert feet/inches to centimetres. ' +
                    'When blank, the previous height is used for calculations.'
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
                bmi.input.attr(
                    'title',
                    'Automatically calculated BMI'
                );
            }

            if (waistHeight) {
                waistHeight.input.attr(
                    'title',
                    'Automatically calculated waist-to-height ratio'
                );
            }

            // Initial calculations also use historical height if HT is blank.
            updateCalculations();

            console.info('[OSCAR converter] Initialized:', {
                height: !!height,
                weight: !!weight,
                bmi: !!bmi,
                waist: !!waist,
                waistHeightRatio: !!waistHeight,
                priorHeightCm: getPriorHeightCm()
            });
        });
    }

    initialize();
})();
