import random from 'lodash/random';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Alert from 'js/components/Utils/Alert';
import { trollFactor } from 'js/constants/calculation';
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

    getPlayerChoices(players) {
        // Must be more than one player and we must roll a zero
        // Only then can Capn Crunch bless us
        const timeToTroll = players.length > 1 && random(0, trollFactor) === 0;

        if (!timeToTroll) {
            return { trollLeader: null, players };
        }

        // Everybody's choices become the first player's first choice
        const numChoices = players[0].choices.length;
        const trollLeader = players[0].choices[0];
        const newPlayerChoices = players.map(({ index }) => ({
            index,
            choices: Array(numChoices).fill(trollLeader),
        }));

        return { trollLeader, players: newPlayerChoices };
    }

    render() {
        const { results } = this.props;
        const { error, players } = results;

        if (error) {
            return <Alert type="danger">{error}</Alert>;
        }

        const { trollLeader, players: actualPlayers } = this.getPlayerChoices(players);

        /* eslint-disable react/no-array-index-key */
        const formatted = actualPlayers.map(({ index: playerIndex, choices }) => (
            <li key={playerIndex}>
                <h3>{`Player ${playerIndex + 1}`}</h3>
                <ul className="draft-results-player-choices">
                    {choices.map(({ shortName, image }, choiceIndex) => (
                        <li key={`${playerIndex}-${choiceIndex}-${shortName}`}>
                            <img alt={`${shortName} icon`} src={`/assets/img/leader-icons/${image}`} />
                            {shortName}
                        </li>
                    ))}
                </ul>
            </li>
        ));
        /* eslint-enable react/no-array-index-key */

        return (
            <div className="draft-results">
                {trollLeader !== null ? (
                    <Alert
                        language={{
                            key: 'oopsAllSameLeader',
                            variables: { leaderName: trollLeader.shortName },
                        }}
                        type="warning"
                    />
                ) : null}
                <ul className="draft-results-players">
                    {formatted}
                </ul>
            </div>
        );
    }
}

export default DraftResults;
