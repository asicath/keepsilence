
var Prime = function () {

    var numbersPerSecond = 0.1;
    var number = 0.0;
    var lastWholeNumber = 0;
    var primes = [];
    var maxTime = 1.0;
    var acceleration = 1.001;

    var Init = function () {
        // Events
        Timer.AddEvent(AddTime);
    }

    var GetCurrentNumber = function () {
        return number;
    };

    var AddTime = function (time, totalTime) {
        number = (totalTime / 1000.0) * numbersPerSecond;
        AddPrimes();
        numbersPerSecond = numbersPerSecond * acceleration;
    };

    var GetCountPerSecond = function () {
        return numbersPerSecond;
    };

    var GetLastWholeNumber = function () {
        return lastWholeNumber;
    };

    var Acceleration = function (value) {
        if (typeof value !== 'undefined') { acceleration = value; }
        return acceleration;
    };

    var AddPrimes = function () {
        var wholeNumber = parseInt(Math.floor(number));

        // Don't skip any
        while (lastWholeNumber < wholeNumber) {
            lastWholeNumber++;

            if (IsPrime(lastWholeNumber)) {
                primes.push(lastWholeNumber);
            }
        }

    };

    var IsPrime = function (n) {
        if (n <= 1) { return false; }
        for (var i = 0; i < primes.length; i++) {
            if (n % primes[i] == 0) {
                return false;
            }
        }
        return true;
    };

    return {
        Init: Init,
        GetCurrentNumber: GetCurrentNumber,
        Current: primes,
        GetCountPerSecond: GetCountPerSecond,
        GetLastWholeNumber: GetLastWholeNumber,
        Acceleration: Acceleration
    };
} ();
