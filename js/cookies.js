/**
 * Retrieves data from a cookie file.
 *
 * @returns {String} data stored in cookie file
 */
function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }

    return null;
}

/**
 * Writes data to a cookie file.
 *
 * @param c_name  {String} name of cookie file
 * @param value   {String} data to be stored in cookie
 * @param ex_days {Number} number of days until cookie expires
 */
function setCookie(c_name,value,ex_days)
{
    var ex_date=new Date();
    ex_date.setDate(ex_date.getDate() + ex_days);
    var c_value=escape(value) + ((ex_days==null) ? "" : "; expires="+ex_date.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

/**
 * Deletes a cookie file. (Sets value to "" and expiration date to yesterday.)
 *
 * @param {String} name of cookie file
 */
function deleteCookie(c_name)
{
    setCookie(c_name,"",-1);
}
