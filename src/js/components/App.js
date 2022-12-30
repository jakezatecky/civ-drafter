import axios from 'axios';
import React, { Component } from 'react';

import DraftResults from 'js/components/DraftResults';
import DraftSettings from 'js/components/DraftSettings';
import LoadingIndicator from 'js/components/Utils/LoadingIndicator';
import getLanguage from 'js/utils/getLanguage';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            leaders: null,
            results: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const leadersPath = '/assets/leaders.json';

        axios.get(leadersPath).then((response) => {
            const { data, status } = response;

            if (status === 200) {
                this.setState({ leaders: data });
            } else {
                this.setState({
                    error: getLanguage('non200Response', {
                        resource: leadersPath,
                        status,
                    }),
                });
            }
        }).catch((error) => {
            this.setState({
                error: error.message,
            });
        });
    }

    onSubmit(results) {
        this.setState({ results });
    }

    render() {
        const { error, leaders, results } = this.state;

        if (error) {
            return (
                <div className="alert alert-danger">
                    <strong>Error</strong>: {error}
                </div>
            );
        }

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
