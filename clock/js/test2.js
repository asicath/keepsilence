// JavaScript by Peter Hayes
// http://www.aphayes.pwp.blueyonder.co.uk/
// Copyright 2001-2008
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

// Utility functions

// datestring provides a locale independent format

function datestring(obs) {
    var datestr = "";  datestr += obs.year;
    datestr += ((obs.month < 10) ? ":0" : ":") + obs.month;
    datestr += ((obs.day < 10) ? ":0" : ":") + obs.day;
    return datestr;
}

// UTstring returns UT as a string

function UTstring(obs) {
    var hours   = obs.hours;
    var minutes = obs.minutes;
    var seconds = obs.seconds;
    minutes+=obs.tz;
    hours+=Math.floor(minutes/60.0);
    minutes=minutes-Math.floor(minutes/60.0)*60;
    while (hours > 24) { hours-=24; }
    while (hours < 0) { hours+=24; }
    var timestr = ((hours < 10) ? "0" : "") + hours;
    timestr    += ((minutes < 10) ? ":0" : ":") + minutes;
    timestr    += ((seconds < 10) ? ":0" : ":") + seconds;
    return timestr;
}

// timestring returns civil or local time as a string

function timestring(obs,local) {
    var hours   = obs.hours;
    var minutes = obs.minutes;
    var seconds = obs.seconds;
    if (local) {
        // Correct for zone time including DST
        minutes+=obs.tz;
        // correct for longitude to nearest second
        seconds=Math.round(seconds-240*obs.longitude);
        while (seconds < 0 ) { seconds+=60; minutes-=1; }
        while (seconds >= 60 ) { seconds-=60; minutes+=1; }
        // Put the daylight saving correction back
        minutes-=checkdst(observer);
        while (minutes < 0 ) { minutes+=60; hours-=1; }
        while (minutes >= 60 ) { minutes-=60; hours+=1; }
        while (hours > 24 ) hours-=24;
        while (hours < 0 ) hours+=24;
    }
    var timestr = ((hours < 10) ? "0" : "") + hours;
    timestr    += ((minutes < 10) ? ":0" : ":") + minutes;
    timestr    += ((seconds < 10) ? ":0" : ":") + seconds;
    return timestr;
}

// hmstring and hmsstring converts hours to a : separated string

function hmsstring(t) {
    var hours = Math.abs(t);
    var minutes = 60.0*(hours-Math.floor(hours));
    hours=Math.floor(hours);
    var seconds = Math.round(60.0*(minutes-Math.floor(minutes)));
    minutes=Math.floor(minutes);
    if (seconds >= 60) { minutes+=1; seconds-=60; }
    if (minutes >= 60) { hours+=1; minutes-=60; }
    if (hours >= 24) { hours-=24; }
    var hmsstr=(t < 0) ? "-" : "";
    hmsstr+=((hours < 10) ? "0" : "" )+hours;
    hmsstr+=((minutes < 10) ? ":0" : ":" )+minutes;
    hmsstr+=((seconds < 10) ? ":0" : ":" )+seconds;
    return hmsstr;
}

function hmstring(t) {
    var hours = Math.abs(t);
    var minutes = Math.round(60.0*(hours-Math.floor(hours)));
    hours=Math.floor(hours);
    if (minutes >= 60) { hours+=1; minutes-=60; }
    if (hours >= 24) { hours-=24; }
    var hmstr=(t < 0) ? "-" : "";
    hmstr+=((hours < 10) ? "0" : "" )+hours;
    hmstr+=((minutes < 10) ? ":0" : ":" )+minutes;
    return hmstr;
}

// hmdstring returns hours minutes as hh:mm.m used to print RA

function hmdstring(t) {
    var hours = Math.abs(t);
    var minutes = 60.0*(hours-Math.floor(hours));
    hours=Math.floor(hours);
    if (minutes >= 60) { hours+=1; minutes-=60; }
    if (hours >= 24) { hours-=24; }
    var hmstr=(t < 0) ? "-" : "";
    hmstr+=((hours < 10) ? "0" : "" )+hours;
    hmstr+=((Math.floor(minutes) < 10) ? ":0" : ":" )+Math.floor(minutes);
    hmstr+="."+Math.floor(10*(minutes-Math.floor(minutes)));
    return hmstr;
}


// llstring returns latitude or longitude as degrees:minutes:seconds without sign

function llstring(a) {
    var deg=Math.abs(a);
    var min=(60.0*(deg-Math.floor(deg)));
    var sec=Math.floor(60.0*(min-Math.floor(min)));
    var dmsstr="";
    deg=Math.floor(deg); min=Math.floor(min); sec=Math.floor(sec);
    dmsstr+=((deg < 10) ? "0" : "" )+deg;
    dmsstr+=((min < 10) ? ":0" : ":" )+min;
    dmsstr+=((sec < 10) ? ":0" : ":" )+sec;
    return dmsstr;
}

// anglestring return angle as degrees:minutes
// circle is true for range between 0 and 360 and false for -90 to +90

function anglestring(a,circle) {
    var ar=Math.round(a*60)/60;
    var deg=Math.abs(ar);
    var min=Math.round(60.0*(deg-Math.floor(deg)));
    if (min >= 60) { deg+=1; min=0; }
    var anglestr="";
    if (!circle) anglestr+=(ar < 0 ? "-" : "+");
    if (circle) anglestr+=((Math.floor(deg) < 100) ? "0" : "" );
    anglestr+=((Math.floor(deg) < 10) ? "0" : "" )+Math.floor(deg);
    anglestr+=((min < 10) ? ":0" : ":" )+(min);
    return anglestr;
}

// parsecol converts deg:min:sec or hr:min:sec to a number

