import PropTypes from 'prop-types';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import Bans from '#js/components/Settings/Bans.jsx';
import Duplications from '#js/components/Settings/Duplications.jsx';
import Mods from '#js/components/Settings/Mods.jsx';
import MainSettings from '#js/components/Settings/MainSettings.jsx';
import Players from '#js/components/Settings/Players.jsx';
import SettingsSection from '#js/components/Settings/SettingsSection.jsx';
import Alert from '#js/components/Utils/Alert.jsx';
import { LanguageContext } from '#js/contexts.js';
import leaderShape from '#js/shapes/leaderShape.js';
import validateDraftSettings from '#js/utils/validateDraftSettings.js';
import allDlc from '#json/dlc.json';

const defaultSettings = {
    numPlayers: 6,
    numChoices: 3,
    bans: [],
    duplications: [],
    mods: [],
};

// The language key naming each setting, for listing any that were reset
const settingLabels = {
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
 *
 * @param {Object[]} leaders
 *
 * @returns {{settings: Object, isUnreadable: boolean, invalidSettings: string[]}}
 */
function getStoredSettings(leaders) {
    const storedSettings = localStorage.getItem('draftSettings');
    const unreadable = { settings: {}, isUnreadable: true, invalidSettings: [] };

    if (storedSettings === null) {
        return { settings: {}, isUnreadable: false, invalidSettings: [] };
    }

    let settings;

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
 *
 * @param {Object} draftSettings
 *
 * @returns {void}
 */
function saveSettings(draftSettings) {
    localStorage.setItem('draftSettings', JSON.stringify(draftSettings));
}

/**
 * Generate default players from the number supplied.
 *
 * @param {Number} numPlayers
 * @param {Number} startIndex
 *
 * @returns {Object[]}
 */
function generatePlayers(numPlayers, startIndex = 1) {
    return [...Array(numPlayers)].map((player, index) => ({
        name: `Player ${index + startIndex}`,
        enabledDlc: allDlc,
    }));
}

function getInitialState(storedSettings) {
    const state = {
        ...defaultSettings,
        ...storedSettings,
    };
    const { numPlayers, players } = state;

    if (players === undefined) {
        state.players = generatePlayers(numPlayers);
    }

    return state;
}

const propTypes = {
    leaders: PropTypes.arrayOf(leaderShape).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

function DraftSettings({ leaders, onSubmit }) {
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

    const onNumPlayersChange = useCallback((event) => {
        const { target: { value } } = event;
        const changes = { numPlayers: value };

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

    const onNumChoicesChange = useCallback((event) => {
        setState({ ...state, numChoices: event.target.value });
    }, [state]);

    const onBansChange = useCallback((event, value) => {
        setState({ ...state, bans: value });
    }, [state]);

    const onDuplicationsChange = useCallback((checked) => {
        setState({ ...state, duplications: checked });
    }, [state]);

    const onModsChange = useCallback((checked) => {
        const longNames = leaders
            .filter(({ mod }) => !mod || mod.every((leaderMod) => checked.includes(leaderMod)))
            .map(({ longName }) => longName);
        const modBans = bans.filter((ban) => longNames.includes(ban));
        setState({ ...state, bans: modBans, mods: checked });
    }, [state, bans, leaders]);

    const onPlayersChange = useCallback((playerIndex, settingsKey) => (
        (newValue) => {
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

    const onFormSubmit = useCallback((event) => {
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

DraftSettings.propTypes = propTypes;

export default DraftSettings;
