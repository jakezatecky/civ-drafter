import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import leaderShape from 'js/shapes/leaderShape';

class DraftResults extends PureComponent {
    static propTypes = {
        results: PropTypes.shape({
            players: PropTypes.arrayOf(PropTypes.shape({
                index: PropTypes.number.isRequired,
                choices: PropTypes.arrayOf(leaderShape).isRequired,
            })),
            error: PropTypes.string,
        }).isRequired,
    };

    render() {
        const { results } = this.props;
        const { error, players } = results;

        if (error) {
            return (
                <div className="alert alert-danger">
                    {error}
                </div>
            );
        }

        const formatted = players.map(({ index, choices }) => (
            <li key={index}>
                <h3>Player {index + 1}</h3>
                <ul className="draft-results-player-choices">
                    {choices.map(({ name, image }) => (
                        <li key={name}>
                            <img alt={`${name} icon`} src={`/assets/img/leader-icons/${image}`} />
                            {name}
                        </li>
                    ))}
                </ul>
            </li>
        ));

        return (
            <div className="draft-results">
                <ul className="draft-results-players">
                    {formatted}
                </ul>
            </div>
        );
    }
}

export default DraftResults;
