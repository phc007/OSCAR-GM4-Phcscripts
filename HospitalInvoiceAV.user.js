
// ==UserScript==
// @name         Avaros Hospital Invoice Helper
// @namespace    https://app.avaros.ca/
// @version      2.3.1
// @author       Peter Hutten-Czapski
// @icon         https://www.google.com/s2/favicons?sz=64&domain=avaros.ca
// @description  Admission date calculator and hospital billing automation
// @match        https://app.avaros.ca/av/billing2/invoice*
// @updateURL 	   https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/HospitalInvoiceAV.user.js
// @downloadURL	   https://raw.githubusercontent.com/phc007/OSCAR-GM4-Phcscripts/refs/heads/main/HospitalInvoiceAV.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const PREFIX = '[Avaros Helper]';

    const log = (...args) => console.log(PREFIX, ...args);
    const warn = (...args) => console.warn(PREFIX, ...args);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // ==================================================
    // CONFIGURATION
    // ==================================================

    const TASKS = [
        {
            label: 'Visit Type',
            id: 'visit-type-select',
            search: 'Hospital visit'
        },
        {
            label: 'Location',
            search: 'Temiskaming Hospital'
        },
        {
            label: 'SLI Code',
            search: 'Hospital In-Patient'
        },
        {
            label: 'Billing Form',
            id: 'billing-form-select',
            search: 'Inpatients'
        }
    ];

    // ==================================================
    // A. ADMISSION DATE
    // ==================================================

    let admissionInput = null;
    let admissionObserver = null;
    let admissionTimer = null;

    function findAdmissionInput() {

        const labels = Array.from(
            document.querySelectorAll('label')
        );

        for (const label of labels) {

            if (
                label.textContent.trim() !== 'Admission Date'
            ) continue;

            const container = label.closest(
                '.MuiFormControl-root'
            );

            if (!container) continue;

            const candidates = Array.from(
                container.querySelectorAll(
                    'input[placeholder="YYYY-MM-DD"]'
                )
            );

            log(
                'Admission input candidates:',
                candidates.map(input => ({
                    id: input.id,
                    value: input.value,
                    attribute: input.getAttribute('value'),
                    visible: input.getClientRects().length > 0,
                    disabled: input.disabled
                }))
            );

            const visible = candidates.find(input =>
                input.getClientRects().length > 0 &&
                !input.disabled
            );

            if (visible) return visible;

            if (candidates.length) return candidates[0];
        }

        return null;
    }

    function updateAdmissionDate() {

        const input = admissionInput || findAdmissionInput();

        if (!input || !input.isConnected) return;

        const container = input.closest(
            '.MuiFormControl-root'
        );

        if (!container) return;

        let indicator = container.querySelector(
            '.avaros-admission-elapsed'
        );

        if (!indicator) {

            indicator = document.createElement('span');

            indicator.className =
                'avaros-admission-elapsed';

            indicator.style.cssText = `
                display:block;
                margin-top:5px;
                padding:5px 9px;
                background:#e3f2fd;
                color:#1565c0;
                border-radius:4px;
                font-size:13px;
                font-weight:600;
                width:fit-content;
            `;

            container.appendChild(indicator);

            log('Admission Date indicator installed.');
        }

        // Always read the live input value.
        const value = input.value.trim();

        // Avoid flooding the console with identical messages.
        if (input.dataset.avarosLastValue !== value) {
            input.dataset.avarosLastValue = value;

            log('Admission date value:', {
                liveValue: value,
                attributeValue: input.getAttribute('value'),
                inputId: input.id
            });
        }

        if (!value) {
            indicator.style.display= 'none';
            indicator.textContent =
                'Waiting for admission date...';
            return;
        }

        // Strict YYYY-MM-DD parsing.
        const match = value.match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );

        if (!match) {
            indicator.style.display= 'block';
            indicator.textContent =
                'Unrecognized date: ' + value;
            return;
        }

        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);

        const admission = new Date(year, month, day);

        // Validate calendar date.
        if (
            admission.getFullYear() !== year ||
            admission.getMonth() !== month ||
            admission.getDate() !== day
        ) {
            indicator.style.display= 'block';
            indicator.textContent = 'Invalid admission date';
            return;
        }

        // Local calendar calculation.
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const elapsedDays = Math.floor(
            (today.getTime() - admission.getTime()) /
            86400000
        );

        if (elapsedDays < 0) {
            indicator.style.display= 'block';
            indicator.textContent =
                'Admission date is in the future';
            return;
        }

        const weeks = Math.floor(elapsedDays / 7);
        const days = elapsedDays % 7;
        indicator.style.display= 'block';
        if (weeks > 0) {
            indicator.textContent =
                `${weeks} weeks, ${days} days since admission`;
        } else {
            indicator.textContent =
                `${days} days since admission`;
        }

        log('Admission date calculated:', {
            date: value,
            elapsedDays,
            weeks,
            days
        });
    }

    // ==================================================
    // ADMISSION DATE MONITORING
    // ==================================================

    function attachAdmissionDateMonitoring() {

        const input = findAdmissionInput();

        if (!input) return false;

        admissionInput = input;

        log('Admission Date input identified:', input);

        // Listen for normal user interaction.
        ['input', 'change', 'blur'].forEach(event => {
            input.addEventListener(
                event,
                updateAdmissionDate
            );
        });

        // Watch attribute changes.
        if (admissionObserver) {
            admissionObserver.disconnect();
        }

        admissionObserver = new MutationObserver(() => {
            updateAdmissionDate();
        });

        admissionObserver.observe(input, {
            attributes: true,
            attributeFilter: ['value']
        });

        updateAdmissionDate();

        return true;
    }

    function startAdmissionMonitoring() {

        if (attachAdmissionDateMonitoring()) {
            log('Admission Date monitoring started.');
        } else {

            log('Waiting for Admission Date field...');

            const observer = new MutationObserver(() => {

                if (attachAdmissionDateMonitoring()) {
                    observer.disconnect();

                    log('Admission Date found.');
                }

            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();

                if (!admissionInput) {
                    warn('Admission Date discovery timed out.');
                }

            }, 30000);
        }

        // Check live values once per second.
        // This detects React property updates that do not
        // generate HTML attribute mutations.
        admissionTimer = setInterval(() => {

            if (
                !admissionInput ||
                !admissionInput.isConnected
            ) {

                const replacement = findAdmissionInput();

                if (replacement) {

                    if (replacement !== admissionInput) {
                        log('Admission input replaced by React.');
                        attachAdmissionDateMonitoring();
                    }
                }

                return;
            }

            updateAdmissionDate();

        }, 1000);
    }

    // ==================================================
    // B-E. MUI AUTOCOMPLETE AUTOMATION
    // ==================================================

    function normalize(value) {
        return value
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    }

    function findField(task) {

        if (task.id) {
            const input = document.getElementById(task.id);

            if (input) return input;
        }

        const labels = document.querySelectorAll(
            '.MuiFormControl-root label'
        );

        for (const label of labels) {

            if (label.textContent.trim() !== task.label) {
                continue;
            }

            const container = label.closest(
                '.MuiFormControl-root'
            );

            const input = container?.querySelector(
                'input[role="combobox"]'
            );

            if (input) return input;
        }

        return null;
    }

    function setInputValue(input, value) {

        const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value'
        ).set;

        setter.call(input, value);

        input.dispatchEvent(
            new Event('input', { bubbles: true })
        );
    }

    async function waitForOption(search, timeout = 4000) {

        const start = Date.now();
        const wanted = normalize(search);

        while (Date.now() - start < timeout) {

            const options = Array.from(
                document.querySelectorAll('[role="option"]')
            );

            let match = options.find(option =>
                normalize(option.textContent) === wanted
            );

            if (!match) {
                match = options.find(option =>
                    normalize(option.textContent).includes(wanted)
                );
            }

            if (match) return match;

            await sleep(100);
        }

        return null;
    }

    async function selectMuiOption(task) {

        log('Processing:', task.label, '=>', task.search);

        const input = findField(task);

        if (!input) {
            warn('FIELD NOT FOUND:', task.label);
            return false;
        }

        if (
            normalize(input.value).includes(
                normalize(task.search)
            )
        ) {
            log(task.label, 'already selected:', input.value);
            return true;
        }

        input.focus();

        // Open MUI dropdown.
        const wrapper = input.closest(
            '.MuiAutocomplete-inputRoot'
        );

        const openButton = wrapper?.querySelector(
            'button[aria-label="Open"]'
        );

        if (openButton) {
            openButton.click();
        } else {
            input.click();
        }

        await sleep(150);

        // Search for desired option.
        setInputValue(input, task.search);

        const option = await waitForOption(task.search);

        if (!option) {

            const available = Array.from(
                document.querySelectorAll('[role="option"]')
            ).map(o => o.textContent.trim());

            warn('OPTION NOT FOUND:', {
                field: task.label,
                search: task.search,
                available
            });

            return false;
        }

        log('Matching option:', option.textContent.trim());

        option.click();

        await sleep(200);

        log(
            'Selection completed:',
            task.label,
            '| Result:',
            input.value
        );

        return true;
    }

    // ==================================================
    // RUN HOSPITAL AUTOMATION
    // ==================================================

    async function runHospitalAutomation() {

        log('================================');
        log('Starting hospital automation');
        log('================================');

        let successful = 0;

        for (const task of TASKS) {

            try {

                if (await selectMuiOption(task)) {
                    successful++;
                }

            } catch (error) {

                console.error(
                    PREFIX,
                    'Task failed:',
                    task.label,
                    error
                );
            }
        }

        log('================================');
        log(`Automation complete: ${successful}/4`);
        log('================================');

        updateAdmissionDate();
    }

    // ==================================================
    // BUTTON
    // ==================================================

    function addButton() {

        if (
            document.getElementById('avaros-hospital-helper')
        ) return;

        const button = document.createElement('button');

        button.id = 'avaros-hospital-helper';
        button.type = 'button';

        button.textContent = 'Apply Hospital Billing';

        button.style.cssText = `
            position:fixed;
            bottom:25px;
            right:25px;
            z-index:999999;
            padding:12px 18px;
            color:white;
            background:#1565c0;
            border:0;
            border-radius:6px;
            font-weight:bold;
            cursor:pointer;
            box-shadow:0 3px 8px rgba(0,0,0,.3);
        `;

        button.addEventListener('click', async () => {

            button.disabled = true;
            button.textContent = 'Applying...';

            try {
                await runHospitalAutomation();

            } catch (error) {
                console.error(PREFIX, error);

            } finally {
                button.disabled = false;
                button.textContent = 'Apply Hospital Billing';
            }
        });

        document.body.appendChild(button);

        log('Button installed.');
    }

    // ==================================================
    // INITIALIZATION
    // ==================================================

    function initialize() {

        log('Initializing version 2.3');

        addButton();

        startAdmissionMonitoring();

        log('Initialization complete.');
    }

    initialize();

})();
