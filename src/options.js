/*global settings*/
angular.module('options', ['dropdown', 'notification'])
    .controller('options', options);

function options($scope) {
    /* Rules table */
    $scope.matchCopy = {
        exact: 'exactly',
        base: 'up to the ?',
        hash: 'up to the #'
    };

    function reloadRules(dontDisplaySaved) {
        if(!dontDisplaySaved) {
            displaySaved();
        }
        $scope.newRule = {match: 'hash'};
        settings.loadRules((rules) => {
            $scope.rules = rules;
            $scope.$apply();
        });
    }

    $scope.addRule = () => {
        if($scope.newRule.url) {
            $scope.rules[$scope.newRule.url] = $scope.newRule.match;
            settings.saveRules($scope.rules, reloadRules);
        }
    };

    $scope.saveRules = () => settings.saveRules($scope.rules, reloadRules);

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        settings.saveRules($scope.rules, reloadRules);
    };

    $scope.select = (url) => $scope.selected = url;
    reloadRules(true);

    /* Other settings */
    settings.loadCloseSetting((close) => {
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
                settings.saveCloseSetting(close, displaySaved);
            }
        });
    }

    /* Settings saved notiication */
    function displaySaved() {
        $scope.settingsSaved = true;
        $scope.$apply();
    }
}
