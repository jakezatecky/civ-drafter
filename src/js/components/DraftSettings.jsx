import PropTypes from 'prop-types';
import React, {
    useCallback,
    useContext,
    useState,
} from 'react';
import { Accordion } from 'react-bootstrap';

import Bans from '#js/components/Settings/Bans.jsx';
import Duplications from '#js/components/Settings/Duplications.jsx';
import MainSettings from '#js/components/Settings/MainSettings.jsx';
import Players from '#js/components/Settings/Players.jsx';
import SettingsSection from '#js/components/Settings/SettingsSection.jsx';
import { LanguageContext } from '#js/contexts.js';
import leaderShape from '#js/shapes/leaderShape.js';
import allDlc from '#json/dlc.json';

const defaultSettings = {
    numPlayers: 6,
    numChoices: 3,
    bans: [],
    duplications: [],
};

/**
 * Fetch any draft settings from the user's previous run.
 *
 * @returns {Object}
 */
function getStoredSettings() {
    const storedSettings = localStorage.getItem('draftSettings');

    return storedSettings !== null ? JSON.parse(storedSettings) : {};
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

function getInitialState() {
    const state = {
        ...defaultSettings,
        ...getStoredSettings(),
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
    const [state, setState] = useState(getInitialState());
    const {
        bans,
        duplications,
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
    }, [state]);

    const onNumChoicesChange = useCallback((event) => {
        setState({ ...state, numChoices: event.target.value });
    }, [state]);

    const onBansChange = useCallback((event, value) => {
        setState({ ...state, bans: value });
    }, [state]);

    const onDuplicationsChange = useCallback((checked) => {
        setState({ ...state, duplications: checked });
    }, [state]);

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
    ), [state]);

    const onFormSubmit = useCallback((event) => {
        event.preventDefault();
        saveSettings(state);
        onSubmit(state);
    }, [onSubmit, state]);

    return (
        <div className="draft-settings">
            <h2 className="visually-hidden">{language('settings.header')}</h2>
            <form className="form" id="draft-form" onSubmit={onFormSubmit}>
                <Accordion alwaysOpen defaultActiveKey={['0', '1']}>
                    <SettingsSection eventKey="0" header={language('settings.main')}>
                        <MainSettings
                            numChoices={numChoices}
                            numPlayers={numPlayers}
                            onNumChoicesChange={onNumChoicesChange}
                            onNumPlayersChange={onNumPlayersChange}
                        />
                    </SettingsSection>
                    <SettingsSection eventKey="1" header={language('settings.secondary')}>
                        <Bans bans={bans} leaders={leaders} onChange={onBansChange} />
                        <Duplications duplications={duplications} onChange={onDuplicationsChange} />
                    </SettingsSection>
                    <SettingsSection eventKey="2" header={language('settings.player')}>
                        <Players players={players} onChange={onPlayersChange} />
                    </SettingsSection>
                </Accordion>
            </form>
        </div>
    );
}

DraftSettings.propTypes = propTypes;

export default DraftSettings;
