
var Color = function () {

    var TrimPercent = function (percent) {
        while (percent > 1.0) { percent -= 1.0; }
        return percent;
    }

    var percentCache = {};

    var ByPercent = function (percent, full) {

        // trim it
        percent = TrimPercent(percent);

        // narrow down to just a handful of possible values
        var key = "K" + Math.floor(percent * 1000);

        // Try to pull from cache
        if (typeof percentCache[key] !== 'undefined') {
            return percentCache[key];
        }

        var max = 6;
        var total = full * max; // Max num of colors that can be generated

        // The number representing the color that will be returned
        var i = Math.round(total * percent);

        //var full = 170;
        var empty = 0;
        var between = 0; //parseInt(parseFloat(full) * percent);

        var r = empty;
        var g = empty;
        var b = empty;
        var a = 0.5; // No alpha

        if (percent < 1.0 / max) {
            // #FF++00 = FF0000 -> FFFF00
            between = i - full * 0;
            r = full;
            g = between;
            b = empty;
        } else if (percent < 2.0 / max) {
            // #--FF00
            between = i - full * 1;
            r = full - between;
            g = full;
            b = empty;
        } else if (percent < 3.0 / max) {
            // #00FF++
            between = i - full * 2;
            r = empty;
            g = full;
            b = between;
        } else if (percent < 4.0 / max) {
            // #00--FF = 00FFFF -> 0000FF
            between = i - full * 3;
            r = empty;
            g = full - between;
            b = full;
        } else if (percent < 5.0 / max) {
            // #++00FF = 0000FF -> FF00FF
            between = i - full * 4;
            r = between;
            g = empty;
            b = full;
        } else if (percent <= 6.0 / max) {
            // #FF00-- = FF00FF -> FF0000
            between = i - full * 5;
            r = full;
            g = empty;
            b = full - between;
        }

        // create the color
        color = 'rgba(' + r + ',' + g + ',' + b + ', ' + a + ')';

        percentCache[key] = color;

        return color;

    };

    var ByNumber = function (number, max) {
        while (number > max) { number -= max; }
        return ByPercent(number / max, 170);
    };

    return {
        ByNumber: ByNumber
    };

} ();

//static public Color GetColorByPercent(double percent, int full) {
//			
//			percent = TrimPercent(percent);

//			if (colorPercents == null) {
//				colorPercents = new Dictionary<double, Color>();
//			}

//			if (colorPercents.ContainsKey(percent)) {
//				return colorPercents[percent];
//			}

//			double max = 6.0;
//			int total = full * (int)max; // Max num of colors that can be generated

//			// The number representing the color that will be returned
//			double ii = (double)total * percent;
//			int i = (int)Math.Round(ii);


//			//int full = 0xAA;
//			int empty = 0x00;
//			int between = (int)((double)full * percent);
//			int alpha = 0xff;

//			if (percent < 1.0 / max) {
//				between = i - full * 0;
//				colorPercents.Add(percent, Color.FromArgb(alpha, full, between, empty));		// #FF++00 = FF0000 -> FFFF00
//			} else if (percent < 2.0 / max) {
//				between = i - full * 1;
//				colorPercents.Add(percent, Color.FromArgb(alpha, full - between, full, empty));	// #--FF00
//			} else if (percent < 3.0 / max) {
//				between = i - full * 2;
//				colorPercents.Add(percent, Color.FromArgb(alpha, empty, full, between));		// #00FF++
//			} else if (percent < 4.0 / max) {
//				between = i - full * 3;
//				colorPercents.Add(percent, Color.FromArgb(alpha, empty, full - between, full));	// #00--FF = 00FFFF -> 0000FF
//			} else if (percent < 5.0 / max) {
//				between = i - full * 4;
//				colorPercents.Add(percent, Color.FromArgb(alpha, between, empty, full));		// #++00FF = 0000FF -> FF00FF
//			} else {
//				if (percent <= 6.0 / max) {
//					between = i - full * 5;
//					return Color.FromArgb(alpha, full, empty, full - between);					// #FF00-- = FF00FF -> FF0000
//				}

//				return Color.Black;
//			}
//			return colorPercents[percent];
//		}