
class BeatTimer {
    constructor({parts, initialDuration, finalDuration, minDuration, totalTime, easingFunction, paused = true}) {
        this.initialDuration = initialDuration;

        this.finalDuration = finalDuration;
        if (minDuration) {
            this.finalDuration = minDuration;
        }

        this.totalTime = totalTime;
        this.parts = parts;
        this.listeners = {};

        this.startTime = 0;
        this.easingFunction = easingFunction || EasingFunctions.linear;

        this.linePercent = 0;
        this.prevTickNow = null;
        this.totalElapsed = 0;
        this.lineStartTime = 0;
        this.paused = paused;

        this.countDown = 5000;

        this.setupTick();
    }

    togglePause() {
        this.paused = !this.paused;
    }

    setupTick() {

        // get the total count
        this.countTotal = this.parts.reduce((total, part) => {
            return total + part.count;
        }, 0);

        // assign each part a percent
        let p = 0;
        for (let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            part.startPercent = p;
            p += part.count / this.countTotal;
        }

        let recalculateDuration = true; // force duration calculation on the first time
        let duration = -1;
        let lastPart = null;

        // user should call this as often as possible
        this.onTick = () => {

            let now = Date.now();
            let elapsed = (this.prevTickNow === null) ? 0 : now - this.prevTickNow;
            this.prevTickNow = now;

            // if we are paused, then do nothing
            if (this.paused) return;

            // process countdown
            if (this.countDown > 0) {
                this.countDown -= elapsed;
                console.log(this.countDown);
                return;
            }

            // calculate the time since start
            this.totalElapsed += elapsed;
            this.timeRemaining = this.totalTime - this.totalElapsed;

            // calculate how far in the current breath
            let time = this.totalElapsed - this.lineStartTime;

            // determine if we've gone over the time for this line
            if (time > duration) {
                // check for end
                if (this.totalElapsed > this.totalTime) {
                    // past the end, no need to change the duration
                }
                else {
                    recalculateDuration = true;
                }
            }

            // get the line duration for this exact moment
            if (recalculateDuration) {
                recalculateDuration = false;

                // first, record how much was left over from last time
                let leftOver = duration === -1 ? 0 : time - duration;

                // calculate the percent we are through the entire session
                let percentLinear = this.totalElapsed / this.totalTime;
                this.percentLinear = percentLinear;

                // apply easing to this percent
                //let percent = percentLinear;
                let percent = this.easingFunction(percentLinear);
                //let percent = EasingFunctions.easeInOutQuad(percentLinear);
                //let percent = EasingFunctions.easeInOutCubic(percentLinear); // longer head/tail
                //let percent = EasingFunctions.easeInOutQuart(percentLinear); // even longer head/tail

                // determine the duration of this breath based on this percent
                duration = Math.floor((this.initialDuration - this.finalDuration) * (1-percent)) + this.finalDuration;
                this.lineDuration = duration;

                console.log(`duration: ${duration} - totalTime: ${this.totalElapsed} - percentLinear: ${percentLinear} - percentEase: ${percent}`);

                // set the new start time
                this.lineStartTime = this.totalElapsed - leftOver;

                // recalculate the time into this line
                time = this.totalElapsed - this.lineStartTime;
            }

            // allow for overage, time will always be less than duration during the session
            let innerTime = time % duration;

            // calculate the progress of the current breath
            this.linePercent = innerTime / duration;

            // calculate how much time assigned to each count
            let timePerCount = duration / this.countTotal;

            // determine which part we are on
            let part = null;
            for (let i = this.parts.length-1; i >= 0; i--) {
                if (this.linePercent >= this.parts[i].startPercent) {
                    part = this.parts[i];
                    break;
                }
            }

            // if we've started a new part, emit an event
            if (lastPart !== part) {
                this.emit('beat', Object.assign({duration: part.count * timePerCount}, part));
                lastPart = part;
            }

            // else if (lastCount !== count) {
            //     this.emit('tick', Object.assign({}, part));
            // }

        };

        // start it
        //this.onTick();
    }

    emit(name, data) {
        if (this.listeners.hasOwnProperty(name)) {
            this.listeners[name](data);
        }
    }

    on(name, fn) {
        this.listeners[name] = fn;
    }

}






if (typeof module !== 'undefined' && module.parent === null) {

    const config = Object.assign({
        initialDuration: 10000,
        finalDuration: 2000,
        totalTime: 1000*60*1,
    }, words.daleth);

    let timer = new BeatTimer(config);

    timer.on('beat', beat => {
        console.log(`${beat.text}\t${(beat.duration/1000)}`);
    });
    timer.on('tick', beat => {
        console.log(` .`);
    });

    setInterval(() => {
        timer.onTick();
    }, 1000/30);


}