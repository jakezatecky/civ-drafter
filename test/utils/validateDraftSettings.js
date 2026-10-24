import { assert } from 'chai';

import validateDraftSettings from '#js/utils/validateDraftSettings.js';

const leaders = [
    {
        longName: 'Alexander (Macedonian)',
    },
    {
        longName: 'Ahiram (Phoenician)',
        mod: ['BBG Expanded'],
    },
];

const defaults = {
    numPlayers: 6,
    numChoices: 3,
    bans: [],
    duplications: [],
    mods: [],
};

const validSettings = {
    numPlayers: 2,
    numChoices: 3,
    duplications: ['civilization'],
    mods: ['BBG Expanded'],
    bans: ['Alexander (Macedonian)', 'Ahiram (Phoenician)'],
    players: [
        { name: 'Player 1', enabledDlc: ['Vanilla'] },
        { name: 'Player 2', enabledDlc: ['Vanilla', 'Gathering Storm'] },
    ],
};

function validate(settings) {
    return validateDraftSettings(settings, leaders, defaults);
}

function getInvalidSettings(overrides) {
    return validate({ ...validSettings, ...overrides }).invalidSettings;
}

describe('validateDraftSettings()', () => {
    it('should keep valid settings', () => {
        assert.deepEqual(validate(validSettings), { validSettings, invalidSettings: [] });
    });

    // Settings saved by older versions may lack newer settings
    it('should leave missing settings for the defaults', () => {
        assert.deepEqual(validate({ numChoices: 4 }), {
            validSettings: { numChoices: 4 },
            invalidSettings: [],
        });
    });

    it('should reset only the invalid settings', () => {
        const { validSettings: kept, invalidSettings } = validate({
            ...validSettings,
            numChoices: 99,
            duplications: 'invalid',
        });

        assert.deepEqual(invalidSettings, ['numChoices', 'duplications']);
        assert.notProperty(kept, 'numChoices');
        assert.notProperty(kept, 'duplications');
        assert.deepEqual(kept.players, validSettings.players);
    });

    it('should reject numbers that are not whole or are out of range', () => {
        [0, 13, 2.5, '2', null].forEach((numPlayers) => {
            assert.include(getInvalidSettings({ numPlayers }), 'numPlayers');
        });
        [0, 9, 1.5, '3', null].forEach((numChoices) => {
            assert.deepEqual(getInvalidSettings({ numChoices }), ['numChoices']);
        });
    });

    it('should reject unknown duplications and mods', () => {
        assert.deepEqual(getInvalidSettings({ duplications: ['unknown'] }), ['duplications']);
        assert.include(getInvalidSettings({ mods: ['Removed Mod'] }), 'mods');
    });

    // Leaders may be renamed or removed between releases
    it('should reject bans of leaders that do not exist', () => {
        assert.deepEqual(getInvalidSettings({ bans: ['Removed Leader (Nowhere)'] }), ['bans']);
    });

    it('should reject bans of leaders whose mod is no longer enabled', () => {
        assert.deepEqual(getInvalidSettings({ mods: [] }), ['bans']);

        // An invalid mods setting resets to no mods, so the modded ban is also invalid
        assert.deepEqual(getInvalidSettings({ mods: 'Invalid' }), ['mods', 'bans']);
    });

    it('should reject players that do not match the number of players', () => {
        assert.deepEqual(getInvalidSettings({ numPlayers: 3 }), ['players']);

        // An invalid number of players resets to the default, which the players must then match
        assert.deepEqual(getInvalidSettings({ numPlayers: 99 }), ['numPlayers', 'players']);
    });

    it('should reject malformed players', () => {
        const [, secondPlayer] = validSettings.players;

        [
            'Player 1',
            [null, secondPlayer],
            [{ enabledDlc: ['Vanilla'] }, secondPlayer],
            [{ name: 'Player 1', enabledDlc: 'Invalid' }, secondPlayer],
            [{ name: 'Player 1', enabledDlc: ['Removed DLC'] }, secondPlayer],
        ].forEach((players) => {
            assert.deepEqual(getInvalidSettings({ players }), ['players']);
        });
    });
});
