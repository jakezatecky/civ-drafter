import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';

import draftLeaders, { NotEnoughLeadersError } from 'js/calculation/draftLeaders';
import withTrollResults from 'js/calculation/withTrollResults';
import DraftActions from 'js/components/DraftActions';
import DraftResults from 'js/components/DraftResults';
import DraftSettings from 'js/components/DraftSettings';
import leaderShape from 'js/shapes/leaderShape';
import { LanguageContext } from 'js/contexts';

const propTypes = {
    leaders: PropTypes.arrayOf(leaderShape).isRequired,

    trollFactor: PropTypes.number,
};

function DraftArea({ leaders, trollFactor = 0 }) {
    const [results, setResults] = useState(null);
    const language = useContext(LanguageContext);
    const onSubmit = useCallback((settings) => {
        try {
            setResults(withTrollResults(draftLeaders(leaders, settings), trollFactor));
        } catch (error) {
            if (error instanceof NotEnoughLeadersError) {
                setResults({
                    error: language('error.notEnoughLeaders', {
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
            <h1 className="visually-hidden">{language('mainHeader')}</h1>
            <DraftSettings leaders={leaders} onSubmit={onSubmit} />
            <DraftActions results={results} />
            {results !== null ? <DraftResults results={results} /> : null}
        </section>
    );
}

DraftArea.propTypes = propTypes;

export default DraftArea;
