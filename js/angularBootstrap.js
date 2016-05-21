var app = angular.module('shoppingCart', ['ngMaterial']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('orange')
    .warnPalette('red');
});

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.factory('notifyService', ['$mdDialog', '$log', function($mdDialog, $log) {
    return {
        alert: function(alertText, alertTitle="", buttonText="Close") {
            $mdDialog.show(
                $mdDialog.alert({
                    title: alertTitle,
                    textContent: alertText,
                    ok: buttonText,
                    ariaLabel: alertTitle
                })
            );
        },
        confirm: function(alertText, alertTitle="", okText="OK", cancelText="Cancel") {
            $log.debug("asdf!");
            return $mdDialog.show(
                $mdDialog.confirm({
                    title: alertTitle,
                    textContent: alertText,
                    ok: okText,
                    cancel: cancelText,
                    clickOutsideToClose: false,
                    ariaLabel: alertTitle
                })
            ).then(function() { $log.debug("QWERTY!");return true; }, function() { $log.debug("ZXCVBNM!");return false; });
        }
    }
}]);

app.controller('mainCtrl', ['$scope', '$log', '$mdMedia', '$mdSidenav', function($scope, $log, $mdMedia, $mdSidenav) {
    $log.info("Controller loaded.");
    
    $scope.toggleNav = function(){
            $mdSidenav('left').toggle();
    };
}]);