function hasValue(str)
{
    if (str.length==0) return false;
    else               return true;
}

function validateZipCode(str)
{
    if (str.length != 5)
    {
        return false; // a
    }
    else
    {
        for (i=0; i<str.length; i++)
        {
            var code = str.charCodeAt(i);

            if (code<48 || code>57)
            {
                return false; // b
            }
        }
    }

    return true; // c
}

function validatePhone(str)
{
    if (str.length != 12)
    {
        return false; // d
    }
    else
    {
        for (i=0; i<str.length; i++)
        {
            var code = str.charCodeAt(i);

            if (i==3 || i==7)
            {
                if (code != 45)
                {
                    return false; // e
                }
            }
            else
            {
                if (code<48 || code>57)
                {
                    return false; // f
                }
            }
        }
    }

    return true; // g
}

function validateEmail(str)
{
    var atPos = str.indexOf("@");
    var dotPos = str.lastIndexOf(".");

    if (atPos>0 && atPos<dotPos-1 && dotPos<str.length-2)
    {
        return true; // h
    }
    else
    {
        return false; // i
    }
}

function validateCardNumber(str)
{
    if (str.length != 16)
    {
        return false;
    }
    else
    {
        for (i=0; i<str.length; i++)
        {
            var code = str.charCodeAt(i);

            if (code<48 || code>57)
            {
                return false;
            }
        }
    }

    return true;
}

function validateExpirationDate(str)
{
    if (str.length != 5)
    {
        return false;
    }
    else
    {
        // from the form
        var mm = Number(str.substring(0,2));
        var yy = Number(str.substring(3));
        var slash = str.charAt(2);

        // for today
        var today = new Date();
        var MM = today.getMonth()+1;
        var YY = today.getFullYear()%100;
        
        if (mm<1 || mm>12) return false; // not a valid month
        if (slash!='/') return false; // no slash between mm & yy

        if (yy<YY) return false; // year before this year
        else if (yy==YY && mm<MM) return false; // current year but month passed
    }

    return true;
}

function validateSecurityCode(str)
{
    if (str.length != 3)
    {
        return false;
    }
    else
    {
        for (i=0; i<str.length; i++)
        {
            var code = str.charCodeAt(i);

            if (code<48 || code>57)
            {
                return false;
            }
        }
    }

    return true;
}


function highlight(field, color)
{
    field.style.backgroundColor = color;
}

function check(myForm)
{
    var isValid = true;
    var white = "#FFFFFF";  // valid
    var yellow = "#FFFFAA"; // invalid
    var red = "#FF0000";    // empty, required

    with (myForm)
    {
        if      (!hasValue(name.value)) { highlight(name,red); isValid = false; }
        else                            { highlight(name,white); }

        if      (!hasValue(address.value)) { highlight(address,red); isValid = false; }
        else                               { highlight(address,white); }

        if      (!hasValue(city.value)) { highlight(city,red); isValid = false; }
        else                            { highlight(city,white); }

        if      (!hasValue(state.value)) { highlight(state,red); isValid = false; }
        else                             { highlight(state,white); }

        if      (!hasValue(zip.value))        { highlight(zip,red); isValid = false; }
        else if (!validateZipCode(zip.value)) { highlight(zip,yellow); isValid = false; }
        else                                  { highlight(zip,white); }

        if      (!hasValue(phone.value))      { highlight(phone,red); isValid = false; }
        else if (!validatePhone(phone.value)) { highlight(phone,yellow); isValid = false; }
        else                                  { highlight(phone,white); }

        if      (!hasValue(email.value))      { highlight(email,red); isValid = false; }
        else if (!validateEmail(email.value)) { highlight(email,yellow); isValid = false; }
        else                                  { highlight(email,white); }

        if      (!hasValue(cc_number.value))           { highlight(cc_number,red); isValid = false; }
        else if (!validateCardNumber(cc_number.value)) { highlight(cc_number,yellow); isValid = false; }
        else                                           { highlight(cc_number,white); }
        
        if      (!hasValue(cc_expire.value))               { highlight(cc_expire,red); isValid = false; }
        else if (!validateExpirationDate(cc_expire.value)) { highlight(cc_expire,yellow); isValid = false; }
        else                                               { highlight(cc_expire,white); }
        
        if      (!hasValue(cc_security.value))             { highlight(cc_security,red); isValid = false; }
        else if (!validateSecurityCode(cc_security.value)) { highlight(cc_security,yellow); isValid = false; }
        else                                               { highlight(cc_security,white); }
    }

    if (!isValid)
    {
        document.getElementById("message").innerHTML = "Highlighted fields are either required or invalid.";
    }

    return isValid;
}