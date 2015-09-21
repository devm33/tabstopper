/*jshint unused:false*/
var settings = {};
/*jshint unused:true*/

settings.loadRules = (callback) => {
    chrome.storage.sync.get('rules', (storage) => {
        if(!storage.rules) {
            storage.rules = {};
        }
        callback(storage.rules);
    });
};

settings.saveRules = (rules, callback) => {
    chrome.storage.sync.set({rules: rules}, callback);
};

settings.matchRule = (baseUrl, callback) => {
    settings.loadRules((rules) => {
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
};

settings.loadCloseSetting = (callback) => {
    chrome.storage.sync.get('close', (storage) => callback(storage.close));
};

settings.saveCloseSetting = (close, callback) => {
    chrome.storage.sync.set({close: close}, callback);
};

