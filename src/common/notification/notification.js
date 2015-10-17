angular.module('notification', [])
    .factory('notification', ($rootScope) => {
        var $scope = $rootScope.$new();
        return {
            notify: () => $scope.$broadcast('notify'),
            on: (cb) => $scope.$on('notify', cb),
        };
    })
    .directive('notification', () => ({
        restrict: 'E',
        scope: {msg: '@'},
        templateUrl: 'common/notification/notification.html',
        controllerAs: 'ctrl',
        controller: notifcationController,
    }));

function notifcationController($timeout, notification) {
    var displayTime = 2000;
    var setThis = (prop, value) => () => this[prop] = value;
    notification.on(() => {
        if(this.timeout) {
            $timeout.cancel(this.timeout);
            this.show = false;
            (this.timeout = $timeout(400))
                .then(setThis('show', true))
                .then(() => this.timeout = $timeout(displayTime))
                .then(setThis('show', false))
                .then(setThis('timeout', false));
        } else {
            this.show = true;
            (this.timeout = $timeout(displayTime))
                .then(setThis('timeout', false))
                .then(setThis('show', false));
        }
    });
}
