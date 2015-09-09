/*global matchRule,loadRules,saveRules*/
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
            $scope.rule = {};
            if(baseUrl.indexOf('://') > -1) {
                $scope.rule.url = urlParts[0] + '//' + urlParts[2];
            } else {
                $scope.rule.url = urlParts[0];
            }
            $scope.rule.match = 'hash';
            $scope.$apply();

            matchRule(baseUrl, (rule) => {
                if(rule) {
                    $scope.rule = rule;
                    $scope.savedRule = _.clone(rule);
                }
                // loading done: safe to show form for user input
                $scope.showRuleForm = true;
                $scope.$apply();
            });
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

    $scope.saveRule = () => {
        loadRules((rules) => {
            if($scope.savedRule) {
                delete rules[$scope.savedRule.url];
            }
            rules[$scope.rule.url] = $scope.rule.match;
            saveRules(rules);
            $scope.savedRule = _.clone($scope.rule);
            $scope.$apply();
        });
    };

    $scope.showOptions = () => {
        chrome.runtime.openOptionsPage();
    };
}
