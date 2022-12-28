import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Select from 'react-select';

import SliderControl from 'js/components/Controls/SliderControl';

const leaders = [
    { name: 'Hammurabi (Babylon)', value: 'hammurabi-babylon' },
    { name: 'Mansa Musa (Mali)', value: 'mansa-musa-mali' },
]

class App extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
    }

    render() {
        const leaderOptions = leaders.map(({ name, value }) => ({
            value,
            label: (
                <span>
                    <img src={`assets/img/${value}.png`} />
                    {` ${name}`}
                </span>
            ),
        }));

        return (
            <section className="draft-area">
                <form className="form" onSubmit={this.onSubmit}>
                    <Accordion alwaysOpen defaultActiveKey={['0', '1']}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Main settings</Accordion.Header>
                            <Accordion.Body>
                                <SliderControl
                                    defaultValue={6}
                                    id="num-players"
                                    label="Number of players"
                                    min={1}
                                    max={12}
                                />
                                <SliderControl
                                    defaultValue={3}
                                    id="num-choices"
                                    label="Number of choices"
                                    min={1}
                                    max={6}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Additional settings</Accordion.Header>
                            <Accordion.Body>
                                Banned leaders
                                <Select
                                    isMulti
                                    name="bans"
                                    options={leaderOptions}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>User-specific settings</Accordion.Header>
                            <Accordion.Body>
                                List all users and have DLC checks
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <div className="d-grid gap-2 col-3 mx-auto">
                        <button className="btn btn-primary">
                            Draft!
                        </button>
                    </div>
                </form>
            </section>
        );
    }
}

export default App;
