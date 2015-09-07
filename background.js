chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        loadBaseUrls((tabBaseUrl) => {
            _(tabs)
                .map( (tab) => {
                    var baseUrl = getBaseUrl(tab.url);
                    tabBaseUrl[tab.id] = baseUrl;
                    return baseUrl;
                })
                .unique()
                .each((baseUrl) => {
                    updateTabGroup(baseUrl);
                })
                .value();
            saveBaseUrls(tabBaseUrl);
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, change) => {
    loadBaseUrls((tabBaseUrl) => {
        if(!change.url) {
            // url not changed in tab update
            return;
        }
        var baseUrl = getBaseUrl(change.url);

        if(tabBaseUrl[tabId] && tabBaseUrl[tabId] !== baseUrl) {
            chrome.pageAction.hide(tabId);
            updateTabGroup(tabBaseUrl[tabId]);
        }
        tabBaseUrl[tabId] = baseUrl;
        saveBaseUrls(tabBaseUrl);
        updateTabGroup(baseUrl);
    });
});

chrome.tabs.onRemoved.addListener((tabId) => {
    loadBaseUrls((tabBaseUrl) => {
        if(tabBaseUrl[tabId]) {
            updateTabGroup(tabBaseUrl[tabId]);
            delete tabBaseUrl[tabId];
            saveBaseUrls(tabBaseUrl);
        }
    });
});

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
        } else if(matches.length === 1) {
            chrome.pageAction.hide(matches[0].id);
        }
    });
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

function getBaseUrl(url) {
    return url.split('?')[0].split('#')[0];
}

function loadBaseUrls(callback) {
    chrome.storage.local.get('tabBaseUrl', (storage) => {
        if(!storage.tabBaseUrl) {
            storage.tabBaseUrl = {};
        }
        callback(storage.tabBaseUrl);
    });
}

function saveBaseUrls(tabBaseUrl) {
    chrome.storage.local.set({tabBaseUrl: tabBaseUrl});
}
