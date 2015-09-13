/*global loadRules,saveRules,loadCloseSetting,saveCloseSetting*/
angular.module('options', [])
    .controller('options', options)
    .directive('addAttr', addAttr);

function options($scope, $timeout) {
    $scope.matchCopy = {
        exact: 'exactly',
        base: 'up to the ?',
        hash: 'up to the #'
    };

    function reloadRules() {
        if($scope.rule) {
            postSaved();
        }
        $scope.rule = {match: 'hash'};
        loadRules((rules) => {
            $scope.rules = rules;
            $scope.$apply();
        });
    }

    function postSaved() {
        $scope.settingsSaved = true;
        $timeout(() => {
            $scope.settingsSaved = false;
        }, 3000);
        $scope.$apply();
    }

    $scope.saveRule = () => {
        if($scope.rule.url) {
            delete $scope.editingRule;
            $scope.ruleSaved = false;
            $scope.rules[$scope.rule.url] = $scope.rule.match;
            saveRules($scope.rules, reloadRules);
        }
    };

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        saveRules($scope.rules, reloadRules);
    };

    $scope.editRule = (url, match) => {
        $scope.editingRule = url;
        $scope.rule = {
            url: url,
            match: match
        };
    };

    $scope.editing = (url) => url === $scope.editingRule;

    loadCloseSetting((close) => {
        $scope.close = close;
        $scope.$apply();
        watchClose();
    });

    function watchClose() {
        var ignoreFirst = true;
        $scope.$watch('close', (close) => {
            if(ignoreFirst) {
                ignoreFirst = false;
            } else {
                saveCloseSetting(close, postSaved);
            }
        });
    }

    reloadRules();
}

function addAttr() {
    return {
        link: function($scope, $element, $attrs) {
        }
    };
}
