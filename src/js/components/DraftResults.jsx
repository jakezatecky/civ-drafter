import random from 'lodash/random';
import React from 'react';

import Alert from 'js/components/Utils/Alert';
import { trollFactor } from 'js/constants/calculation';
import draftResultsShape from 'js/shapes/draftResultsShape';

const propTypes = {
    results: draftResultsShape.isRequired,
};

function getPlayerChoices(players) {
    // Must be more than one player and we must roll a zero
    // Only then can Cap'n Crunch bless us
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

/* eslint-disable react/no-array-index-key */
function DraftResults({ results }) {
    const { error, players } = results;

    if (error) {
        return <Alert type="danger">{error}</Alert>;
    }

    const { trollLeader, players: actualPlayers } = getPlayerChoices(players);

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

    return (
        <div className="draft-results">
            <h2 className="visually-hidden">Draft results</h2>
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

DraftResults.propTypes = propTypes;

export default DraftResults;
