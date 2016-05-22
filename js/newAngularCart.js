var showDebugOutput = true;
var siteURL = "https://bgodfr5236.github.io/shopping-cart/";

function Product(id, name, price, category, img) {
    // fields set from constructor
    this.id = String(id);
    this.name = String(name);
    this.price = Number(price);
    this.category = String(category);
    this.img = String(img);
    this.quantity = 0;
    
    
    // setters
    this.setQuantity = function(n) { this.quantity = Math.floor(Number(n)); };
    
    // getters
    this.getId = function() { return this.id; };
    this.getName = function() { return this.name; };
    this.getPrice = function() { return this.price; };
    this.getQuantity = function() { return this.quantity; };
    this.getExtendedPrice = function() { return this.quantity * this.price; };
    this.getCategory = function() { return this.category; };
    this.getImgPath = function() { return 'img/products/' + this.category + '/' + this.img; };
    
    // doers
    this.bumpQuantity = function() { this.quantity++; };
    
    // for testing only
    this.toString = function() {
        return this.id + "|" + this.name + "|" + this.price + "|" + this.quantity + "|" + this.getExtendedPrice();
    };
};

app.factory('productHandler', ['$http', '$log', '$rootScope', function($http, $log, $rootScope) {
    
    $rootScope.itemCount = 0;
    
    var products = {};
    
    products.counter = function() {
        var itemTempCounter = 0;
        for (var c=0; c < products.list.length; c++) {
            itemTempCounter += products.quantity.get(c);
        }
        
        $rootScope.itemCount = itemTempCounter;
    };
                               
    products.list = [];
    
    products.loadServerDB = function() {
        if (showDebugOutput) { $log.info("Loading the product database from the server..."); }
        
        $http({
            method: "GET",
            url: siteURL + "products.json"
        }).then(function(response) {
            for (var p = 0; p < response.data.length; p++) {
                products.list.push(new Product(response.data[p]['itemID'], 
                                               response.data[p]['itemname'], 
                                               response.data[p]['price'],
                                               response.data[p]['category'],
                                               response.data[p]['img']));
            }
            if (showDebugOutput) { $log.info("Product database load from server success."); }
            products.loadCartFromDisk();
            
        });
    };
    
    products.loadCartFromDisk = function() {
        
        if (showDebugOutput) { $log.info("Loading the user's cart from disk..."); }
        
        var cartFromStorage = localStorage["cart"];

        if (cartFromStorage != null && cartFromStorage.length != 0) {
            cartFromStorage = cartFromStorage.split("|");
            for (var k=0; k < cartFromStorage.length; k++) {
                var loadedIndex = products.find(cartFromStorage[k]);
                if (loadedIndex > -1) {
                    products.quantity.bump(loadedIndex);
                }
            }
        }
        
        if (showDebugOutput) { $log.info("Cart load from disk success."); }
        
        products.counter();
        
        if (document.getElementById("cart") != null) {
            products.cartDisplay.setArray();
        }
    };
    
    products.find = function(id) {
        id = id.toLowerCase();
        
        for (var s=0; s<products.list.length; s++) {
            if (id == products.list[s].getId().toLowerCase()) {
                return s;
            }
        }
        $log.error("Product ID '" + id + "' was not found!")
        return -1;
    };
    
    products.quantity = {
        bump: function(index) {
            products.list[index].bumpQuantity();
//            products.counter();
        },
        set: function(index, quantity) {
            products.list[index].setQuantity(quantity);
//            products.counter();
        },
        clear: function(index) {
            products.list[index].setQuantity(0);
//            products.counter();
        },
        get: function(index) {
            return products.list[index].getQuantity();
        }
        
    };
    
    products.getItem = function(id) {
        return products.list[id];
    };
    
    products.cartDisplay = {
        setArray: function() {
            
            if (showDebugOutput) { $log.info("Setting the cart display!"); }
            
            if (products.list.length > 0) {
                var tempCartArray = [];
                for (var q=0; q < products.list.length; q++) {
                    if (products.list[q].getQuantity() > 0) {
                        tempCartArray.push({
                            name: products.list[q].getName(),
                            id: products.list[q].getId(),
                            quantity: products.list[q].getQuantity(),
                            price: products.list[q].getPrice(),
                            extPrice: products.list[q].getExtendedPrice(),
                            img: siteURL + products.list[q].getImgPath()
                        });
                    }
                }
                
                $rootScope.cartArray = tempCartArray;
                $rootScope.showCart = true;
                
            } else {
                $rootScope.showCart = false;
            }
        },
        update: function() {
            
            if (showDebugOutput) { $log.info("Updating the cart from the display!"); }
            
            $('#cart input.productQuantity').each(function() {
                if ($.isNumeric($(this).val()) && $(this).val() >= 0) {
                    products.quantity.set(products.find($(this).attr("data-itemid")), $(this).val());
                }
            });
            
            products.cartDisplay.setArray();
            products.counter();
        }
    }
    
    products.loadServerDB();
    
    return products;
}]);

