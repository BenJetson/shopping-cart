//************************************* Shopping Cart *************************************//
//*                                                                                       *//
//* Author: Jon Cooper                                                                    *//
//* Version: 1.0                                                                          *//
//* Release: May 1, 2016                                                                  *//
//*                                                                                       *//
//*                                                                                       *//
//* Instructions:                                                                         *//
//*                                                                                       *//
//* 1. Copy the files cart.js, and cart.css to the folder with your site.                 *//
//*                                                                                       *//
//* 2. Open the cart.js file and edit the configuration section.                          *//
//*                                                                                       *//
//*     a. Create as many products as you want. Just make sure that the ID is unique for  *//
//*        each item. IDs don't need to be sequential and they can include any alpha-     *//
//*        numeric character. Product IDs are not case-sensitive.                         *//
//*     b. Edit the shipping section. Set free_shipping to false if you plan on charging  *//
//*        for shipping, true otherwise. Set shipping_rate to the amount you'd like to    *//
//*        charge for shipping.                                                           *//
//*     c. Make sure the site settings match the file names used on your site.            *//
//*     d. Optionally, you can edit the cookie settings. The cookie_name doesn't affect   *//
//*        how the site works. The cookie_persistence is the number of days the cart      *//
//*        cookie will last before being deleted.                                         *//
//*                                                                                       *//
//* 3. Add the following lines to each page on your site:                                 *//
//*                                                                                       *//
//*     <link rel="stylesheet" href="cart.css" type="text/css" />                         *//
//*     <script src="js/cart.js"></script>                                                *//
//*                                                                                       *//
//* 4. Add an onload event to the body of each page that needs to read cart data.         *//
//*                                                                                       *//
//*     <body onload="loadCart()">                                                        *//
//*                                                                                       *//
//* 5. On the cart page, include empty div tags with the id="cart" where you would like   *//
//*    the cart to appear. You should not put anything between the tags. The cart.js      *//
//*    file has functions that will automatically create a table of all items in the      *//
//*    cart between the tags.                                                             *//
//*                                                                                       *//
//*     <div id="cart"></div>                                                             *//
//*                                                                                       *//
//*    If you preview the cart at this point, you should see a message stating the cart   *//
//*    is empty along with a working link to the home page.                               *//
//*                                                                                       *//
//* 6. For each item you would like to add to the cart, you'll need to create an add-to-  *//
//*    cart button. The buttons onclick attribute should call the addToCart function and  *//
//*    pass the items ID as a parameter.                                                  *//
//*                                                                                       *//
//*     <input type="button" onclick="addToCart('001')" value="Add to cart" />            *//
//*                                                                                       *//
//*    You can test by clicking the button. Each time you click a button, a popup should  *//
//*    notify you that the item was added to the cart. Visit the cart page and confirm    *//
//*    that the items were added to the cart and price calculations are correct.          *//
//*                                                                                       *//
//* 7. The page that confirms an order has been successfully placed can use an onload     *//
//*    event to empty the cart.                                                           *//
//*                                                                                       *//
//*     <body onload="emptyCart()">                                                       *//
//*                                                                                       *//
//* 8. Modify cart.css as you see fit. Most cells have unique class names which should    *//
//*    give plenty of options regarding styling the cart table.                           *//
//*                                                                                       *//
//* More options:                                                                         *//
//*                                                                                       *//
//* a. You can also add tags to display the count of items in the cart. Each time an      *//
//*    item is added/removed from the cart, item count will update automatically.         *//
//*                                                                                       *//
//*     <span id="item_count">0</span>                                                    *//
//*                                                                                       *//
//* b. You do not need to add a link to your checkout page as it will  be reachable by    *//
//*    clicking 'checkout' on the cart page. However, if you do choose to provide a link  **/
//*    to your checkout page, add an id="checkout_link" attribute. Then the link will     *//
//*    point to the cart rather than checkout if the cart page is empty.                  *//
//*                                                                                       *//
//*     <a id="checkout_link" href="checkout.html">Checkout</a>                           *//
//*                                                                                       *//
//* c. Cart Link Widget:                                                                  *//
//*                                                                                       *//
//*    Instead of options a and b above, you can also include a widget which displays a   *//
//*    cart icon, a link to the cart, the the number of items in the car, and a dynamic   *//
//*    link to the cart or checkout page. Copy the html code from widget.txt to the html  *//
//*    source code on the pages for which you would like to display the widget. Links     *//
//*    created will reflect those configured in 'site settings' below. CSS for the        *//
//*    widget can be found in cart.css.                                                   *//
//*                                                                                       *//
//*                                                                                       *//
//* Disclaimer/Known isssues:                                                             *//
//*                                                                                       *//
//* This code is intended for instructional purposes only. No claims of fitness for       *//
//* actual online shopping is expressed or implied. (What I'm saying here is that this    *//
//* code does a pretty good job at replicating the front-end experience of an online      *//
//* shopping site. However, you'd be nuts to use this unless in conjuction with some      *//
//* robust server-side authentication scripts.)                                           *//
//*                                                                                       *//
//*                                                                                       *//
//* Copyright:                                                                            *//
//*                                                                                       *//
//* You are free to modify this code as you like. You may share this code, modified or    *//
//* in its original form so long as this notice remains intact.                           *//
//*                                                                                       *//
//*****************************************************************************************//



