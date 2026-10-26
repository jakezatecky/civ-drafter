import { useContext } from 'react';

import Alert from '#js/components/Utils/Alert.tsx';
import { leaderIconSize } from '#js/constants/theme.ts';
import { LanguageContext } from '#js/contexts.ts';
import type { DraftResults as DraftResultsType } from '#js/types.ts';

interface DraftResultsProps {
    results: DraftResultsType;
}

function DraftResults({ results }: DraftResultsProps) {
    const language = useContext(LanguageContext);

    if ('error' in results) {
        return <Alert type="danger">{results.error}</Alert>;
    }

    const { players, trollLeader } = results;

    /* eslint-disable react/no-array-index-key */
    const formatted = players.map(({ name: playerName, choices }, playerIndex) => (
        <li key={playerIndex}>
            <h3>{playerName}</h3>
            <ul className="draft-results-player-choices">
                {choices.map(({ id: choiceId, shortName, image }) => (
                    <li key={`${playerName}-${choiceId}-${shortName}`}>
                        <img
                            alt={`${shortName} icon`}
                            height={leaderIconSize}
                            src={`/assets/img/leader-icons/${image}`}
                            width={leaderIconSize}
                        />
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

export default DraftResults;