function parsecol(str) {
    var col1=str.indexOf(":");
    var col2=str.lastIndexOf(":");
    if (col1 < 0) return parseInt(str);
    if (str.substring(0,1) == "-") {
        var res=parseInt(str.substring(1,col1),10);
    } else {
        var res=parseInt(str.substring(0,col1),10);
    }
    if (col2 > col1) {
        res+=(parseInt(str.substring(col1+1,col2),10)/60.0) +
            (parseInt(str.substring(col2+1,str.length),10)/3600.0);
    } else {
        res+=(parseInt(str.substring(col1+1,str.length),10)/60.0);
    }
    if (str.substring(0,1) == "-") {
        return -res;
    } else {
        return res;
    }
}

// JavaScript by Peter Hayes http://www.aphayes.pwp.blueyonder.co.uk/ephemeris/index.html
// Copyright 2001-2011
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

// Various date and time functions

// getFullYear returns a 4 digit year allowing for browser bugs
// now is a JavaScript date object which works from 1900
// assume that a date of 00 is actually a year 2000 bug NOT 1900

function getFullYear(now) {
    var year = now.getYear();
    if (year==0) {year=2000}
    if (year<1900) {year=year+1900}
    return year;
}

// Global variables

var month_length=new Array(31,28,31,30,31,30,31,31,30,31,30,31);

function leapyear(year) {
    var leap=false;
    if (year % 4 == 0) leap = true;
    if (year % 100 ==0 ) leap = false;
    if (year % 400 == 0) leap = true;
    return leap;
}

// Attempt to discover if daylight saving time is on
function localdst() {
    var now=new Date();
    var tz=now.getTimezoneOffset();
    now.setMonth(0); var tz0 = now.getTimezoneOffset();
    now.setMonth(6); var tz6 = now.getTimezoneOffset();
    if (tz6 < tz0) { // Northern hemisphere with DST
        if (tz < tz0) return true;
    }
    if (tz0 < tz6) { // Southern hemisphere with DST
        if (tz < tz6) return true;
    }
    return false;
}

// The Julian date at 0 hours UT at Greenwich

function jd0(year,month,day) {
    var y  = year;
    var m = month;
    if (m < 3) {m += 12; y -= 1};
    var a = Math.floor(y/100);
    var b = 2-a+Math.floor(a/4);
    var j = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524.5;
    return j;
}

// The calendar date from julian date
// Returns year, month, day, day of week, hours, minutes, seconds

function jdtocd(jd) {
    var Z=Math.floor(jd+0.5);
    var F=jd+0.5-Z;
    if (Z < 2299161) {
        var A=Z;
    } else {
        var alpha=Math.floor((Z-1867216.25)/36524.25);
        var A=Z+1+alpha-Math.floor(alpha/4);
    }
    var B=A+1524;
    var C=Math.floor((B-122.1)/365.25);
    var D=Math.floor(365.25*C);
    var E=Math.floor((B-D)/30.6001);
    var d=B-D-Math.floor(30.6001*E)+F;
    if (E < 14) {
        var month=E-1;
    } else {
        var month=E-13;
    }
    if ( month>2) {
        var year=C-4716;
    } else {
        var year=C-4715;
    }
    var day=Math.floor(d);
    var h=(d-day)*24;
    var hours=Math.floor(h);
    var m=(h-hours)*60;
    var minutes=Math.floor(m);
    var seconds=Math.round((m-minutes)*60);
    if (seconds >= 60) {
        minutes=minutes+1;
        seconds=seconds-60;
    }
    if (minutes >= 60) {
        hours=hours+1;
        minutes=0;
    }
    var dw=Math.floor(jd+1.5)-7*Math.floor((jd+1.5)/7);
    return new Array(year,month,day,dw,hours,minutes,seconds);
}

// sidereal time in hours for Greenwich

function g_sidereal(year,month,day) {
    var T=(jd0(year,month,day)-2451545.0)/36525;
    var res=100.46061837+T*(36000.770053608+T*(0.000387933-T/38710000.0));
    return rev(res)/15.0;
}

// JavaScript by Peter Hayes http://www.aphayes.pwp.blueyonder.co.uk/
// Copyright 2001-2013
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

// The place definitions and function
// latitude is degrees:minutes:seconds, ns is 0 for north and 1 for south
// longitude is degrees:minutes:seconds, we is 0 for west and 1 for east
// zone is the correction in minutes from local time to UT (GMT) without daylight saving,
// west of Greenwich is positive.
// The daylight saving start and end (dss and dse) are strings month:week:day
// where month is 1:12, day is 0-6 (0=Sunday) and week is 1-5.
// week 1 is the first week containing 'day' and week 5 means the last occurence
// of day in the month (same as the Unix TZ rules).
// Set the string to a null string if you don't know the rules.
// Some sites taken from the stellarium database
// /Applications/Stellarium.app/Contents/Resources/data/cities_Earth.fab

function place(name,latitude,ns,longitude,we,zone,dss,dse) {
    this.name      = name;
    this.latitude  = latitude;
    this.ns        = ns;
    this.longitude = longitude;
    this.we        = we;
    this.zone      = zone;
    this.dss       = dss;
    this.dse       = dse;
}

// A selection of places

