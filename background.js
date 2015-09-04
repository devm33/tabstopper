function onUpdated(tabId, change) {
    if(!change.url) {
        // url not updating
        return;
    }
    console.log('You\'re going to', change.url, 'in tab', tabId);
    tabQuery({ url: change.url })
    .then(function(tabs) {
        console.log('You went to', change.url);
        console.log('It is open in', tabs);
    });
}

chrome.tabs.onUpdated.addListener(onUpdated);

var tabQuery = Q.denodeify(chrome.tabs.query);
