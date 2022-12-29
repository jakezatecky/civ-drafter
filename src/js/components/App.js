import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import AutocompleteControl from 'js/components/Controls/AutocompleteControl';
import SliderControl from 'js/components/Controls/SliderControl';

const leaders = [
    { name: 'Hammurabi (Babylon)', value: 'hammurabi-babylon' },
    { name: 'Mansa Musa (Mali)', value: 'mansa-musa-mali' },
];

class App extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
    }

    renderMainSettings() {
        return (
            <Accordion.Item eventKey="0">
                <Accordion.Header>Main settings</Accordion.Header>
                <Accordion.Body>
                    <SliderControl
                        defaultValue={6}
                        id="num-players"
                        label="Number of players"
                        max={12}
                        min={1}
                    />
                    <SliderControl
                        defaultValue={3}
                        id="num-choices"
                        label="Number of choices"
                        max={6}
                        min={1}
                    />
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    renderAdditionalSettings() {
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
                <Accordion.Header>Additional settings</Accordion.Header>
                <Accordion.Body>
                    <AutocompleteControl
                        label="Banned leaders"
                        options={leaderOptions}
                    />
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    renderUserSettings() {
        return (
            <Accordion.Item eventKey="2">
                <Accordion.Header>User-specific settings</Accordion.Header>
                <Accordion.Body>
                    List all users and have DLC checks
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    render() {
        return (
            <section className="draft-area">
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
            </section>
        );
    }
}

export default App;