var atlas = new Array(

    new place("GB:Greenwich","51:28:38",0,"00:00:00",0,0,"",""),
    new place("US:Seattle","47:36:00",0,"122:19:00",0,480,"03:2:0","11:1:0"),
    new place("A:Vienna","48:13:00",0,"16:22:00",1,-60,"3:5:0","10:5:0"),
    new place("B:Brussels","50:50:00",0,"4:21:00",1,-60,"3:5:0","10:5:0"),
    new place("CH:Berne","46:55:00",0,"07:25:00",1,-60,"3:5:0","10:5:0"),
    new place("CH:Gen�ve","46:12:00",0,"06:10:00",1,-60,"3:5:0","10:5:0"),
    new place("CH:Lausanne","46:32:00",0,"06:40:00",1,-60,"3:5:0","10:5:0"),
    new place("CH:Zurich","47:22:40",0,"08:33:04",1,-60,"3:5:0","10:5:0"),
    new place("DE:Berlin","52:31:00",0,"13:19:59",1,-60,"3:5:0","10:5:0"),
    new place("DE:Frankfurt am Main","50:06:00",0,"8:41:00",1,-60,"3:5:0","10:5:0"),
    new place("DE:Hamburg","53:33:00",0,"10:00:00",1,-60,"3:5:0","10:5:0"),
    new place("DE:Munich","48:08:00",0,"11:35:00",1,-60,"3:5:0","10:5:0"),
    new place("DK:Aalborg","57:03:00",0,"9:51:00",1,-60,"3:5:0","10:5:0"),
    new place("DK:�rhus","56:10:00",0,"10:13:00",1,-60,"3:5:0","10:5:0"),
    new place("DK:Copenhagen","55:43:00",0,"12:34:00",1,-60,"3:5:0","10:5:0"),
    new place("ES:Barcelona","41:18:07",0,"02:05:31",0,-60,"3:5:0","10:5:0"),
    new place("ES:Madrid","40:25:00",0,"03:42:00",0,-60,"3:5:0","10:5:0"),
    new place("ES:Malaga","36:43:00",0,"04:25:00",0,-60,"3:5:0","10:5:0"),
    new place("ES:Las Palmas","28:08:00",0,"15:27:00",0,60,"3:5:0","10:5:0"),
    new place("FR:Bordeaux","44:50:00",0,"0:34:00",0,-60,"3:5:0","10:5:0"),
    new place("FR:Brest","48:24:00",0,"4:30:00",0,-60,"3:5:0","10:5:0"),
    new place("FR:Calais","50:57:00",0,"1:52:00",1,-60,"3:5:0","10:5:0"),
    new place("FR:Lille","50:38:00",0,"03:04:00",1,-60,"3:5:0","10:5:0"),
    new place("FR:Marseille","43:18:00",0,"5:22:00",1,-60,"3:5:0","10:5:0"),
    new place("FR:Nice","43:42:00",0,"07:16:00",1,-60,"3:5:0","10:5:0"),
    new place("FR:Orl�ans","47:54:00",0,"01:54:00",1,-60,"3:5:0","10:5:0"),
    new place("FR:Paris","48:48:00",0,"02:14:00",1,-60,"3:5:0","10:5:0"),
    new place("FR:Strasbourg","48:35:00",0,"7:45:00",1,-60,"3:5:0","10:5:0"),
    new place("FI:Helsinki","60:08:00",0,"25:00:00",1,-120,"3:5:0","10:5:0"),
    new place("GR:Athens","38:01:36",0,"23:44:00",1,-120,"3:5:0","10:5:0"),
    new place("GB:Aberdeen","57:12:00",0,"02:12:00",0,0,"3:5:0","10:5:0"),
    new place("GB:Birmingham","52:28:59",0,"01:52:59",0,0,"3:5:0","10:5:0"),
    new place("GB:Belfast","54:37:48",0,"05:52:12",0,0,"3:5:0","10:5:0"),
    new place("GB:Bristol","51:28:59",0,"02:38:59",0,0,"3:5:0","10:5:0"),
    new place("GB:Cambridge","52:10:00",0,"00:06:00",0,0,"3:5:0","10:5:0"),
    new place("GB:Cardiff","51:30:00",0,"03:12:00",0,0,"3:5:0","10:5:0"),
    new place("GB:Cheltenham","51:52:52",0,"02:06:48",0,0,"3:5:0","10:5:0"),
    new place("GB:Edinburgh","55:55:48",0,"03:13:48",0,0,"3:5:0","10:5:0"),
    new place("GB:Manchester","53:30:00",0,"01:45:00",0,0,"3:5:0","10:5:0"),
    new place("GB:London","51:30:00",0,"00:10:12",0,0,"3:5:0","10:5:0"),
    new place("HR:Zagreb","45:48:00",0,"15:58:00",1,-60,"3:5:0","10:5:0"),
    new place("IT:Rome","41:53:00",0,"12:30:00",1,-60,"3:5:0","10:5:0"),
    new place("IT:Milan","45:28:00",0,"9:12:00",1,-60,"3:5:0","10:5:0"),
    new place("IT:Palermo","38:08:00",0,"13:23:00",1,-60,"3:5:0","10:5:0"),
    new place("IE:Dublin","53:19:48",0,"06:15:00",0,0,"3:5:0","10:5:0"),
    new place("IS:Reykjavik","64:09:00",0,"21:58:00",0,60,"3:5:0","10:5:0"),
    new place("LU:Luxembourg","49:36:00",0,"6:09:00",1,-60,"3:5:0","10:5:0"),
    new place("NO:Bergen","60:21:00",0,"5:20:00",1,-60,"3:5:0","10:5:0"),
    new place("NO:Oslo","59:56:00",0,"10:45:00",1,-60,"3:5:0","10:5:0"),
    new place("NO:Troms�","69:70:00",0,"19:00:00",1,-60,"3:5:0","10:5:0"),
    new place("NL:Amsterdam","52:22:23",0,"4:53:33",1,-60,"3:5:0","10:5:0"),
    new place("NL:Apeldoorn","52:13:00",0,"5:57:00",1,-60,"3:5:0","10:5:0"),
    new place("NL:Maastricht","50:51:00",0,"5:04:00",1,-60,"3:5:0","10:5:0"),
    new place("NL:Groningen","53:13:00",0,"6:33:00",1,-60,"3:5:0","10:5:0"),
    new place("NL:The Hague","52:05:00",0,"4:29:00",1,-60,"3:5:0","10:5:0"),
    new place("PT:Lisbon","38:44:00",0,"9:08:00",0,0,"3:5:0","10:5:0"),
    new place("PL:Warszawa","52:15:00",0,"21:00:00",1,-60,"3:5:0","10:5:0"),
    new place("RO:Bucharest","44:25:00",0,"26:07:00",1,-120,"3:5:0","10:5:0"),
    new place("RU:Irkutsk","52:18:00",0,"104:15:00",1,-480,"3:5:0","10:5:0"),
    new place("RU:Moscow","55:45:00",0,"37:35:00",1,-180,"3:5:0","10:5:0"),
    new place("RU:Omsk","55:00:00",0,"73:22:00",1,-360,"3:5:0","10:5:0"),
    new place("SE:Gothenburg","57:43:00",0,"11:58:00",1,-60,"3:5:0","10:5:0"),
    new place("SE:Stockholm","59:35:00",0,"18:06:00",1,-60,"3:5:0","10:5:0"),
// Canada assume DST rules same as USA until checked
    new place("CA:Calgary","51:02:42",0,"114:03:26",0,420,"03:2:0","11:1:0"),
// USA daylight saving changes
// 1966 -2006 first Sunday in April to last Sunday in October
// 2007 -     second Sunday in March to first Sunday in November
    new place("US:Aledo TX","32:44:25",0,"97:39:59",0,360,"03:2:0","11:1:0"),
    new place("US:Anchorage","61:10:00",0,"149:53:00",0,540,"03:2:0","11:1:0"),
    new place("US:Dallas","32:48:00",0,"96:48:00",0,360,"03:2:0","11:1:0"),
    new place("US:Denver","39:45:00",0,"104:59:00",0,420,"03:2:0","11:1:0"),
    new place("US:Honolulu","21:19:00",0,"157:86:00",0,600,"03:2:0","11:1:0"),
    new place("US:Los Angeles","34:03:15",0,"118:14:28",0,480,"03:2:0","11:1:0"),
    new place("US:Miami","25:47:00",0,"80:20:00",0,300,"03:2:0","11:1:0"),
    new place("US:Minneapolis","44:58:01",0,"93:15:00",0,360,"03:2:0","11:1:0"),
    new place("US:Muskegon Mi.","43:15:49",0,"86:01:25",0,300,"03:2:0","11:1:0"),

    new place("US:Washington DC","38:53:51",0,"77:00:33",0,300,"03:2:0","11:1:0"),

    new place("AU:Melbourne","37:48:00",1,"144:58:00",1,-600,"10:5:0","03:5:0"),
    new place("AU:Perth","31:58:00",1,"115:49:00",1,-480,"10:5:0","03:5:0"),
    new place("BR:Rio de Janeiro","22:54:00",1,"43:16:00",0,180,"",""),
    new place("ZA:Cape Town","33:56",1,"18:25",1,-120,"","")
);

