import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import CheckboxTree from 'react-checkbox-tree';

import draftLeaders, { NotEnoughLeadersError } from 'js/calculation/draftLeaders';
import withTrollResults from 'js/calculation/withTrollResults';
import AutocompleteControl from 'js/components/Controls/AutocompleteControl';
import SliderControl from 'js/components/Controls/SliderControl';
import SettingsSection from 'js/components/Settings/SettingsSection';
import leaderShape from 'js/shapes/leaderShape';
import getLanguage from 'js/utils/getLanguage';
import allDlc from 'json/dlc.json';
import dlcNodes from 'json/dlc-tree.json';

const defaultSettings = {
    numPlayers: 6,
    numChoices: 3,
    bans: [],
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
        this.onBanChange = this.onBanChange.bind(this);
        this.onDlcChange = this.onDlcChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onNumPlayersChange(event) {
        const { target: { value } } = event;
        const { numPlayers, players } = this.state;
        const changes = { numPlayers: value };

        if (value < numPlayers) {
            // We lost a player; remove the DLC settings
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

    onBanChange(event, value) {
        this.setState({ bans: value });
    }

    onDlcChange(playerIndex) {
        return (checked) => {
            const { players } = this.state;

            // Update the enabled DLC for this individual player
            this.setState({
                players: [
                    ...players.slice(0, playerIndex),
                    {
                        ...players[playerIndex],
                        enabledDlc: checked,
                    },
                    ...players.slice(playerIndex + 1),
                ],
            });
        };
    }

    onSubmit(event) {
        event.preventDefault();

        const { leaders, onSubmit } = this.props;
        const { players, numChoices, bans } = this.state;

        try {
            saveSettings(this.state);

            const results = draftLeaders(leaders, { players, numChoices, bans });
            onSubmit(withTrollResults(results));
        } catch (error) {
            if (error instanceof NotEnoughLeadersError) {
                onSubmit({
                    error: getLanguage('notEnoughLeaders', {
                        totalChoices: error.totalChoices,
                        availableLeaders: error.availableLeaders,
                    }),
                });
            } else {
                throw error;
            }
        }
    }

    renderMainSettings() {
        const { numPlayers, numChoices } = this.state;

        return (
            <SettingsSection eventKey="0" header="Main settings">
                <SliderControl
                    id="num-players"
                    label="Number of players"
                    max={12}
                    min={1}
                    value={numPlayers}
                    onChange={this.onNumPlayersChange}
                />
                <SliderControl
                    id="num-choices"
                    label="Number of choices"
                    max={6}
                    min={1}
                    value={numChoices}
                    onChange={this.onNumChoicesChange}
                />
            </SettingsSection>
        );
    }

    renderAdditionalSettings() {
        const { leaders } = this.props;
        const { bans } = this.state;
        const leaderOptions = leaders.map(({ longName, image }) => ({
            value: longName,
            name: longName,
            label: (
                <div className="leader-box">
                    <img
                        alt={`${longName} portrait}`}
                        className="leader-icon"
                        src={`/assets/img/leader-icons/${image}`}
                    />
                    <span className="leader-name">{`${longName}`}</span>
                </div>
            ),
        }));

        return (
            <SettingsSection eventKey="1" header="Additional settings">
                <div className="draft-settings-bans">
                    <AutocompleteControl
                        label="Banned leaders"
                        options={leaderOptions}
                        value={bans}
                        onChange={this.onBanChange}
                    />
                </div>
            </SettingsSection>
        );
    }

    renderDlcSettings() {
        const { players } = this.state;

        const playerList = players.map(({ name, enabledDlc }, playerIndex) => (
            <li key={name}>
                <h4>{name}</h4>
                <CheckboxTree
                    checked={enabledDlc}
                    expanded={[name]}
                    id={`setting-player-dlc-${playerIndex}`}
                    nodes={dlcNodes}
                    showNodeIcon={false}
                    onCheck={this.onDlcChange(playerIndex)}
                />
            </li>
        ));

        return (
            <SettingsSection eventKey="2" header="Player DLC settings">
                <div className="draft-settings-dlc">
                    <ol className="draft-settings-players">{playerList}</ol>
                </div>
            </SettingsSection>
        );
    }

    render() {
        return (
            <div className="draft-settings">
                <h2 className="visually-hidden">Draft selections</h2>
                <form className="form" id="draft-form" onSubmit={this.onSubmit}>
                    <Accordion alwaysOpen defaultActiveKey={['0', '1']}>
                        {this.renderMainSettings()}
                        {this.renderAdditionalSettings()}
                        {this.renderDlcSettings()}
                    </Accordion>
                </form>
            </div>
        );
    }
}

export default DraftSettings;
