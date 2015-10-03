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
    var flags = {timeout: false, secondTimeout: false};
    var setShow = (value) => () => this.show = value;
    var setFlag = (flag, value) => () => flags[flag] = value;
    var onShow = () => {
        console.log('show');
        this.show = true;
        flags.timeout = $timeout(3000)
            .then(setFlag('timeout', false))
            .then(setShow(false))
            .then(() => console.log('show done'));
    };
    var onReshow = () => {
        if(!flags.secondTimeout) {
            console.log('reshow');
            console.log('cancel succesful?', $timeout.cancel(flags.timeout));
            this.show = false;
            flags.secondTimeout = true;
            flags.timeout = $timeout(400)
                .then(() => console.log('done hiding, now show'))
                .then(setShow(true))
                .then(() => $timeout(3000))
                .then(() => console.log('reshow done'))
                .then(setShow(false))
                .then(setFlag('secondTimeout', false))
                .then(setFlag('timeout', false));
        }
    };
    notification.on(() => {
        console.log('notification timeout =', flags.timeout);
        if(flags.timeout) {
            onReshow();
        } else {
            onShow();
        }
    });
}
