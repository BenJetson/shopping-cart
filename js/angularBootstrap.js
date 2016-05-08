var app = angular.module('shoppingCart', ['ngMaterial']);

app.controller('mainCtrl', function($scope, $log, $mdMedia, $mdSidenav, alertHandler) {
    $log.info("Controller loaded.");
    
    $scope.toggleNav = function(){
            $mdSidenav('left').toggle();
    };
    
});

app.service('alertHandler', function($mdDialog) {
    return {
        show: function(alertBody, alertTitle, buttonText) {
            $mdDialog.show(
                $mdDialog.alert({
                    title: alertTitle,
                    textContent: alertBody,
                    ok: buttonText
                })
            );
        }
    }
});

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