/*jshint unused:false*/
function loadRules(callback) {
    chrome.storage.sync.get('rules', (storage) => {
        if(!storage.rules) {
            storage.rules = {};
        }
        callback(storage.rules);
    });
}

function saveRules(rules) {
    chrome.storage.sync.set({rules: rules});
}

function matchRule(baseUrl, callback) {
    loadRules((rules) => {
        var match = _(rules)
            .pairs()
            .filter((rule) => baseUrl.indexOf(rule[0]) > -1)
            .reduce((a, b) => {
                // apply most specific rule (longest)
                if(a[0].length > b[0].length) {
                    return a;
                }
                return b;
            });

        if(match) {
            callback({
                url: match[0],
                match: match[1]
            });
        } else {
            callback();
        }
    });
}
