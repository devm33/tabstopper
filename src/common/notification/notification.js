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
                console.log('watch triggered, show = ', show, 'timeout', timeout);
                if(show) {
                    // Oh I see the problem is that when we try to set show =
                    // true temporarily we end up back here with show and
                    // timeout both truthy
                    if(timeout) {

                        console.log('timeout exists canceling');
                        $timeout.cancel(timeout);
                        $scope.show = false;
                        timeout = $timeout(400)
                            .then(() => console.log('done hiding, now show'))
                            .then(showNotification)
                            .then(() => $timeout(3000))
                            .then(() => console.log('done'))
                            .then(hideNotification)
                            .then(finishTimeout);
                    } else {
                        console.log('timeout was false, showing then hiding');
                        timeout = $timeout(3000).then(hideNotification);
                    }
                }
            });
        }
    }));
