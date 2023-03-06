import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import draftLeaders, { NotEnoughLeadersError } from 'js/calculation/draftLeaders';
import withTrollResults from 'js/calculation/withTrollResults';
import AutocompleteControl from 'js/components/Controls/AutocompleteControl';
import SliderControl from 'js/components/Controls/SliderControl';
import SettingsSection from 'js/components/Settings/SettingsSection';
import leaderShape from 'js/shapes/leaderShape';
import getLanguage from 'js/utils/getLanguage';

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

        this.onSliderChange = this.onSliderChange.bind(this);
        this.onBanChange = this.onBanChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSliderChange(key) {
        return (event) => {
            this.setState({ [key]: event.target.value });
        };
    }

    onBanChange(event, value) {
        this.setState({ bans: value });
    }

    onSubmit(event) {
        event.preventDefault();

        const { leaders, onSubmit } = this.props;
        const { numPlayers, numChoices, bans } = this.state;

        try {
            saveSettings(this.state);

            const players = [...Array(numPlayers)].map((player, index) => `Player ${index + 1}`);
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
                    onChange={this.onSliderChange('numPlayers')}
                />
                <SliderControl
                    id="num-choices"
                    label="Number of choices"
                    max={6}
                    min={1}
                    value={numChoices}
                    onChange={this.onSliderChange('numChoices')}
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
                <AutocompleteControl
                    label="Banned leaders"
                    options={leaderOptions}
                    value={bans}
                    onChange={this.onBanChange}
                />
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
                    </Accordion>
                </form>
            </div>
        );
    }
}

export default DraftSettings;
