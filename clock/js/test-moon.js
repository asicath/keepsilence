const fs = require("fs");

function reduce(degrees) {
    let value = degrees % 360;
    if (value < 0) value += 360;
    return value;
}

function rev(angle){return angle-Math.floor(angle/360.0)*360.0;}
function sind(angle){return Math.sin((angle*Math.PI)/180.0);}
function cosd(angle){return Math.cos((angle*Math.PI)/180.0);}
function tand(angle){return Math.tan((angle*Math.PI)/180.0);}
function asind(c){return (180.0/Math.PI)*Math.asin(c);}
function acosd(c){return (180.0/Math.PI)*Math.acos(c);}
function atan2d(y,x){return (180.0/Math.PI)*Math.atan(y/x)-180.0*(x<0);}

// Functions for the moon

// Meeus first edition table 45.A Longitude and distance of the moon

const T45AD = [
    0, 2, 2, 0, 0, 0, 2, 2, 2, 2,
    0, 1, 0, 2, 0, 0, 4, 0, 4, 2,
    2, 1, 1, 2, 2, 4, 2, 0, 2, 2,
    1, 2, 0, 0, 2, 2, 2, 4, 0, 3,
    2, 4, 0, 2, 2, 2, 4, 0, 4, 1,
    2, 0, 1, 3, 4, 2, 0, 1, 2, 2
];

const T45AM = [
    0,  0,  0,  0,  1,  0,  0, -1,  0, -1,
    1,  0,  1,  0,  0,  0,  0,  0,  0,  1,
    1,  0,  1, -1,  0,  0,  0,  1,  0, -1,
    0, -2,  1,  2, -2,  0,  0, -1,  0,  0,
    1, -1,  2,  2,  1, -1,  0,  0, -1,  0,
    1,  0,  1,  0,  0, -1,  2,  1,  0,  0
];

const T45AMP = [
     1, -1,  0,  2,  0,  0, -2, -1,  1,  0,
    -1,  0,  1,  0,  1,  1, -1,  3, -2, -1,
     0, -1,  0,  1,  2,  0, -3, -2, -1, -2,
     1,  0,  2,  0, -1,  1,  0, -1,  2, -1,
     1, -2, -1, -1, -2,  0,  1,  4,  0, -2,
     0,  2,  1, -2, -3,  2,  1, -1,  3, -1
];

const T45AF  = [
     0,  0,  0,  0,  0,  2,  0,  0,  0,  0,
     0,  0,  0, -2,  2, -2,  0,  0,  0,  0,
     0,  0,  0,  0,  0,  0,  0,  0,  2,  0,
     0,  0,  0,  0,  0, -2,  2,  0,  2,  0,
     0,  0,  0,  0,  0, -2,  0,  0,  0,  0,
    -2, -2,  0,  0,  0,  0,  0,  0,  0, -2
];

const T45AL = [
    6288774, 1274027, 658314, 213618, -185116,
    -114332,   58793,  57066,  53322,   45758,
    -40923,  -34720, -30383,  15327,  -12528,
    10980,   10675,  10034,   8548,   -7888,
    -6766,   -5163,   4987,   4036,    3994,
    3861,    3665,  -2689,  -2602,    2390,
    -2348,    2236,  -2120,  -2069,    2048,
    -1773,   -1595,   1215,  -1110,    -892,
    -810,     759,   -713,   -700,     691,
    596,     549,    537,    520,    -487,
    -399,    -381,    351,   -340,     330,
    327,    -323,    299,    294,       0
];

const T45AR = [
    -20905355, -3699111, -2955968, -569925,   48888,
    -3149,   246158,  -152138, -170733, -204586,
    -129620,   108743,   104755,   10321,       0,
    79661,   -34782,   -23210,  -21636,   24208,
    30824,    -8379,   -16675,  -12831,  -10445,
    -11650,    14403,    -7003,       0,   10056,
    6322,    -9884,     5751,       0,   -4950,
    4130,        0,    -3958,       0,    3258,
    2616,    -1897,    -2117,    2354,       0,
    0,    -1423,    -1117,   -1571,   -1739,
    0,    -4421,        0,       0,       0,
    0,     1165,        0,       0,    8752
];

