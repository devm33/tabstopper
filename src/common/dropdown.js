angular.module('dropdown', [])
    .directive('dropdown', dropdown);

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
