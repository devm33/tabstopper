/*global settings*/
angular.module('options', ['notification', 'editRule'])
    .controller('options', options);

function options($scope, notification, $document) {

    function applyNotify() {
        notification.notify();
        $scope.$apply();
    }

    /* Rules table */
    $scope.matchCopy = {
        exact: 'exactly',
        base: 'up to the ?',
        hash: 'up to the #'
    };

    $scope.clearNewRule = () => {
        $scope.newRule = {match: 'hash'};
    };

    function reloadRules() {
        $scope.clearNewRule();
        settings.loadRules((rules) => {
            $scope.rules = _.mapValues(rules, (match, url) => ({match: match, url: url}));
            $scope.$apply();
        });
    }

    reloadRules();

    var onSaveRules = _.flow(reloadRules, applyNotify);

    function saveRules() {
        settings.saveRules(_.mapValues($scope.rules, 'match'), onSaveRules);
    }

    $scope.addRule = () => {
        if($scope.newRule.url) {
            $scope.rules[$scope.newRule.url] = $scope.newRule;
            saveRules();
        }
    };

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        saveRules();
    };

    var stopEvents = (fn) => ($event, ...args) => {
        $event.preventDefault();
        $event.stopPropagation();
        return fn.apply(this, args);
    };

    $scope.select = stopEvents((url) => {
        $scope.selected = url;
        $scope.editing = {url:url, match:$scope.rules[url].match};
    });

    $scope.saveEditing = stopEvents(() => {
        if($scope.editing.url !== $scope.selected) {
            delete $scope.rules[$scope.selected];
        }
        $scope.rules[$scope.editing.url] = $scope.editing;
        $scope.selected = false;
        $scope.editing = {};
        saveRules();
    });

    $document.on('click', () => {
        $scope.selected = false;
        $scope.$apply();
    });

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
