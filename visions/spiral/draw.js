var Kaph = function () {

    var radius = 249;
    var lineWidth = 1;
    var minLineLength = 10;
    var blue = "rgba(0,0,255, 0.5)";
    var red = "rgba(255,0,0, 0.5)";
    var grey = "rgba(128,128,128, 1)";
    var c;
    var capType = 'round';
    var power = 0.5;

    var Init = function (context) {
        c = context;
        CalculateRadius();
        Timer.AddEvent(Draw);
    };

    var CalculateRadius = function () {
        var size = canvas.width;
        if (canvas.height < size) { size = canvas.height; }
        radius = (size * 0.95) / 2;
    };

    var Draw = function (time, totalTime) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        DrawCircle();
        DrawOne();
        DrawPrimes();
        DrawSpeed();
        DrawNumber();
        DrawAcceleration();
    };

    var DrawAcceleration = function () {
        c.save();
        //c.translate(canvas.width / 2, canvas.height / 2);
        c.font = '18px Arial';
        c.fillStyle = 'grey';
        c.fillText(('' + Prime.Acceleration()).substring(0, 6), 20, 30);
        //c.restore();
    };

    var DrawSpeed = function () {
        c.save();
        //c.translate(canvas.width / 2, canvas.height / 2);
        c.font = '18px Arial';
        c.fillStyle = 'grey';
        c.fillText(('' + Prime.GetCountPerSecond()).substring(0, 4), 20, 50);
        //c.restore();
    };

    var DrawNumber = function () {
        c.save();
        //c.translate(canvas.width / 2, canvas.height / 2);
        c.font = '18px Arial';
        c.fillStyle = 'grey';
        c.fillText(('' + Prime.GetLastWholeNumber()).substring(0, 7), 20, 70);
        //c.restore();
    };

    var DrawOne = function () {
        var number = Prime.GetCurrentNumber();
        DrawPrime(1, 1, grey);
        DrawPrime(1, number, 'white');

    };

    var DrawPrimes = function () {
        var number = Prime.GetCurrentNumber();
        for (var i = Prime.Current.length; i >= 0; i--) {
            DrawPrime(Prime.Current[i], number, null);
        }
    };

    var DrawPrime = function (number, count, color) {
        var initialAngle = Math.PI * 1.5;
        var percent = (count % number) / number;
        var angle = initialAngle + Math.PI * 2.0 * percent;

        //var lengthPercent = Math.log(number);
        var lengthPercent = number / count;
        //var lengthPercent = Math.log(number / count) / Math.log(1);
        //var lengthPercent = Math.log(number) / Math.log(count*power);

        //lengthPercent = Math.pow(lengthPercent, power);

        lengthPercent = lengthPercent >= 1 ? 1 : lengthPercent;


        if (color == null) { color = Color.ByNumber(number, 1000); }
        DrawLine(angle, lengthPercent, color);
    };

    var DrawLine = function (angle, lengthPercent, color) {

        // Outside point (On circle)
        var x1 = Math.cos(angle) * radius;
        var y1 = Math.sin(angle) * radius;

        // The length of the line
        var length = lengthPercent * radius;

        // Ensure min length
        if (length < minLineLength) {
            length = minLineLength;
        }

        // The point inside the circle
        var x2 = Math.cos(angle) * (radius - length);
        var y2 = Math.sin(angle) * (radius - length);

        // Draw
        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.lineWidth = lineWidth;
        c.strokeStyle = color;
        c.lineCap = capType;
        c.stroke();
        c.restore();
    };

    var DrawCircle = function () {

        var x = 0;
        var y = 0;

        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);

        c.beginPath();
        c.arc(x, y, radius, 0, Math.PI * 2, false);
        c.closePath();
        c.lineWidth = 3;
        c.strokeStyle = grey;
        c.lineCap = capType;
        c.stroke();

        c.restore();
    };

    return {
        Init: Init,
        CalculateRadius: CalculateRadius,
        Lower: function(){power -= 0.1;},
        Raise: function () { power += 0.1; }
    };

} ();






