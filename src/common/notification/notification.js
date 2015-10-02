angular.module('notification', [])
    .directive('notification', () => ({
        restrict: 'E',
        scope: {show: '=', msg: '@'},
        templateUrl: 'common/notification/notification.html',
        controller: ($scope, $timeout) => {
            var timeout;
            $scope.$watch('show', (show) => {
                if(show && !timeout) {
                    timeout = $timeout(() => {
                        $scope.show = false;
                        timeout = false;
                    }, 3000);
                }
            });
        }
    }));