// The observatory object holds local date and time,
// timezone correction in minutes with daylight saving if applicable,
// latitude and longitude  NOTE Meeus uses West positive for longitude and zone
// The IAU convention of East being positive was adopted in 1982
// we will use the IAU convention for options passed via the URL and convert

function observatory(place) {
    this.name = place.name;
    this.tz = place.zone;
    this.latitude = parsecol(place.latitude); if (place.ns == 1) { this.latitude=-this.latitude; }
    this.longitude = parsecol(place.longitude); if (place.we == 1) { this.longitude=-this.longitude; }
    this.setDate = function(now) {
        this.year = now.getUTCFullYear();
        this.month = now.getUTCMonth()+1;
        this.day = now.getUTCDate();
        this.hours = now.getUTCHours();
        this.minutes = now.getUTCMinutes();
        this.seconds = now.getUTCSeconds();
    }
}




// the actual observer
var observer  = new observatory(atlas[0]);
observer.setDate(new Date());

// Site name returns name and latitude / longitude as a string

function sitename() {
    var sname=observer.name;
    var latd=Math.abs(observer.latitude);
    var latdi=Math.floor(latd);
    sname+=((latdi < 10) ? " 0" : " ") + latdi;
    latm=60*(latd-latdi); latmi=Math.floor(latm);
    sname+=((latmi < 10) ? ":0" : ":") + latmi;
    lats=60*(latm-latmi); latsi=Math.floor(lats);
    sname+=((latsi < 10) ? ":0" : ":") + latsi;
    sname+=((observer.latitude >= 0) ? "N " : "S ");
    var longd=Math.abs(observer.longitude);
    var longdi=Math.floor(longd);
    sname+=((longdi < 10) ? "0" : "") + longdi;
    longm=60*(longd-longdi); longmi=Math.floor(longm);
    sname+=((longmi < 10) ? ":0" : ":") + longmi;
    longs=60*(longm-longmi); longsi=Math.floor(longs);
    sname+=((longsi < 10) ? ":0" : ":") + longsi;
    sname+=((observer.longitude >= 0) ? "W" : "E");
    return sname;
}

// Check DST is an attempt to check daylight saving, its not perfect.
// Returns 0 or -60 that is amount to remove to get to zone time.

