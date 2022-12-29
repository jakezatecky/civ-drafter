import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import AutocompleteControl from 'js/components/Controls/AutocompleteControl';
import SliderControl from 'js/components/Controls/SliderControl';
import DraftResults from 'js/components/DraftResults';
import getLanguage from 'js/utils/getLanguage';

// TODO: Store full results in JSON and fetch
const leaders = [
    { name: 'Hammurabi (Babylon)', value: 'hammurabi-babylon' },
    { name: 'Mansa Musa (Mali)', value: 'mansa-musa-mali' },
];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numPlayers: 6,
            numChoices: 3,
            bans: [],
            results: null,
        };

        this.onSliderChange = this.onSliderChange.bind(this);
        this.onBanChange = this.onBanChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    setSetting(key, value) {
        this.setState({
            [key]: value,
            results: null,
        });
    }

    onSliderChange(key) {
        return (event) => {
            this.setSetting(key, event.target.value);
        }
    }

    onBanChange(event, value) {
        this.setSetting('bans', value);
    }

    onSubmit(event) {
        event.preventDefault();

        const { numPlayers, numChoices, bans } = this.state;

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

        // TODO: Implement randomization of choices
        // TODO: Verify that multiple players can play different personas
        setTimeout(() => {
            this.setState({ results: {} });
        }, 500);
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
        const { bans } = this.state;
        const leaderOptions = leaders.map(({ name, value }) => ({
            value,
            name,
            label: (
                <span className="box-leader">
                    <img alt={`${name} portrait}`} src={`assets/img/${value}.png`} />
                    {` ${name}`}
                </span>
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
        const { results } = this.state;

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
                    <div className="d-grid gap-2 col-3 mx-auto">
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
