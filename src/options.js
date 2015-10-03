/*global settings*/
angular.module('options', ['notification'])
    .controller('options', options);

function options($scope, notification, $document) {
    /* Rules table */
    $scope.matchCopy = {
        exact: 'exactly',
        base: 'up to the ?',
        hash: 'up to the #'
    };

    function applyNotify() {
        notification.notify();
        $scope.$apply();
    }

    function reloadRules() {
        $scope.newRule = {match: 'hash'};
        settings.loadRules((rules) => {
            $scope.rules = rules;
            $scope.$apply();
        });
    }

    var onSaveRules = _.flowRight(reloadRules, applyNotify);

    $scope.addRule = () => {
        if($scope.newRule.url) {
            $scope.rules[$scope.newRule.url] = $scope.newRule.match;
            settings.saveRules($scope.rules, onSaveRules);
        }
    };

    $scope.saveRules = () => settings.saveRules($scope.rules, onSaveRules);

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        settings.saveRules($scope.rules, onSaveRules);
    };

    $scope.select = ($event, url) => {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.selected = url;
    };

    $document.on('click', () => {
        $scope.selected = false;
        $scope.$apply();
    });

    reloadRules();

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
                settings.saveCloseSetting(close, applyNotify);
            }
        });
    }
}
