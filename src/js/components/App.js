import axios from 'axios';
import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import AutocompleteControl from 'js/components/Controls/AutocompleteControl';
import SliderControl from 'js/components/Controls/SliderControl';
import DraftResults from 'js/components/DraftResults';
import LoadingIndicator from 'js/components/Utils/LoadingIndicator';
import getLanguage from 'js/utils/getLanguage';
import draftLeaders from 'js/draftLeaders';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            leaders: null,
            numPlayers: 6,
            numChoices: 3,
            bans: [],
            results: null,
        };

        this.onSliderChange = this.onSliderChange.bind(this);
        this.onBanChange = this.onBanChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('assets/leaders.json').then((response) => {
            const { data, status } = response;

            if (status === 200) {
                this.setState({
                    leaders: data,
                });
            } else {
                // TODO: Handle more gracefully
                throw new Error('Non-200 response');
            }
        }).catch((error) => {
            // TODO: Surface error to user
            throw error;
        });
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

        const {
            leaders,
            numPlayers,
            numChoices,
            bans,
        } = this.state;

        const totalChoices = numPlayers * numChoices;
        const availableLeaders = leaders.length - bans.length;
        const notEnoughLeaders = totalChoices > availableLeaders;

        if (notEnoughLeaders) {
            this.setState({
                results: {
                    error: getLanguage('notEnoughLeaders', {
                        totalChoices,
                        availableLeaders,
                    }),
                },
            });
            return;
        }

        // TODO: Verify that multiple players can play different personas
        const draftResults = draftLeaders(leaders, numPlayers, numChoices, bans);

        this.setState({
            results: {
                players: draftResults,
            },
        });
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
        const { bans, leaders } = this.state;
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

    renderUserSettings() {
        // TODO: Implement
        return (
            <Accordion.Item eventKey="2">
                <Accordion.Header as="h3">User-specific settings</Accordion.Header>
                <Accordion.Body>
                    List all users and have DLC checks
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    render() {
        const { leaders, results } = this.state;

        if (leaders === null) {
            return <LoadingIndicator />;
        }

        return (
            <section className="draft-area">
                <h1 className="sr-only">Draft picker</h1>
                <h2 className="sr-only">Draft selections</h2>
                <form className="form" onSubmit={this.onSubmit}>
                    <Accordion alwaysOpen defaultActiveKey={['0', '1']}>
                        {this.renderMainSettings()}
                        {this.renderAdditionalSettings()}
                        {this.renderUserSettings()}
                    </Accordion>
                    <div className="form-submit-area">
                        <button className="btn btn-primary" type="submit">
                            Draft!
                        </button>
                    </div>
                </form>
                {results !== null ? <DraftResults results={results} /> : null}
            </section>
        );
    }
}

export default App;
