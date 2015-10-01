angular.module('dropdown', [])
    .directive('dropdown', dropdown);

function dropdown() {
    return {
        restrict: 'E',
        scope: { options: '=', value: '=' },
        templateUrl: 'common/dropdown.html',
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