/*const tableA = [];
for (let i = 0; i < 60; i++) {
    const row = {
        D: T45AD[i],
        M: T45AM[i],
        Mp:T45AMP[i],
        F: T45AF[i],
        Sl:T45AL[i],
        Sr:T45AR[i]
    };
    tableA.push(row);
}
fs.writeFileSync('table-a.json', JSON.stringify(tableA, null, 2));*/

// Meeus table 45B latitude of the moon

const T45BD = [
    0, 0, 0, 2, 2, 2, 2, 0, 2, 0,
    2, 2, 2, 2, 2, 2, 2, 0, 4, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 4, 4,
    0, 4, 2, 2, 2, 2, 0, 2, 2, 2,
    2, 4, 2, 2, 0, 2, 1, 1, 0, 2,
    1, 2, 0, 4, 4, 1, 4, 1, 4, 2];

const T45BM = [
    0,  0,  0,  0,  0,  0,  0, 0,  0,  0,
    -1,  0,  0,  1, -1, -1, -1, 1,  0,  1,
    0,  1,  0,  1,  1,  1,  0, 0,  0,  0,
    0,  0,  0,  0, -1,  0,  0, 0,  0,  1,
    1,  0, -1, -2,  0,  1,  1, 1,  1,  1,
    0, -1,  1,  0, -1,  0,  0, 0, -1, -2];

const T45BMP = [
    0,  1, 1,  0, -1, -1,  0,  2,  1,  2,
    0, -2, 1,  0, -1,  0, -1, -1, -1,  0,
    0, -1, 0,  1,  1,  0,  0,  3,  0, -1,
    1, -2, 0,  2,  1, -2,  3,  2, -3, -1,
    0,  0, 1,  0,  1,  1,  0,  0, -2, -1,
    1, -2, 2, -2, -1,  1,  1, -1,  0,  0];

const T45BF = [
    1,  1, -1, -1,  1, -1,  1,  1, -1, -1,
    -1, -1,  1, -1,  1,  1, -1, -1, -1,  1,
    3,  1,  1,  1, -1, -1, -1,  1, -1,  1,
    -3,  1, -3, -1, -1,  1, -1,  1, -1,  1,
    1,  1,  1, -1,  3, -1, -1,  1, -1, -1,
    1, -1,  1, -1, -1, -1, -1, -1, -1,  1];

const T45BL = [5128122, 280602, 277693, 173237, 55413,
    46271,  32573,  17198,   9266,  8822,
    8216,   4324,   4200,  -3359,  2463,
    2211,   2065,  -1870,   1828, -1794,
    -1749,  -1565,  -1491,  -1475, -1410,
    -1344,  -1335,   1107,   1021,   833,
    777,    671,    607,    596,   491,
    -451,    439,    422,    421,  -366,
    -351,    331,    315,    302,  -283,
    -229,    223,    223,   -220,  -220,
    -185,    181,   -177,    176,   166,
    -164,    132,   -119,    115,   107];

/*const tableB = [];
for (let i = 0; i < 60; i++) {
    const row = {
        D: T45BD[i],
        M: T45BM[i],
        Mp:T45BMP[i],
        F: T45BF[i],
        Sb:T45BL[i]
    };
    tableB.push(row);
}
fs.writeFileSync('table-b.json', JSON.stringify(tableB, null, 2));*/

// MoonPos calculates the Moon position, based on Meeus chapter 45
// and the illuminated percentage from Meeus equations 46.4 and 46.1

