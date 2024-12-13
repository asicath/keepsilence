const Julian = require('julian-date');
console.log(new Julian().julian());

/*const t = ((julianDate - 2451545.0) / 36525); // time in julian centuries
const theta0 = 280.46061837 + 360.98564736629 * (julianDate - 2451545.0) + (0.000387933 * t * t) - (t * t * t / 38710000.0);
const angle = theta0 % 360;*/

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

function julianDate(time) {
    return time / 86400000 + 2440587.5;
}

const jd = julianDate(Date.now());
console.log(jd);

function reduce(degrees) {
    let value = degrees % 360;
    if (value < 0) value += 360;
    return value;
}

function sunRightAscension(JD)    {
    const radiansPerDegree= Math.PI / 180.0;

    // the number of days from J2000 (2000 January 1.5, Julian date 2451545.0)
    const T = (JD - 2451545.0) / 36525;

    // geometric mean longitude
    let L0 = reduce(280.46646 + 36000.76983*T + 0.0003032*T*T);

    // mean anomaly
    let M = reduce(357.52911 + 35999.05029*T - 0.0001537*T*T);

    // sun's equation of the center
    const C = Math.sin(1*M * radiansPerDegree) * (1.914602 - 0.004817*T - 0.000014*T*T)
                     + Math.sin(2*M * radiansPerDegree) * (0.019993 - 0.000101*T)
                     + Math.sin(3*M * radiansPerDegree) * (0.000289);

    // sun's true longitude
    const L = L0 + C;

    // mean obliquity of the ecliptic
    const U = T / 100;
    const e0 = reduce(DHMtoD(23,26,21.448)
        - DHMtoD(0,0,4680.93) * U
        -    1.55 * Math.pow(U, 2)
        + 1999.25 * Math.pow(U, 3)
        -   51.38 * Math.pow(U, 4)
        -  249.67 * Math.pow(U, 5)
        -   39.05 * Math.pow(U, 6)
        +    7.12 * Math.pow(U, 7)
        +   27.87 * Math.pow(U, 8)
        +    5.79 * Math.pow(U, 9)
        +    2.45 * Math.pow(U, 10));

    const RA = reduce(Math.atan2(
        Math.cos(e0 * radiansPerDegree) * Math.sin(L * radiansPerDegree),
        Math.cos(L * radiansPerDegree)
    ) / radiansPerDegree);

    return RA;
}

function DHMtoD(degrees, hours, minutes) {
    return degrees + hours / 60 + minutes / (60 * 60);
}

log(Date.now());

// const jd = julianDate(Date.now());
// for (let i = 0; i < 12; i++) {
//     const position = sunRightAscension(jd + i * 30);
//     const v = parsePosition(position);
//     console.log(`${v.signIndex} ${v.degree}° ${v.hour}' ${v.minute}"`);
// }

//const d00 = Date.parse("2025-03-20T07:32:00.000Z");


const a = [
    //"1992-10-13T00:00:00.000Z",
    "2025-03-20T08:43:00.000Z",
    "2025-03-20T08:44:00.000Z",
    "2025-03-20T09:01:00.000Z",
    "2025-03-20T09:02:00.000Z"
]

for (const d of a) {
    const time = Date.parse(d);
    console.log(d);
    log(time);
}

function log(time) {
    const jd = julianDate(time);
    const position = sunRightAscension(jd);

    const h = Math.floor(position / 15);
    const mRaw = (position / 15 - h) * 60;
    const m = Math.floor(mRaw);
    const s = Math.floor((mRaw - m) * 60);
    console.log(`   ${h}h ${m}m ${s}s`);

    const v = parseZodiacPosition(position);
    console.log(`   ${zodiac[v.signIndex]} ${v.degree}° ${v.hour}' ${v.minute}"`);
}

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
