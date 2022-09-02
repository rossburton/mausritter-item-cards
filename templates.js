'use strict';

const itemDefault = {
    name: '',
    usage: 3,
    damage: '',
    armour: false,
    mechanicDetail: '',
    clearDetail: '',
    classDetail: '',
    imageSource: '',
    scale: 100,
    nudgeX: 0,
    nudgeY: 0,
    rotate: 0,
    backgroundColour: '#ffffff',
    foregroundColour: '#000000',
    whiteUsage: false,
    width: 1,
    height: 1,
    divider: true,
    borderWidth: 2,
    star: false,
    freeFonts: false
};

const itemTemplates = {
    limpetshield: {
        name: 'Limpet Shield',
        usage: 3,
        damage: '1/2 def',
        armour: true,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        imageSource: 'limpet.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    dagger: {
        name: 'Dagger',
        usage: 3,
        damage: 'd6',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: 'Light',
        imageSource: 'item-light-1.png',
        nudgeY: 10,
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    torches: {
        name: 'Torches',
        usage: 3,
        damage: '',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        imageSource: 'item-torch.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    rations: {
        name: 'Rations',
        usage: 3,
        damage: '',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        nudgeY: 10,
        imageSource: 'item-rations.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        border: true,
        star: false,
    },
    sword: {
        name: 'Sword',
        usage: 3,
        damage: 'd6/d8',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: 'Medium',
        image: 'Sword',
        imageSource: 'item-medium-2.png',
        backgroundImage: 'paper.jpg',
        backgroundColour: '#bdb3a8',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    armour: {
        name: 'Heavy armour',
        usage: 3,
        damage: '1 def',
        armour: true,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: 'Heavy',
        image: 'Heavy armour',
        imageSource: 'item-heavy-armour.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 2,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    mussel: {
        name: 'Mussel Armour',
        usage: 3,
        damage: '2 def',
        armour: true,
        mechanicDetail: 'Disadvantage on DEX saves, cannot run',
        clearDetail: '',
        classDetail: 'Heavy',
        image: 'Heavy armour',
        imageSource: 'Muscle.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 2,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    spell: {
        name: 'Restore',
        usage: 3,
        damage: '',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        image: 'Spell 1',
        imageSource: 'item-spell-1.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: true,
    },
    condition: {
        name: 'Injured',
        usage: 0,
        damage: '',
        armour: false,
        mechanicDetail: 'Disadvantage on STR and DEX saves',
        clearDetail: 'After full rest',
        classDetail: '',
        image: '',
        imageSource: '',
        backgroundColour: '#ff4444',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: false,
        borderWidth: 2,
        star: false,
    },
    condition2: {
        name: 'Frozen',
        usage: 6,
        damage: '',
        armour: false,
        mechanicDetail: 'You are frozen. Count turns in usage, dead when all used.',
        clearDetail: '',
        classDetail: '',
        image: '',
        imageSource: '',
        backgroundColour: '#384761',
        foregroundColour: '#ffffff',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 0,
        star: false,
    },
    razorclam: {
        name: 'Razor Clam',
        usage: 3,
        damage: 'd8',
        armour: false,
        mechanicDetail: 'Causes Irritated Injury on critical damage',
        clearDetail: '',
        classDetail: 'Heavy',
        image: 'razor',
        imageSource: 'razor_shell_8271_lg.png',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 2,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    net: {
        name: 'Tough Net',
        usage: 0,
        damage: '',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        image: 'net',
        imageSource: 'net.jpg',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    rope: {
        name: 'Tough Rope',
        usage: 0,
        damage: '',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        image: 'rope',
        imageSource: 'rope2.svg',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    twine: {
        name: 'Twine',
        usage: 3,
        damage: '',
        armour: false,
        mechanicDetail: '',
        clearDetail: '',
        classDetail: '',
        /* TODO better artwork */
        imageSource: 'ball-of-hemp-twine.jpg',
        backgroundColour: '#ffffff',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: true,
        borderWidth: 2,
        star: false,
    },
    irritated: {
        name: 'Irritated Injury',
        usage: 0,
        damage: '',
        armour: false,
        mechanicDetail: 'Disadvantage on STR and DEX saves',
        clearDetail: 'After two full rests',
        classDetail: '',
        image: '',
        imageSource: '',
        backgroundColour: '#cc5530',
        foregroundColour: '#000000',
        width: 1,
        height: 1,
        divider: false,
        borderWidth: 2,
        star: false,
    }
};
