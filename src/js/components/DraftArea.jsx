import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import draftLeaders, { NotEnoughLeadersError } from 'js/calculation/draftLeaders';
import withTrollResults from 'js/calculation/withTrollResults';
import DraftActions from 'js/components/DraftActions';
import DraftResults from 'js/components/DraftResults';
import DraftSettings from 'js/components/DraftSettings';
import getLanguage from 'js/utils/getLanguage';
import leaderShape from '../shapes/leaderShape';

const propTypes = {
    leaders: PropTypes.arrayOf(leaderShape).isRequired,
};

function DraftArea({ leaders }) {
    const [results, setResults] = useState(null);
    const onSubmit = useCallback((settings) => {
        try {
            setResults(withTrollResults(draftLeaders(leaders, settings)));
        } catch (error) {
            if (error instanceof NotEnoughLeadersError) {
                setResults({
                    error: getLanguage('notEnoughLeaders', {
                        totalChoices: error.totalChoices,
                        availableLeaders: error.availableLeaders,
                    }),
                });
            } else {
                throw error;
            }
        }
    }, []);

    return (
        <section className="draft-area">
            <h1 className="visually-hidden">Civilization drafter</h1>
            <DraftSettings leaders={leaders} onSubmit={onSubmit} />
            <DraftActions results={results} />
            {results !== null ? <DraftResults results={results} /> : null}
        </section>
    );
}

DraftArea.propTypes = propTypes;

export default DraftArea;
