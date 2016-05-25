var app = angular.module('shoppingCart', ['ngMaterial']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('cyan');
    $mdThemingProvider.theme('default').accentPalette('orange');
    $mdThemingProvider.theme('default').warnPalette('red');
});

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.factory('notifyService', ['$mdDialog', function($mdDialog) {
    return {
        alert: function(alertText, alertTitle, buttonText) {
            var alertHolder = $mdDialog.alert({
                    title: alertTitle,
                    textContent: alertText,
                    ok: buttonText,
                    ariaLabel: alertTitle
                });
            
            $mdDialog.show(alertHolder);
        },
        confirm: function(alertText, alertTitle, okText, cancelText) {
            var confirmHolder = $mdDialog.confirm({
                    title: alertTitle,
                    textContent: alertText,
                    ok: okText,
                    cancel: cancelText,
                    clickOutsideToClose: false,
                    ariaLabel: alertTitle
                });
            
            return $mdDialog.show(confirmHolder).then(function() { return true; }, function() { return false; });
        }
    }
}]);

app.controller('mainCtrl', ['$scope', '$log', '$mdMedia', '$mdSidenav', function($scope, $log, $mdMedia, $mdSidenav) {
    if (showDebugOutput) { $log.info("Controller loaded!"); }
    
    $scope.toggleNav = function(){
        $mdSidenav('left').toggle();
    };
    
    
}]);

app.controller('carouselCtrl', ['$scope', '$log', function($scope, $log) {
    
    $scope.$on('$routeChangeSuccess', function () {
        $(document).ready(function() {
            
            if (showDebugOutput) { $log.info("Processing image carousel '#carousel'..."); }
            
            $('#carousel').owlCarousel({ 
                items: 1, 
                margin: 10, 
                loop: true, 
                autoplay: true, 
                autoplayTimeout: 3000, 
                autoplayHoverPause: true, 
                dots: true 
            });
        });
    });
    
}]);