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
    var setThis = (prop, value) => () => this[prop] = value;
    var onShow = () => {
        console.log('show');
        this.show = true;
        this.timeout = $timeout(3000);
        this.timeout
            .then(setThis('timeout', false))
            .then(setThis('show', false))
            .then(() => console.log('show done'));
    };
    var onReshow = () => {
        console.log('reshow');
        console.log('cancel successful?', $timeout.cancel(this.timeout));
        this.show = false;
        this.secondTimeout = true;
        this.timeout = $timeout(400);
        this.timeout
            .then(() => console.log('done hiding, now show'))
            .then(setThis('show', true))
            .then(() => this.timeout = $timeout(3000))
            .then(() => console.log('reshow done'))
            .then(setThis('show', false))
            .then(setThis('timeout', false));
    };
    notification.on(() => {
        console.log('notification timeout =', this.timeout);
        if(this.timeout) {
            onReshow();
        } else {
            onShow();
        }
    });
}