app.service('itemCounterService', ['productHandler', function(productHandler) {
    return {
        do: function() {
            var itemTempCounter = 0
            for (var c=0; c < productHandler.list.length; c++) {
                itemTempCounter += productHandler.quantity.get(c);
            }
            $log.debug(itemTempCounter);

            return itemTempCounter;
        }
    }
}]);

app.provider('cartProvider', function() {
    // Configuration
//    this.cartURL = 'cart.html';
//    this.homeURL = 'index.html';
//    this.salesTaxRate = 0.06;
//    this.freeShipping = true;
//    this.freeShippingMin = 29.99;
//    this.shippingRate = 8.99;
////    this.cartName = "cart";
    
    this.cartURL = "cart.html";
    this.homeURL = "index.html";
    this.salesTaxRate = 0.06;
    this.freeShipping = false;
    this.freeShippingMin = 49.00;
    this.shippingRate = 7.95;
    this.cartName = "bgparts_cart";

    
    // Functions available to controllers
    this.$get = ['notifyService', 'productHandler', '$log', function(notifyService, productHandler, $log) {
        var cartPVDR = {
            requestAdd: function(id) {
                id = productHandler.find(id);
                
                if (id > -1) {
                    if (productHandler.quantity.get(id) == 0) {
                        notifyService.alert("The item '" + productHandler.list[id].getName() + "' has been added to your cart.");
                        this.add(id);
                    } else {
                        notifyService.confirm("The item '" + productHandler.list[id].getName() + "' is already " +
                                              "in your cart. Are you sure you want to add another?", "Ad",
                                              "Yes", "No").then(function(userInput) {
                            if (userInput) {
                                cartPVDR.add(id);
                            }
                        });
                    }
                } else {
                    notifyService.alert("Whoops! This site has encountered an error. Don't worry: it's not your fault. " +
                                        "The developer of this site has made an error when programming item IDs.", "Error");
                }
            },
            add: function(id) {
                productHandler.quantity.bump(id);
                productHandler.counter();
                this.write();
            },
            clear: function() {
                localStorage.removeItem(cartPVDR.cartName);
                window.location.reload();
            },
            toString: function() {
                var tempCartStrItems = []
                
                for (var i=0; i<productHandler.list.length; i++) {
                    for (var j=0; j<productHandler.quantity.get(i); j++) {
                        tempCartStrItems.push(productHandler.list[i].getId());
                    }
                }
                
                return tempCartStrItems.join("|");
            },
            write: function() {
                localStorage["cart"] = this.toString();
            }
        }
        
        return cartPVDR;
    }];
});

app.service("cartInterfaceService",  ['$log', '$rootScope', 'productHandler', 
                                      function($log, $rootScope, productHandler) {
    serviceObject = {
        setCartDisplayArray: function() {
            
            var tempCartArray = [];
            
            for (var q=0; q < productHandler.list.length; q++) {
                if (productHandler.list[q].getQuantity() > 0) {
                    tempCartArray.push({
                        name: productHandler.list[q].getName(),
                        id: productHandler.list[q].getId(),
                        quantity: productHandler.list[q].getQuantity(),
                        price: productHandler.list[q].getPrice(),
                        extPrice: productHandler.list[q].getExtendedPrice(),
                        img: siteURL + productHandler.list[q].getImgPath()
                    });
                }
            }
            $log.debug(tempCartArray);
            $rootScope.cartArray = tempCartArray;
//            $rootScope.$apply();
        },
        updateCartFromDisplay: function() {
            $('#cart input.productQuantity').each(function() {
                if ($.isNumeric($(this).val()) && $(this).val() >= 0) {
                    productHandler.quantity.set(productHandler.find($(this).attr("data-itemid")), $(this).val());
                }
            });
            
            serviceObject.setArray();
            productHandler.counter();
        }
    }
    
    return serviceObject;
}]);


app.controller("cartCtrl", ['$scope', '$log', 'cartProvider', 'productHandler',
                            function($scope, $log, cartProvider, productHandler) {
    
    $scope.cartAdd = function(id) {
        cartProvider.requestAdd(id);
    }
    
    $scope.updateCart = function() {
        productHandler.cartDisplay.update();
    }
    
}]);