import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type SubmitEvent,
    type SyntheticEvent,
} from 'react';

import Bans from '#js/components/Settings/Bans.tsx';
import Duplications from '#js/components/Settings/Duplications.tsx';
import Mods from '#js/components/Settings/Mods.tsx';
import MainSettings from '#js/components/Settings/MainSettings.tsx';
import Players from '#js/components/Settings/Players.tsx';
import SettingsSection from '#js/components/Settings/SettingsSection.tsx';
import Alert from '#js/components/Utils/Alert.tsx';
import { LanguageContext } from '#js/contexts.ts';
import type { DraftSettings as Settings, Leader, PlayerSettings } from '#js/types.ts';
import validateDraftSettings from '#js/utils/validateDraftSettings.ts';
import allDlc from '#json/dlc.json';

interface StoredSettings {
    settings: Partial<Settings>;
    isUnreadable: boolean;
    invalidSettings: (keyof Settings)[];
}

const defaultSettings: Omit<Settings, 'players'> = {
    numPlayers: 6,
    numChoices: 3,
    bans: [],
    duplications: [],
    mods: [],
};

// The language key naming each setting, for listing any that were reset
const settingLabels: Record<keyof Settings, string> = {
    numPlayers: 'settings.numPlayers',
    numChoices: 'settings.numChoices',
    duplications: 'settings.duplications',
    mods: 'settings.enabledMods',
    bans: 'settings.bans',
    players: 'settings.player',
};

/**
 * Fetch the valid draft settings from the user's previous run, noting whether they could not be
 * read at all or which individual settings were invalid.
 */
function getStoredSettings(leaders: Leader[]): StoredSettings {
    const storedSettings = localStorage.getItem('draftSettings');
    const unreadable: StoredSettings = { settings: {}, isUnreadable: true, invalidSettings: [] };

    if (storedSettings === null) {
        return { settings: {}, isUnreadable: false, invalidSettings: [] };
    }

    let settings: unknown;

    try {
        settings = JSON.parse(storedSettings);
    } catch {
        return unreadable;
    }

    // Anything other than an object is as unusable as corrupt JSON
    if (typeof settings !== 'object' || settings === null || Array.isArray(settings)) {
        return unreadable;
    }

    const { validSettings, invalidSettings } = validateDraftSettings(
        settings,
        leaders,
        defaultSettings,
    );

    return { settings: validSettings, isUnreadable: false, invalidSettings };
}

/**
 * Save draft settings for future re-use.
 */
function saveSettings(draftSettings: Partial<Settings>) {
    localStorage.setItem('draftSettings', JSON.stringify(draftSettings));
}

/**
 * Generate default players from the number supplied.
 */
function generatePlayers(numPlayers: number, startIndex = 1): PlayerSettings[] {
    return Array.from({ length: numPlayers }, (_, index) => ({
        name: `Player ${index + startIndex}`,
        enabledDlc: allDlc,
    }));
}

function getInitialState(storedSettings: Partial<Settings>): Settings {
    const state = {
        ...defaultSettings,
        ...storedSettings,
    };

    return {
        ...state,
        players: state.players ?? generatePlayers(state.numPlayers),
    };
}

interface DraftSettingsProps {
    leaders: Leader[];
    onSubmit: (settings: Settings) => void;
}

function DraftSettings({ leaders, onSubmit }: DraftSettingsProps) {
    const language = useContext(LanguageContext);
    const storedSettings = useMemo(() => getStoredSettings(leaders), [leaders]);
    const [state, setState] = useState(() => getInitialState(storedSettings.settings));
    const {
        bans,
        duplications,
        mods,
        numChoices,
        numPlayers,
        players,
    } = state;

    const onNumPlayersChange = useCallback((_: Event, value: number) => {
        const changes: Partial<Settings> = { numPlayers: value };

        if (value < numPlayers) {
            // We lost a player; remove the player's settings
            changes.players = players.slice(0, value);
        } else if (value > numPlayers) {
            // More players added; generate from default
            changes.players = [
                ...players,
                ...generatePlayers(value - numPlayers, numPlayers + 1),
            ];
        }

        setState({ ...state, ...changes });
    }, [state, numPlayers, players]);

    const onNumChoicesChange = useCallback((_: Event, value: number) => {
        setState({ ...state, numChoices: value });
    }, [state]);

    const onBansChange = useCallback((_: SyntheticEvent, value: string[]) => {
        setState({ ...state, bans: value });
    }, [state]);

    const onDuplicationsChange = useCallback((checked: string[]) => {
        setState({ ...state, duplications: checked });
    }, [state]);

    const onModsChange = useCallback((checked: string[]) => {
        const longNames = leaders
            .filter(({ mod }) => !mod || mod.every((leaderMod) => checked.includes(leaderMod)))
            .map(({ longName }) => longName);
        const modBans = bans.filter((ban) => longNames.includes(ban));
        setState({ ...state, bans: modBans, mods: checked });
    }, [state, bans, leaders]);

    const onPlayersChange = useCallback(<Key extends keyof PlayerSettings>(
        playerIndex: number,
        settingsKey: Key,
    ) => (
        (newValue: PlayerSettings[Key]) => {
            // Update the individual player setting
            setState({
                ...state,
                players: [
                    ...players.slice(0, playerIndex),
                    { ...players[playerIndex], [settingsKey]: newValue },
                    ...players.slice(playerIndex + 1),
                ],
            });
        }
    ), [state, players]);

    // Remove or correct invalid settings, so that they are not loaded again
    useEffect(() => {
        if (storedSettings.isUnreadable) {
            localStorage.removeItem('draftSettings');
        } else if (storedSettings.invalidSettings.length > 0) {
            saveSettings(storedSettings.settings);
        }
    }, [storedSettings]);

    function renderLoadErrors() {
        const { isUnreadable, invalidSettings } = storedSettings;

        if (isUnreadable) {
            return <Alert type="warning">{language('error.unreadableStoredSettings')}</Alert>;
        }

        if (invalidSettings.length > 0) {
            const settingNames = invalidSettings.map((key) => language(settingLabels[key]));

            return (
                <Alert type="warning">
                    {language('error.invalidStoredSettings', { settings: settingNames.join(', ') })}
                </Alert>
            );
        }

        return null;
    }

    const onFormSubmit = useCallback((event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        saveSettings(state);
        onSubmit(state);
    }, [onSubmit, state]);

    return (
        <div className="draft-settings">
            <h2 className="visually-hidden">{language('settings.header')}</h2>
            {renderLoadErrors()}
            <form className="form" id="draft-form" onSubmit={onFormSubmit}>
                <div className="accordion">
                    <SettingsSection defaultOpen header={language('settings.main')}>
                        <MainSettings
                            numChoices={numChoices}
                            numPlayers={numPlayers}
                            onNumChoicesChange={onNumChoicesChange}
                            onNumPlayersChange={onNumPlayersChange}
                        />
                    </SettingsSection>
                    <SettingsSection defaultOpen header={language('settings.secondary')}>
                        <Bans bans={bans} leaders={leaders} mods={mods} onChange={onBansChange} />
                        <Duplications duplications={duplications} onChange={onDuplicationsChange} />
                    </SettingsSection>
                    <SettingsSection defaultOpen header={language('settings.mods')}>
                        <Mods mods={mods} onChange={onModsChange} />
                    </SettingsSection>
                    <SettingsSection header={language('settings.player')}>
                        <Players players={players} onChange={onPlayersChange} />
                    </SettingsSection>
                </div>
            </form>
        </div>
    );
}

export default DraftSettings;
