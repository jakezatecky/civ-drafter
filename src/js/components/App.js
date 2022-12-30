import axios from 'axios';
import React, { Component } from 'react';

import DraftResults from 'js/components/DraftResults';
import DraftSettings from 'js/components/DraftSettings';
import LoadingIndicator from 'js/components/Utils/LoadingIndicator';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            leaders: null,
            results: null,
        };

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

    onSubmit(results) {
        this.setState({ results });
    }

    render() {
        const { leaders, results } = this.state;

        if (leaders === null) {
            return <LoadingIndicator />;
        }

        return (
            <section className="draft-area">
                <h1 className="sr-only">Draft picker</h1>
                <DraftSettings leaders={leaders} onSubmit={this.onSubmit} />
                {results !== null ? <DraftResults results={results} /> : null}
            </section>
        );
    }
}

export default App;
