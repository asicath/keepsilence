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

