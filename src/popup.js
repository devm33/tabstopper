/*global settings*/
angular.module('popup', []).controller('popup', popup);

function popup($scope) {
    chrome.tabs.query({active: true, currentWindow: true}, (currentTabs) => {
        $scope.currentTab = currentTabs[0];
        var urlWithoutHash = $scope.currentTab.url.split('#')[0];
        var baseUrl = urlWithoutHash.split('?')[0];

        chrome.tabs.query({ url: baseUrl + '*' }, (tabs) => {
            $scope.tabs = tabs;
            var matches = _.reject(tabs, {id: $scope.currentTab.id});
            $scope.exacts = _.filter(matches, {url: $scope.currentTab.url});
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

            settings.matchRule(baseUrl, (rule) => {
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

    settings.loadCloseSetting((close) => {
        $scope.closeTab = close;
        $scope.$apply();
    });

    $scope.goto = (tab) => {
        if($scope.closeTab) {
            chrome.tabs.remove($scope.currentTab.id);
        }
        chrome.tabs.update(tab.id, {active:true});
        chrome.windows.update(tab.windowId, {focused:true});
    };

    $scope.saveRule = () => {
        settings.loadRules((rules) => {
            if($scope.savedRule) {
                delete rules[$scope.savedRule.url];
            }
            rules[$scope.rule.url] = $scope.rule.match;
            settings.saveRules(rules);
            $scope.savedRule = _.clone($scope.rule);
            $scope.$apply();
        });
    };

    $scope.showOptions = () => {
        chrome.runtime.openOptionsPage();
    };

    // TODO these (all below) could be filters
    $scope.pluralizeMsg = (count) => {
        if(count == 1) {
            return 'There is one other tab';
        }
        if(count > 1) {
            return 'There are ' + count + ' tabs';
        }
        return '';
    };

    $scope.afterDelim = (str, delim, emptyMsg) => {
        var split = str.split(delim);
        if(split.length > 1) {
            return delim + split[1];
        }
        return emptyMsg || '';
    };

    $scope.ellipsis = (str, lim) => {
        if(str.length > lim) {
            return str.substr(0, lim) + '...';
        }
        return str;
    };
}
