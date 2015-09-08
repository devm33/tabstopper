angular.module('popup', []).controller('popup', popup);

function popup($scope) {
    var currentTab;
    chrome.tabs.query({active: true, currentWindow: true}, (currentTabs) => {
        currentTab = currentTabs[0];
        var urlWithoutHash = currentTab.url.split('#')[0];
        var baseUrl = urlWithoutHash.split('?')[0];

        chrome.tabs.query({ url: baseUrl + '*' }, (tabs) => {
            $scope.tabs = tabs;
            var matches = _.reject(tabs, {id: currentTab.id});
            $scope.exacts = _.filter(matches, {url: currentTab.url});
            var matchesWithoutHash = _.filter(matches, (tab) =>
                tab.url.split('#')[0] === urlWithoutHash
            );
            $scope.matchesOnlyBase = _.difference(matches, matchesWithoutHash);
            $scope.matchesExceptHash = _.difference(matchesWithoutHash, $scope.exacts);

            var urlParts = baseUrl.split('/');
            if(baseUrl.indexOf('://') > -1) {
                $scope.ruleUrl = urlParts[0] + '//' + urlParts[2];
            } else {
                $scope.ruleUrl = urlParts[0];
            }
            $scope.ruleUrl += '/*';
            $scope.matchOption = 'hash';
            $scope.$apply();
        });
    });

    $scope.goto = (tab) => {
        chrome.tabs.update(tab.id, {active:true});
        chrome.windows.update(tab.windowId, {focused:true});
        if($scope.closeTab) {
            chrome.tabs.remove(currentTab.id);
        }
    };

    $scope.pluralizeMsg = (count) => {
        if(count == 1) {
            return 'There is one other tab';
        }
        if(count > 1) {
            return 'There are ' + count + ' tabs';
        }
        return '';
    };

    $scope.saveUrl = () => {
        // TODO load and save rules in storage.sync
        // TODO collapse/hide rule form / show success message
    };
}

// Work-around for chrome auto-focusing first anchor tag in popup
document.addEventListener('focusin', (event) => {
    event.target.blur();
});
