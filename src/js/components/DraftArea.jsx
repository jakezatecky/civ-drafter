import React, { useCallback, useState } from 'react';

import DraftSettings from 'js/components/DraftSettings';
import DraftResults from 'js/components/DraftResults';
import leaders from 'json/leaders.json';
import DraftActions from './DraftActions';

function DraftArea() {
    const [results, setResults] = useState(null);
    const onSubmit = useCallback((formResults) => {
        setResults(formResults);
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

export default DraftArea;
