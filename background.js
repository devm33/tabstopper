function onUpdated(tabId, change, changedTab) {
    if(!change.url) {
        // url not changed in tab update
        return;
    }

    var urlWithoutHash = change.url.split('#')[0];
    var baseUrl = urlWithoutHash.split('?')[0];

    chrome.tabs.query({ url: baseUrl + '*' }, function(tabs) {
        var matches = _.reject(tabs, {id: tabId});

        if(_.isEmpty(matches)) {
            // no matching open tabs at broadest level
            return;
        }

        var exacts = _.filter(matches, {url: change.url});
        var matchesExceptHash = _.filter(matches, (tab) => {
            return tab.url.split('#')[0] === urlWithoutHash;
        });

        console.log('original tab:', tabId, changedTab, '\n',
                    'url:', change.url, '\n',
                    'baseUrl:', baseUrl, '\n',
                    'matches base:', _.map(matches, 'id'), matches, '\n',
                    'matches except hash:', _.map(matchesExceptHash, 'id'),
                    matchesExceptHash, '\n',
                    'exact matches:', _.map(exacts, 'id'), exacts, '\n');
    });
}

chrome.tabs.onUpdated.addListener(onUpdated);
