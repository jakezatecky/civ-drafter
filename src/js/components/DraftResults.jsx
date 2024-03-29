import React, { useContext } from 'react';

import Alert from '#js/components/Utils/Alert.jsx';
import draftResultsShape from '#js/shapes/draftResultsShape.js';
import { LanguageContext } from '#js/contexts.js';

const propTypes = {
    results: draftResultsShape.isRequired,
};

function DraftResults({ results }) {
    const language = useContext(LanguageContext);
    const { error, players, trollLeader } = results;

    if (error) {
        return <Alert type="danger">{error}</Alert>;
    }

    /* eslint-disable react/no-array-index-key */
    const formatted = players.map(({ name: playerName, choices }, playerIndex) => (
        <li key={playerIndex}>
            <h3>{playerName}</h3>
            <ul className="draft-results-player-choices">
                {choices.map(({ id: choiceId, shortName, image }) => (
                    <li key={`${playerName}-${choiceId}-${shortName}`}>
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
            <h2 className="visually-hidden">{language('results.header')}</h2>
            {trollLeader !== undefined ? (
                <Alert
                    language={{
                        key: 'easterEgg.oopsAllSameLeader',
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
