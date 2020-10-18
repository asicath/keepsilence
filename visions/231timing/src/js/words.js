

const words = {

    'aleph': {
        background: '#fee74d',
        imgSrc: '001.png',
        minDuration: 1000*3.0,
        parts: [
            {text:'A', count: 1, countx: 4.10, audio: 'high'},
            {text:'ع', count: 1, countx: 3.86, audio: 'low'},
            {text:'u', count: 2, countx: 7.05, audio: 'low'},

            {text:'i', count: 1, countx: 4.08, audio: 'low'},
            {text:'a', count: 1, countx: 3.99, audio: 'high'},
            {text:'o', count: 2, countx: 8.17, audio: 'low'},

            {text:'u', count: 1, countx: 3.97, audio: 'low'},
            {text:'ع', count: 1, countx: 4.44, audio: 'low'},
            {text:'a', count: 2, countx: 8.34, audio: 'high'}
        ]
    },
    'beth':{
        background: '#FEDD00',
        imgSrc: '002.png',
        minDuration: 1000 * 2,
        parts: [
            // Beعθaoooabitom
            {text:'Be', count:1, audio:'high'},
            {text:'ع', count:1, audio:'low'},
            {text:'θa', count:1, audio:'high'},
            {text:'o', count:1, audio:'low'},
            {text:'o', count:1, audio:'low'},
            {text:'o', count:1, audio:'low'},
            {text:'a', count:1, audio:'high'},
            {text:'bi', count:1, audio:'high'},
            {text:'tom', count:1, audio:'low'}
        ]
    },
    'gimel':{
        background: '#0085ca',
        imgSrc: '003.png',
        minDuration: 1000 * 2,
        parts: [
            // Gitωnosapφωllois
            {text:'Gi', count:1, audio:'low'},
            {text:'tω', count:1, audio:'low'},
            {text:'no', count:1, audio:'low'},
            {text:'sap', count:2, audio:'high'},
            {text:'φωl', count:1, audio:'low'},
            {text:'lo', count:1, audio:'low'},
            {text:'is', count:2, audio:'low'}
        ]
    },
    'daleth': {
        background: '#00A550',
        imgSrc: '004.png',
        minDuration: 1000 * 1.5,
        parts: [
            {text:'dηn', count:2, audio:'high'},
            {text:'a', count:1.3, audio:'low'},
            {text:'star', count:2, audio:'high'},
            {text:'tar', count:1, audio:'high'},
            {text:'ωθ', count:2.5, audio:'low'}
        ]
    },
    'heh':{
        background: '#ed2800',
        imgSrc: '005.png',
        minDuration: 1000 * 2,
        parts: [
            // Hoo-oorω-iⲝ
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'vav':{
        background: '#FF4E00',
        imgSrc: '006.png',
        minDuration: 1000 * 2,
        parts: [
            // Vuaretza
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'zain':{
        background: '#FF6D00',
        imgSrc: '007.png',
        minDuration: 1000 * 2,
        parts: [
            // Zooωasar
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'cheth':{
        background: '#ffb734',
        imgSrc: '008.png',
        minDuration: 1000 * 2,
        parts: [
            // Chiva-abrahadabra-cadaxviii
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'teth':{
        background: '#E5D708',
        imgSrc: '009.png',
        minDuration: 1000 * 2,
        parts: [
            // θalعⲝer-ā-dekerval
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'yod':{
        background: '#59B934',
        imgSrc: '010.png',
        minDuration: 1000 * 2,
        parts: [
            // Iehuvahaⲝanعθatan
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'kaph': {
        background: '#8C15C4',
        imgSrc: '020.png',
        minDuration: 1000*1.7,
        parts: [
            {text:'Ke', count: 6.33, audio: 'low'},
            {text:'ru', count: 9.28, audio: 'low'},
            {text:'gu', count: 6.45, audio: 'high'},
            {text:'na', count: 9.65, audio: 'high'},
            {text:'vi', count: 6.68, audio: 'high'},
            {text:'el', count: 9.61, audio: 'low'},
        ]
    },
    'lamed':{
        background: '#00A550',
        imgSrc: '030.png',
        minDuration: 1000 * 2,
        parts: [
            // Lusanaherandraton
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'mem': {
        background: '#0246bc',
        imgSrc: '040.png',
        minDuration: 1000*1,
        customTimes: {
            short3: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            short2: {
                easingFunction: EasingFunctions.easeOutQuad
            }
        },
        parts: [
            {text:'Ma', count:16.14, audio:'low'},
            {text:'la', count:16.16, audio: 'low'},
            {text:'i',  count:15.70, audio: 'high'}
        ]
    },
    'nun':{
        background: '#00958d',
        imgSrc: '050.png',
        minDuration: 1000 * 2,
        parts: [
            // Nadimraphoroiozعθalai
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'samekh':{
        background: '#0085ca',
        imgSrc: '060.png',
        minDuration: 1000 * 2,
        parts: [
            // Salaθlala-amrodnaqعiⲝ
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'ayin':{
        background: '#001489',
        imgSrc: '070.png',
        minDuration: 1000 * 2,
        parts: [
            // Oaoaaaoooع-iⲝ
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'pe': {
        background: '#ed2800',
        imgSrc: '080.png',
        minDuration: 1000*2.5,
        customTimes: {
            short3: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            short2: {
                easingFunction: EasingFunctions.easeOutQuad
            }
        },
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
    'tzaddi':{
        background: '#5c00cc',
        imgSrc: '090.png',
        minDuration: 1000 * 2,
        parts: [
            // XanθaⲝeranⲈϘ-iⲝ
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'qoph':{
        background: '#AE0E36',
        imgSrc: '100.png',
        minDuration: 1000 * 2,
        parts: [
            // QaniΔnayx-ipamai
            {text:'', count:1, audio:'high'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'},
            {text:'', count:1, audio:'low'}
        ]
    },
    'resh': {
        //`Ra-a-gi o selah lad na i ma wa-iⲝ`
        background: '#FF6D00',
        imgSrc: '200.png',
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
            {text:'iⲝ', count:8.09, audio: 'low'}
        ]
    },
    'shin': {
        background: '#ff3300',
        imgSrc: '300.png',
        minDuration: 1000 * 1.5,
        parts: [
            {text:'shab', count:2, audio:'high'},
            {text:'nax', count:2, audio:'high'},
            {text:'od', count:1, audio:'low'},
            {text:'ob', count:1, audio:'low'},
            {text:'or', count:2, audio:'low'}
        ]
    },
    'tav':{
        background: '#001489',
        imgSrc: '400.png',
        minDuration: 1000 * 2,
        parts: [
            // Thath'th'thithعthuth-thiⲝ
            {text:'Thath', count:1, audio:'low'},
            {text:'th', count:1, audio:'high'},
            {text:'thi', count:1, audio:'high'},
            {text:'thع', count:1, audio:'high'},
            {text:'thuth', count:1, audio:'high'},
            {text:'thiⲝ', count:1, audio:'low'}
        ]
    }

};