function moonRightAscension(JD) {

    const T= (JD - 2451545.0) / 36525;
    const T2= T*T;
    const T3= T2*T;
    const T4= T3*T;

    // Moon's mean longitude L'
    const LP= 218.3164477 + 481267.88123421*T - 0.0015786*T2 + T3/538841 - T4/65194000;

    // Mean elongation of the Moon
    const D= 297.8501921 + 445267.1114034*T - 0.0018819*T2 + T3/545868 - T4/113065000;

    // Moons mean anomaly M'
    const MP= 134.9633964 + 477198.8675055*T + 0.0087414*T2 + T3/69699 - T4/14712000;

    // Moons argument of latitude
    const F= 93.2720950 + 483202.0175233*T - 0.0036539*T2 - T3/3526000 + T4/863310000;

    // Suns mean anomaly
    const M= 357.5291092 + 35999.0502909*T - 0.0001536*T2 + T3/24490000;

    // Additional arguments
    const A1= 119.75 + 131.849*T;
    const A2= 53.09 + 479264.290*T;
    const A3= 313.45 + 481266.484*T;

    const E= 1 - 0.002516*T - 0.0000074*T2;
    const E2= E*E;

    // Sums of periodic terms from table A and B
    let Sl= 0.0;
    let Sr= 0.0;
    for (let i= 0; i < 60; i++) {
        let Eterm= 1;
        if (Math.abs(T45AM[i]) === 1) Eterm = E;
        if (Math.abs(T45AM[i]) === 2) Eterm = E2;
        const x = rev(T45AD[i]*D + T45AM[i]*M + T45AMP[i]*MP + T45AF[i]*F);
        Sl += T45AL[i] * Eterm * sind(x);
        Sr += T45AR[i] * Eterm * cosd(x);
    }

    let Sb= 0.0;
    for (let i= 0; i < 60; i++) {
        let Eterm= 1;
        if (Math.abs(T45BM[i]) === 1) Eterm = E;
        if (Math.abs(T45BM[i]) === 2) Eterm = E2;
        const x = rev(T45BD[i]*D + T45BM[i]*M + T45BMP[i]*MP + T45BF[i]*F);
        Sb += T45BL[i] * Eterm * sind(x);
    }

    // Additional additive terms
    Sl = Sl + 3958*sind(rev(A1)) + 1962*sind(rev(LP-F)) + 318*sind(rev(A2));
    Sb = Sb - 2235*sind(rev(LP)) + 382*sind(rev(A3)) + 175*sind(rev(A1-F)) + 175*sind(rev(A1+F)) + 127*sind(rev(LP-MP)) - 115*sind(rev(LP+MP));

    // geocentric longitude, latitude and distance
    const mglong = rev(LP + Sl/1000000.0);
    let mglat = rev(Sb/1000000.0);
    if (mglat > 180.0) mglat = mglat - 360;

    // Obliquity of Ecliptic
    const obl= 23.4393 - 3.563E-7 * (JD - 2451543.5);

    const ra= rev(atan2d(sind(mglong) * cosd(obl) - tand(mglat) * sind(obl), cosd(mglong)));

    return ra;
}

function julianDate(time) {
    return time / 86400000 + 2440587.5;
}

const zodiac = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces'
];

function parseZodiacPosition(position) {
    const signIndex = Math.floor(position / 30);

    const degreeRaw = position - signIndex * 30;
    const degree = Math.floor(degreeRaw);

    const hourRaw = (degreeRaw - degree) * 60;
    const hour = Math.floor(hourRaw);

    const minuteRaw = (hourRaw - hour) * 60;
    const minute = Math.floor(minuteRaw);

    return {
        signIndex,
        degree,
        hour,
        minute
    }
}

function log(time) {
    const jd = julianDate(time);
    const position = moonRightAscension(jd);

    const h = Math.floor(position / 15);
    const mRaw = (position / 15 - h) * 60;
    const m = Math.floor(mRaw);
    const s = Math.floor((mRaw - m) * 60);
    console.log(`   ${h}h ${m}m ${s}s`);

    const v = parseZodiacPosition(position);
    console.log(`   ${zodiac[v.signIndex]} ${v.degree}° ${v.hour}' ${v.minute}"`);
}

//log(Date.now());

log(Date.parse("1992-04-12T00:00:00.000Z"));

