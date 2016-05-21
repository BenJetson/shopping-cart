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

app.factory('notifyService', ['$mdDialog', function($mdDialog) {
    return {
        alert: function(alertText, alertTitle="", buttonText="Close") {
            $mdDialog.show(
                $mdDialog.alert({
                    title: alertTitle,
                    textContent: alertText,
                    ok: buttonText
                })
            );
        },
        confirm: function(alertText, alertTitle="") {
            $mdDialog.show(
                $mdDialog.confirm({
                    title: alertTitle,
                    textContent: alertText,
                    clickOutsideToClose: false
                })
            ).then(function() { return true; }).then(function() { return false; });
        }
    }
}]);

app.controller('mainCtrl', ['$scope', '$log', '$mdMedia', '$mdSidenav', function($scope, $log, $mdMedia, $mdSidenav) {
    $log.info("Controller loaded.");
    
    $scope.toggleNav = function(){
            $mdSidenav('left').toggle();
    };
}]);