//********************************** CART CONFIGURATION ***********************************//

// products you sell by (id, name, price)
var products = new Array();
products[0] = new Product("001", "Whatchahoozit",  0.99);
products[1] = new Product("002", "Thingamabob",    9.95);
products[2] = new Product("003", "Doomahitchey",  20.00);


// tax rate for your state
var sales_tax_rate = 0.06;


// shipping
var free_shipping = false;
var shipping_rate = 6.99; // (will not be applied if free_shipping = true)


// site settings
var home_page_url = "index.html";
var cart_url = "cart.html";
var checkout_url = "checkout.html";


// optional settings
var cart_name = "my_cart"; // (must change if multiple carts run on same domain)
var cart_persistence = 2;  // (in days)



//************** END OF CONFIGURATION, DO NOT* MODIFY CODE BELOW THIS LINE!! **************//
//                     ( * Unless you really know what you are doing. )                    //


// public functions, for use on html pages

/**
 * Reads the cart string from local storage and sets product quantities. Then refreshes display.
 * Method should be called as body onload event for all pages that implement cart.
 *
 * Usage: <body onload="loadCart()">
 */
function loadCart()
{
    var cart_str = localStorage[cart_name];

    if (cart_str!=null && cart_str.length!=0)
    {
        var item_ids = cart_str.split("|");


        for (var i=0; i<item_ids.length; i++)
        {
            var index = search(item_ids[i]);

            if (index>-1)
            {
                var q = products[index].getQuantity() + 1;
                products[index].setQuantity(q);
            }
        }
    }

    refresh();
}

/**
 * Adds item to cart. Include button on product pages.
 *
 * Usage: <input type="button" onclick="addToCart("[item id]")" value="Add to cart" />
 *
 * @param {String} id of product to add
 */
function addToCart(id)
{
    var index = search(id);

    if (index>-1)
    {
        var name = products[index].getName();
        var quantity = products[index].getQuantity();
        var addIt = false;

        if (quantity==0)
        {
            alert("The following item was added to your cart: " + name)
            addIt = true;
        }
        else
        {
            addIt = confirm("The item \"" + name + "\" is already in your cart. Would you like to add another?");
        }
    }
    else
    {
        alert("Error: Invalid product ID");
    }

    if (addIt)
    {
        products[index].setQuantity(quantity + 1);
        writeCart();
    }

    refresh();
}

/**
 * Deletes the cart string from local storage, effectively setting all item quanties to zero.
 * Call after order is successfully placed.
 *
 * Usage: <body onload="emptyCart()">
 */
function emptyCart()
{
    localStorage.removeItem(cart_name);
    refresh();
}


/**
 * Product object. Product has ID, name, and price set by constructor. Quantity is set
 * by setter method. Getter methods return id, name, price, quantity, and extended price.
 *
 * @param {String} id unique product ID
 * @param {String} name product name
 * @param {Number} price price of product
 */
