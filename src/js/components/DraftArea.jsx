import React, { useCallback, useState } from 'react';

import DraftActions from 'js/components/DraftActions';
import DraftResults from 'js/components/DraftResults';
import DraftSettings from 'js/components/DraftSettings';
import leaders from 'json/leaders.json';

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
