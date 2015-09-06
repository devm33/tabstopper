function onUpdated(tabId, change) {
    if(!change.url) {
        // url not changed in tab update
        return;
    }


    var urlWithoutHash = change.url.split('#')[0];
    var baseUrl = urlWithoutHash.split('?')[0];
    console.log('You\'re going to', baseUrl, 'in tab', tabId);

    chrome.tabs.query({ url: baseUrl + '*' }, function(tabs) {
        var matches = _.reject(tabs, {id: tabId});
        var exacts = _.filter(matches, {url: change.url});
        var matchesExceptHash = _.filter(matches, (tab) => {
            return tab.url.split('#')[0] === urlWithoutHash;
        });

        console.log('baseUrl', baseUrl, 'original tab:', tabId, '\n',
                    'tabs matching:', _.map(matches, 'id'), matches, '\n',
                    'exact matches:', _.map(exacts, 'id'), exacts, '\n',
                    'matches without hash:', _.map(matchesExceptHash, 'id'),
                    matchesExceptHash, '\n');
    });
}

chrome.tabs.onUpdated.addListener(onUpdated);
