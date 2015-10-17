angular.module('editRule', [])
    .directive('editRule', () => ({
        restrict: 'E',
        scope: {rule: '=', options: '=', onDelete: '&', onSave: '&', save: '@',
            saveEnabled: '='},
        templateUrl: 'common/rules/edit-rule.html'
    }));
