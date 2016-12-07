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

app.controller('mainCtrl', ['$scope', '$log', '$mdMedia', '$mdSidenav', '$mdToast','notifyService', function($scope, $log, $mdMedia, $mdSidenav, $mdToast, notifyService) {
    if (showDebugOutput) { $log.info("Controller loaded!"); }
    
    var lastVisit = localStorage["bgcart-visit-timestamp"];
    var currentTime = Math.floor(new Date().getTime() / 1000);
    
    if (lastVisit == null || currentTime - lastVisit > 3600) {
        notifyService.alert("Welcome to Ben's PC Parts! Please be advised that this site is 100% fake and that anything you 'buy' will never be delivered or ordered. Also, please do not enter any real personal information into this site. I made this website for educational purposes in a web design class. Feel free to browse around -- enjoy!");
    } else {
        $mdToast.show(
            $mdToast.simple()
                .textContent("Remember that BGParts is not a real shopping site.")
                .position("top right")
                .hideDelay(8000);
        );
    }
        
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
    
    $scope.fixForm = function() {
        $log.debug("ASDF"); 
        $('#emailForm').slideUp();
        $('#emailThanks').attr('ng-hide', 'false');
    }
    
}]);
