/*global settings*/
angular.module('options', ['notification'])
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

    function reloadRules() {
        $scope.newRule = {match: 'hash'};
        settings.loadRules((rules) => {
            $scope.rules = _.mapValues(rules, (match, url) => ({match: match, url: url}));
            $scope.$apply();
        });
    }

    reloadRules();

    var onSaveRules = _.flowRight(reloadRules, applyNotify);

    function saveRules() {
        settings.saveRules(_.mapValues($scope.rules, 'match'), onSaveRules);
    }

    $scope.addRule = () => {
        if($scope.newRule.url) {
            $scope.rules[$scope.newRule.url] = $scope.newRule.match;
            saveRules();
        }
    };

    $scope.saveRules = () => {
        saveRules();
        $scope.selected = false;
    };

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        settings.saveRules($scope.rules, onSaveRules);
    };

    $scope.select = ($event, url) => {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.selected = url;
        $scope.editing = {url:url, match:$scope.rules[url].match};
    };

    $document.on('click', () => {
        console.log('$document clicked');
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
