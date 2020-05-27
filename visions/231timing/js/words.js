

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
            {text:'a', count:1.3, audio:'low'},
            {text:'star', count:2, audio:'high'},
            {text:'tar', count:1, audio:'high'},
            {text:'ωθ', count:2, audio:'low'},
            {text:'-', count: 0.5}
        ]
    },
    resh: {
        //`Ra-a-gi o selah lad na i ma wa-iⲝ`
        background: '#FF6D00',
        minDuration: 1000*2,
        parts: [
            {text:'Ra', count:2, audio:'high'},
            {text:'a', count:3, audio: 'high'},
            {text:'gi', count:2, audio: 'high'},
            {text:'os', count:5, audio: 'high'},

            {text:'el', count:6, audio:'low'},
            {text:'ah', count:6, audio: 'low'},

            {text:'lad', count:3, audio:'high'},
            {text:'na', count:2, audio: 'high'},
            {text:'i', count:6, audio: 'low'},

            {text:'ma', count:3, audio:'high'},
            {text:'wa', count:2, audio: 'high'},
            {text:'iⲝ', count:8, audio: 'low'},
        ]
    }

};


const times = {
    demo: {
        initialDuration: 1000 * 4,
        finalDuration: 1000 * 4,
        totalTime: 1000*60*2,
        easingFunction: EasingFunctions.linear
    },
    short3: {
        initialDuration: 1000 * 5,
        finalDuration: 1000 * 1.5,
        totalTime: 1000*60*3,
        easingFunction: EasingFunctions.easeInCubic
    },
    short2: {
        initialDuration: 1000 * 5,
        finalDuration: 1000 * 1.5,
        totalTime: 1000*60*2,
        easingFunction: EasingFunctions.easeInCubic
    },
    first: {
        initialDuration: 1000 * 12,
        finalDuration: 1000 * 1.7,
        totalTime: 1000*60*11,
        easingFunction: EasingFunctions.easeInOutCubic
    }
};