function checkdst(obs) {
    // We only know daylight saving if in the atlas
    with (document.table1) {
        if ((Place.selectedIndex < 0) || (Place.selectedIndex >= atlas.length))
            return 0;
        var dss=atlas[Place.selectedIndex].dss;
        var dse=atlas[Place.selectedIndex].dse;
        var ns=atlas[Place.selectedIndex].ns;
    }
    if (dss.length==0) return 0;
    if (dse.length==0) return 0;
    // parse the daylight saving start & end dates
    var col1=dss.indexOf(":");
    var col2=dss.lastIndexOf(":");
    var col3=dss.length;
    var dssm=parseInt(dss.substring(0,col1),10);
    var dssw=parseInt(dss.substring(col1+1,col2),10);
    var dssd=parseInt(dss.substring(col2+1,col3),10);
    col1=dse.indexOf(":");
    col2=dse.lastIndexOf(":");
    col3=dse.length;
    var dsem=parseInt(dse.substring(0,col1),10);
    var dsew=parseInt(dse.substring(col1+1,col2),10);
    var dsed=parseInt(dse.substring(col2+1,col3),10);
    // Length of months
    // year,month,day and day of week
    var jdt=jd0(obs.year,obs.month,obs.day);
    var ymd=jdtocd(jdt);
    // first day of month - we need to know day of week
    var fymd=jdtocd(jdt-ymd[2]+1);
    // look for daylight saving / summertime changes
    // first the simple month checks
    // Test for the northern hemisphere
    if (ns==0) {
        if ((ymd[1]>dssm) && (ymd[1]<dsem)) return -60;
        if ((ymd[1]<dssm) || (ymd[1]>dsem)) return 0;
    } else{
        // Southern hemisphere, New years day is summer.
        if ((ymd[1]>dssm) || (ymd[1]<dsem)) return -60;
        if ((ymd[1]<dssm) && (ymd[1]>dsem)) return 0;
    }
    // check if we are in month of change over
    if (ymd[1]==dssm) { // month of start of summer time
        // date of change over
        var ddd=dssd-fymd[3]+1;
        ddd=ddd+7*(dssw);
        while (ddd>month_length[ymd[1]-1]) ddd-=7;
        if (ymd[2]<ddd) return 0;
        // assume its past the change time, its impossible
        // to know if the change has occured.
        return -60;
    }
    if (ymd[1]==dsem) { // month of end of summer time
        // date of change over
        var ddd=dsed-fymd[3]+1;
//    alert("first ddd="+ddd);
        ddd=ddd+7*(dsew);
//    alert("next ddd="+ddd);
        while (ddd>month_length[ymd[1]-1]) ddd-=7;
//    alert("last ddd="+ddd);
        if (ymd[2]<ddd) return -60;
        // see comment above for start time
        return 0;
    }
    return 0;
}

// The Julian date at observer time

function jd(obs) {
    var j = jd0(obs.year,obs.month,obs.day);
    j+=(obs.hours+((obs.minutes+obs.tz)/60.0)+(obs.seconds/3600.0))/24;
    return j;
}

// sidereal time in hours for observer

function local_sidereal(obs) {
    var res=g_sidereal(obs.year,obs.month,obs.day);
    res+=1.00273790935*(obs.hours+(obs.minutes+obs.tz+(obs.seconds/60.0))/60.0);
    res-=obs.longitude/15.0;
    while (res < 0) res+=24.0;
    while (res > 24) res-=24.0;
    return res;
}

// radtoaa converts ra and dec to altitude and azimuth

function radtoaa(ra,dec,obs) {
    var lst=local_sidereal(obs);
    var x=cosd(15.0*(lst-ra))*cosd(dec);
    var y=sind(15.0*(lst-ra))*cosd(dec);
    var z=sind(dec);
    // rotate so z is the local zenith
    var xhor=x*sind(obs.latitude)-z*cosd(obs.latitude);
    var yhor=y;
    var zhor=x*cosd(obs.latitude)+z*sind(obs.latitude);
    var azimuth=rev(atan2d(yhor,xhor)+180.0); // so 0 degrees is north
    var altitude=atan2d(zhor,Math.sqrt(xhor*xhor+yhor*yhor));
    return new Array(altitude,azimuth);
}

// aatorad converts alt and azimuth to ra and dec

function aatorad(alt,az,obs) {
    var lst=local_sidereal(obs)
    var lat=obs.latitude
    var j=sind(alt)*sind(lat)+cosd(alt)*cosd(lat)*cosd(az);
    var dec=asind(j);
    j=(sind(alt)-sind(lat)*sind(dec))/(cosd(lat)*cosd(dec));
    var s=acosd(j);
    j=sind(az);
    if (j>0) s=360-s;
    var ra=lst-s/15;
    if (ra<0) ra+=24;
    if (ra>=24) ra-=24;
    return new Array(ra,dec);
}

// JavaScript by Peter Hayes http://www.aphayes.pwp.blueyonder.co.uk/
// Copyright 2001-2009
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

// Various functions for the Sun

// Nutation in longitude and obliquity, returns seconds

function nutation(obs) {
    var T=(jd(obs)-2451545.0)/36525.0;
    var T2=T*T;
    var T3=T2*T;
    var omega=rev(125.04452-1934.136261*T);
    var L=rev(280.4665+36000.7698*T);
    var LP=rev(218.3165+481267.8813*T);
    var deltaL=-17.20*sind(omega)-1.32*sind(2*L)-0.23*sind(2*LP)+0.21*sind(2*omega);
    var deltaO=9.20*cosd(omega)+0.57*cosd(2*L)+0.10*cosd(2*LP)-0.09*cosd(2*omega);
    return new Array(deltaL,deltaO);
}

// Obliquity of ecliptic

function obl_eql(obs) {
    var T=(jd(obs)-2451545.0)/36525;
    var T2=T*T;
    var T3=T2*T;
    var e0=23.0+(26.0/60.0)+(21.448-46.8150*T-0.00059*T2+0.001813*T3)/3600.0;
    var nut=nutation(obs);
    var e=e0+nut[1]/3600.0;
    return e;
}

// Eccentricity of Earths Orbit

function earth_ecc(obs) {
    var T=(jd(obs)-2451545.0)/36525;
    var T2=T*T;
    var T3=T2*T;
    var e=0.016708617-0.000042037*T-0.0000001236*T2;
    return e;
}

// The equation of time function returns minutes

function EoT(obs) {
    var sun_xyz=new Array(0.0,0.0,0.0);
    var earth_xyz=helios(planets[2],obs);
    var radec=radecr(sun_xyz,earth_xyz,obs);
    var T=(jd(obs)-2451545.0)/365250;
    var T2=T*T;
    var T3=T2*T;
    var T4=T3*T;
    var T5=T4*T;
    var L0=rev(280.4664567+360007.6982779*T+0.03032028*T2+
        T3/49931.0-T4/15299.0-T5/1988000.0);
    var nut=nutation(obs);
    var delta=nut[0]/3600.0;
    var e=obl_eql(obs);
    var E=4*(L0-0.0057183-(radec[0]*15.0)+delta*cosd(e));
    while (E < -1440) E+=1440;
    while (E > 1440) E-=1440;
    return E;
}



