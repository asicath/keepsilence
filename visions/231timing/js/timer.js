
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

        this.linePercent = 0;
        this.setupTick();
    }

    setupTick() {

        // get the total count
        this.partCount = this.parts.reduce((total, part) => {
            return total + part.count;
        }, 0);

        // put the counts in an array
        let partsByCount = [];
        this.parts.forEach(part => {
            for (let i = 0; i < part.count; i++) {
                partsByCount.push(part);
            }
        });

        this.startTime = Date.now();

        let lastPart = null;
        let recalculateDuration = true;
        let duration = -1;
        let lastCount = -1;

        this.onTick = () => {

            let totalTime = Date.now() - this.startTime;
            this.timeRemaining = this.totalTime - totalTime;

            let time = Date.now() - this.lineStartTime;

            if (time > duration) {

                // check for end
                if (totalTime > this.totalTime) {

                }
                else {
                    recalculateDuration = true;
                }

            }

            // get the line duration for this exact moment
            if (recalculateDuration) {

                recalculateDuration = false;
                let percentLinear = 1 - (totalTime / this.totalTime);

                // apply easing
                //let percent = percentLinear;
                let percent = EasingFunctions.easeInCubic(percentLinear);
                //let percent = EasingFunctions.easeInOutQuad(percentLinear);
                //let percent = EasingFunctions.easeInOutCubic(percentLinear); // longer head/tail
                //let percent = EasingFunctions.easeInOutQuart(percentLinear); // even longer head/tail

                duration = Math.floor((this.initialDuration - this.finalDuration) * percent) + this.finalDuration;
                console.log(`duration: ${duration} - totalTime: ${totalTime} - percentLinear: ${percentLinear} - percentEase: ${percent}`);

                this.lineStartTime = Date.now();

                // redo the time
                time = Date.now() - this.lineStartTime;
            }

            let innerTime = time % duration;
            this.linePercent = innerTime / duration; // allow outside to see the percent
            this.lineDuration = duration;

            let countTime = duration / this.partCount;
            let count = Math.floor(innerTime / countTime);
            let part = partsByCount[count];

            if (lastPart !== part) {
                this.emit('beat', Object.assign({duration: Math.floor(countTime * part.count)}, part));
                lastPart = part;
            }
            else if (lastCount !== count) {
                this.emit('tick', Object.assign({}, part));
            }
            lastCount = count;
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

const words = {
    shin: {
        background: '#ed2800',
        parts: [
            {text:'shab', count:2},
            {text:'nax', count:2},
            {text:'od', count:1},
            {text:'ob', count:1},
            {text:'or', count:1},
            {text:'', count: 1}
        ]
    },
    daleth: {
        background: '#00A550',
        parts: [
            {text:'dηn', count:2, audio:'high'},
            {text:'a', count:1, audio:'low'},
            {text:'star', count:2, audio:'high'},
            {text:'tar', count:1, audio:'high'},
            {text:'ωθ', count:2, audio:'low'},
            {text:'-', count: 1}
        ]
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