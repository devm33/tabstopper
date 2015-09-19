/*global matchRule*/
chrome.runtime.onInstalled.addListener(updateAllTabs);
chrome.tabs.onUpdated.addListener(updateAllTabs);
chrome.tabs.onRemoved.addListener(updateAllTabs);

function updateAllTabs() {
    chrome.tabs.query({}, (tabs) => {
            _(tabs)
                .each((tab) => {
                    chrome.pageAction.hide(tab.id);
                })
                .groupBy((tab) => getBaseUrl(tab.url))
                .pick((tabs) => tabs.length > 1)
                .each(checkGroup)
                .value();
    });
}

function checkGroup(tabs, baseUrl) {
    matchRule(baseUrl, (rule) => {
        if(rule) {
            var originalTabs = _(tabs).map('id').sortBy('index').value();
            _.each(originalTabs, (id) => {
                var cur = _.find(tabs, {id:id});
                if(cur) {
                    var ruleGroup = ruleSubgroup(cur, tabs, rule.match);
                    if(ruleGroup.length > 0) {
                        _.each(ruleGroup, (tab) => {
                            chrome.tabs.remove(tab.id);
                            _.remove(tabs, {id:tab.id});
                        });
                        chrome.tabs.update(cur.id, {active:true});
                        chrome.windows.update(cur.windowId, {focused:true});
                    }
                }
            });
        }

        if(tabs.length > 1) {
            addPageAction(tabs);
        }
    });
}

function ruleSubgroup(cur, tabs, match) {
    var matches = _.reject(tabs, {id: cur.id});
    var groups = {};
    groups.exact = _.filter(matches, {url: cur.url});
    var urlNoHash = cur.url.split('#')[0];
    groups.hash = _.filter(matches, (tab) => tab.url.split('#')[0] === urlNoHash);
    var urlNoQuery = cur.url.split('?')[0];
    groups.base = _.filter(matches, (tab) => tab.url.split('?')[0] === urlNoQuery);
    return groups[match];
}

function addPageAction(tabs) {
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
