import { choiceLimits, playerLimits } from '#js/constants/settings.js';
import allDlc from '#json/dlc.json';
import duplicationNodes from '#json/duplication-tree.json';
import modNodes from '#json/mods-tree.json';

const duplicationValues = duplicationNodes.map(({ value }) => value);
const modValues = modNodes.map(({ value }) => value);

function isIntegerInRange(value, { min, max }) {
    return Number.isInteger(value) && value >= min && value <= max;
}

function isListOf(value, knownValues) {
    return Array.isArray(value) && value.every((item) => knownValues.includes(item));
}

function isValidPlayer(player) {
    return (
        typeof player === 'object' &&
        player !== null &&
        typeof player.name === 'string' &&
        isListOf(player.enabledDlc, allDlc)
    );
}

/**
 * Split draft settings stored by a previous visit into the valid settings and the names of the
 * invalid ones, so that only the invalid settings need to be reset.
 *
 * Missing settings (such as those saved before a setting existed) are neither valid nor invalid,
 * and are left for the defaults to fill in.
 *
 * @param {Object} settings
 * @param {Object[]} leaders
 * @param {Object} defaults The default value of each setting.
 *
 * @returns {{validSettings: Object, invalidSettings: string[]}}
 */
function validateDraftSettings(settings, leaders, defaults) {
    const validSettings = {};
    const invalidSettings = [];

    // Some settings depend on the final value of others, so check those first
    const getValue = (key) => validSettings[key] ?? defaults[key];
    const validators = {
        numPlayers: (value) => isIntegerInRange(value, playerLimits),
        numChoices: (value) => isIntegerInRange(value, choiceLimits),
        duplications: (value) => isListOf(value, duplicationValues),
        mods: (value) => isListOf(value, modValues),
        bans: (value) => {
            // Leaders may be renamed or removed between releases, or need a disabled mod
            const mods = getValue('mods');
            const availableLeaders = leaders
                .filter(({ mod }) => !mod || mod.every((leaderMod) => mods.includes(leaderMod)))
                .map(({ longName }) => longName);

            return isListOf(value, availableLeaders);
        },
        players: (value) => (
            Array.isArray(value) &&
            value.length === getValue('numPlayers') &&
            value.every(isValidPlayer)
        ),
    };

    Object.entries(validators).forEach(([key, isValid]) => {
        if (settings[key] === undefined) {
            return;
        }

        if (isValid(settings[key])) {
            validSettings[key] = settings[key];
        } else {
            invalidSettings.push(key);
        }
    });

    return { validSettings, invalidSettings };
}

export default validateDraftSettings;
