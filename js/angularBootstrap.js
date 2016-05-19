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

app.controller('formCtrl', function($scope, $log) {
    $scope.states = ['AL',
                    'AK',
                    'AZ',
                    'AR',
                    'CA',
                    'CO',
                    'CT',
                    'DE',
                    'FL',
                    'GA',
                    'HI',
                    'ID',
                    'IL',
                    'IN',
                    'IA',
                    'KS',
                    'KY',
                    'LA',
                    'ME',
                    'MD',
                    'MA',
                    'MI',
                    'MN',
                    'MS',
                    'MO',
                    'MT',
                    'NE',
                    'NV',
                    'NH',
                    'NJ',
                    'NM',
                    'NY',
                    'NC',
                    'ND',
                    'OH',
                    'OK',
                    'OR',
                    'PA',
                    'RI',
                    'SC',
                    'SD',
                    'TN',
                    'TX',
                    'UT',
                    'VT',
                    'VA',
                    'WA',
                    'WV',
                    'WI',
                    'WY'];
    
})