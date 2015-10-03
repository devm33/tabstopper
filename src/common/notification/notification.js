angular.module('notification', [])
    .directive('notification', () => ({
        restrict: 'E',
        scope: {show: '=', msg: '@'},
        templateUrl: 'common/notification/notification.html',
        controller: ($scope, $timeout) => {
            var flags = {timeout: false, secondTimeout: false};
            var showNotification = () => $scope.show = true;
            var hideNotification = () => $scope.show = false;
            var setFlagFalse = (flag) => () => flags[flag] = false;
            var onShow = () => {
                console.log('show');
                flags.timeout = $timeout(3000)
                    .then(setFlagFalse('timeout'))
                    .then(hideNotification)
                    .then(() => console.log('show done'));
            };
            var onReshow = () => {
                if(!flags.secondTimeout) {
                    console.log('reshow');
                    $timeout.cancel(flags.timeout);
                    $scope.show = false;
                    flags.secondTimeout = true;
                    flags.timeout = $timeout(400)
                        .then(() => console.log('done hiding, now show'))
                        .then(showNotification)
                        .then(() => $timeout(3000))
                        .then(() => console.log('reshow done'))
                        .then(hideNotification)
                        .then(setFlagFalse('secondTimeout'))
                        .then(setFlagFalse('timeout'));
                }
            };
            $scope.$watch('show', (show) => {
                console.log('watch triggered\t show =', show, '\ttimeout =', flags.timeout);
                if(show) {
                    if(flags.timeout) {
                        onReshow();
                    } else {
                        onShow();
                    }
                }
            });
        }
    }));
