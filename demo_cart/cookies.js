// The functions getCookie and setCookie are from w3schools.com. I've added a
// deleteCookie function, documentation comments, and cleaned up spacing and
// variable naming to be consistent with other code we have written. Include
// this file with any future projects that require setting/reading cookies
// through JavaScript.


/**
 * Writes data to a cookie file.
 * 
 * @param c_name  {String} name of cookie file
 * @param c_value {String} data to be stored in cookie
 * @param ex_days {Number} number of days until cookie expires
 */
function setCookie(c_name, c_value, ex_days)
{
    var d = new Date();
    d.setTime(d.getTime() + (ex_days*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();

    document.cookie = c_name + "=" + c_value + "; " + expires;
}


/**
 * Retrieves data from a cookie file.
 *
 * @param c_name {String} name of cookie file
 * @returns      {String} data stored in cookie file
 */
function getCookie(c_name)
{
    var name = c_name + "=";
    var cookie_array = document.cookie.split(';');

    for(var i=0; i<cookie_array.length; i++) 
    {
        var c = cookie_array[i].trim();

        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return "";
}


/**
 * Deletes a cookie file. (Sets value to "" and expiration date to yesterday.)
 *
 * @param c_name {String} name of cookie file
 */
function deleteCookie(c_name)
{
    setCookie(c_name, "", -1);
}