//function Source(count, rotationsPerSecond, circlesPerRotation, red, green, blue, alpha) {

//    if (typeof (_source_prototype_called) == 'undefined') {
//        _source_prototype_called = true;
//        Source.prototype.AddTime = AddTime;
//        Source.prototype.AddCircles = AddCircles;
//        Source.prototype.SetRotationsPerSecond = SetRotationsPerSecond;
//        Source.prototype.SetCirclesPerRotation = SetCirclesPerRotation;
//    }
//    
//    this.Count = count;
//    this.TimeUntilNext = 0;
//    
//    this.Red = red;
//    this.Green = green;
//    this.Blue = blue;
//    this.Alpha = alpha;

//    this.SourceId = SourceIdNext++;

//    //this.RotationsPerSecond = 1.0;
//    this.SecondsPerRotation = 0;
//    this.SetRotationsPerSecond(rotationsPerSecond);
//    this.SetCirclesPerRotation(circlesPerRotation);
//    

//    
//    function SetRotationsPerSecond(rps) {
//        this.RotationsPerSecond = rps;

//        this.TimePerRotation = 1000 / this.RotationsPerSecond;
//        //this.AngleIncr = (Math.PI * 2.0 * (this.RotationsPerSecond / 1000.0));// / FramesPerSecond;
//    }

//    function SetCirclesPerRotation(cpr) {
//        this.CirclesPerRotation = cpr;
//        this.CirclesPerSecond = this.RotationsPerSecond * this.CirclesPerRotation;
//    }
//    
//    function AddTime(time) {
//    
//        this.TimeUntilNext = this.TimeUntilNext - time;
//        
//        if (this.TimeUntilNext <= 0) {
//            this.AddCircles();
//            this.TimeUntilNext = this.TimeUntilNext + (1000.0 / this.CirclesPerSecond);
//        }
//    }

//    function AddCircles() {
//        
//        var radius = Radius;
//        var totalVelocity = Velocity;
//        var xV = 0;
//        var yV = 0;
//        var aInr = Math.PI * 2 / this.Count;
//        var ttl = TTL;
//        var aInit = (TotalTime / this.TimePerRotation) * Math.PI * 2.0;
//        
//        for (var a = 0; a < Math.PI * 2; a += aInr) {
//            xV = Math.cos(a + aInit) * totalVelocity;
//            yV = Math.sin(a + aInit) * totalVelocity;
//            Circles.push(new Circle(0, 0, xV, yV, radius, ttl, "rgba(" + this.Red + "," + this.Green + "," + this.Blue + ", " + this.Alpha + ")"));
//        }
//        
//    }
//    
//}

//function Circle(x, y, velocityX, velocityY, radius, timeToLive, color) {
//    
//    this.X = x;
//    this.Y = y;
//    this.VelocityX = velocityX;
//    this.VelocityY = velocityY;
//    this.Radius = radius;
//    this.TimeToLive = timeToLive;
//    this.Color = color;
//    
//    if (typeof(_circle_prototype_called) == 'undefined') {
//        _circle_prototype_called = true;
//        Circle.prototype.Draw = Draw;
//        Circle.prototype.AddTime = AddTime;
//        Circle.prototype.IsDead = IsDead;
//    }
//    
//    function AddTime(time) {
//        this.X = this.X + this.VelocityX * time;
//        this.Y = this.Y + this.VelocityY * time;
//        this.TimeToLive = this.TimeToLive - time;
//    }
//    
//    function Draw(c, scale) {
//        c.fillStyle = this.Color;
//        c.beginPath();
//        c.arc(this.X * scale, this.Y * scale, this.Radius * scale, 0, Math.PI * 2, false);
//        c.closePath();
//        c.fill();
//    }
//    
//    function IsDead() {
//        if (this.TimeToLive <= 0) {
//            return true;
//        }
//        return false;
//    }
//    
//}
