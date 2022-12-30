import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import SliderControl from './Controls/SliderControl';
import AutocompleteControl from './Controls/AutocompleteControl';

import leaderShape from 'js/shapes/leaderShape';
import getLanguage from 'js/utils/getLanguage';
import draftLeaders from 'js/draftLeaders';

class DraftSettings extends Component {
    static propTypes = {
        leaders: PropTypes.arrayOf(leaderShape).isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            numPlayers: 6,
            numChoices: 3,
            bans: [],
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

        const totalChoices = numPlayers * numChoices;
        const availableLeaders = leaders.length - bans.length;
        const notEnoughLeaders = totalChoices > availableLeaders;

        if (notEnoughLeaders) {
            onSubmit({
                error: getLanguage('notEnoughLeaders', {
                    totalChoices,
                    availableLeaders,
                }),
            });
        } else {
            // TODO: Verify that multiple players can play different personas
            const draftResults = draftLeaders(leaders, numPlayers, numChoices, bans);

            onSubmit({ players: draftResults });
        }
    }

    renderMainSettings() {
        const { numPlayers, numChoices } = this.state;

        return (
            <Accordion.Item eventKey="0">
                <Accordion.Header as="h3">Main settings</Accordion.Header>
                <Accordion.Body>
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
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    renderAdditionalSettings() {
        const { leaders } = this.props;
        const { bans } = this.state;
        const leaderOptions = leaders.map(({ name, image }) => ({
            value: name,
            name,
            label: (
                <div className="leader-box">
                    <img alt={`${name} portrait}`} className="leader-icon" src={`/assets/img/leader-icons/${image}`} />
                    <span className="leader-name">{`${name}`}</span>
                </div>
            ),
        }));

        return (
            <Accordion.Item eventKey="1">
                <Accordion.Header as="h3">Additional settings</Accordion.Header>
                <Accordion.Body>
                    <AutocompleteControl
                        label="Banned leaders"
                        options={leaderOptions}
                        value={bans}
                        onChange={this.onBanChange}
                    />
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    render() {
        // TODO: Implement user-specific settings

        return (
            <div className="draft-settings">
                <h2 className="sr-only">Draft selections</h2>
                <form className="form" onSubmit={this.onSubmit}>
                    <Accordion alwaysOpen defaultActiveKey={['0', '1']}>
                        {this.renderMainSettings()}
                        {this.renderAdditionalSettings()}
                    </Accordion>
                    <div className="form-submit-area">
                        <button className="btn btn-primary" type="submit">
                            Draft!
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default DraftSettings;
