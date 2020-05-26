
const EasingFunctions = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t*t,
    // decelerating to zero velocity
    easeOutQuad: t => t*(2-t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    // accelerating from zero velocity
    easeInCubic: t => t*t*t,
    // decelerating to zero velocity
    easeOutCubic: t => (--t)*t*t+1,
    // acceleration until halfway, then deceleration
    easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    // accelerating from zero velocity
    easeInQuart: t => t*t*t*t,
    // decelerating to zero velocity
    easeOutQuart: t => 1-(--t)*t*t*t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    // accelerating from zero velocity
    easeInQuint: t => t*t*t*t*t,
    // decelerating to zero velocity
    easeOutQuint: t => 1+(--t)*t*t*t*t,
    // acceleration until halfway, then deceleration
    easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
};

//const EventEmitter = require( 'events' );
//

class BeatTimer {
    constructor({parts, initialDuration, finalDuration, totalTime}) {
        this.initialDuration = initialDuration;
        this.finalDuration = finalDuration;
        this.totalTime = totalTime;
        this.parts = parts;
        this.listeners = {};

        this.startTime = 0;

        this.linePercent = 0;
        this.setupTick();
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

            // mark the start time, should probably do on first tick
            if (this.startTime === 0) {
                this.startTime = now;
                this.lineStartTime = this.startTime;
            }

            // calculate the time since start
            let totalTime = now - this.startTime;
            this.timeRemaining = this.totalTime - totalTime;

            // calculate how far in the current breath
            let time = now - this.lineStartTime;

            // determine if we've gone over the time for this line
            if (time > duration) {
                // check for end
                if (totalTime > this.totalTime) {
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
                let percentLinear = totalTime / this.totalTime;

                // apply easing to this percent
                //let percent = percentLinear;
                let percent = EasingFunctions.easeInCubic(percentLinear);
                //let percent = EasingFunctions.easeInOutQuad(percentLinear);
                //let percent = EasingFunctions.easeInOutCubic(percentLinear); // longer head/tail
                //let percent = EasingFunctions.easeInOutQuart(percentLinear); // even longer head/tail

                // determine the duration of this breath based on this percent
                duration = Math.floor((this.initialDuration - this.finalDuration) * (1-percent)) + this.finalDuration;
                this.lineDuration = duration;

                console.log(`duration: ${duration} - totalTime: ${totalTime} - percentLinear: ${percentLinear} - percentEase: ${percent}`);

                // set the new start time
                this.lineStartTime = now - leftOver;

                // recalculate the time into this line
                time = now - this.lineStartTime;
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

const times = {
    demo: {
        initialDuration: 1000 * 10,
        finalDuration: 1000 * 2,
        totalTime: 1000*60*2
    },
    short3: {
        initialDuration: 1000 * 5,
        finalDuration: 1000 * 1.5,
        totalTime: 1000*60*3
    },
    short2: {
        initialDuration: 1000 * 5,
        finalDuration: 1000 * 1.5,
        totalTime: 1000*60*2
    },
    first: {
        initialDuration: 1000 * 12,
        finalDuration: 1000 * 1.7,
        totalTime: 1000*60*11
    }
};




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