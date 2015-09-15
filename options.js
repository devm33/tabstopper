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
        $scope.newRule = {match: 'hash'};
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

    $scope.saveRules = () => saveRules($scope.rules, reloadRules);

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
        restrict: 'E',
        scope: { options: '=', value: '=' },
        template: [
            '<button ng-click="ctrl.toggle()" ng-blur="ctrl.blur()"',
            'class="custom-btn" ng-class="ctrl.dropdownMenu">{{options[value]}}',
            '<span class="caret"></button>',
            '<div class="dropdown-menu" ng-class="ctrl.dropdownMenu">',
            '<div ng-repeat="(val, name) in options" ng-mousedown="ctrl.click(val)">',
            '{{name}}</div></div></div>'].join(''),
        controllerAs: 'ctrl',
        controller: function($scope) {
            this.dropdownMenu = {open: false};
            this.toggle = () => {
                this.dropdownMenu.open = !this.dropdownMenu.open;
            };
            this.click = (val) => {
                $scope.value = val;
                this.dropdownMenu.open = false;
            };
            this.blur = () => {
                this.dropdownMenu.open = false;
            };
        }
    };
}
