app.controller('storeCtrl', function($scope, $mdDialog, $log, $http) {
    
    $scope.products = []
    
    $http({
        method: "GET",
        url: "/products.json"
    }).then(function(response) {
        
        $scope.productsAsJSON = response.data;
        
        for (i = 0; i < $scope.productsAsJSON.length; i++) {
            $scope.products.push(new Product($scope.zeroPadString(i), $scope.productsAsJSON[i]['itemname'], $scope.productsAsJSON[i]['price']));
        }
        
        $log.debug($scope.products);
        
    });
    
    $scope.sales_tax_rate = 0.06;
    $scope.free_shipping = false;
    $scope.shipping_rate = 6.99;
    $scope.home_page_url = "index.html";
    $scope.cart_url = "cart.html";
    $scope.checkout_url = "checkout.html";
    $scope.cart_name = "bgparts_cart";
    
    $scope.zeroPadString = function(number) {
        if (number >= 0 && number < 1000) {
            return ("0000" + number).slice(-4);
        } else if (number < 0 && number > -1000) {
            return "-" + ("0000" + Math.abs(num)).slice(-4);
        } else {
            return number;
        }
    }
    
    $scope.loadCart = function()
    {
        $scope.cart_str = localStorage[cart_name];
        
        if ($scope.cart_str!=null && $scope.cart_str.length!=0)
        {
            $scope.item_ids = $scope.cart_str.split("|");
            
            
            for ($scope.i=0; i<$scope.item_ids.length; i++)
            {
                $scope.index = $scope.search($scope.item_ids[i]);
                
                if (index>-1)
                {
                    $scope.q = $scope.products[index].getQuantity() + 1;
                    $scope.products[index].setQuantity(q);
                }
            }
        }
        
        $scope.refresh();
    }
    
    $scope.updateCart = function(){
		
		$scope.my_cart = document.getElementById('cart_form');
		$scope.inputs = $scope.my_cart.getElementsByTagName('input');
        
		for (i=0; i<$scope.inputs.length; i++)
		{
			$scope.id = $scope.inputs[i].name;
			$scope.quantity = Number($scope.inputs[i].value);
            
			$scope.index = $scope.search(id);
            
			if ($scope.index>-1 && !isNaN($scope.quantity) && $scope.quantity>=0)
			{
				$scope.products[index].setQuantity(quantity);
			}
		}
        
		$scope.writeCart();
		$scope.refresh();
	}
    
    $scope.addToCart = function(id) {
        $scope.index = $scope.search(id);

        if ($scope.index>-1)
        {
            $scope.name = $scope.products[$scope.index].getName();
            $scope.quantity = $scope.products[$scope.index].getQuantity();
            $scope.addIt = false;

            if ($scope.quantity==0)
            {
                alert("The following item was added to your cart: " + $scope.name)
                $scope.addIt = true;
            }
            else
            {
                $scope.addIt = confirm("The item \"" + $scope.name + "\" is already in your cart. Would you like to add another?");
            }
        }
        else
        {
            alert("Error: Invalid product ID");
        }

        if ($scope.addIt)
        {
            $scope.products[$scope.index].setQuantity(quantity + 1);
            $scope.writeCart();
        }

        $scope.refresh();
    }
    
    $scope.setChoice = function(option, button_id) {
        // This will need to be modified to accomodate ng-click elements.
        if (option.value.length == 0) {
            document.getElementById(button_id).disabled = true;
        }
        else {
            document.getElementById(button_id).disabled = false;
            document.getElementById(button_id).onclick = function() { $scope.addToCart(option.value); };
        }
    }

    
    $scope.writeCart = function() {
        $scope.cart_str = $scope.cartToString();
        localStorage[$scope.cart_name] = $scope.cart_str;
        $scope.refresh();
    }
    
    $scope.refresh = function() {
        $scope.cart_area = document.getElementById("cart")
        $scope.item_count_area = document.getElementById("item_count")
        $scope.cart_link = document.getElementById("cart_link");
        $scope.checkout_link = document.getElementById("checkout_link");
        $scope.num_items = getNumItems();

        // draw cart if on cart page
        if ($scope.cart_area != null) $scope.cart_area.innerHTML = $scope.cartToTable();
        if ($scope.cart_area != null) $scope.cart_area.innerHTML = $scope.cartToTable();

        // update item count
        if ($scope.item_count_area != null) $scope.item_count_area.innerHTML = $scope.num_items;

        // update links
        if ($scope.cart_link != null) $scope.cart_link.href = $scope.cart_url;

        if ($scope.checkout_link != null)
        {
            if ($scope.num_items==0) $scope.checkout_link.href = cart_url;
            else              $scope.checkout_link.href = checkout_url;
        }
    }
    
    $scope.getNumItems = function() {
        $scope.count = 0;

        for (i=0; i<$scope.products.length; i++)
        {
            $scope.count += $scope.products[i].getQuantity();
        }

        return count;
    }
    
    $scope.emptyCart = function() {
        localStorage.removeItem(cart_name);
        $scope.refresh();
    }
    
    $scope.cartToTable = function() {
        $scope.html_cart_str = "";
        $scope.sub_total = 0;
        $scope.tax = 0;
        $scope.total = 0;
        $scope.num_items = getNumItems();

        if ($scope.num_items>0)
        {
            $scope.html_cart_str = "<p>Please review your order. Press 'Update' to change quantities. " +
                            "To remove an item from your card, change the quantity to zero. " +
                            "Press 'Checkout' when you are ready to place your order.";

            $scope.html_cart_str += "<div class='cart'>"
            $scope.html_cart_str += "<form id='cart_form' action='" + $scope.checkout_url + "'>";
            $scope.html_cart_str += "<table>";
            $scope.html_cart_str += "<tr class='column-headings'>";
            $scope.html_cart_str += "<th>Item</th>";
            $scope.html_cart_str += "<th>Quantity</th>";
            $scope.html_cart_str += "<th>Unit Price</th>";
            $scope.html_cart_str += "<th>Ext. Price</th>";
            $scope.html_cart_str += "</tr>";

            for (i=0; i<$scope.products.length; i++)
            {
                $scope.id = $scope.products[i].get_id();
                $scope.name = $scope.products[i].get_name();
                $scope.quantity = $scope.products[i].get_quantity();
                $scope.price = $scope.products[i].get_price();
                $scope.extended_price = $scope.products[i].getExtendedPrice();

                $scope.sub_total += $scope.extended_price;
                $scope.tax = $scope.sub_total * $scope.sales_tax_rate;
                $scope.total = $scope.sub_total + $scope.tax;

                if ($scope.quantity>0)
                {
                    $scope.html_cart_str += "<tr class='item'>";
                    $scope.html_cart_str += "<td class='item_name'>" + $scope.name + "<br><span class='item_id'>ID: " + $scope.id + "</span></td>";
                    $scope.html_cart_str += "<td class='item_quantity'><input name='" + $scope.id + "' type='text' size='3' value='" + $scope.quantity + "' /></td>";
                    $scope.html_cart_str += "<td class='item_price'>$" + $scope.price.toFixed(2) + "</td>";
                    $scope.html_cart_str += "<td class='item_total'>$" + $scope.extended_price.toFixed(2) + "</td>";
                    $scope.html_cart_str += "</tr>";
                }
            }

            $scope.html_cart_str += "<tr class='subtotal'>";
            $scope.html_cart_str += "<th class='subtotal'colspan='3'>Subtotal:</th>";
            $scope.html_cart_str += "<td class='subtotal'>$" + $scope.sub_total.toFixed(2) + "</th>";
            $scope.html_cart_str += "</tr>";

            $scope.html_cart_str += "<tr class='tax'>";
            $scope.html_cart_str += "<th class='tax' colspan='3'>Tax:</th>";
            $scope.html_cart_str += "<td class='tax'>$" + $scope.tax.toFixed(2) + "</th>";
            $scope.html_cart_str += "</tr>";

            if (!free_shipping)
            {
                $scope.html_cart_str += "<tr class='shipping'>";
                $scope.html_cart_str += "<th class='shipping' colspan='3'>Shipping:</th>";
                $scope.html_cart_str += "<td class='shipping'>$" + shipping_rate.toFixed(2) + "</td>";
                $scope.html_cart_str += "</tr>";

                $scope.total += shipping_rate;
            }

            $scope.html_cart_str += "<tr class='total'>";
            $scope.html_cart_str += "<th class='total' colspan='3'>Total:</th>";
            $scope.html_cart_str += "<td class='total'>$" + $scope.total.toFixed(2) + "</th>";
            $scope.html_cart_str += "</tr>";
            $scope.html_cart_str += "</table>"

            $scope.html_cart_str += "<div class='buttons'>";
            $scope.html_cart_str += "<input type='button' value='Update' ng-click='$scope.updateCart()' />";
            $scope.html_cart_str += "<input type='submit' value='Checkout' />";
            $scope.html_cart_str += "</form>"
            $scope.html_cart_str += "</div>";
        }
        else
        {
            $scope.html_cart_str = "<p class='no_items'>Your cart is empty. <a href='" + $scope.home_page_url + "'>Go shopping!</a></p>";
        }

        return $scope.html_cart_str;
    }
    
    $scope.cartToString = function() {
        $scope.cart_str ="";

        for (var i=0; i<$scope.products.length; i++)
        {
            $scope.q = $scope.products[i].getQuantity();

            for (var j=0; j<$scope.q; j++)
            {
                $scope.cart_str += $scope.products[i].getId() + "|";
            }
        }

        $scope.cart_str = $scope.cart_str.substring(0,cart_str.length-1);

        return $scope.cart_str;
    }
    
    $scope.search = function(id) {
        $scope.search_id = id.toLowerCase();

        for (var i=0; i<$scope.products.length; i++)
        {
            $scope.this_id = $scope.products[i].getId().toLowerCase();

            if ($scope.this_id==$scope.search_id)
            {
                return i;
            }
        }

        return -1;
    }
    
    $scope.listProducts = function() {
        for (i=0; i<$scope.products.length; i++)
        {
            document.write($scope.products[i].toString() + "<br />");
        }
    }
    
});


function Product(id,name,price)
{
    // fields set from constructor
    this.id = String(id);
    this.name = String(name);
    this.price = Number(price);
    this.quantity = 0;
    
    // setters
    this.setQuantity = function(n) { quantity = n };
    
    // getters
    this.getId = function() { return id; };
    this.getName = function() { return name; };
    this.getPrice = function() { return price; };
    this.getQuantity = function() { return quantity; };
    this.getExtendedPrice = function() { return quantity * price; };
    
    // for testing only
    this.toString = function()
    {
        return id + "|" + name + "|" + price + "|" + quantity + "|" + this.getExtendedPrice();
    }
}