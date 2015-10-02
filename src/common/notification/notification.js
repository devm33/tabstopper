angular.module('notification', [])
    .directive('notification', () => ({
        restrict: 'E',
        scope: {show: '=', msg: '@'},
        templateUrl: 'common/notification/notification.html',
        controller: ($scope, $timeout) => {
            var timeout;
            var showNotification = () => $scope.show = true;
            var hideNotification = () => $scope.show = false;
            var finishTimeout = () => timeout = false;
            $scope.$watch('show', (show) => {
                if(show) {
                    if(timeout) {
                        $timeout.cancel(timeout);
                        $scope.show = false;
                        timeout = $timeout(400)
                            .then(showNotification)
                            .then(() => $timeout(3000))
                            .then(hideNotification)
                            .then(finishTimeout);
                    } else {
                        timeout = $timeout(3000).then(hideNotification);
                    }
                }
            });
        }
    }));
