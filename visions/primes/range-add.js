
var range = (function() {

    var exports = {};

    var primes = [];
    var upTo = 1;

    function createPrimesTo(n) {
        while (n > upTo) {
            upTo += 1;
            if (isPrime(upTo)) addPrime(upTo);
        }
    }

    function isPrime(n) {

        var max = Math.floor(Math.sqrt(n));

        for (var j = 0; j < primes.length; j++) {
            var prime = primes[j];

            // don't find above the limit
            if (prime.n > max) return true;

            // found a factor
            if (n % prime.n == 0) return false;
        }

        return true;
    }

    function addPrime(n) {

        // create the base prime
        var prime = {n: n};

        // get the existing coverage gap
        var uncovered = primes.length == 0 ? 1 : 1 - primes[primes.length - 1].sumCoverage;

        // take a smaller portion each time
        prime.addCoverage = uncovered * (1 / n);

        // get the sum
        prime.sumCoverage = (1 - uncovered) + prime.addCoverage;

        // add it to the list
        primes.push(prime);
    }

    exports.getPrimeFactors = function(n) {

        var factors = [];
        var max = n * n;

        for (var j = 0; j < primes.length; j++) {
            var prime = primes[j];

            // don't find above the limit
            if (prime.n > max) break;

            // found a factor
            if (n % prime.n == 0) factors.push(prime.n);
        }

        return factors;
    };

    exports.getRangeAt = function(n, intervalCount) {

        // make sure we've got enough primes
        //var target = Math.floor(Math.sqrt(n));
        var target = Math.floor(n/2);
        createPrimesTo(n);

        // find the max prime for this number
        var iMax = primes.length - 1;
        while (iMax > 0 && primes[iMax].n > target) { // ?? Could make this sqrt n
            iMax -= 1;
        }

        // get max coverage
        var coverage = primes[iMax].sumCoverage;

        var ranges = [];
        var range = null;
        var prime, i = 0;

        // create the initial ranges, up to the max count
        while (i <= iMax && ranges.length < intervalCount) {
            range = getSingularRange(i);
            ranges.push(range);
            i++;
        }

        var j = ranges.length - 1;

        while (i <= iMax) {
            range = ranges[j];

            // get the next default range
            ranges[j] = getNextRange(range);

            while (!checkForBalance(j, ranges)) {

            }

            i++;
        }

        return ranges;
    };

    function checkForBalance(j, ranges) {

        // at the bottom
        if (j == 0) return true;

        var next = ranges[j];
        var prev = ranges[j-1];
        if (next.active > prev.active) {
            //console.log('needs step down');

            // reduce on the front
            ranges[j] = getReducedRange(next);

            // advance the next
            ranges[j - 1] = getNextRange(prev);

            // need to check on level deeper to check if this change propogates one level further
            return false;
        }
        return checkForBalance(j - 1, ranges);
    }

    function getSingularRange(i) {
        var prime = primes[i];

        var range = {
            active: 1/prime.n,
            next: null,

            count: 1,
            sum: prime.n,

            start: prime.n,
            end: prime.n,
            startIndex: i,
            endIndex: i
        };

        // calculate the next coverage percent
        if (i+1 < primes.length) range.next = range.active + (1 - range.active) * (1 / primes[i+1].n);

        return range;
    }

    function getNextRange(range) {
        var i = range.endIndex + 1;
        var prime = primes[i];

        var next = {
            active: range.active + (1 - range.active) * (1/prime.n),
            next: null,

            count: range.count + 1,
            sum: range.sum + prime.n,

            start: range.start,
            end: prime.n,
            startIndex: range.startIndex,
            endIndex: i
        };

        // calculate the next coverage percent
        if (i+1 < primes.length) next.next = next.active + (1 - next.active) * (1 / primes[i+1].n);

        return next;
    }

    // drops one on the front end
    function getReducedRange(range) {
        var i = range.startIndex;
        var prime = primes[i];
        var nextPrime = primes[i + 1];

        var next = {
            active: range.active - (1 / (range.sum - prime.n)) * (1 / prime.n),
            next: null,

            count: range.count - 1,
            sum: range.sum - prime.n,

            start: nextPrime.n,
            end: range.end,
            startIndex: range.startIndex + 1,
            endIndex: range.endIndex
        };

        // calculate the next coverage percent
        if (i+1 < primes.length) next.next = next.active + (1 - next.active) * (1 / primes[i+1].n);


        return next;
    }

    return exports;
})();

//console.log(range.getRangeAt(2, 7));
//console.log(range.getRangeAt(3, 7));

// sub: p - 1/(sum-n) * (1/n)
