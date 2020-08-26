

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
        finalDuration: 1000 * 1.5,
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

        minDuration: 1000*4,

        parts: [
            {text:'Ra', count:1.95, audio:'high'},
            {text:'a', count:3.64, audio: 'high'},
            {text:'gi', count:1.90, audio: 'high'},
            {text:'os', count:5.19, audio: 'high'},

            {text:'el', count:5.32, audio:'low'},
            {text:'ah', count:5.71, audio: 'low'},

            {text:'lad', count:3.42, audio:'high'},
            {text:'na', count:2.16, audio: 'high'},
            {text:'i', count:5.24, audio: 'low'},

            {text:'ma', count:3.07, audio:'high'},
            {text:'wa', count:2.29, audio: 'high'},
            {text:'iⲝ', count:8.09, audio: 'low'},
        ]
    },
    mem: {

        background: '#0246bc',
        minDuration: 1000*1,
        parts: [
            {text:'Ma', count:16.14, audio:'low'},
            {text:'la', count:16.16, audio: 'low'},
            {text:'i',  count:15.70, audio: 'high'}
        ]
    },

    pe: {
        background: '#ed2800',
        minDuration: 1000*2.5,
        parts: [
            {text:'Pu', count:5.65, audio:'low'},
            {text:'raθ', count:6.44, audio: 'low'},
            {text:'me',  count:3.07, audio: 'high'},
            {text:'ta',  count:3.16, audio: 'high'},
            {text:'i',  count:5.89, audio: 'high'},

            {text:'a', count:5.75, audio:'low'},
            {text:'pη', count:5.93, audio: 'low'},
            {text:'me',  count:2.95, audio: 'high'},
            {text:'ta',  count:3.05, audio: 'high'},
            {text:'i',  count:6.12, audio: 'high'},
        ]
    },

    kaph: {
        background: '#8C15C4',
        minDuration: 1000*1.3,
        parts: [
            // 6.33
            // 9.28
            // 6.45
            // 9.65
            // 6.68
            // 9.61
            {text:'Ke', count: 6.33, audio: 'low'},
            {text:'ru', count: 9.28, audio: 'low'},
            {text:'gu', count: 6.45, audio: 'high'},
            {text:'na', count: 9.65, audio: 'high'},
            {text:'vi', count: 6.68, audio: 'high'},
            {text:'el', count: 9.61, audio: 'low'},
        ]
    }

};


const times = {
    short3: {
        initialDuration: 1000 * 8,
        totalTime: 1000*60*3,
        easingFunction: EasingFunctions.easeOutCubic
    },
    short2: {
        initialDuration: 1000 * 6,
        totalTime: 1000*60*2,
        easingFunction: EasingFunctions.easeOutCubic
    },
    long: {
        initialDuration: 1000 * 10,
        totalTime: 1000*60*11,
        easingFunction: EasingFunctions.easeInOutCubic
    }
};
