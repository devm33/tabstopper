chrome.runtime.onInstalled.addListener(updateAllTabs);
// TODO open options page on installed with screenshots
chrome.tabs.onUpdated.addListener(updateAllTabs);
chrome.tabs.onRemoved.addListener(updateAllTabs);

function updateAllTabs() {
    chrome.tabs.query({}, (tabs) => {
            _(tabs)
                .each((tab) => {
                    chrome.pageAction.hide(tab.id);
                })
                .groupBy((tab) => getBaseUrl(tab.url))
                .filter((tabs) => tabs.length > 1)
                .each(addPageAction)
                .value();
    });
}

function addPageAction(tabs) {
    // TODO apply rules here I think (load in updateAll though so its only done once)
    var imageData = drawIcon(tabs.length);
    _(tabs).map('id').each((id) => {
        chrome.pageAction.show(id);
        chrome.pageAction.setIcon({tabId: id, imageData: imageData});
        chrome.pageAction.setTitle({
            tabId: id,
            title: 'This page is open in ' + tabs.length + ' tabs.'
        });
    }).value();
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
    ctx.fillText(count+'x', W/2, H/2, maxW-minW);
    return ctx.getImageData(0, 0, 19, 19);
}
