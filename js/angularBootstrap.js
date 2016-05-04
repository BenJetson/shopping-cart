var app = angular.module('shoppingSite', ['ngMaterial']);

app.controller('MainCtrl', function($scope, $log, alertHandler) {
    $log.info("Controller loaded.")
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