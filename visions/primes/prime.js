function generatePrimes(count) {
    var n = 2;
    var a = [];
    while (a.length < count) {

        if (isPrime(n, a)) {
            a.push(n);
        }

        n++;
    }
    return a;
}

function isPrime(n, primes) {
    for (var i = 0; i < primes.length; i++) {
        if (n % primes[i] === 0) return false;
    }
    return true;
}
