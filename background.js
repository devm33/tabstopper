function onUpdated(tabId, change, changedTab) {
    if(!change.url) {
        // url not changed in tab update
        return;
    }

    var urlWithoutHash = change.url.split('#')[0];
    var baseUrl = urlWithoutHash.split('?')[0];

    chrome.tabs.query({ url: baseUrl + '*' }, (tabs) => {
        var matches = _.reject(tabs, {id: tabId});

        if(_.isEmpty(matches)) {
            // no matching open tabs at broadest level
            return;
        }

        var exacts = _.filter(matches, {url: change.url});
        var matchesExceptHash = _.filter(matches, (tab) => {
            return tab.url.split('#')[0] === urlWithoutHash;
        });

        console.log(
            'original tab:', tabId, changedTab, '\n',
            'url:', change.url, '\n',
            'baseUrl:', baseUrl, '\n',
            'matches base:', _.map(matches, 'id'), matches, '\n',
            'matches except hash:', _.map(matchesExceptHash, 'id'),
            matchesExceptHash, '\n',
            'exact matches:', _.map(exacts, 'id'), exacts, '\n'
        );

        var imageData = drawIcon(tabs.length);
        _.each(tabs, (tab) => {
            chrome.pageAction.show(tab.id);
            chrome.pageAction.setIcon({tabId: tab.id, imageData: imageData});
            chrome.pageAction.setTitle({
                tabId: tab.id,
                title: 'This page is open in ' + tabs.length + ' tabs.'
            });
        });
    });
}

chrome.tabs.onUpdated.addListener(onUpdated);

chrome.tabs.onRemoved.addListener((tabId) => {
    // TODO remove affected pageActions
    console.log('removed', tabId);
});

function drawIcon(count) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var wMargin = 2;
    var minW = wMargin;
    var maxW = W - wMargin;
    var hOff = 5;
    var wOff = 6;

    var path = new Path2D();
    path.moveTo(maxW-wOff, 0);
    path.lineTo(minW, 0);
    path.lineTo(minW, H);
    path.lineTo(maxW, H);
    path.lineTo(maxW, hOff);
    path.lineTo(maxW-wOff, hOff);
    path.lineTo(maxW-wOff, 0);
    path.lineTo(maxW, hOff);

    ctx.clearRect(0, 0, W, H);
    ctx.stroke(path);
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(count+'×', W/2, H/2, maxW-minW);
    return ctx.getImageData(0, 0, 19, 19);
}
