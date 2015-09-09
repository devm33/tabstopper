/*global loadRules,saveRules,loadCloseSetting,saveCloseSetting*/
angular.module('options', []).controller('options', options);

function options($scope) {
    $scope.matchCopy = {
        exact: 'exactly',
        base: 'up to the ?',
        hash: 'up to the #'
    };

    function reloadRules() {
        $scope.rule = {match: 'hash'};
        loadRules((rules) => {
            $scope.rules = rules;
            $scope.$apply();
        });
    }

    $scope.saveClose = (close) => {
        $scope.closeSaved = false;
        saveCloseSetting(close, () => {
            $scope.closeSaved = true;
            $scope.$apply();
        });
    };

    $scope.saveRule = () => {
        $scope.ruleSaved = false;
        $scope.rules[$scope.rule.url] = $scope.rule.match;
        saveRules($scope.rules, () => {
            $scope.ruleSaved = true;
            reloadRules();
        });
    };

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        saveRules($scope.rules, reloadRules);
    };

    reloadRules();

    loadCloseSetting((close) => {
        $scope.close = close;
        $scope.$apply();
    });
}
