function Product(id, name, price) {
    // fields set from constructor
    this.id = String(id);
    this.name = String(name);
    this.price = Number(price);
    this.quantity = 0;
    
    // setters
    this.setQuantity = function (n) { this.quantity = n; };
    
    // getters
    this.getId = function () { return this.id; };
    this.getName = function () { return this.name; };
    this.getPrice = function () { return this.price; };
    this.getQuantity = function () { return this.quantity; };
    this.getExtendedPrice = function () { return this.quantity * this.price; };
    this.bumpQuantity = function () { this.quantity++; };
    
    // for testing only
    this.toString = function () {
        return this.id + "|" + this.name + "|" + this.price + "|" + this.quantity + "|" + this.getExtendedPrice();
    }
}

app.controller("cartCtrl", function ($scope, $rootScope, $log, $mdDialog, $log, $http) {
   
    $rootScope.products = [];
//    $scope.cartItemCount = 0;
    
    $http({
        method: "GET",
        url: "/products.json"
    }).then(function (response) {
        
        $scope.productsAsJSON = response.data;
        
        for (var p = 0; p < $scope.productsAsJSON.length; p++) {
            $rootScope.products.push(new Product($scope.productsAsJSON[p]['itemID'], 
                                             $scope.productsAsJSON[p]['itemname'], 
                                             $scope.productsAsJSON[p]['price']));
        }
        
        $scope.loadCart();
        
    });
    
    $scope.sales_tax_rate = 0.06;
    $scope.free_shipping = false;
    $scope.shipping_rate = 6.99;
    $scope.cart_name = "bgparts_cart";
    
    $scope.loadCart = function () {
        $scope.loadedCart = localStorage[$scope.cart_name];
        
        if ($scope.loadedCart != null && $scope.loadedCart.length != 0) {
            
            $scope.loadedItemIDs = $scope.loadedCart.split("|");
            
            for (var k=0; k < $scope.loadedItemIDs.length; k++) {
                $scope.loadedIndex = $scope.search($scope.loadedItemIDs[k]);
                
                if ($scope.loadedIndex > -1) {
                    $rootScope.products[$scope.loadedIndex].bumpQuantity();
                }
            }
        }
            
        $scope.refresh();
            
    }
    
    $scope.addToCart = function (idToAdd) {
        $scope.indexToAdd = $scope.search(idToAdd);
        $scope.shouldAddItem = false;
        
        if ($scope.indexToAdd > -1) {
            if ($rootScope.products[$scope.indexToAdd].getQuantity() == 0) {
                alert("The following item was added to your cart: " + $rootScope.products[$scope.indexToAdd].getName());
                $scope.shouldAddItem = true;
            } else {
                $scope.shouldAddItem = confirm("The item " + $rootScope.products[$scope.indexToAdd].getName() + 
                                               " is already in your cart. Do you want to add another?")
            }

            if ($scope.shouldAddItem) {
                $rootScope.products[$scope.indexToAdd].bumpQuantity();
                $scope.writeCart();
            }
        } else {
            alert("We've encountered an error, but it's not your fault. The developer of this site " +
                  "has provided an invalid product ID. Nag the site owner with an email.")
        }
        
        $scope.refresh();
        
    }
    
    $scope.search = function (id) {
        $scope.searchID = id.toLowerCase();
        
        for (var s=0; s<$rootScope.products.length; s++) {
            $scope.searchThisID = $rootScope.products[s].getId().toLowerCase();
            
            if ($scope.searchID == $scope.searchThisID) {
                return s;
            }
        }
        
        return -1;
    }
    
    $scope.cartToString = function () {
        $scope.tempCartStrItems = [];
        
//        $log.debug($rootScope.products);
        
        for (var i=0; i<$rootScope.products.length; i++) {
            
//            $log.debug($rootScope.products[i].getId() + " | q: "+ $rootScope.products[i].getQuantity().toString());
            
            for (var j=0; j<$rootScope.products[i].getQuantity(); j++) {
                $scope.tempCartStrItems.push($rootScope.products[i].getId());
            }
            
        }
        
        return $scope.tempCartStrItems.join("|");
    }
    
    $scope.writeCart = function () {
        localStorage[$scope.cart_name] = $scope.cartToString();
        $scope.refresh();
    }
    
    $scope.getNumItems = function () {
//        $scope.itemTempCounter = 0
//        for (var c=0; c < $rootScope.products.length; c++) {
//            $scope.itemTempCounter += $rootScope.products[c].getQuantity();
//        }
        return localStorage[$scope.cart_name].split("|").length;
    }
    
    $scope.emptyCart = function () {
        localStorage.removeItem($scope.cart_name);;
        $scope.refresh();
    }
    
    $scope.refresh = function () {
        $scope.cartItemCount = $scope.getNumItems();
    }
    
});