function hmDate(t) {
    var hours = Math.abs(t);
    var minutes = Math.round(60.0*(hours-Math.floor(hours)));
    hours=Math.floor(hours);

    if (minutes >= 60) { hours+=1; minutes-=60; }
    if (hours >= 24) { hours-=24; }

    var hmstr=(t < 0) ? "-" : "";
    hmstr+=((hours < 10) ? "0" : "" )+hours;
    hmstr+=((minutes < 10) ? ":0" : ":" )+minutes;

    return hmstr;
}


function doSun(obs) {

    var obscopy = {};
    for (var i in obs) obscopy[i] = obs[i];
    var sun_xyz = [0.0, 0.0, 0.0];

    var earth_xyz = helios(planets[2], obscopy);
    var radec = radecr(sun_xyz, earth_xyz, obscopy);
    var altaz = radtoaa(radec[0], radec[1], obscopy);

    return {
        rightAscension: radec[0],
        declination: radec[1],
        distance: radec[2],
        altitude: altaz[0],
        azimuth: altaz[1]
    };

}


// JavaScript by Peter Hayes http://www.aphayes.pwp.blueyonder.co.uk/
// Copyright 2001-2009
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

// Functions for the planets

// The planet object

function planet(name,L,a,e,i,N,P) {
    this.name=name;
    this.L=L;
    this.a=a;
    this.e=e;
    this.i=i;
    this.N=N;
    this.P=P;
}
// Meeus table 30.A Orbital Elements for the mean equinox of the date

var planets=new Array();
planets[0]=new planet("Mercury",
    new Array(252.250906, 149474.0722491,    0.00030397,    0.000000018),
    new Array(  0.387098310,   0.0,          0.0,           0.0),
    new Array(  0.20563175,    0.000020406, -0.0000000284, -0.00000000017),
    new Array(  7.004986,      0.0018215,   -0.00001809,    0.000000053),
    new Array( 48.330893,      1.1861890,    0.00017587,    0.000000211),
    new Array( 77.456119,      1.5564775,    0.00029589,    0.000000056));

planets[1]=new planet("Venus",
    new Array(181.979801,  58519.2130302,    0.00031060,    0.000000015),
    new Array(  0.723329820,   0.0,          0.0,           0.0),
    new Array(  0.00677188,   -0.000047766,  0.0000000975,  0.00000000044),
    new Array(  3.394662,      0.0010037,   -0.00000088,   -0.000000007),
    new Array( 76.679920,      0.9011190,    0.00040665,   -0.000000080),
    new Array(131.563707,      1.4022188,   -0.00107337,   -0.000005315));

planets[2]=new planet("Earth",
    new Array(100.466449,  36000.7698231,    0.00030368,    0.000000021),
    new Array(  1.000001018,   0.0,          0.0,           0.0),
    new Array(  0.01670862,   -0.000042037, -0.0000001236,  0.00000000004),
    new Array(  0.0,           0.0,          0.0,           0.0),
    new Array(  0.0,           0.0,          0.0,           0.0),
    new Array(102.937348,      1.7195269,    0.00045962,    0.000000499));

planets[3]=new planet("Mars",
    new Array(355.433275,  19141.6964746,    0.00031097,    0.000000015),
    new Array(  1.523679342,   0.0,          0.0,           0.0),
    new Array(  0.09340062,    0.000090483, -0.0000000806, -0.00000000035),
    new Array(  1.849726,     -0.0006010,    0.00001276,   -0.000000006),
    new Array( 49.558093,      0.7720923,    0.00001605,    0.000002325),
    new Array(336.060234,      1.8410331,    0.00013515,    0.000000318));

planets[4]=new planet("Jupiter",
    new Array( 34.351484,   3036.3027889,    0.00022374,    0.000000025),
    new Array(  5.202603191,   0.0000001913, 0.0,           0.0),
    new Array(  0.04849485,    0.000163244, -0.0000004719, -0.00000000197),
    new Array(  1.303270,     -0.0054966,    0.00000465,   -0.000000004),
    new Array(100.464441,      1.0209550,    0.00040117,    0.000000569),
    new Array( 14.331309,      1.6126668,    0.00103127,   -0.000004569));

planets[5]=new planet("Saturn",
    new Array( 50.077471,   1223.5110141,    0.00051952,   -0.000000003),
    new Array(  9.554909596,  -0.0000021389, 0.0,           0.0),
    new Array(  0.05550862,   -0.000346818, -0.0000006456,  0.00000000338),
    new Array(  2.488878,     -0.0037363,   -0.00001516,    0.000000089),
    new Array(113.665524,      0.8770979,   -0.00012067,   -0.000002380),
    new Array( 93.056787,      1.9637694,    0.00083757,    0.000004899));

planets[6]=new planet("Uranus",
    new Array(314.055005,    429.8640561,    0.00030434,    0.000000026),
    new Array( 19.218446062,  -0.0000000372, 0.00000000098, 0.0),
    new Array(  0.04629590,   -0.000027337,  0.0000000790,  0.00000000025),
    new Array(  0.773196,      0.0007744,    0.00003749,   -0.000000092),
    new Array( 74.005947,      0.5211258,    0.00133982,    0.000018516),
    new Array(173.005159,      1.4863784,    0.00021450,    0.000000433));

planets[7]=new planet("Neptune",
    new Array(304.348665,    219.8833092,    0.00030926,    0.000000018),
    new Array( 30.110386869,  -0.0000001663, 0.00000000069, 0.0),
    new Array(  0.00898809,    0.000006408, -0.0000000008, -0.00000000005),
    new Array(  1.769952,     -0.0093082,   -0.00000708,    0.000000028),
    new Array(131.784057,      1.1022057,    0.00026006,   -0.000000636),
    new Array( 48.123691,      1.4262677,    0.00037918,   -0.000000003));

// heliocentric xyz for planet p and observer obs

