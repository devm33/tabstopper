function onBeforeNavigate(req) {
    /* schema for pending request: {
     *  tabId
     *  url
     *  ...
     * }
     * Note: this doesn't stop the navigation to the url
     */
    tabQuery({ url: req.url })
    .then(function(tabs) {
        console.log('You went to', req.url);
        console.log('It is open in', tabs);
    });
}

chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate);

var tabQuery = Q.denodeify(chrome.tabs.query);
