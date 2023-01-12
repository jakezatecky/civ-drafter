import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import AutocompleteControl from 'js/components/Controls/AutocompleteControl';
import SliderControl from 'js/components/Controls/SliderControl';
import leaderShape from 'js/shapes/leaderShape';
import getLanguage from 'js/utils/getLanguage';
import draftLeaders, { NotEnoughLeadersError } from 'js/draftLeaders';

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

        try {
            const draftResults = draftLeaders(leaders, numPlayers, numChoices, bans);
            onSubmit({ players: draftResults });
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
        const leaderOptions = leaders.map(({ longName, image }) => ({
            value: longName,
            name: longName,
            label: (
                <div className="leader-box">
                    <img alt={`${longName} portrait}`} className="leader-icon" src={`/assets/img/leader-icons/${image}`} />
                    <span className="leader-name">{`${longName}`}</span>
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
