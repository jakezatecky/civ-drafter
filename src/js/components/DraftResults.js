import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class DraftResults extends PureComponent {
    static propTypes = {
        results: PropTypes.shape({
            error: PropTypes.string,
        }).isRequired,
    };

    renderResults(results) {
        const { error } = results;

        if (error) {
            return (
                <div className="alert alert-danger">
                    {error}
                </div>
            );
        }

        return (
            <p>These are your results...</p>
        );
    }

    render() {
        const { results } = this.props;

        if (results === null) {
            return null;
        }

        return (
            <div className="draft-results">
                <h2 className="sr-only">Draft results</h2>
                {this.renderResults(results)}
            </div>
        );
    }
}

export default DraftResults;