function helios(p,obs) {
    var T=(jd(obs)-2451545.0)/36525;
    var T2=T*T;
    var T3=T2*T;
    // longitude of ascending node
    var N=rev(p.N[0]+p.N[1]*T+p.N[2]*T2+p.N[3]*T3);
    // inclination
    var i=p.i[0]+p.i[1]*T+p.i[2]*T2+p.i[3]*T3;
    // Mean longitude
    var L=rev(p.L[0]+p.L[1]*T+p.L[2]*T2+p.L[3]*T3);
    // semimajor axis
    var a=p.a[0]+p.a[1]*T+p.a[2]*T2+p.a[3]*T3;
    // eccentricity
    var e=p.e[0]+p.e[1]*T+p.e[2]*T2+p.e[3]*T3;
    // longitude of perihelion
    var P=rev(p.P[0]+p.P[1]*T+p.P[2]*T2+p.P[3]*T3);
    var M=rev(L-P);
    var w=rev(L-N-M);
    // Eccentric anomaly
    var E0=M+(180.0/Math.PI)*e*sind(M)*(1+e*cosd(M));
    var E=E0-(E0-(180.0/Math.PI)*e*sind(E0)-M)/(1-e*cosd(E0));
    while (Math.abs(E0-E) > 0.0005) {
        E0=E;
        E=E0-(E0-(180.0/Math.PI)*e*sind(E0)-M)/(1-e*cosd(E0));
    };
    var x=a*(cosd(E)-e);
    var y=a*Math.sqrt(1-e*e)*sind(E);
    var r=Math.sqrt(x*x+y*y);
    var v=rev(atan2d(y,x));
    // Heliocentric Ecliptic Rectangular Coordinates
    var xeclip=r*(cosd(N)*cosd(v+w)-sind(N)*sind(v+w)*cosd(i));
    var yeclip=r*(sind(N)*cosd(v+w)+cosd(N)*sind(v+w)*cosd(i));
    var zeclip=r*sind(v+w)*sind(i);
    return new Array(xeclip,yeclip,zeclip);
}
// radecr returns ra, dec and earth distance
// obj and base are Heliocentric Ecliptic Rectangular Coordinates
// for the object and earth and obs is the observer

function radecr(obj,base,obs) {
    // Equatorial co-ordinates
    var x=obj[0];
    var y=obj[1];
    var z=obj[2];
    // julian date
    var jdobs=jd(obs);
    // Obliquity of Ecliptic
    var obl=23.4393-3.563E-7*(jdobs-2451543.5);
    // Convert to Geocentric co-ordinates
    var x1=x-base[0];
    var y1=(y-base[1])*cosd(obl)-(z-base[2])*sind(obl);
    var z1=(y-base[1])*sind(obl)+(z-base[2])*cosd(obl);
    // RA and dec
    var ra=rev(atan2d(y1,x1))/15.0;
    var dec=atan2d(z1,Math.sqrt(x1*x1+y1*y1));
    // Earth distance
    var r=Math.sqrt(x1*x1+y1*y1+z1*z1);
    return new Array(ra,dec,r);
}


function doPlanets(obs,repeat) {
    // creates the planets window,
    // obs is the observer
    // repeat = 0 only do for 1 day
    // repeat = 1 do for several days
    // repeat = 3 do for the full month
    var obscopy=new Object();
    for (var i in obs) obscopy[i] = obs[i];
    var oname=sitename();
    var dayno;

    //write("Planetary Positions for "+oname);
    //writeln("<br>Date = "+datestring(obscopy));
    //writeln(" Time = "+timestring(obscopy,false));


    //writeln("<TD align=center>Rise</TD>");
    //writeln("<TD align=center>Transit</TD>");
    //writeln("<TD align=center>Set</TD>");

    var data = [];

    // Print the positions
    for (var p=0; p<8; p++) {
        if (p==2) continue; // skip Earth

        if (p==6) continue; // skip uranus
        if (p==7) continue; // skip neptune

        var value = {};
        data.push(value);

        value.name = planets[p].name;

        var earth_xyz = helios(planets[2],obscopy);
        var planet_xyz = helios(planets[p],obscopy);
        var radec = radecr(planet_xyz, earth_xyz, obscopy);
        var altaz = radtoaa(radec[0], radec[1], obscopy);

        value.rightAscension = radec[0];
        value.declination = radec[1];
        value.altitude = altaz[0];
        value.azimuth = altaz[1];
        value.distance = radec[2];


        obscopy.hours=12;
        obscopy.minutes=0;
        obscopy.seconds=0;
        var planet_xyz = helios(planets[p],obscopy);
        var lst=local_sidereal(obscopy);
        var radec=radecr(planet_xyz,earth_xyz,obscopy);
        var ra=radec[0];
        var dec=radec[1];
        var UTplanet=12.0+ra-lst;
        if (UTplanet < 0.0) UTplanet+=24.0;
        if (UTplanet > 24.0) UTplanet-=24.0;
        // refraction correction 0.583
        var cosLHA=(sind(-0.583)-sind(obs.latitude)*sind(dec)) / (cosd(obs.latitude)*cosd(dec));
        if (cosLHA > 1.0) {
            // ---
            value.rise = null;
            value.set = null;
            value.transit = null;
        } else if (cosLHA < -1.0) {
            // +++
            value.rise = null;
            value.set = null;
            value.transit = null;
        } else {
            // Print rise/set times allowing for not today.
            lha=acosd(cosLHA)/15.04107 ;

            if ((UTplanet-lha) < 0.0) {
                value.rise = 24.0+UTplanet-lha;
            } else {
                value.rise = UTplanet-lha;
            }

            value.transit = UTplanet;

            if ((UTplanet+lha) > 24.0) {
                value.set = UTplanet+lha-24.0
            } else {
                value.set = UTplanet+lha;
            }
            obscopy.hours=obs.hours;
            obscopy.minutes=obs.minutes;
            obscopy.seconds=obs.seconds;
        }
    }

    return data;

}








