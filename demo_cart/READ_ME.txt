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
//* Instructions for use:                                                                 *//
//*                                                                                       *//
//* 1. Copy the files cart.js, cookies.js and cart.css to the folder with your site.      *//
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
//* 3. Add the following lines to the head of each page on your site:                     *//
//*                                                                                       *//
//*     <link rel="stylesheet" href="cart.css" type="text/css" />                         *//
//*     <script src="cart.js"></script>                                                   *//
//*     <script src="cookies.js"></script>                                                *//
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
//*     <input type="button" onclick="addToCart('ABC123')" value="Add to cart" />         *//
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
//* b. You do not need to add a link to your checkout page as it will be reachable by     *//
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