function Product(id,name,price)
{
    // fields set from constructor
    this.id = String(id);
    this.name = String(name);
    this.price = Number(price);
    var quantity = 0;

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


// helper functions. don't reference these on html pages. for interal use only.

/**
 * Searches the products array for a product ID and returns the index of that product.
 * Product IDs are not case-sensitive.
 *
 * @param {String} id  ID of product to find
 * @returns {Number} index of product, -1 if product ID is not found
 */
function search(id)
{
    var search_id = id.toLowerCase();

    for (var i=0; i<products.length; i++)
    {
        var this_id = products[i].getId().toLowerCase();

        if (this_id==search_id)
        {
            return i;
        }
    }

    return -1;
}

/**
 * Returns a pipe-delimited list of IDs for all products contained in cart.
 * The ID is contained in string multiple times if quantity is greater than 1.
 *
 * @returns {String} HTML code for shopping cart
 */
function cartToString()
{
    var cart_str ="";

    for (var i=0; i<products.length; i++)
    {
        q = products[i].getQuantity();

        for (var j=0; j<q; j++)
        {
            cart_str += products[i].getId() + "|";
        }
    }

    cart_str = cart_str.substring(0,cart_str.length-1);

    return cart_str;
}

/**
 * Writes the cart string (a list of product ids) to local storage.
 */
function writeCart()
{
    var cart_str = cartToString();
    refresh();
}

/**
 * Gets new quantities from cart form, writes new cart string.
 */
function updateCart()
{
    var my_cart = document.getElementById('cart_form');
    var inputs = my_cart.getElementsByTagName('input');

    for (i=0; i<inputs.length; i++)
    {
        var id = inputs[i].name;
        var quantity = Number(inputs[i].value);

        var index = search(id);

        if (index>-1 && !isNaN(quantity) && quantity>=0)
        {
            products[index].setQuantity(quantity);
        }
    }

    writeCart();
    refresh();
}

/**
 * Refreshes display of cart data.
 */
function refresh()
{
    var cart_area = document.getElementById("cart")
    var item_count_area = document.getElementById("item_count")
    var cart_link = document.getElementById("cart_link");
    var checkout_link = document.getElementById("checkout_link");
    var num_items = getNumItems();

    // draw cart if on cart page
    if (cart_area != null) cart_area.innerHTML = cartToTable();
    if (cart_area != null) cart_area.innerHTML = cartToTable();

    // update item count
    if (item_count_area != null) item_count_area.innerHTML = num_items;

    // update links
    if (cart_link != null) cart_link.href = cart_url;

    if (checkout_link != null)
    {
        if (num_items==0) checkout_link.href = cart_url;
        else              checkout_link.href = checkout_url;
    }
}

/**
 * Returns the sum of quantities for each item in the shopping cart.
 *
 * @returns total number of items in cart
 */
function getNumItems()
{
    var count = 0;

    for (i=0; i<products.length; i++)
    {
        count += products[i].getQuantity();
    }

    return count;
}

/**
 * Returns cart data as HTML table. If desired, edit style in cart.css.
 *
 * @returns {String} HTML code for shopping cart
 */
function cartToTable()
{
    var html_cart_str = "";
    var sub_total = 0;
    var tax = 0;
    var total = 0;
    var num_items = getNumItems();

    if (num_items>0)
    {
        html_cart_str = "<p>Please review your order. Press 'Update' to change quantities. " +
                        "To remove an item from your card, change the quantity to zero. " +
                        "Press 'Checkout' when you are ready to place your order.";

        html_cart_str += "<form id='cart_form' action='" + checkout_url + "'>";
        html_cart_str += "<table class='cart'>";
        html_cart_str += "<tr>";
        html_cart_str += "<th>Item Number</th>";
        html_cart_str += "<th>Item Name</th>";
        html_cart_str += "<th>Quantity</th>";
        html_cart_str += "<th>Item Price</th>";
        html_cart_str += "<th>Item Total</th>";
        html_cart_str += "</tr>";

        for (i=0; i<products.length; i++)
        {
            var id = products[i].getId();
            var name = products[i].getName();
            var quantity = products[i].getQuantity();
            var price = products[i].getPrice();
            var extended_price = products[i].getExtendedPrice();

            sub_total += extended_price;
            tax = sub_total * sales_tax_rate;
            total = sub_total + tax;

            if (quantity>0)
            {
                if (i%2==0) html_cart_str += "<tr class='item odd'>";
                else html_cart_str += "<tr class='item even'>";

                html_cart_str += "<td class='item_id'>" + id + "</td>";
                html_cart_str += "<td class='item_name'>" + name + "</td>";
                html_cart_str += "<td class='item_quantity'><input name='" + id + "' type='text' size='3' value='" + quantity + "' /></td>";
                html_cart_str += "<td class='item_price'>$" + price.toFixed(2) + "</td>";
                html_cart_str += "<td class='item_total'>$" + extended_price.toFixed(2) + "</td>";
                html_cart_str += "</tr>";
            }
        }

        if (!free_shipping)
        {
            html_cart_str += "<tr class='shipping'>";
            html_cart_str += "<th class='shipping' colspan='4'>Shipping:</th>";
            html_cart_str += "<td class='shipping'>$" + shipping_rate.toFixed(2) + "</td>";
            html_cart_str += "</tr>";

            sub_total += shipping_rate;
        }

        html_cart_str += "<tr class='subtotal'>";
        html_cart_str += "<th class='subtotal'colspan='4'>Subtotal:</th>";
        html_cart_str += "<td class='subtotal'>$" + sub_total.toFixed(2) + "</th>";
        html_cart_str += "</tr>";

        html_cart_str += "<tr class='tax'>";
        html_cart_str += "<th class='tax'colspan='4'>Tax:</th>";
        html_cart_str += "<td class='tax'>$" + tax.toFixed(2) + "</th>";
        html_cart_str += "</tr>";

        html_cart_str += "<tr class='total'>";
        html_cart_str += "<th class='total'colspan='4'>Total:</th>";
        html_cart_str += "<td class='total'>$" + total.toFixed(2) + "</th>";
        html_cart_str += "</tr>";
        html_cart_str += "</table>"

        html_cart_str += "<p class='buttons'>";
        html_cart_str += "<input type='button' value='Update' onclick='updateCart()' />";
        html_cart_str += "<input type='submit' value='Checkout' />";
        html_cart_str += "</p>";
        html_cart_str += "</form>"
    }
    else
    {
        html_cart_str = "<p class='no_items'>Your cart is empty. <a href='" + home_page_url + "'>Go shopping!</a></p>";
    }

    return html_cart_str;
}

// for testing only. writes a plain-text list of all products
function listProducts()
{
    for (i=0; i<products.length; i++)
    {
        document.write(products[i].toString() + "<br />");
    }
}
