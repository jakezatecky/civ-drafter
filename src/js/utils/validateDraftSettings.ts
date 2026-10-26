import { choiceLimits, playerLimits } from '#js/constants/settings.ts';
import type { DraftSettings, Leader, PlayerSettings } from '#js/types.ts';
import allDlc from '#json/dlc.json';
import duplicationNodes from '#json/duplication-tree.json';
import modNodes from '#json/mods-tree.json';

type SettingKey = keyof DraftSettings;

interface ValidationResult {
    validSettings: Partial<DraftSettings>;
    invalidSettings: SettingKey[];
}

const duplicationValues = duplicationNodes.map(({ value }) => value);
const modValues = modNodes.map(({ value }) => value);

function isIntegerInRange(value: unknown, { min, max }: { min: number, max: number }): boolean {
    return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function isListOf<Item>(value: unknown, knownValues: Item[]): value is Item[] {
    const known: readonly unknown[] = knownValues;

    return Array.isArray(value) && value.every((item: unknown) => known.includes(item));
}

function isValidPlayer(player: unknown): player is PlayerSettings {
    return (
        typeof player === 'object' &&
        player !== null &&
        'name' in player &&
        typeof player.name === 'string' &&
        'enabledDlc' in player &&
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
 * @param defaults The default value of each setting.
 */
function validateDraftSettings(
    settings: Partial<Record<SettingKey, unknown>>,
    leaders: Leader[],
    defaults: Omit<DraftSettings, 'players'>,
): ValidationResult {
    const validSettings: Partial<DraftSettings> = {};
    const invalidSettings: SettingKey[] = [];

    // Some settings depend on the final value of others, so check those first
    const getValue = <Key extends keyof typeof defaults>(key: Key) => (
        validSettings[key] ?? defaults[key]
    );
    const validators: Record<SettingKey, (value: unknown) => boolean> = {
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

    (Object.keys(validators) as SettingKey[]).forEach((key) => {
        const value = settings[key];

        if (value === undefined) {
            return;
        }

        if (validators[key](value)) {
            // The validator has checked that the value has the setting's type
            Object.assign(validSettings, { [key]: value });
        } else {
            invalidSettings.push(key);
        }
    });

    return { validSettings, invalidSettings };
}

export default validateDraftSettings;
