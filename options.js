/*global loadRules,saveRules,loadCloseSetting,saveCloseSetting*/
angular.module('options', [])
    .controller('options', options)
    .directive('dropdown', dropdown);

function options($scope, $timeout) {
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
        $scope.rule = {match: 'hash'};
        loadRules((rules) => {
            $scope.rules = rules;
            $scope.$apply();
        });
    }

    $scope.addRule = () => {
        if($scope.newRule.url) {
            $scope.rules[$scope.newRule.url] = $scope.newRule.match;
            saveRules($scope.rules, reloadRules);
        }
    };

    $scope.deleteRule = (url) => {
        delete $scope.rules[url];
        saveRules($scope.rules, reloadRules);
    };

    $scope.select = (url) => $scope.selected = url;
    reloadRules(true);

    /* Other settings */
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
                saveCloseSetting(close, displaySaved);
            }
        });
    }

    /* Settings saved notiication */
    function displaySaved() {
        $scope.settingsSaved = true;
        $timeout(() => {
            $scope.settingsSaved = false;
        }, 3000);
        $scope.$apply();
    }
}

function dropdown() {
    return {
        scope: { options: '=', value: '=' },
        template: [
            '<button ng-click="toggle()" ng-blur="blur()"',
            'ng-class="dropdownMenu">{{options[value]}}</button>',
            '<div class="dropdown-menu" ng-class="dropdownMenu">',
            '<div ng-repeat="(val, name) in options" ng-click="click(val)">',
            '{{name}}</div></div></div>'].join(''),
        controller: function($scope) {
            $scope.dropdownMenu = {open: false};
            $scope.toggle = () => {
                $scope.dropdownMenu.open = !$scope.dropdownMenu.open;
            };
            $scope.click = (val) => {
                $scope.value = val;
                $scope.dropdownMenu.open = false;
            };
            $scope.blur = () => {
                $scope.dropdownMenu.open = false;
            };
        }
    };
}
