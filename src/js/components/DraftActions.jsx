import React, { useContext } from 'react';

import CopyToClipboard from '#js/components/Utils/CopyToClipboard.jsx';
import { LanguageContext } from '#js/contexts.js';
import draftResultsShape from '#js/shapes/draftResultsShape.js';

const propTypes = {
    results: draftResultsShape,
};

function DraftActions({ results = null }) {
    const language = useContext(LanguageContext);
    const hasDraftResults = results !== null && results.error === undefined;

    return (
        <div className="draft-actions">
            <button className="btn btn-primary btn-submit" form="draft-form" type="submit">
                {language('actions.draft')}
            </button>
            {hasDraftResults ? (
                <CopyToClipboard domSelector=".draft-results" draftResults={results} />
            ) : null}
        </div>
    );
}

DraftActions.propTypes = propTypes;

export default DraftActions;
