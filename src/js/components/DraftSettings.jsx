import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import CheckboxTree from 'react-checkbox-tree';

import Bans from 'js/components/Settings/Bans';
import MainSettings from 'js/components/Settings/MainSettings';
import Players from 'js/components/Settings/Players';
import SettingsSection from 'js/components/Settings/SettingsSection';
import leaderShape from 'js/shapes/leaderShape';
import { LanguageContext } from 'js/contexts';
import allDlc from 'json/dlc.json';

import duplicationNodes from 'json/duplication-tree.json';

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

class DraftSettings extends Component {
    static contextType = LanguageContext;

    static propTypes = {
        leaders: PropTypes.arrayOf(leaderShape).isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            ...defaultSettings,
            ...getStoredSettings(),
        };

        const { numPlayers, players } = this.state;

        if (players === undefined) {
            this.state.players = generatePlayers(numPlayers);
        }

        this.onNumPlayersChange = this.onNumPlayersChange.bind(this);
        this.onNumChoicesChange = this.onNumChoicesChange.bind(this);
        this.onBansChange = this.onBansChange.bind(this);
        this.onDuplicationsChange = this.onDuplicationsChange.bind(this);
        this.onPlayersChange = this.onPlayersChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onNumPlayersChange(event) {
        const { target: { value } } = event;
        const { numPlayers, players } = this.state;
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

        this.setState(changes);
    }

    onNumChoicesChange(event) {
        this.setState({ numChoices: event.target.value });
    }

    onBansChange(event, value) {
        this.setState({ bans: value });
    }

    onDuplicationsChange(checked) {
        this.setState({ duplications: checked });
    }

    onPlayersChange(playerIndex, settingsKey) {
        return (newValue) => {
            const { players } = this.state;

            // Update the individual player setting
            this.setState({
                players: [
                    ...players.slice(0, playerIndex),
                    { ...players[playerIndex], [settingsKey]: newValue },
                    ...players.slice(playerIndex + 1),
                ],
            });
        };
    }

    onSubmit(event) {
        event.preventDefault();
        saveSettings(this.state);

        const { onSubmit } = this.props;

        onSubmit(this.state);
    }

    render() {
        const language = this.context;
        const { leaders } = this.props;
        const {
            numPlayers,
            numChoices,
            bans,
            duplications,
            players,
        } = this.state;

        return (
            <div className="draft-settings">
                <h2 className="visually-hidden">{language('settings.header')}</h2>
                <form className="form" id="draft-form" onSubmit={this.onSubmit}>
                    <Accordion alwaysOpen defaultActiveKey={['0', '1']}>
                        <SettingsSection eventKey="0" header={language('settings.main')}>
                            <MainSettings
                                numChoices={numChoices}
                                numPlayers={numPlayers}
                                onNumChoicesChange={this.onNumChoicesChange}
                                onNumPlayersChange={this.onNumPlayersChange}
                            />
                        </SettingsSection>
                        <SettingsSection eventKey="1" header={language('settings.secondary')}>
                            <Bans bans={bans} leaders={leaders} onChange={this.onBansChange} />
                            <div aria-label={language('settings.playerDlc')} className="draft-settings-duplications">
                                <CheckboxTree
                                    checked={duplications}
                                    expanded={[]}
                                    id="settings-duplications"
                                    nodes={duplicationNodes}
                                    showNodeIcon={false}
                                    onCheck={this.onDuplicationsChange}
                                />
                            </div>
                        </SettingsSection>
                        <SettingsSection eventKey="2" header={language('settings.player')}>
                            <Players players={players} onChange={this.onPlayersChange} />
                        </SettingsSection>
                    </Accordion>
                </form>
            </div>
        );
    }
}

export default DraftSettings;
