import React, { useContext } from 'react';

import CopyToClipboard from 'js/components/Utils/CopyToClipboard';
import { LanguageContext } from 'js/contexts';
import draftResultsShape from 'js/shapes/draftResultsShape';

const propTypes = {
    results: draftResultsShape,
};
const defaultProps = {
    results: null,
};

function DraftActions({ results }) {
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
DraftActions.defaultProps = defaultProps;

export default DraftActions;
