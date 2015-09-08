chrome.runtime.onInstalled.addListener(updateAllTabs);
chrome.tabs.onUpdated.addListener(updateAllTabs);
chrome.tabs.onRemoved.addListener(updateAllTabs);

function updateAllTabs() {
    chrome.tabs.query({}, (tabs) => {
            _(tabs)
                .map((tab) => {
                    chrome.pageAction.hide(tab.id);
                    return getBaseUrl(tab.url);
                })
                .unique()
                .each((baseUrl) => {
                    updateTabGroup(baseUrl);
                })
                .value();
    });
}

function updateTabGroup(baseUrl) {
    chrome.tabs.query({ url: baseUrl + '*' }, (tabs) => {
        var matches = _.filter(tabs, (tab) => getBaseUrl(tab.url) === baseUrl);
        if(matches.length > 1) {
            var imageData = drawIcon(matches.length);
            _(matches).map('id').each((id) => {
                chrome.pageAction.show(id);
                chrome.pageAction.setIcon({tabId: id, imageData: imageData});
                chrome.pageAction.setTitle({
                    tabId: id,
                    title: 'This page is open in ' + matches.length + ' tabs.'
                });
            }).value();
        }
    });
}

function getBaseUrl(url) {
    return url.split('?')[0].split('#')[0];
}

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
