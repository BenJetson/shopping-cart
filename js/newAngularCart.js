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

app.factory('storeManager', ['$http', '$log', '$rootScope', 'notifyService', 
                             function($http, $log, $rootScope, notifyService) {
    
    $rootScope.itemCount = 0;
    
    var self = {
        config: {
            siteURL: "https://bgodfr5236.github.io/shopping-cart/",
            productDbURL: "products.json",
            cartURL: "cart.html",
            homeURL: "index.html",
            salesTaxRate: 0.06,
            freeShipping: true,
            freeShippingMin: 49.00,
            shippingRate: 7.95,
            cartName: "bgparts_cart"
        },
        productDB: {
            list: [],
            load: function() {
                if (showDebugOutput) { $log.info("Loading the product database from the server..."); }

                $http({
                    method: "GET",
                    url: self.config.siteURL + self.config.productDbURL
                }).then(function(response) {
                    for (var p = 0; p < response.data.length; p++) {
                        self.productDB.list.push(new Product(response.data[p]['itemID'], 
                                                       response.data[p]['itemname'], 
                                                       response.data[p]['price'],
                                                       response.data[p]['category'],
                                                       response.data[p]['img']));
                    }
                    if (showDebugOutput) { $log.info("Product database load from server success."); }
                    self.cart.loadFromDisk();

                });
            },
            find: find = function(id) {
                id = id.toLowerCase();

                for (var s=0; s < self.productDB.list.length; s++) {
                    if (id == self.productDB.list[s].getId().toLowerCase()) {
                        return s;
                    }
                }
                $log.error("Product ID '" + id + "' was not found!")
                return -1;
            }
        },
        cart: {
            loadFromDisk: function() {

                if (showDebugOutput) { $log.info("Loading the user's cart from disk..."); }

                var cartFromStorage = localStorage["cart"];

                if (cartFromStorage != null && cartFromStorage.length != 0) {
                    cartFromStorage = cartFromStorage.split("|");
                    for (var k=0; k < cartFromStorage.length; k++) {
                        var loadedIndex = self.productDB.find(cartFromStorage[k]);
                        if (loadedIndex > -1) {
                            self.cart.quantity.bump(loadedIndex);
                        }
                    }
                }

                if (showDebugOutput) { $log.info("Cart load from disk success."); }

                self.cart.itemCounter();

                if (document.getElementById("cart") != null) {
                    self.cart.display.setup();
                }
            },
            quantity: {
                bump: function(index) {
                    self.productDB.list[index].bumpQuantity();
        //            products.counter();
                },
                set: function(index, quantity) {
                    self.productDB.list[index].setQuantity(quantity);
        //            products.counter();
                },
                clear: function(index) {
                    self.productDB.list[index].setQuantity(0);
        //            products.counter();
                },
                get: function(index) {
                    return self.productDB.list[index].getQuantity();
                }

            },
            requestAdd: function(id) {
                id = self.productDB.find(id);
                
                if (id > -1) {
                    if (self.cart.quantity.get(id) == 0) {
                        notifyService.alert("The item '" + self.productDB.list[id].getName() + "' has been added to your cart.");
                        self.cart.add(id);
                    } else {
                        notifyService.confirm("The item '" + self.productDB.list[id].getName() + "' is already " +
                                              "in your cart.", "Add another?",
                                              "Yes", "No").then(function(userInput) {
                            if (userInput) {
                                self.cart.add(id);
                            }
                        });
                    }
                } else {
                    notifyService.alert("Whoops! This site has encountered an error. Don't worry: it's not your fault. " +
                                        "The developer of this site has made an error when programming item IDs.", "Error");
                }
            },
            add: function(id) {
                if (showDebugOutput) { $log.info("Adding item with id '" + id + "' to the cart...")}
                self.cart.quantity.bump(id);
                self.cart.itemCounter();
                self.cart.write();
                if (showDebugOutput) { $log.info("Item with id '" + id + "' was sucessfully added to the cart.")}
            },
            clear: function() {
                if (showDebugOutput) { $log.info("Emptying cart..."); }
                for (var z=0; z < self.productDB.list.length; z++) {
                    self.cart.quantity.set(z, 0);
                }
                self.cart.write();
                self.cart.itemCounter();
                if (showDebugOutput) { $log.info("Emptying cart success."); }
            },
            toString: function() {
                var tempCartStrItems = []
                
                for (var i=0; i < self.productDB.list.length; i++) {
                    for (var j=0; j < self.cart.quantity.get(i); j++) {
                        tempCartStrItems.push(self.productDB.list[i].getId());
                    }
                }
                
                return tempCartStrItems.join("|");
            },
            write: function() {
                if (showDebugOutput) { $log.info("Writing cart to disk..."); }
                localStorage["cart"] = this.toString();
                if (showDebugOutput) { $log.info ("Writing cart to disk success."); }
            },
            itemCounter: function() {
                var itemTempCounter = 0;
                for (var c=0; c < self.productDB.list.length; c++) {
                    itemTempCounter += self.cart.quantity.get(c);
                }

                $rootScope.itemCount = itemTempCounter;
                return itemTempCounter;
            },
            getPriceInfo: function() {
                
                var subTotal = 0;
                for (var d=0; d<self.productDB.list.length; d++) {
                    subTotal += self.productDB.list[d].getExtendedPrice();
                }
                
                if (self.config.freeShipping && subTotal >= self.config.freeShippingMin) {
                    var shippingCost = 0;
                } else {
                    var shippingCost = self.config.shippingRate;
                }
                
                var tax = subTotal * self.config.salesTaxRate;
                
                var grandTotal = subTotal + shippingCost + tax;
                
                return {
                    'subTotal': subTotal.toFixed(2),
                    'shippingCost': shippingCost.toFixed(2),
                    'tax': tax.toFixed(2),
                    'grandTotal': grandTotal.toFixed(2)
                };
            },
            display: {
                setup: function() {

                    if (showDebugOutput) { $log.info("Setting cart display..."); }

                    if (self.productDB.list.length > 0 && self.cart.itemCounter() > 0) {
                        var tempCartArray = [];
                        for (var q=0; q < self.productDB.list.length; q++) {
                            if (self.productDB.list[q].getQuantity() > 0) {
                                tempCartArray.push({
                                    name: self.productDB.list[q].getName(),
                                    id: self.productDB.list[q].getId(),
                                    quantity: self.productDB.list[q].getQuantity(),
                                    price: self.productDB.list[q].getPrice().toFixed(2),
                                    extPrice: self.productDB.list[q].getExtendedPrice().toFixed(2),
                                    img: siteURL + self.productDB.list[q].getImgPath()
                                });
                            }
                        }
                        
                        var cartPriceInfo = self.cart.getPriceInfo();
                        
                        $rootScope.cartArray = tempCartArray;
                        $rootScope.cartSubTotal = cartPriceInfo['subTotal'];
                        $rootScope.cartShipCost = cartPriceInfo['shippingCost'];
                        $rootScope.cartTax = cartPriceInfo['tax'];
                        $rootScope.cartGrandTotal = cartPriceInfo['grandTotal'];
                        $rootScope.showCart = true;

                    } else {
                        $rootScope.showCart = false;
                    }
                    
                    if (showDebugOutput) { $log.info("Setting cart display success."); }
                    
                },
                update: function() {

                    if (showDebugOutput) { $log.info("Updating the cart from the display..."); }

                    $('#cart input.productQuantity').each(function() {
                        if ($.isNumeric($(this).val()) && $(this).val() >= 0) {
                            self.cart.quantity.set(self.productDB.find($(this).attr("data-itemid")), $(this).val());
                        }
                    });
                    
                    self.cart.write();
                    self.cart.display.setup();
                    self.cart.itemCounter();
                    
                    if (showDebugOutput) { $log.info("Updating cart from display success."); }
                    
                }
            }
            
        }
    }
    
    self.productDB.load();
    
    return self;
}]);

//app.provider('cartProvider', function() {
//    // Configuration
////    this.cartURL = 'cart.html';
////    this.homeURL = 'index.html';
////    this.salesTaxRate = 0.06;
////    this.freeShipping = true;
////    this.freeShippingMin = 29.99;
////    this.shippingRate = 8.99;
//////    this.cartName = "cart";
//    
//    this.cartURL = "cart.html";
//    this.homeURL = "index.html";
//    this.salesTaxRate = 0.06;
//    this.freeShipping = false;
//    this.freeShippingMin = 49.00;
//    this.shippingRate = 7.95;
//    this.cartName = "bgparts_cart";
//
//    
//    // Functions available to controllers
//    this.$get = ['notifyService', 'productHandler', '$log', function(notifyService, productHandler, $log) {
//        var cartPVDR = {
//    
//        }
//        
//        return cartPVDR;
//    }];
//});

app.controller("cartCtrl", ['$scope', '$log', 'storeManager',
                            function($scope, $log, storeManager) {
    
    $scope.cartAdd = function(id) {
        storeManager.cart.requestAdd(id);
    }
    
    $scope.updateCart = function() {
        storeManager.cart.display.update();
    }
    
    $scope.emptyCart = function() {
        storeManager.cart.clear();
    }
    
}]);