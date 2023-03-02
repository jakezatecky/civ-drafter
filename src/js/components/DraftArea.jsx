import React, { Component } from 'react';

import DraftSettings from 'js/components/DraftSettings';
import DraftResults from 'js/components/DraftResults';
import leaders from 'json/leaders.json';
import DraftActions from './DraftActions';

class DraftArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(results) {
        this.setState({ results });
    }

    render() {
        const { results } = this.state;

        return (
            <section className="draft-area">
                <h1 className="visually-hidden">Civilization drafter</h1>
                <DraftSettings leaders={leaders} onSubmit={this.onSubmit} />
                <DraftActions results={results} />
                {results !== null ? <DraftResults results={results} /> : null}
            </section>
        );
    }
}

export default DraftArea;
