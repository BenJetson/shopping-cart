//************************************* Shopping Cart *************************************//
//*                                                                                       *//
//* Author: Jon Cooper                                                                    *//
//* Version: 0.9                                                                          *//
//* Release: May 6, 2013                                                                  *//
//*                                                                                       *//
//*                                                                                       *//
//* Description:                                                                          *//
//*                                                                                       *//
//* This shopping cart software is intended for instructional purposes only. It is        *//
//* intended to replicate the front-end experience of an online shopping site. It should  *//
//* handle a store with dozens of items fairly well, but is probably unfit for a store    *//
//* with hundreds. It has not been tested thoroughly for compatablity with all browsers.  *//
//*                                                                                       *//
//*                                                                                       *//
//* Usage:                                                                                *//
//*                                                                                       *//
//* See the READ_ME.txt file for complete installation instructions.                      *//
//*                                                                                       *//
//*                                                                                       *//
//* Copyright 2013:                                                                       *//
//*                                                                                       *//
//* This package is distributed under a Creative Commons Attribution-ShareAlike License.  *// 
//* You are free to share or adapt this work so long as:                                  *//
//*                                                                                       *//
//*  1. You must attribute the work in the manner specified by the author or licensor     *//
//*     (but not in any way that suggests that they endorse you or your use of the work). *//
//*  2. If you alter, transform, or build upon this work, you may distribute the          *//
//*     resulting work only under the same or similar license to this one.                *//
//*                                                                                       *//
//*            http://creativecommons.org/licenses/by-sa/3.0/deed.en_US                   *//
//*                                                                                       *//
//*                                                                                       *//
//* Disclaimer:                                                                           *//
//*                                                                                       *//
//* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,   *//
//* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A         *//
//* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT    *//
//* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION     *//
//* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE        *//
//* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                *//
//*                                                                                       *//
//*****************************************************************************************//



//********************************** CART CONFIGURATION ***********************************//

// products you sell by (id, name, price)
var products = new Array();
products[0] = new Product("ABC", "Whatchahoozit",  0.99);
products[1] = new Product("123", "Thingamabob",    9.95);
products[2] = new Product("XYZ", "Doomahitchey",  20.00);


// tax rate for your state
var sales_tax_rate = 0.06;


// shipping
var free_shipping = false;
var shipping_rate = 6.99; // (will not be applied if free_shipping = true)


// site settings
var home_page_url = "add_item_example.html";
var cart_url = "cart_example.html";
var checkout_url = "checkout_example.html";


// optional settings
var cookie_name = "my_cart"; // (change if multiple carts run on same site)
var cookie_persistence = 2;  // (in days)



//************** END OF CONFIGURATION, DO NOT* MODIFY CODE BELOW THIS LINE!! **************//
//                     ( * Unless you really know what you are doing. )                    //


// public functions, for use on html pages

/**
 * Reads the cart cookie and sets product quantities. Then refreshes display.
 * Method should be called as body onload event for all pages that implement cart.
 *
 * Usage: <body onload="loadCart()">
 * Requires: cookies.js
 */
function loadCart()
{   
    var cart_str = getCookie(cookie_name);

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
            else
            {
                alert("Error: Invalid product ID in cart cookie");
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
 * Deletes the cart cookie, effectively setting all item quanties to zero. Use as onload
 * event after order is successfully placed.
 *
 * Usage: <body onload="emptyCart()">
 *
 * Requires: cookies.js
 */
function emptyCart()
{
    deleteCookie(cookie_name);
    refresh();
}


// helper functions. don't reference these on html pages. for interal use only.

/**
 * Product object. Product has ID, name, and price set by consctructor. Quantity is set
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
 * Writes the cart string (a list of product ids) to a cookie file.
 *
 * Requires: cookies.js
 */
function writeCart()
{
    var cart_str = cartToString();
    setCookie(cookie_name, cart_str, cookie_persistence);

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
