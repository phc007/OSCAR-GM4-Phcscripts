/**
 * waitForKeyElements: A utility function that detects and handles dynamically added elements (e.g., via AJAX).
 * It uses MutationObserver to detect when elements matching the provided selector appear in the DOM.
 * No dependencies but not quite a dropin replacement for waitForKeyElements as the callback function is passed a node
 *
 * Usage example:
 * 
 * waitForKeyElements(
 *   ".comments",    // Selector string (CSS selector for the target elements)
 *   commentCallbackFunction,  // Function to execute when the element is found
 *   true,            // Optional: If true, stops after the first match (defaults to true)
 *   "#iframe"        // Optional: If elements are inside an iframe, provide the iframe selector
 * );
 * 
 * Function called when target element is found (example):
 * 
 * function commentCallbackFunction(node) {
 *   console.log("Comment node found:", node);
 *   node.textContent = "This comment was modified by waitForKeyElements.";
 *   // Return false to continue observing, or true to stop.
 *   return false;  // Can be used to stop once the first element is found
 * }
 *
 * @param {string} selector - The CSS selector string used to target the desired element(s).
 * @param {function} actionFunction - The callback function that is called when elements are found. It receives the matched node as a parameter.
 * @param {boolean} [bWaitOnce=true] - Optional. If true, stops searching once the element is found. Defaults to true.
 * @param {string} [iframeSelector=null] - Optional. If provided, searches within the specified iframe instead of the main document.
 */
function waitForKeyElements(selector, actionFunction, bWaitOnce = true, iframeSelector = null) {
    // Debugging logs to help understand flow
    console.log("Initializing MutationObserver for:", selector);

    let targetNodes;
    
    // Handle if an iframeSelector is provided
    if (iframeSelector) {
        const iframe = document.querySelector(iframeSelector);
        if (iframe) {
            targetNodes = iframe.contentDocument.querySelectorAll(selector);
            console.log("Iframe found, searching inside...");
        }
    } else {
        targetNodes = document.querySelectorAll(selector);
        console.log("Searching in the main document...");
    }

    // If target elements are already found, run actionFunction on them
    if (targetNodes && targetNodes.length > 0) {
        targetNodes.forEach(node => {
            if (!node.hasAttribute('data-alreadyFound')) {
                console.log("Node found, executing actionFunction:", node);
                const cancelFound = actionFunction(node);
                
                if (cancelFound) {
                    console.log("Action cancelled for this node.");
                } else {
                    // Mark node as already processed
                    node.setAttribute('data-alreadyFound', 'true');
                    console.log("Node processed and marked.");
                }
            }
        });

        if (bWaitOnce) {
            return; // If we are to stop after the first match, exit function
        }
    } else {
        console.log("No target nodes found yet, waiting...");
    }

    // MutationObserver setup
    const observer = new MutationObserver(mutations => {
        console.log("Mutation detected. Checking for target nodes...");
        targetNodes = document.querySelectorAll(selector);
        if (iframeSelector) {
            const iframe = document.querySelector(iframeSelector);
            if (iframe) {
                targetNodes = iframe.contentDocument.querySelectorAll(selector);
            }
        }

        targetNodes.forEach(node => {
            if (!node.hasAttribute('data-alreadyFound')) {
                console.log("New node detected, executing actionFunction:", node);
                const cancelFound = actionFunction(node);

                if (cancelFound) {
                    console.log("Action cancelled for this node.");
                } else {
                    node.setAttribute('data-alreadyFound', 'true');
                    console.log("Node processed and marked.");
                }
            }
        });

        if (bWaitOnce && targetNodes.length > 0) {
            console.log("Found nodes and bWaitOnce is true. Disconnecting observer...");
            observer.disconnect(); // Stop observing after the first match
        }
    });

    // Start observing the document body for added or changed elements
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    console.log("MutationObserver is now observing changes...");
}