// JavaScript by Peter Hayes http://www.peter-hayes.freeserve.co.uk/
// Copyright 2001-2004
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

// radsep returns the angular separation of 2 objects given RA and dec.

function radsep(ra1,dec1,ra2,dec2){
    var sdec1=sind(dec1);
    var cdec1=cosd(dec1);
    var sdec2=sind(dec2);
    var cdec2=cosd(dec2);
    var angular_separation=acosd(sdec1*sdec2+cdec1*cdec2*cosd(15.0*(ra1-ra2)));
    return angular_separation;
}

function radpos(ra,dec) {
    this.ra=ra;
    this.dec=dec;
}

function doAngles(obs) {
    var obscopy=new Object();
    for (var i in obs) obscopy[i] = obs[i];
    obscopy.hours=12;
    obscopy.minutes=0;
    obscopy.seconds=0;
    var oname=sitename();

    // ra and dec of each object
    var radecs = new Array();

    // sun's position
    var sun_xyz=new Array(0.0,0.0,0.0);
    var earth_xyz=helios(planets[2],obs);
    var radec=radecr(sun_xyz,earth_xyz,obs);
    radecs[0]=new radpos(radec[0],radec[1]);

    // moon's position
    var moontab=MoonPos(obs);
    radecs[1]=new radpos(moontab[0],moontab[1]);

    // planets positions - i is an offset for the tables so earth is skipped
    var i=2;
    for (var p=0;p<8;p++) {
        if (p==2) {
            i=1;
        } else {
            var planet_xyz = helios(planets[p],obs);
            radec=radecr(planet_xyz,earth_xyz,obs);
            radecs[i+p] = new radpos(radec[0],radec[1]);
        }
    }

    // User defined object specified by RA/Dec table entry
    var ra=parsecol(document.table1.ra.value);
    var dec=parsecol(document.table1.dec.value);
    radecs[9] = new radpos(ra,dec);
    // Now print the table
    var awin=window.open("","Angles","menubar,scrollbars,resizable");
    with (awin.document) {
        writeln("<HTML>");
        writeln("<HEAD>");
        writeln("<TITLE>Astronomy Javascript Angles</TITLE>");
        writeln("<link href=\"default.css\" rel=stylesheet type=\"text/css\"/>");
        writeln("</HEAD>");
        writeln("<BODY>");
        writeln("<CENTER>");
        write("<H2>");
        write("Angular Separations for "+oname+"<BR>");
        write("Date = "+datestring(obs)+" ");
        write("Time = "+timestring(obs,false));
        writeln("</H2>");
        writeln("<table  class=\"fixed_bluebox\" border=\"1\" cellpadding=\"5\"");
        // i is offset for the planet table to get the names
        i=2;
        writeln("<TR>");
        writeln("<TD align=center>&nbsp</TD>");
        for (var p=0; p<10; p++) {
            if (p==0) {
                writeln("<TD align=center><B>Sun</B></TD>");
            } else {
                if (p==1) {
                    writeln("<TD align=center><B>Moon</B></TD>");
                } else {
                    if (p==9) {
                        writeln("<TD align=center><B>User defined</B></TD>");
                    } else {
                        if (p==4) i=1;
                        writeln("<TD align=center><B>"+planets[p-i].name+"</B></TD>");
                    }
                }
            }
        }
        i=2;
        for (var p=0; p<10; p++) {
            if (p==0) {
                writeln("<TR><TD align=center><B>Sun</B></TD>");
            } else {
                if (p==1) {
                    writeln("<TR><TD align=center><B>Moon</B></TD>");
                } else {
                    if (p==9) {
                        writeln("<TR><TD align=center><B>User defined</B></TD>");
                    } else {
                        if (p==4) i=1;
                        writeln("<TR><TD align=center><B>"+planets[p-i].name+"</B></TD>");
                    }
                }
            }
            for (var q=0; q<10 ;q++){
                if (p==q) {
                    writeln("<TD align=center>&nbsp</TD>");
                } else {
                    var sep=radsep(radecs[p].ra,radecs[p].dec,radecs[q].ra,radecs[q].dec);
                    writeln("<TD align=center>"+anglestring(sep,true)+"</TD>");
                }
            }
        }

        writeln("</TABLE><P>");
        writeln("<A HREF=\"javascript:window.close()\">close window</A>");
        writeln("</CENTER></BODY></HTML>");
        close();
    }
    awin.focus();
}

// JavaScript by Peter Hayes Copyright 2001-2005
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page
// http://www.aphayes.pwp.blueyonder.co.uk/

// Extensions to the Math routines - Trig routines in degrees

function rev(angle){return angle-Math.floor(angle/360.0)*360.0;}
function sind(angle){return Math.sin((angle*Math.PI)/180.0);}
function cosd(angle){return Math.cos((angle*Math.PI)/180.0);}
function tand(angle){return Math.tan((angle*Math.PI)/180.0);}
function asind(c){return (180.0/Math.PI)*Math.asin(c);}
function acosd(c){return (180.0/Math.PI)*Math.acos(c);}
function atan2d(y,x){return (180.0/Math.PI)*Math.atan(y/x)-180.0*(x<0);}

// Functions used for converting Basic code
function SGN(x) { return (x<0)?-1:+1; }

// Routines from Dennis Allen www.stargazing.net/mas

//
//    This function returns the integer of a number.
//
function intr(num) {
    with (Math) {
        var n = floor(abs(num)) ; if (num < 0) n = n * -1
    }
    return n
}
//
//    This function returns a numeric value.
//
function NumFloat(num) {
    with (Math) {
        var temp = parseFloat(num)
        if (!(temp > 0 || temp < 0 || temp == 0)) temp = 0
    }
    return temp
}






// *** Create the location ***
var location = new place("GB:Greenwich","51:28:38",0,"00:00:00",0,0,"","");
observer = new observatory(location);
observer.setDate(new Date());

var sunData = doSun(observer,0);

console.log(sunData.rightAscension);